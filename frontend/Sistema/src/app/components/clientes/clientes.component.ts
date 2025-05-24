import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { validateCNPJ } from '../../utils/validators';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm: Cliente = {
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: ''
  };
  isEditing = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  // Mensagens de erro de validação
  nomeError = '';
  cnpjError = '';
  enderecoError = '';
  telefoneError = '';
  emailError = '';

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading = true;
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar clientes';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  validateForm(): boolean {
    let isValid = true;
    
    // Validação do nome (não vazio e só letras, espaços e alguns caracteres especiais)
    if (!this.clienteForm.nome.trim()) {
      this.nomeError = 'Nome/Razão Social é obrigatório';
      isValid = false;
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s.,&'-]+$/.test(this.clienteForm.nome)) {
      this.nomeError = 'Nome/Razão Social deve conter caracteres válidos';
      isValid = false;
    } else {
      this.nomeError = '';
    }
    
    // Validação do CNPJ
    const cnpjLimpo = this.clienteForm.cnpj.replace(/[^\d]/g, '');
    if (!cnpjLimpo) {
      this.cnpjError = 'CNPJ é obrigatório';
      isValid = false;
    } else if (!validateCNPJ(cnpjLimpo)) {
      this.cnpjError = 'CNPJ inválido';
      isValid = false;
    } else {
      this.cnpjError = '';
    }
    
    // Validação do telefone (opcional, mas deve conter apenas números e formatação)
    if (this.clienteForm.telefone && !/^[\d\s()+-]+$/.test(this.clienteForm.telefone)) {
      this.telefoneError = 'Telefone deve conter apenas números e símbolos válidos';
      isValid = false;
    } else {
      this.telefoneError = '';
    }
    
    // Validação do email (opcional, mas deve ser válido se fornecido)
    if (this.clienteForm.email && !this.validateEmail(this.clienteForm.email)) {
      this.emailError = 'Email inválido';
      isValid = false;
    } else {
      this.emailError = '';
    }
    
    return isValid;
  }
  
  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  }

  saveCliente(): void {
    // Validar formulário completo
    if (!this.validateForm()) {
      return;
    }
    
    // Remove formatação antes de salvar
    const cnpjLimpo = this.clienteForm.cnpj.replace(/[^\d]/g, '');
    
    this.isLoading = true;
    this.clearMessages();

    // Atualiza o CNPJ com o valor limpo
    const clienteToSave = {
      ...this.clienteForm,
      cnpj: cnpjLimpo
    };

    if (this.isEditing && this.clienteForm.id) {
      // Atualizar cliente existente
      this.clienteService.update(this.clienteForm.id, clienteToSave).subscribe({
        next: () => {
          this.successMessage = 'Cliente atualizado com sucesso!';
          this.loadClientes();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erro ao atualizar cliente';
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      // Criar novo cliente
      this.clienteService.create(clienteToSave).subscribe({
        next: () => {
          this.successMessage = 'Cliente cadastrado com sucesso!';
          this.loadClientes();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erro ao cadastrar cliente';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  editCliente(cliente: Cliente): void {
    this.isEditing = true;
    // Formatar o CNPJ para exibição
    const cnpjFormatado = this.aplicarFormatacaoCnpj(cliente.cnpj);
    this.clienteForm = { 
      ...cliente,
      cnpj: cnpjFormatado
    };
    // Limpar mensagens de erro
    this.nomeError = '';
    this.cnpjError = '';
    this.enderecoError = '';
    this.telefoneError = '';
    this.emailError = '';
  }

  deleteCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.isLoading = true;
      this.clearMessages();

      this.clienteService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Cliente excluído com sucesso!';
          this.loadClientes();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erro ao excluir cliente';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.clienteForm = {
      nome: '',
      cnpj: '',
      endereco: '',
      telefone: '',
      email: ''
    };
    // Limpar mensagens de erro
    this.nomeError = '';
    this.cnpjError = '';
    this.enderecoError = '';
    this.telefoneError = '';
    this.emailError = '';
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  formatCnpj(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    
    // Formatar o CNPJ: xx.xxx.xxx/xxxx-xx
    value = this.aplicarFormatacaoCnpj(value);
    
    this.clienteForm.cnpj = value;
  }

  aplicarFormatacaoCnpj(cnpj: string): string {
    cnpj = cnpj.replace(/\D/g, '');
    
    if (cnpj.length <= 14) {
      cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
      cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
      cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    return cnpj;
  }
  
  // Função para exibir CNPJ formatado na tabela
  formatarCnpjExibicao(cnpj: string): string {
    return this.aplicarFormatacaoCnpj(cnpj);
  }
}
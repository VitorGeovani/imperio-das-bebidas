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
  cnpjError = '';

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

  saveCliente(): void {
    // Remove formatação antes de validar
    const cnpjLimpo = this.clienteForm.cnpj.replace(/[^\d]/g, '');
    
    // Validar CNPJ
    if (!validateCNPJ(cnpjLimpo)) {
      this.cnpjError = 'CNPJ inválido';
      return;
    }
    
    this.cnpjError = '';
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
    this.cnpjError = '';
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
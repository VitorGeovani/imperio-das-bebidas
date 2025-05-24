import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { VendaService } from '../../services/venda.service';
import { ClienteService } from '../../services/cliente.service';
import { ProdutoService } from '../../services/produto.service';
import { Venda } from '../../models/venda.model';
import { Cliente } from '../../models/cliente.model';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class VendasComponent implements OnInit {
  vendas: Venda[] = [];
  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  
  vendaForm: any = {
    id: 0,
    clienteId: null,
    itens: [],
    dataVenda: new Date().toISOString().substring(0, 10),
    formaPagamento: 'Dinheiro',
    observacoes: '',
    valorTotal: 0
  };
  
  // Item temporário para adicionar à venda
  itemTemp: {produtoId: number | null, quantidade: number} = {
    produtoId: null,
    quantidade: 1
  };
  
  isEditing: boolean = false;
  formError: string = '';
  isLoading: boolean = false;
  showForm: boolean = false;
  
  // Opções de forma de pagamento
  formasPagamento: string[] = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Boleto'];

  constructor(
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    this.loadVendas();
    this.loadClientes();
    this.loadProdutos();
  }

  loadVendas(): void {
    this.isLoading = true;
    this.vendaService.getVendas().subscribe({
      next: (data: Venda[]) => {
        this.vendas = data;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar vendas:', error);
        this.isLoading = false;
      }
    });
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }

  loadProdutos(): void {
    this.produtoService.getAll().subscribe({
      next: (data: Produto[]) => {
        this.produtos = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }
  
  // Adicionar item à venda
  adicionarItem(): void {
    if (!this.itemTemp.produtoId || this.itemTemp.quantidade <= 0) {
      this.formError = 'Selecione um produto e uma quantidade válida';
      return;
    }
    
    const produto = this.produtos.find(p => p.id === Number(this.itemTemp.produtoId));
    if (!produto) {
      this.formError = 'Produto não encontrado';
      return;
    }
    
    // Verificar se há estoque suficiente
    if (produto.quantidade < this.itemTemp.quantidade) {
      this.formError = `Quantidade insuficiente em estoque para ${produto.nome}. Disponível: ${produto.quantidade}`;
      return;
    }
    
    // Verificar se o produto já está na lista
    const itemExistente = this.vendaForm.itens.find((item: any) => 
      item.produto && item.produto.id === Number(this.itemTemp.produtoId));
    
    if (itemExistente) {
      // Verificar estoque para o item atualizado
      if (produto.quantidade < (itemExistente.quantidade + this.itemTemp.quantidade)) {
        this.formError = `Quantidade insuficiente em estoque para ${produto.nome}. Disponível: ${produto.quantidade}`;
        return;
      }
      
      itemExistente.quantidade += this.itemTemp.quantidade;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
      // Adicionar novo item
      this.vendaForm.itens.push({
        produto: produto,
        produtoId: produto.id,
        quantidade: this.itemTemp.quantidade,
        precoUnitario: produto.preco,
        valorUnitario: produto.preco, // Adicionado para corresponder ao backend
        subtotal: produto.preco * this.itemTemp.quantidade
      });
    }
    
    // Limpar o item temporário
    this.itemTemp = {
      produtoId: null,
      quantidade: 1
    };
    
    // Atualizar valor total
    this.atualizarValorTotal();
    
    // Limpar erro
    this.formError = '';
  }
  
  // Remover item da venda
  removerItem(index: number): void {
    this.vendaForm.itens.splice(index, 1);
    this.atualizarValorTotal();
  }
  
  // Atualizar valor total da venda
  atualizarValorTotal(): void {
    this.vendaForm.valorTotal = this.vendaForm.itens.reduce(
      (total: number, item: any) => total + item.subtotal, 0);
  }

  onSubmit(): void {
    this.formError = '';
    if (!this.vendaForm.clienteId || this.vendaForm.itens.length === 0) {
      this.formError = 'Por favor, selecione um cliente e adicione pelo menos um produto à venda.';
      return;
    }

    this.isLoading = true;
    
    // Preparando o DTO simplificado para envio ao backend
    const vendaDTO = {
      id: this.vendaForm.id || null,
      clienteId: Number(this.vendaForm.clienteId),
      itens: this.vendaForm.itens.map((item: any) => ({
        id: item.id || null,
        produtoId: item.produto.id,
        quantidade: item.quantidade,
        // Usar valorUnitario para o backend, que é compatível com o campo no backend
        precoUnitario: (item.valorUnitario || item.precoUnitario).toString()
      })),
      dataVenda: this.vendaForm.dataVenda,
      formaPagamento: this.vendaForm.formaPagamento,
      observacoes: this.vendaForm.observacoes || '',
      status: 'Concluída',
      valorTotal: this.vendaForm.valorTotal.toString()
    };

    console.log('Enviando venda:', JSON.stringify(vendaDTO));

    if (this.isEditing) {
      this.vendaService.updateVenda(Number(vendaDTO.id), vendaDTO).subscribe({
        next: () => {
          this.resetForm();
          this.loadVendas();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar venda:', error);
          this.formError = this.getErrorMessage(error);
          this.isLoading = false;
        }
      });
    } else {
      this.vendaService.createVenda(vendaDTO).subscribe({
        next: () => {
          this.resetForm();
          this.loadVendas();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao criar venda:', error);
          this.formError = this.getErrorMessage(error);
          this.isLoading = false;
        }
      });
    }
  }

  // Extrair mensagem de erro da resposta HTTP
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    return error.status === 0 ? 
      'Não foi possível conectar ao servidor. Verifique sua conexão.' : 
      'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.';
  }

  editVenda(venda: Venda): void {
    this.isEditing = true;
    
    this.vendaForm = {
      id: venda.id,
      clienteId: venda.cliente.id,
      itens: venda.itens.map(item => ({
        id: item.id,
        produto: item.produto,
        quantidade: item.quantidade,
        // Tratar ambas as propriedades (valorUnitario e precoUnitario)
        precoUnitario: item.precoUnitario || item.valorUnitario || item.produto.preco,
        valorUnitario: item.valorUnitario || item.precoUnitario || item.produto.preco,
        subtotal: (item.valorUnitario || item.precoUnitario || item.produto.preco) * item.quantidade
      })),
      dataVenda: new Date(venda.dataVenda).toISOString().split('T')[0],
      formaPagamento: venda.formaPagamento || 'Dinheiro',
      observacoes: venda.observacoes || '',
      valorTotal: venda.valorTotal
    };
    
    this.showForm = true;
  }

  deleteVenda(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      this.isLoading = true;
      this.vendaService.deleteVenda(id).subscribe({
        next: () => {
          this.loadVendas();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir venda:', error);
          this.formError = 'Erro ao excluir venda.';
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.vendaForm = {
      id: 0,
      clienteId: null,
      itens: [],
      dataVenda: new Date().toISOString().substring(0, 10),
      formaPagamento: 'Dinheiro',
      observacoes: '',
      valorTotal: 0
    };
    this.itemTemp = {
      produtoId: null,
      quantidade: 1
    };
    this.isEditing = false;
    this.formError = '';
    this.showForm = false;
  }

  toggleForm(): void {
    if (!this.showForm) {
      this.showForm = true;
    } else {
      if (confirm('Deseja cancelar esta venda? Todos os dados serão perdidos.')) {
        this.resetForm();
        this.showForm = false;
      }
    }
  }

  getNomeProduto(id: number): string {
    const produto = this.produtos.find(p => p.id === id);
    return produto ? produto.nome : '';
  }

  getNomeCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.nome : '';
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }
  
  // Formatar valor para exibição em Reais
  formatarMoeda(valor: number): string {
    if (!valor && valor !== 0) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
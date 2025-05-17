// filepath: /home/geovani/Documents/sistema-vendas/frontend/Sistema/src/app/components/produtos/produtos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  produtoForm: Produto = {
    nome: '',
    preco: 0,
    quantidade: 0,
    descricao: '',
    categoria: '',
    fornecedor: ''
  };
  isEditing = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.isLoading = true;
    this.produtoService.getAll().subscribe({
      next: (data) => {
        this.produtos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar bebidas';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  saveProduto(): void {
    if (!this.produtoForm.nome || this.produtoForm.preco <= 0) {
      this.errorMessage = 'Preencha todos os campos obrigatórios';
      return;
    }
    
    this.isLoading = true;
    this.clearMessages();

    if (this.isEditing && this.produtoForm.id) {
      // Atualizar produto existente
      this.produtoService.update(this.produtoForm.id, this.produtoForm).subscribe({
        next: () => {
          this.successMessage = 'Bebida atualizada com sucesso!';
          this.loadProdutos();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erro ao atualizar bebida';
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      // Criar novo produto
      this.produtoService.create(this.produtoForm).subscribe({
        next: () => {
          this.successMessage = 'Bebida cadastrada com sucesso!';
          this.loadProdutos();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erro ao cadastrar bebida';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  editProduto(produto: Produto): void {
    this.isEditing = true;
    this.produtoForm = { ...produto };
  }

  deleteProduto(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta bebida?')) {
      this.isLoading = true;
      this.clearMessages();

      this.produtoService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Bebida excluída com sucesso!';
          this.loadProdutos();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erro ao excluir bebida';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.produtoForm = {
      nome: '',
      preco: 0,
      quantidade: 0,
      descricao: '',
      categoria: '',
      fornecedor: ''
    };
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
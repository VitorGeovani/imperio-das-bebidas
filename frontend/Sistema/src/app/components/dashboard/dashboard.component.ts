import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ProdutoService } from '../../services/produto.service';
import { VendaService } from '../../services/venda.service';
import { Cliente } from '../../models/cliente.model';
import { Produto } from '../../models/produto.model';
import { Venda } from '../../models/venda.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalClientes: number = 0;
  totalProdutos: number = 0;
  totalVendas: number = 0;
  isLoading: boolean = true;

  constructor(
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private vendaService: VendaService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Usando forkJoin para aguardar todas as respostas
    forkJoin({
      clientes: this.clienteService.getAll().pipe(catchError(error => {
        console.error('Erro ao carregar clientes:', error);
        return of([]);
      })),
      produtos: this.produtoService.getAll().pipe(catchError(error => {
        console.error('Erro ao carregar produtos:', error);
        return of([]);
      })),
      vendas: this.vendaService.getVendas().pipe(catchError(error => {
        console.error('Erro ao carregar vendas:', error);
        return of([]);
      }))
    }).subscribe(results => {
      this.totalClientes = results.clientes.length;
      this.totalProdutos = results.produtos.length;
      this.totalVendas = results.vendas.length;
      this.isLoading = false;
    });
  }
}
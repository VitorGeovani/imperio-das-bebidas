import { Produto } from './produto.model';

export interface ItemVenda {
  id?: number;
  produto: Produto;
  produtoId?: number;
  quantidade: number;
  precoUnitario: number;
  valorUnitario?: number; // Adicionado para compatibilidade com o backend
  subtotal?: number;
  venda?: any;
}
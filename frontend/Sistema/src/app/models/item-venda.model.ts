import { Produto } from './produto.model';

export interface ItemVenda {
  id?: number;
  produto: Produto;
  produtoId?: number;
  quantidade: number;
  precoUnitario: number;
  valorUnitario?: number;
  subtotal?: number;
  venda?: any;
}
import { Cliente } from './cliente.model';
import { ItemVenda } from './item-venda.model';

export interface Venda {
  id?: number;
  cliente: Cliente;
  itens: ItemVenda[];
  dataVenda: Date;
  valorTotal: number;
  formaPagamento?: string;
  observacoes?: string;
  status?: string;
}
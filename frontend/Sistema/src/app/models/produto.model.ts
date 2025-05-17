export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  quantidade: number;
  descricao?: string;
  categoria?: string;
  fornecedor?: string;
  imagemUrl?: string;
}
export interface Cliente {
  id?: number;
  nome: string;
  cnpj: string; // Alterado de CPF para CNPJ
  endereco?: string;
  telefone?: string;
  email?: string;
}
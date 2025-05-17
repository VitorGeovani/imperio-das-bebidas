import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venda } from '../models/venda.model';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = `${environment.apiUrl}/vendas`;

  constructor(private http: HttpClient) { }

  // Método para obter todas as vendas
  getVendas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl);
  }

  // Método para obter uma venda específica por ID
  getVendaById(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`);
  }

  // Método para criar uma nova venda
  createVenda(venda: any): Observable<Venda> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Venda>(this.apiUrl, venda, httpOptions);
  }

  // Método para atualizar uma venda existente
  updateVenda(id: number, venda: any): Observable<Venda> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Venda>(`${this.apiUrl}/${id}`, venda, httpOptions);
  }

  // Método para excluir uma venda
  deleteVenda(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
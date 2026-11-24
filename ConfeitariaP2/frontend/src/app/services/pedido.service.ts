import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api-config';
export interface Pedido {
  codigoPedido?: number;
  valorTotal: number;
  entrega: string;
  obs?: string;
  dataPedido: string;
  codigoCliente: number;
}
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly url = `${API_URL}/pedido`;
  constructor(private http: HttpClient) {}
  consultar(codigo: number): Observable<Pedido> { return this.http.get<Pedido>(`${this.url}/${codigo}`); }
  cadastrar(pedido: Pedido): Observable<string> { return this.http.post(this.url, pedido, { responseType: 'text' }); }
  atualizar(pedido: Pedido): Observable<string> { return this.http.put(this.url, pedido, { responseType: 'text' }); }
  excluir(codigo: number): Observable<string> { return this.http.delete(`${this.url}/${codigo}`, { responseType: 'text' }); }
}

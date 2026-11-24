import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api-config';

export interface Cliente {
  codigo?: number;
  nome: string;
  telefone?: string;
  documento?: string;
  senha?: string;
  logradouro?: string;
  email: string;
  ativo?: number;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly url = `${API_URL}/cliente`;
  constructor(private http: HttpClient) {}
  consultar(codigo: number): Observable<Cliente> { return this.http.get<Cliente>(`${this.url}/${codigo}`); }
  cadastrar(cliente: Cliente): Observable<string> { return this.http.post(this.url, cliente, { responseType: 'text' }); }
  atualizar(cliente: Cliente): Observable<string> { return this.http.put(this.url, cliente, { responseType: 'text' }); }
  excluir(codigo: number): Observable<string> { return this.http.delete(`${this.url}/${codigo}`, { responseType: 'text' }); }
  login(email: string, senha: string): Observable<Cliente> { return this.http.post<Cliente>(`${this.url}/login`, { email, senha }); }
  solicitarResetSenha(email: string): Observable<string> { return this.http.patch(`${this.url}/resetarSenha`, { email }, { responseType: 'text' }); }
  alterarSenha(cliente: Pick<Cliente, 'email'|'documento'|'senha'>): Observable<string> { return this.http.patch(`${this.url}/alterarSenha`, cliente, { responseType: 'text' }); }
}

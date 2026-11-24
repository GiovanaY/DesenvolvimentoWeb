
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Produto } from '../model/produto';
import { API_URL } from './api-config';

interface ProdutoAPI {
  codigo: number;
  nome?: string;
  descricao?: string;
  descritivo?: string;
  valor: number;
  valorPromo?: number;
  quantidade?: number;
  destaque?: number;
  semGluten?: boolean;
  semLactose?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly url = `${API_URL}/produto`;

  constructor(private http: HttpClient) {}

  private adaptarProduto(p: ProdutoAPI): Produto {
    return {
      codigo: p.codigo,
      nome: p.nome ?? p.descricao ?? '',
      descritivo: p.descritivo ?? '',
      valor: p.valor,
      valorPromo: p.valorPromo && p.valorPromo > 0 ? p.valorPromo : undefined,
      quantidade: p.quantidade ?? 0,
      destaque: p.destaque ?? 0,
      semGluten: p.semGluten,
      semLactose: p.semLactose
    };
  }

  listar(): Observable<Produto[]> {
    return this.http.get<ProdutoAPI[]>(`${API_URL}/produtos`).pipe(
      map(dados => (dados || []).map(p => this.adaptarProduto(p)))
    );
  }

  vitrine(): Observable<Produto[]> {
    return this.http.get<ProdutoAPI[]>(`${this.url}/vitrine`).pipe(
      map(dados => (dados || []).map(p => this.adaptarProduto(p)))
    );
  }

  buscarPorCodigo(codigo: number): Observable<Produto> {
    return this.http.get<ProdutoAPI>(`${this.url}/${codigo}`).pipe(
      map(p => this.adaptarProduto(p))
    );
  }

  buscar(termo: string): Observable<Produto[]> {
    return this.http.get<ProdutoAPI[]>(
      `${this.url}/busca/${encodeURIComponent(termo)}`
    ).pipe(
      map(dados => (dados || []).map(p => this.adaptarProduto(p)))
    );
  }

  cadastrar(produto: Produto): Observable<string> {
    return this.http.post(this.url, produto, { responseType: 'text' });
  }

  atualizar(produto: Produto): Observable<string> {
    return this.http.put(this.url, produto, { responseType: 'text' });
  }

  excluir(codigo: number): Observable<string> {
    return this.http.delete(`${this.url}/${codigo}`, { responseType: 'text' });
  }
}
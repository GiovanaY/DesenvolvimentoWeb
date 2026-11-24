import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Produto } from '../model/produto';
import { filtrarProdutos } from '../model/lista-produtos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../services/produto.service';

@Component({ imports: [CommonModule, FormsModule, RouterLink], selector: 'app-vitrine', styleUrl: './vitrine.css', templateUrl: './vitrine.html' })
export class Vitrine implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private produtosApi = inject(ProdutoService);

  termoPesquisa = signal('');
  lista = signal<Produto[]>([]);
  mostrarAviso = signal(false);
  pedidoRealizado = signal(false);
  erroApi = signal('');

  produtosFiltrados = computed(() => filtrarProdutos(this.lista(), this.termoPesquisa()));

  ngOnInit(): void {
    this.carregarProdutos();
    this.route.queryParamMap.subscribe(params => {
      if (params.get('adicionado')) {
        this.mostrarAviso.set(true);
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
      if (params.get('pedido')) {
        this.pedidoRealizado.set(true);
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });
  }

  carregarProdutos(): void {
    this.produtosApi.listar().subscribe({
      next: dados => { this.lista.set(dados || []); this.erroApi.set(''); },
      error: () => this.erroApi.set('Não foi possível conectar ao backend. Confira se a API está rodando na porta 8081.')
    });
  }

  buscarNaAPI(termo: string): void {
    this.termoPesquisa.set(termo);
    const consulta = termo.trim();
    if (!consulta) { this.carregarProdutos(); return; }
    this.produtosApi.buscar(consulta).subscribe({
      next: dados => {
        if (this.termoPesquisa() !== termo) return; // descarta resposta antiga
        this.lista.set(dados || []);
        this.erroApi.set('');
      },
      error: () => this.erroApi.set('Falha na busca pela API. Confira a conexão.')
    });
  }
}
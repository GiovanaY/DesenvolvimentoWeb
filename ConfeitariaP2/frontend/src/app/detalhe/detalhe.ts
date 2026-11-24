import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Produto } from '../model/produto';
import { Cesta as CestaModel } from '../model/cesta';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-detalhe',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.css'
})
export class Detalhe implements OnInit {

  private cdr = inject(ChangeDetectorRef);

  produto?: Produto;
  quantidadeSelecionada = 1;
  cesta = new CestaModel();
  erroApi = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtosApi: ProdutoService
  ) {}

  ngOnInit(): void {
    const parametro = this.route.snapshot.paramMap.get('codigo')
      ?? this.route.snapshot.paramMap.get('id');

    const codigo = Number(parametro);

    if (!parametro || isNaN(codigo)) {
      this.erroApi = 'Código do produto inválido.';
      return;
    }

    this.produtosApi.buscarPorCodigo(codigo).subscribe({
      next: produto => {
        this.produto = produto;
        this.cdr.markForCheck();
      },
      error: erro => {
        console.error('Erro ao buscar produto:', erro);
        this.erroApi = 'Não foi possível carregar este doce da API.';
        this.cdr.markForCheck();
      }
    });
  }

  aumentarQuantidade(): void {
    if (
      this.produto &&
      this.quantidadeSelecionada < this.produto.quantidade
    ) {
      this.quantidadeSelecionada++;
    }
  }

  diminuirQuantidade(): void {
    if (this.quantidadeSelecionada > 1) {
      this.quantidadeSelecionada--;
    }
  }

  adicionarECesta(): void {
    if (!this.produto) return;

    this.cesta.adicionar(
      this.produto,
      this.quantidadeSelecionada
    );

    this.router.navigate(['/vitrine'], {
      queryParams: { adicionado: '1' }
    });
  }
}
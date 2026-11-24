import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cesta } from '../model/cesta';
import { PedidoService, Pedido } from '../services/pedido.service';
import { SessaoService } from '../services/sessao.service';

@Component({
  selector: 'app-finalizar-compra',
  templateUrl: './finalizar-compra.html',
  styleUrls: ['./finalizar-compra.css'],
  imports: [CommonModule, RouterLink, FormsModule]
})
export class FinalizarCompra {
  private cdr = inject(ChangeDetectorRef);

  metodoPagamento = 'pix';
  cesta = new Cesta();
  enviando = false;
  erro = '';
  sucesso = '';

  constructor(
    private router: Router,
    private pedidoApi: PedidoService,
    private sessao: SessaoService
  ) {}

  onSubmit(form: HTMLFormElement) {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    if (this.cesta.vazia()) {
      this.erro = 'Sua cesta está vazia.';
      return;
    }

    const cliente = this.sessao.clienteAtual();
    if (!cliente?.codigo) {
      this.erro = 'Faça login antes de finalizar o pedido.';
      return;
    }

    const value = (id: string) =>
      (form.querySelector(`#${id}`) as HTMLInputElement)?.value?.trim() || '';

    const endereco = `${value('txtEndereco')}, ${value('txtNumero')}${value('txtComplemento') ? ' - ' + value('txtComplemento') : ''}, ${value('txtCidade')} - CEP ${value('txtCep')}`;

    const descricaoItens = this.cesta.itens
      .map(i => `${i.quantidade}x ${i.produto.nome}`)
      .join('; ');

    const pedido: Pedido = {
      codigoCliente: cliente.codigo,
      valorTotal: Number((this.cesta.total() + this.cesta.frete).toFixed(2)),
      entrega: endereco,
      obs: `Pagamento: ${this.metodoPagamento}. Produtos: ${descricaoItens}`,
      dataPedido: new Date().toISOString().slice(0, 10)
    };

    this.enviando = true;
    this.erro = '';

    this.pedidoApi.cadastrar(pedido).subscribe({
      next: resposta => {
        this.sucesso = resposta || 'Pedido enviado com sucesso!';
        this.cesta.limpar();
        this.enviando = false;
        this.cdr.markForCheck();
        this.router.navigate(['/vitrine'], { queryParams: { pedido: 'ok' } });
      },
      error: () => {
        this.erro = 'Não foi possível enviar o pedido. Verifique o backend e tente novamente.';
        this.enviando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
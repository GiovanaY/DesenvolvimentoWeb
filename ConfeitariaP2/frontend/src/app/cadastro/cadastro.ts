import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente } from '../services/cliente.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css'],
  imports: [RouterLink, FormsModule, CommonModule]
})
export class Cadastro {
  private cdr = inject(ChangeDetectorRef);

  enviando = false;
  erro = '';

  constructor(private router: Router, private clienteApi: ClienteService) {}

  onSubmit(form: HTMLFormElement) {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const get = (id: string) =>
      (form.querySelector(`#${id}`) as HTMLInputElement)?.value?.trim() || '';

    const cliente: Cliente = {
      nome: get('txtNome'),
      email: get('txtEmail'),
      senha: get('txtSenha'),
      telefone: get('txtTelefone'),
      ativo: 1
    };

    this.enviando = true;
    this.erro = '';

    this.clienteApi.cadastrar(cliente).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { cadastrado: '1' } }),
      error: err => {
        this.erro = err?.error || 'Não foi possível cadastrar. Verifique se o backend está ativo e se os dados são válidos.';
        this.enviando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../services/cliente.service';

@Component({
  imports: [RouterLink, FormsModule, CommonModule],
  selector: 'app-reenvio-senha',
  styleUrl: './reenvio-senha.css',
  templateUrl: './reenvio-senha.html'
})
export class ReenvioSenha {
  private cdr = inject(ChangeDetectorRef);

  linkEnviado = false;
  erro = '';
  enviando = false;

  constructor(private clienteApi: ClienteService) {}

  onSubmit(form: HTMLFormElement) {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const email = (form.querySelector('#txtEmail') as HTMLInputElement).value.trim();

    this.enviando = true;
    this.erro = '';

    this.clienteApi.solicitarResetSenha(email).subscribe({
      next: () => {
        this.linkEnviado = true;
        this.enviando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erro = 'Não foi possível solicitar a redefinição. Confira se o backend está disponível.';
        this.enviando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { SessaoService } from '../services/sessao.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [RouterLink, FormsModule, CommonModule]
})
export class Login {
  private cdr = inject(ChangeDetectorRef);

  enviando = false;
  erro = '';
  cadastrado = false;

  constructor(
    private router: Router,
    private clienteApi: ClienteService,
    private sessao: SessaoService,
    private route: ActivatedRoute
  ) {
    this.cadastrado = this.route.snapshot.queryParamMap.has('cadastrado');
  }

  onSubmit(form: HTMLFormElement) {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const email = (form.querySelector('#txtEmail') as HTMLInputElement).value.trim();
    const senha = (form.querySelector('#txtSenha') as HTMLInputElement).value;

    this.enviando = true;
    this.erro = '';

    this.clienteApi.login(email, senha).subscribe({
      next: cliente => {
        if (!cliente?.codigo) {
          this.erro = 'E-mail ou senha não conferem.';
          this.enviando = false;
          this.cdr.markForCheck();
          return;
        }
        this.sessao.guardarCliente(cliente);
        this.router.navigate(['/vitrine']);
      },
      error: () => {
        this.erro = 'Falha ao autenticar. Confira a conexão com o backend.';
        this.enviando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
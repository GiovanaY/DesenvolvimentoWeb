import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Cliente } from './cliente.service';
@Injectable({ providedIn: 'root' })
export class SessaoService {
  private browser = isPlatformBrowser(inject(PLATFORM_ID));
  guardarCliente(cliente: Cliente): void { if (this.browser) localStorage.setItem('clienteLogado', JSON.stringify(cliente)); }
  clienteAtual(): Cliente | null {
    if (!this.browser) return null;
    try { return JSON.parse(localStorage.getItem('clienteLogado') || 'null') as Cliente | null; } catch { return null; }
  }
  sair(): void { if (this.browser) localStorage.removeItem('clienteLogado'); }
}

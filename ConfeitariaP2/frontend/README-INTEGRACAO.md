# Confeitaria P1 — integração com API Spring Boot

Frontend Angular da P1 conectado aos endpoints do backend de referência `lojinha`.


## Pré-requisitos
- Node.js/npm compatíveis com a versão do Angular deste projeto.
- Backend Spring Boot iniciado na porta `8081` (configuração de referência `application.properties`).

## Iniciar backend
Na pasta do backend `lojinha/lojinha`, execute:

```bash
./mvnw spring-boot:run
```
No Windows, use `mvnw.cmd spring-boot:run`.

## Iniciar frontend
Na pasta `confeitariaP1`:

```bash
npm install
npm start
```
Acesse http://localhost:4200.

## Configuração de API
O endereço base é configurado em `src/app/services/api-config.ts`:
`http://localhost:8081/api`
Se a API estiver em outra porta/endereço, altere `API_URL`.


## Integrações implementadas
### Produto
- `GET /api/produtos` — lista catálogo
- `GET /api/produto/{codigo}` — busca detalhes
- `GET /api/produto/vitrine` — lista destaques
- `GET /api/produto/busca/{termo}` — busca por texto
- `POST /api/produto` — cadastrar
- `PUT /api/produto` — atualizar
- `DELETE /api/produto/{codigo}` — remover

### Cliente
- `GET /api/cliente/{codigo}` — consultar
- `POST /api/cliente` — cadastrar
- `PUT /api/cliente` — atualizar
- `DELETE /api/cliente/{codigo}` — remover
- `POST /api/cliente/login` — login
- `PATCH /api/cliente/resetarSenha` — solicitar redefinição
- `PATCH /api/cliente/alterarSenha` — alterar senha

### Pedido
- `GET /api/pedido/{codigo}` — consultar
- `POST /api/pedido` — registrar
- `PUT /api/pedido` — atualizar
- `DELETE /api/pedido/{codigo}` — remover

## Observações para demonstração
- Cadastro e login agora usam a API; o cliente autenticado é guardado no armazenamento local do navegador.
- A finalização exige login e envia o pedido com cliente, total, endereço de entrega, data e texto de observação contendo forma de pagamento e itens.
- O backend de referência `Pedido` não persiste uma lista estruturada de itens: a lista de produtos é enviada no campo `obs`. Isso é uma limitação do modelo Java fornecido.
- Os três PDFs de endpoint do GitHub não foram acessíveis durante a preparação. A integração foi baseada nas rotas e campos visíveis no código Spring Boot do ZIP da lojinha. Confirme se os PDFs do professor descrevem essas mesmas rotas antes da apresentação.
- A API de referência não implementa um endpoint de listagem de clientes/pedidos; os serviços contêm métodos CRUD que correspondem aos endpoints presentes nos controllers.

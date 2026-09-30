# Site Aurius

One-page estático (`index.html`, `css/style.css`, `js/main.js`, `js/galaxy.js`), sem build. `npm test` roda html-validate, stylelint, eslint e linkinator. Servidor local: `npx http-server . -p 4174 -c-1`.

## Regra obrigatória: testar o formulário após qualquer alteração

Depois de **toda** alteração no site (HTML, CSS ou JS), antes de commitar, rode o agente **`form-tester`** (`.claude/agents/form-tester.md`). Ele valida o formulário de contato de ponta a ponta: envio real para `auriusmedical@gmail.com` via Web3Forms, todos os campos chegando com os valores corretos, validação, fallback para o WhatsApp, links de contato, lint e layout mobile. Se o agente ainda não estiver disponível na sessão, rode um agente `general-purpose` instruído a ler e seguir esse arquivo.

Não commite se o `form-tester` reportar FALHOU.

## Contatos

- Formulário: Web3Forms (`access_key` pública no `index.html`), destino `auriusmedical@gmail.com`. O Web3Forms bloqueia envios feitos por servidor; teste só pelo navegador.
- WhatsApp: +55 96 98116-3599 (`https://wa.me/5596981163599`).

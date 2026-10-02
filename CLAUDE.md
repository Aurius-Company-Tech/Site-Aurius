# Site Aurius

One-page estático (`index.html`, `css/style.css`, `js/main.js`, `js/galaxy.js`), sem build. `npm test` roda html-validate, stylelint, eslint e linkinator. Servidor local: `npx http-server . -p 4174 -c-1`.

**Retomando o trabalho?** Leia `PROXIMOS-PASSOS.md`: status do plano de melhorias, o que falta e como configurar outra máquina.

## Testar o formulário só quando ele mudar

O agente **`form-tester`** (`.claude/agents/form-tester.md`) faz um envio real para `auriusmedical@gmail.com` via Web3Forms e confere todos os campos, a validação e o fallback para o WhatsApp. Ele gasta tokens, então **só rode quando a alteração mexer no formulário** (o bloco `#contact-form` no HTML, seus estilos ou o JS de envio/validação, ou os links de contato). Para as demais alterações, `npm test` basta.

Se o `form-tester` rodar e reportar FALHOU, não commite.

## Contatos

- Formulário: Web3Forms (`access_key` pública no `index.html`), destino `auriusmedical@gmail.com`. O Web3Forms bloqueia envios feitos por servidor; teste só pelo navegador.
- WhatsApp: +55 96 98116-3599 (`https://wa.me/5596981163599`).

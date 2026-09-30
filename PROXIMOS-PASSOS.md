# Próximos passos: site Aurius

Última atualização: 30/09/2026. Branch de trabalho: `feat/formulario-whatsapp`, com o **PR #5** aberto.

## Onde paramos

O plano de melhorias do site tem 6 itens.

| # | Item | Status |
|---|---|---|
| 1 | Formulário que envia de verdade + WhatsApp | ✅ Feito (PR #4, mergeado) |
| 2 | Prova social (portfólio, resultados, depoimentos, logos, números) | 🟡 Em andamento: portfólio feito (PR #5) |
| 3 | Reduzir dúvidas do cliente (FAQ, faixa de preço, garantias) | ⬜ A fazer |
| 4 | CTA de baixo compromisso ("Diagnóstico gratuito de 30 min" com agendamento) | ⬜ A fazer |
| 5 | SEO e medição (página por serviço, Analytics/Plausible com eventos, blog) | ⬜ A fazer |
| 6 | Polimento (hero com mockup/vídeo, Lighthouse mobile em produção) | ⬜ A fazer |

Já concluído nesta rodada:

- **Layout e transições no estilo "Auros"** (PR #3, mergeado).
- **CI no Node 22** (PR #3).
- **Formulário:**
  - envia para `auriusmedical@gmail.com` via **Web3Forms**;
  - campos: nome, e-mail, WhatsApp, tipo de projeto, investimento, prazo e mensagem;
  - honeypot anti-spam;
  - se o envio falhar, oferece o WhatsApp.
- **WhatsApp +55 96 98116-3599:** botão flutuante, link ao lado do formulário e link no rodapé.
- **E-mail do rodapé** trocado para `auriusmedical@gmail.com`.
- **Agente de testes `form-tester`** (`.claude/agents/form-tester.md`) e a regra no `CLAUDE.md` de rodá-lo depois de toda alteração.
- **Portfólio com 3 cases reais** em cards-link com moldura de navegador e troca de print no hover:
  - Bonavides Fine Art (e-commerce): https://bonavidesfineart.com.br/
  - Sacolaria Macapá (e-commerce): https://www.sacolariamacapa.com/
  - Triunfa (ERP, "Em finalização"): https://triunfa-web.onrender.com/
- **Ajustes pequenos:**
  - o `aria-invalid` agora é limpo no reenvio e no `change`;
  - `aspect-ratio` no logo do rodapé, que tirava o aviso de lazy-load do Chrome.
  - O último `form-tester` passou nos 10 passos (ID `T-20260930-170628`).

## Para fazer

### 0. Fechar o PR #5
- [ ] Conferir o CI do PR #5 e fazer o merge.
- [ ] Depois do merge, criar uma branch nova a partir da `main` para cada próximo passo.

### 2. Prova social (continuação)
- [ ] **Resultado principal de cada case.** Trocar as descrições provisórias (`.p-result` no bloco `#portfolio` do `index.html`) por um resultado concreto, com número se possível (ex.: "+40% de vendas online").
  - Bonavides: _(a definir)_
  - Sacolaria: _(a definir)_
  - Triunfa: _(a definir)_ (tirar o selo "Em finalização" quando entregar)
- [ ] **Depoimentos reais** (seção `#depoimentos`): nome, cargo, empresa, foto e, se possível, link do LinkedIn. Os 3 atuais são exemplos.
- [ ] **Faixa de logos de clientes** logo abaixo do hero.
- [ ] **Números da seção `#numeros`** (hoje "120+ projetos", "80+ clientes", "8 anos", "99% de satisfação"): confirmar valores reais ou remover.
- [ ] (Opcional) **Galeria/lightbox** com os prints extras (`bonavides/image1` colagem, `bonavides/image4` FAQ).
- [ ] (Opcional) **Página curta por case:** problema → solução → resultado.

### 3. Reduzir dúvidas
- [ ] **FAQ:** quanto custa, quanto tempo leva, de quem é o código, como funciona o suporte.
- [ ] **Faixa "a partir de"** por tipo de projeto.
- [ ] **Garantias:** prazo de resposta, contrato, suporte pós-entrega.

### 4. CTA de baixo compromisso
- [ ] **"Diagnóstico gratuito de 30 min"** com agendamento (Cal.com ou Calendly).

### 5. SEO e medição
- [ ] **Página por serviço:** ERP sob medida, e-commerce, apps, automação com IA.
- [ ] **Analytics** (GA4 ou Plausible) com eventos: clique nos CTAs, clique no WhatsApp, envio do formulário.
- [ ] (Opcional) Blog/conteúdo.

### 6. Polimento
- [ ] **Hero** com mockup ou vídeo curto de um produto real.
- [ ] **Lighthouse mobile em produção.** Localmente fica em cerca de 60 por causa da máquina; o CI mede em outro ambiente.
- [ ] **Links das redes sociais no rodapé:** ainda estão com `href="#"` (Instagram, LinkedIn, GitHub).
- [ ] **Mobile (390px):** o botão flutuante do WhatsApp cobre o fim da linha "Usamos seus dados… (LGPD)" do formulário. Não cobre o botão de envio. Opções: esconder o `.wa-float` quando o `#contato` estiver visível, ou dar `padding-right` ao `.form-legal` no mobile.

### Pendências externas
- [ ] **Refero MCP:** a assinatura está inativa (`NO_SUBSCRIPTION`). Para usar as referências de design pelo MCP, reative em https://refero.design/mcp/upgrade.

## Como retomar em outra máquina

1. **Clonar e instalar:**
   ```bash
   git clone git@github.com:Aurius-Company-Tech/Site-Aurius.git
   cd Site-Aurius
   git switch feat/formulario-whatsapp   # ou main, se o PR #5 já foi mergeado
   npm install
   ```
   Requer **Node 22+**, porque o `html-validate` e o `linkinator` não rodam no Node 20.
2. **GitHub CLI**, para abrir PRs e ver o CI: `gh auth login`.
3. **Servidor local:** `npx http-server . -p 4174 -c-1` e abrir http://localhost:4174.
4. **Testes:**
   - `npm test` roda html-validate, stylelint, eslint e linkinator.
   - Depois de **qualquer** alteração, rodar o agente **`form-tester`** no Claude Code. Ele faz 1 envio real do formulário e confere todos os campos. Não commitar se ele reprovar.
5. **Prints originais do portfólio:** os PNGs de `assets/portifolio/**` estão no `.gitignore` e **não vêm pelo Git**. Se precisar reprocessar, copie a pasta manualmente desta máquina. O site usa só os `.webp`, que estão versionados.
6. **Gerar novos WebPs para o portfólio:** use o `sharp` fora do projeto (não é dependência do site).
   - Cortes 16:10, larguras 640 e 1200, qualidade 78.
   - Nomes: `assets/portifolio/<projeto>/{capa,hover}-{640,1200}.webp`.

## Referências rápidas

- **Web3Forms:** `access_key` no `index.html`, pública por design e presa ao e-mail `auriusmedical@gmail.com`. O serviço bloqueia envios de servidor (curl retorna 403); teste só pelo navegador.
- **WhatsApp:** `https://wa.me/5596981163599`.
- **Agentes do projeto:** `.claude/agents/design-agent.md` (layout/UI) e `.claude/agents/form-tester.md` (testes).
- **CI (`.github/workflows/ci.yml`):** "Verificação de erros" (lint e links) e "Performance (Lighthouse)".

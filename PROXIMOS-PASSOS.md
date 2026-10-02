# Próximos passos: site Aurius

Última atualização: 01/10/2026. PRs #5 e #6 mergeados. Branch de trabalho: `feat/faq-garantias` (item 3).

## Onde paramos

O plano de melhorias do site tem 6 itens.

| # | Item | Status |
|---|---|---|
| 1 | Formulário que envia de verdade + WhatsApp | ✅ Feito (PR #4, mergeado) |
| 2 | Prova social (portfólio, resultados, depoimentos, logos) | 🟡 Em andamento: portfólio feito (PR #5) |
| 3 | Reduzir dúvidas do cliente (FAQ e garantias) | ✅ Feito (PR #8, mergeado) |
| 4 | CTA de baixo compromisso ("Diagnóstico gratuito de 30 min" com agendamento) | ✅ Feito pelo WhatsApp (PR #9); agenda online fica para depois |
| 5 | SEO e medição (página por serviço, Analytics com eventos, blog) | ✅ SEO técnico, Umami e páginas por serviço feitos; blog opcional |
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
- **Agente de testes `form-tester`** (`.claude/agents/form-tester.md`) e a regra no `CLAUDE.md` de rodá-lo só quando houver mudanças no formulário.
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
- [x] PR #5 e PR #6 mergeados (01/10/2026).
- [x] Branch nova `feat/faq-garantias` criada a partir da `main`.

### 2. Prova social (continuação)
- [ ] **Resultado principal de cada case.** Trocar as descrições provisórias (`.p-result` no bloco `#portfolio` do `index.html`) por um resultado concreto, com número se possível (ex.: "+40% de vendas online").
  - Bonavides: _(a definir)_
  - Sacolaria: _(a definir)_
  - Triunfa: _(a definir)_ (tirar o selo "Em finalização" quando entregar)
- [ ] **Depoimentos reais** (a seção foi removida em 01/10/2026, ver abaixo): quando houver, recriar a seção com nome, cargo, empresa, foto e, se possível, link do LinkedIn. Está no histórico do Git (`git log -S "carousel"`).
- [ ] **Faixa de logos de clientes** logo abaixo do hero.
- [x] **Números inventados removidos** (01/10/2026): a faixa do hero e a seção `#numeros` ("120+ projetos", "80+ clientes", "8 anos", "99% de satisfação") eram texto de exemplo e não refletiam a empresa, que é nova. Só voltam com dados reais (ver ideias de substituição no PR).
- [x] **Depoimentos de exemplo removidos** (01/10/2026): a seção `#depoimentos` (3 depoimentos com nomes e resultados fictícios), o carrossel, o link no menu e o ponto do trilho saíram. Voltam só com depoimentos reais e autorizados.

#### Ideias para ocupar o lugar dos números (anotadas em 01/10/2026, a fazer depois)
A empresa é nova, então só entra o que for verdadeiro hoje. Sugestão de ordem: 1, 2 e 4.
1. [x] **Faixa de fatos no hero** (feita em 02/10/2026, com "3 projetos recentes"): "3 projetos no ar", "5 frentes de serviço", "Resposta em até 24h úteis" (todos já são fatos do site).
2. [ ] **Seção "Quem somos":** história da Aurius, o que ela acredita e as pessoas por trás (foto, nome e LinkedIn dos sócios).
3. [ ] **Mais detalhe em cada case do portfólio:** problema do cliente, o que foi construído e tecnologias usadas.
4. [ ] **"Como trabalhamos":** contrato com escopo fechado, código no nome do cliente e entregas por etapa com aprovação do cliente.
5. [ ] **Selo "Primeiros clientes":** condição especial para quem fechar nesta fase (depende de decisão comercial).
6. [ ] **Faixa de tecnologias usadas** (React, Node, Python, API do WhatsApp...): confirmar quais são realmente usadas.
7. [ ] **Transparência no portfólio:** manter o selo "Em finalização" no Triunfa e falar em "projetos recentes", não "projetos entregues".
8. [ ] **Números reais, quando existirem:** projetos no ar, clientes atendidos e tempo médio de resposta (o Umami ajuda a medir). A seção de números volta só com dados verdadeiros.
- [ ] (Opcional) **Galeria/lightbox** com os prints extras (`bonavides/image1` colagem, `bonavides/image4` FAQ).
- [ ] (Opcional) **Página curta por case:** problema → solução → resultado.

### 3. Reduzir dúvidas
Seção `#faq` (entre o portfólio e o contato) pronta, com link "FAQ" no menu, no menu mobile, no trilho e no rodapé.
- [x] **FAQ** com 7 perguntas (`<details>` nativo, sem JS): custo, prazo, código, suporte, pagamento, escopo indefinido, mudanças.
- [x] ~~Faixa "a partir de"~~: **descartada**. Decisão (01/10/2026): o valor é negociado com cada cliente conforme complexidade e tamanho, então o site não mostra preços.
- [x] **Garantias** (`.guarantees`): resposta em 24h úteis, contrato com escopo fechado, código é do cliente, qualidade testada.
- Decisão (01/10/2026): **preço, prazo, suporte e pagamento não têm números no site**. São tratados na negociação de cada projeto; o FAQ só diz que ficam definidos na proposta e no contrato.
- [ ] (Opcional) Adicionar JSON-LD `FAQPage` para SEO.

### 4. CTA de baixo compromisso
- [x] **"Diagnóstico gratuito de 30 min"** pelo WhatsApp (decisão de 01/10/2026: sem ferramenta de agenda por enquanto). A mensagem pronta é "quero agendar o diagnóstico gratuito de 30 min".
  - Hero: o botão secundário "Ver projetos" virou "Diagnóstico gratuito de 30 min" (o portfólio continua no menu).
  - Formulário: "ou fale pelo WhatsApp" virou "ou agende um diagnóstico gratuito de 30 min pelo WhatsApp".
  - Contato: o item "Diagnóstico inicial sem custo" virou "Diagnóstico gratuito de 30 min".
- [ ] (Depois) Trocar o link do WhatsApp por uma agenda online (Cal.com ou Calendly) quando a conta existir: basta substituir o `href` dos dois links com `diagn%C3%B3stico` no `index.html`.

### 5. SEO e medição
Domínio oficial: **https://auriuscompany.com.br** (GitHub Pages, DNS na Hostinger, HTTPS obrigatório, domínio verificado na organização). O `CNAME` está na raiz do repo.
- [x] **Imagem de compartilhamento** `assets/og-aurius.jpg` (1200x630, logo + slogan), com URL absoluta em `og:image`/`twitter:image`. Gerada com `sharp` fora do projeto.
- [x] **Canonical + `og:url`**, **JSON-LD** (`ProfessionalService`, `WebSite`, `FAQPage` com as 7 perguntas do FAQ), `robots.txt` e `sitemap.xml`.
  - Se mudar o texto do FAQ, atualize também o JSON-LD no `<head>`.
- [x] **Umami Cloud** (sem cookies, sem banner LGPD), website ID `b2aa8368-c082-4117-b3c4-4171c8c0a95f`, `data-domains` restrito ao domínio (testes locais não contam).
  - Eventos: `cta-proposta` (local: menu, menu-mobile, hero), `cta-diagnostico` (hero, formulario), `whatsapp` (flutuante, rodape, falha-formulario), `portfolio` (case), `formulario-enviado` (tipo, orcamento, prazo, sem dados pessoais), `formulario-falhou`.
- [ ] Depois do merge: enviar o `sitemap.xml` no **Google Search Console** e validar a prévia no **Facebook Sharing Debugger** / **LinkedIn Post Inspector**.
- [x] **Página por serviço** (02/10/2026): `sites/`, `aplicativos/`, `erp-sob-medida/`, `ecommerce/`, `automacao-ia/` (cada uma com `index.html`, canonical, JSON-LD `Service`/`BreadcrumbList`/`FAQPage`, eventos Umami). Usam `css/style.css` + `css/servico.css`, sem JS e sem galáxia. Foram geradas por um script fora do repo: para mudar o texto, edite o HTML de cada página direto. Os cards e o rodapé do `index.html` linkam para elas, e o `sitemap.xml` lista as 6 URLs.
- [ ] **Reenviar o `sitemap.xml` no Google Search Console** depois do deploy (agora com as páginas de serviço).
- [ ] (Opcional) Blog/conteúdo.

### 6. Polimento
- [ ] **Hero** com mockup ou vídeo curto de um produto real.
- [ ] **Lighthouse mobile em produção.** Localmente fica em cerca de 60 por causa da máquina; o CI mede em outro ambiente.
- [x] **Redes sociais no rodapé** (02/10/2026): só o Instagram (https://www.instagram.com/auriuscompany/) existe; LinkedIn e GitHub foram removidos. Recriar quando houver perfis.
- [x] **Mobile (390px):** o botão flutuante do WhatsApp cobria o texto de LGPD do formulário. Corrigido: o `.wa-float` agora some enquanto o `#contact-form` está na tela.

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
   - Só quando mexer no **formulário** (HTML, estilos, JS de envio ou links de contato), rodar o agente **`form-tester`** no Claude Code. Ele faz 1 envio real e confere todos os campos. Não commitar se ele reprovar.
5. **Prints originais do portfólio:** os PNGs de `assets/portifolio/**` estão no `.gitignore` e **não vêm pelo Git**. Se precisar reprocessar, copie a pasta manualmente desta máquina. O site usa só os `.webp`, que estão versionados.
6. **Gerar novos WebPs para o portfólio:** use o `sharp` fora do projeto (não é dependência do site).
   - Cortes 16:10, larguras 640 e 1200, qualidade 78.
   - Nomes: `assets/portifolio/<projeto>/{capa,hover}-{640,1200}.webp`.

## Referências rápidas

- **Web3Forms:** `access_key` no `index.html`, pública por design e presa ao e-mail `auriusmedical@gmail.com`. O serviço bloqueia envios de servidor (curl retorna 403); teste só pelo navegador.
- **WhatsApp:** `https://wa.me/5596981163599`.
- **Agentes do projeto:** `.claude/agents/design-agent.md` (layout/UI) e `.claude/agents/form-tester.md` (testes).
- **CI (`.github/workflows/ci.yml`):** "Verificação de erros" (lint e links) e "Performance (Lighthouse)".

# Prompt — Site Aurius (experiência cinematográfica com scroll)

Crie um site institucional imersivo e cinematográfico para a empresa **AURIUS**, uma software house que oferece: **criação de sites, aplicativos, ERP, e-commerce e automação**.

## Identidade visual

- **Logo:** usar o arquivo `ChatGPT Image 16 de jul. de 2026, 12_30_10.png` (letra "A" estilizada, metade dourada e metade violeta, com uma esfera roxa como ponto — remetendo a "AI").
- **Paleta de cores (extraída da logo):**
  - Dourado claro (glow): `#F2E27E`
  - Dourado metálico: `#D9C25A`
  - Violeta principal: `#7C3AED`
  - Roxo profundo: `#5B21B6`
  - Lilás (glow): `#B794F6`
  - Fundo espacial: `#0A0A12` (quase preto, com leve tom azulado)
  - Cinza grafite (superfícies/cards): `#1A1A24`
  - Texto: branco `#F5F5F7` e cinza claro `#A0A0B0`
- **Estilo:** dark mode espacial, glassmorphism sutil nos cards, gradientes dourado→violeta nos títulos e CTAs, glow/bloom nos elementos interativos (mesmo efeito de brilho da logo).
- **Tipografia:** display futurista para títulos (ex.: Space Grotesk ou Clash Display) e sans-serif limpa para corpo (ex.: Inter).

## Cena de abertura (Hero)

Ao abrir o site, a tela inteira mostra uma **galáxia espiral inspirada na imagem `galáxia-andrómeda.webp`** (galáxia de Andrômeda inclinada em diagonal, núcleo dourado brilhante, braços em tons violeta/azulados, campo de estrelas coloridas ao redor):

- Renderizar a galáxia em **WebGL/Three.js** com sistema de partículas (100k+ partículas): núcleo dourado (`#F2E27E`) que transiciona para violeta (`#7C3AED`) nos braços espirais — exatamente o degradê da logo.
- Campo de estrelas com parallax em múltiplas camadas, estrelas piscando (twinkle) e algumas estrelas cadentes ocasionais.
- A galáxia gira lentamente e reage ao movimento do mouse (parallax 3D suave, inclinação de ~5°).
- A logo AURIUS surge no centro com animação de reveal (partículas se condensando formando a logo), seguida do tagline: **"Tecnologia que orbita o seu negócio"** com efeito de texto shimmer dourado→violeta.
- Indicador de scroll pulsante no rodapé ("Role para explorar o universo Aurius").

## Transição principal: galáxia → notebook (scroll cinematográfico)

Esta é a animação central do site. Ao começar a scrollar, o **scroll nativo é pausado/sequestrado (scroll hijacking com GSAP ScrollTrigger + `pin: true` e `scrub`)** e o progresso do scroll passa a controlar uma transição cinematográfica:

1. **Frame inicial:** a galáxia de Andrômeda ocupando a tela inteira (referência: `galáxia-andrómeda.webp`).
2. Conforme o usuário scrolla, a câmera **recua lentamente (zoom out)** e a galáxia vai diminuindo, revelando que ela está dentro da **tela de um notebook** — usar como referência a imagem `pexels-photo-205421.webp` (MacBook prateado aberto em diagonal sobre uma mesa de madeira escura, visto de cima).
3. A galáxia "entra" na tela do notebook: o brilho do núcleo reflete sutilmente no teclado e na mesa de madeira.
4. **Frame final:** o notebook completo sobre a mesa, com a galáxia girando viva dentro da tela — a mensagem visual: *"a Aurius coloca o universo digital na sua tela"*.
5. Ao completar a transição, o scroll é liberado e o texto surge ao lado do notebook: **"Nós criamos universos digitais"** + subtítulo sobre os serviços.

**Produção da animação:** gerar esse vídeo de transição no **Higgsfield** (image-to-video com frame inicial e final):
- *Start frame:* `galáxia-andrómeda.webp`
- *End frame:* `pexels-photo-205421.webp` (com a galáxia composta dentro da tela do notebook)
- *Prompt do Higgsfield:* "Slow cinematic dolly zoom out from inside a spiral galaxy (Andromeda, golden core, purple arms, star field), the camera pulls back smoothly revealing the galaxy is displayed on the glowing screen of a silver laptop sitting on a dark wooden desk, top-down angle, screen glow reflecting on the keyboard and wood, dark ambient, photorealistic, seamless transition, 4K"
- Exportar o vídeo e usá-lo no site com **scroll-scrubbing** (o `currentTime` do vídeo — ou sequência de frames em `<canvas>` — atrelado ao progresso do ScrollTrigger, técnica estilo Apple AirPods). Alternativa 100% código: fazer a mesma transição em Three.js movendo a câmera da galáxia para dentro de um modelo 3D de notebook.

## Seções seguintes (todas com efeitos de scroll)

Depois da transição, o site segue em one-page com estas seções, cada uma com animações disparadas por scroll:

1. **Serviços** — 5 cards (Sites, Aplicativos, ERP, E-commerce, Automação) orbitando como planetas ao redor de um "sol" com a logo; ao scrollar, cada card entra em cena com stagger + efeito 3D tilt no hover + borda com glow gradiente dourado→violeta. Ícones com micro-animações (Lottie).
2. **Processo/Metodologia** — linha do tempo horizontal com scroll horizontal sequestrado (pin + scrub): Descoberta → Design → Desenvolvimento → Lançamento → Órbita (suporte contínuo), com uma "estrela cadente" percorrendo a linha conforme o scroll avança.
3. **Portfólio** — grid de projetos com parallax individual por card, imagens com efeito de distorção líquida (hover shader) e reveal com clip-path ao entrar na viewport.
4. **Números/Prova social** — contadores animados (projetos entregues, clientes, anos) com partículas douradas subindo ao fundo.
5. **Depoimentos** — carrossel com transição de fade estelar.
6. **CTA final** — fundo volta a mostrar o campo de estrelas; título "Pronto para lançar seu projeto em órbita?" com botão magnético (magnetic button) com glow pulsante violeta; formulário de contato em glassmorphism.
7. **Footer** — constelação animada conectando os links (linhas entre pontos, estilo particles.js).

## Efeitos globais obrigatórios

- **Lenis/smooth scroll** em todo o site + GSAP ScrollTrigger para todas as animações.
- Cursor customizado com trilha de partículas estelares (dourado/violeta).
- Text reveal (split por caractere/palavra) em todos os títulos ao entrar na viewport.
- Parallax em múltiplas camadas em todas as seções.
- Barra de progresso do scroll no topo com gradiente dourado→violeta.
- Transições de seção com máscaras/gradientes que lembram poeira estelar.
- Preloader: logo Aurius formada por partículas convergindo + porcentagem de carregamento.
- Sons sutis opcionais (toggle de áudio): ambiente espacial no hero.

## Requisitos técnicos

- **Stack:** Next.js (ou Vite + React), Three.js / React Three Fiber para as cenas 3D, GSAP + ScrollTrigger + Lenis para scroll, Tailwind CSS para estilo.
- Responsivo: no mobile, substituir o scroll-hijack pesado por uma versão simplificada da transição (vídeo scrubbed mais curto ou fade sequencial) e reduzir contagem de partículas.
- Performance: lazy load das cenas, `prefers-reduced-motion` respeitado (fallback estático), imagens em WebP/AVIF, meta Lighthouse ≥ 85 em performance.
- SEO: metatags completas, OG image com a arte da galáxia + logo, semântica HTML correta apesar das animações.
- Idioma do conteúdo: **português (Brasil)**.

# 🌌 Site Aurius

Site institucional imersivo e cinematográfico da **AURIUS** — software house especializada em **sites, aplicativos, ERP, e-commerce e automação**.

> *"Tecnologia que orbita o seu negócio."*

## ✨ Destaques

- **Galáxia em WebGL/Three.js** — sistema com ~42 mil partículas no desktop e ~9 mil no mobile: núcleo dourado que transiciona para violeta nos braços espirais (o mesmo degradê da logo), campo de estrelas em múltiplas camadas com twinkle, estrelas cadentes e parallax 3D com o mouse.
- **Scroll suave** com Lenis em todo o site.
- **Hero sem preloader**: proposta de valor, CTAs e prova social aparecem em < 1 s (entrada em CSS); a galáxia é montada depois, em momento ocioso, e entra com fade.
- Linha do tempo **horizontal** do processo (Descoberta → Design → Desenvolvimento → Lançamento → Evolução) com um marcador de progresso percorrendo a linha conforme o scroll.
- Portfólio com reveal em `clip-path` e parallax individual por card, contadores animados com partículas douradas, carrossel de depoimentos, botão magnético no CTA e constelação animada no footer.
- Responsivo, com versão simplificada dos efeitos no mobile e suporte a `prefers-reduced-motion`.

## 🎨 Identidade visual

Paleta extraída da logo (letra "A" metade dourada, metade violeta, com esfera de IA):

| Cor | Hex |
| --- | --- |
| Dourado claro (glow) | `#F2E27E` |
| Dourado metálico | `#D9C25A` |
| Violeta principal | `#7C3AED` |
| Roxo profundo | `#5B21B6` |
| Lilás (glow) | `#B794F6` |
| Fundo espacial | `#0A0A12` |
| Cinza grafite (cards) | `#1A1A24` |

Tipografia: **Space Grotesk** (títulos) e **Inter** (corpo), via Google Fonts.

## 🛠 Stack

Site estático, sem build:

- HTML5 + CSS3 + JavaScript (vanilla)
- [Three.js](https://threejs.org/) — cena 3D da galáxia
- [GSAP + ScrollTrigger](https://gsap.com/) — animações e scroll cinematográfico
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll

As bibliotecas são carregadas via CDN (jsDelivr).

## 📁 Estrutura

```
├── index.html              # One-page com todas as seções
├── css/
│   └── style.css           # Tema espacial, glassmorphism, responsivo
├── js/
│   ├── galaxy.js           # Galáxia de partículas em Three.js
│   └── main.js             # Preloader, transições, scroll e interações
├── assets/
│   ├── logo.webp           # Logo com fundo transparente (418×620, usada no site)
│   ├── favicon.png
│   ├── galaxia.webp        # Referência da galáxia (OG image)
└── prompt-site-aurius.md   # Especificação/briefing do projeto
```

## 🚀 Como rodar

Por ser estático, basta abrir o `index.html` no navegador — ou servir a pasta para uma experiência idêntica à de produção:

```bash
npx http-server -p 4174 -c-1
# abra http://localhost:4174
```

## 📄 Seções

1. **Hero** — galáxia em tela cheia com reveal da logo e tagline
2. **Serviços** — Sites · Aplicativos · ERP · E-commerce · Automação
3. **Processo** — timeline horizontal em 5 etapas
4. **Portfólio** — projetos em grid com parallax
5. **Depoimentos** — carrossel com fade estelar
6. **Contato** — formulário glassmorphism com botão magnético
7. **Footer** — constelação animada

## ✅ CI — verificação automática de erros

Toda atualização (push em qualquer branch, pull request ou execução manual) dispara
o workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml), que alerta se houver erro:

| Check | Ferramenta | O que pega |
|---|---|---|
| HTML | `html-validate` | marcação inválida, atributos errados, problemas de acessibilidade |
| CSS | `stylelint` | sintaxe quebrada, propriedades e valores inválidos |
| JS | `eslint` | variáveis/funções indefinidas (typos), erros de sintaxe |
| Links | `linkinator` | imagens, CSS, JS e links apontando para 404 |
| Performance | Lighthouse | pontuação e orçamento de peso (informativo, não bloqueia) |

Os quatro primeiros rodam com `if: always()`, então um PR mostra **todos** os erros
de uma vez, em vez de um por execução.

Rodar localmente antes de commitar:

```bash
npm install   # apenas na primeira vez
npm test      # roda os quatro checks
```

Ou individualmente: `npm run lint:html`, `lint:css`, `lint:js`, `lint:links`.

---

© 2026 Aurius · Tecnologia que orbita o seu negócio

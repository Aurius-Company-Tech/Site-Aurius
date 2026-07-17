# 🌌 Site Aurius

Site institucional imersivo e cinematográfico da **AURIUS** — software house especializada em **sites, aplicativos, ERP, e-commerce e automação**.

> *"Tecnologia que orbita o seu negócio."*

## ✨ Destaques

- **Galáxia em WebGL/Three.js** — sistema com ~90 mil partículas: núcleo dourado que transiciona para violeta nos braços espirais (o mesmo degradê da logo), campo de estrelas em múltiplas camadas com twinkle, estrelas cadentes e parallax 3D com o mouse.
- **Transição cinematográfica galáxia → notebook** — ao rolar, o scroll é sequestrado (GSAP ScrollTrigger com `pin` + `scrub`) e a câmera "recua": a galáxia encolhe até se encaixar, via homografia (`matrix3d`), exatamente dentro da tela de um notebook sobre uma mesa de madeira, com o brilho do núcleo refletindo no teclado.
- **Scroll suave** com Lenis em todo o site.
- **Preloader** com partículas convergindo e porcentagem de carregamento.
- Linha do tempo **horizontal** do processo (Descoberta → Design → Desenvolvimento → Lançamento → Órbita) com um cometa percorrendo a rota conforme o scroll.
- Portfólio com reveal em `clip-path` e parallax individual por card, contadores animados com partículas douradas, carrossel de depoimentos, botão magnético no CTA, cursor customizado com trilha estelar e constelação animada no footer.
- **Som ambiente espacial opcional** (WebAudio, toggle na navegação).
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
│   ├── logo-glow.png       # Logo com fundo transparente (usada no site)
│   ├── favicon.png
│   ├── galaxia.webp        # Referência da galáxia (OG image)
│   └── laptop.webp         # Foto do notebook usada na transição
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
2. **Transição** — a galáxia entra na tela do notebook ("Nós criamos universos digitais")
3. **Serviços** — Sites · Aplicativos · ERP · E-commerce · Automação
4. **Processo** — timeline horizontal em 5 etapas
5. **Portfólio** — projetos em grid com parallax
6. **Números** — prova social com contadores animados
7. **Depoimentos** — carrossel com fade estelar
8. **Contato** — formulário glassmorphism com botão magnético
9. **Footer** — constelação animada

---

© 2026 Aurius · Tecnologia que orbita o seu negócio

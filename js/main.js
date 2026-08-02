/* ============================================================
   AURIUS — Interações, scroll cinematográfico e efeitos
   Requer: gsap + ScrollTrigger, Lenis, AuriusGalaxy (galaxy.js)
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(pointer: coarse)").matches;
  var isMobile = window.innerWidth < 768;

  gsap.registerPlugin(ScrollTrigger);

  /* ============ Galáxia WebGL ============ */
  var galaxyWrap = document.getElementById("galaxy-wrap");
  var galaxyApi = AuriusGalaxy.init({
    canvas: document.getElementById("galaxy-canvas"),
    count: isMobile ? 26000 : 90000,
    reducedMotion: prefersReduced
  });

  /* ============ Lenis smooth scroll ============ */
  var lenis = null;
  if (!prefersReduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ============ Split text ============ */
  function splitChars(el) {
    var chars = [];
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (word) {
          if (!word) return;
          if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(" ")); return; }
          var w = document.createElement("span");
          w.className = "split-w";
          word.split("").forEach(function (ch) {
            var c = document.createElement("span");
            c.className = "split-c";
            c.textContent = ch;
            w.appendChild(c);
            chars.push(c);
          });
          frag.appendChild(w);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        // elementos internos (ex.: <em>) viram uma unidade única
        var w2 = document.createElement("span");
        w2.className = "split-w";
        var c2 = document.createElement("span");
        c2.className = "split-c";
        el.replaceChild(w2, node);
        c2.appendChild(node);
        w2.appendChild(c2);
        chars.push(c2);
      }
    });
    return chars;
  }

  /* ============ Preloader ============ */
  var preloader = document.getElementById("preloader");
  var plBar = preloader.querySelector(".preloader-bar");
  var plPct = preloader.querySelector(".preloader-pct");
  var plCanvas = document.getElementById("preloader-canvas");
  var plRunning = true;

  (function preloaderParticles() {
    var ctx = plCanvas.getContext("2d");
    var parts = [];
    plCanvas.width = innerWidth; plCanvas.height = innerHeight;
    for (var i = 0; i < 90; i++) {
      parts.push({
        x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        gold: Math.random() < 0.5, sp: 0.008 + Math.random() * 0.02, r: 0.6 + Math.random() * 1.6
      });
    }
    (function draw() {
      if (!plRunning) return;
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, plCanvas.width, plCanvas.height);
      var cx = innerWidth / 2, cy = innerHeight / 2;
      ctx.globalCompositeOperation = "lighter";
      parts.forEach(function (p) {
        p.x += (cx - p.x) * p.sp;
        p.y += (cy - p.y) * p.sp;
        var d = Math.hypot(cx - p.x, cy - p.y);
        if (d < 60) { p.x = Math.random() * innerWidth; p.y = Math.random() * innerHeight; }
        var a = Math.min(0.8, d / 500);
        ctx.fillStyle = p.gold ? "rgba(242,226,126," + a + ")" : "rgba(183,148,246," + a + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      });
    })();
  })();

  var loadDone = false;
  window.addEventListener("load", function () { loadDone = true; });

  var plStart = performance.now(), plShown = 0;
  (function plTick() {
    var elapsed = (performance.now() - plStart) / 1000;
    if (elapsed > 3.2 || document.readyState === "complete") loadDone = true; // segurança
    var target = loadDone ? 100 : Math.min(90, elapsed * 55);
    plShown += (target - plShown) * 0.16;
    if (plShown > 99.4) plShown = 100;
    plBar.style.width = plShown + "%";
    plPct.textContent = Math.round(plShown) + "%";
    if (plShown >= 100) { exitPreloader(); return; }
    requestAnimationFrame(plTick);
  })();

  function exitPreloader() {
    var tl = gsap.timeline({
      onComplete: function () { plRunning = false; preloader.style.display = "none"; }
    });
    tl.to(".preloader-center", { autoAlpha: 0, scale: 1.15, duration: 0.55, ease: "power2.in" })
      .to(preloader, { autoAlpha: 0, duration: 0.7, ease: "power1.inOut" }, "-=0.15")
      .add(introHero, "-=0.45");
  }

  /* ============ Intro do hero ============ */
  var tagChars = null;
  var heroTagline = document.querySelector(".hero-tagline");
  if (heroTagline) { tagChars = splitChars(heroTagline); gsap.set(tagChars, { yPercent: 110 }); }
  gsap.set(".hero-logo", { autoAlpha: 0, scale: 0.62, y: 26 });
  gsap.set(".hero-title", { autoAlpha: 0, y: 34 });
  gsap.set(".scroll-indicator", { autoAlpha: 0 });

  function introHero() {
    var tl = gsap.timeline();
    tl.to(".hero-logo", { autoAlpha: 1, scale: 1, y: 0, duration: 1.3, ease: "power3.out" })
      .to(".hero-title", { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.7");
    if (tagChars) tl.to(tagChars, { yPercent: 0, duration: 0.8, stagger: 0.018, ease: "power3.out" }, "-=0.5");
    tl.to(".scroll-indicator", { autoAlpha: 1, duration: 0.8 }, "-=0.3");
  }

  /* ============ Barra de progresso + nav ============ */
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: function (self) {
      document.getElementById("scroll-progress").style.transform = "scaleX(" + self.progress + ")";
    }
  });
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });

  /* Menu mobile */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  function setMenu(open) {
    menuToggle.classList.toggle("open", open); mobileMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open)); mobileMenu.setAttribute("aria-hidden", String(!open));
    // inert tira os links da ordem de tabulação enquanto o menu está fora da tela
    mobileMenu.inert = !open;
  }
  function closeMenu() { setMenu(false); }
  menuToggle.addEventListener("click", function () {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  /* Âncoras suaves */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var sel = a.getAttribute("href");
      if (sel.length < 2) return;
      var target = document.querySelector(sel);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ============ Saída do hero (scrub) ============ */
  if (!prefersReduced) {
    gsap.to(".hero-content", {
      autoAlpha: 0, y: -90, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom 40%", scrub: true }
    });
    gsap.to(".scroll-indicator", {
      autoAlpha: 0, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "18% top", scrub: true }
    });
  }

  /* ============================================================
     TRANSIÇÃO GALÁXIA → NOTEBOOK (homografia + pin scrub)
     ============================================================ */
  var laptopImg = document.getElementById("laptop-img");
  var stageTint = document.querySelector(".stage-tint");
  var screenGlow = document.getElementById("screen-glow");
  var vignette = document.querySelector(".stage-vignette");
  var grain = document.querySelector(".stage-grain");
  var transText = document.querySelector(".transition-text");

  // cantos da tela do notebook, em frações da imagem (TL, TR, BL, BR)
  var SCREEN_QUAD = {
    tl: [0.128, 0.300],
    tr: [0.298, 0.086],
    bl: [0.208, 0.620],
    br: [0.436, 0.324]
  };
  var QUAD_INSET = 0.06;        // encolhe em direção ao centro (moldura/bezel)
  var OBJ_POS = [0.30, 0.45];   // deve casar com object-position do CSS

  /* --- homografia: 4 pontos -> matrix3d --- */
  function adj3(m) {
    return [
      m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
      m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
      m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]
    ];
  }
  function mulMM(a, b) {
    var r = [];
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
      r[3 * i + j] = a[3 * i] * b[j] + a[3 * i + 1] * b[3 + j] + a[3 * i + 2] * b[6 + j];
    }
    return r;
  }
  function mulMV(m, v) {
    return [
      m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
      m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
      m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
    ];
  }
  function basisToPoints(p1, p2, p3, p4) {
    var m = [p1[0], p2[0], p3[0], p1[1], p2[1], p3[1], 1, 1, 1];
    var v = mulMV(adj3(m), [p4[0], p4[1], 1]);
    return mulMM(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
  }
  // pts na ordem TL, TR, BL, BR
  function matrix3dFor(w, h, pts) {
    var s = basisToPoints([0, 0], [w, 0], [0, h], [w, h]);
    var d = basisToPoints(pts[0], pts[1], pts[2], pts[3]);
    var t = mulMM(d, adj3(s));
    for (var i = 0; i < 9; i++) t[i] /= t[8];
    return "matrix3d(" + [
      t[0], t[3], 0, t[6],
      t[1], t[4], 0, t[7],
      0, 0, 1, 0,
      t[2], t[5], 0, t[8]
    ].join(",") + ")";
  }

  function fitRect() {
    var nw = laptopImg.naturalWidth || 500, nh = laptopImg.naturalHeight || 333;
    var s = Math.max(innerWidth / nw, innerHeight / nh);
    s = Math.min(s, 1.18 * innerHeight / nh); // não corta o notebook em telas muito largas
    var w = nw * s, h = nh * s;
    return { x: (innerWidth - w) * OBJ_POS[0], y: (innerHeight - h) * OBJ_POS[1], w: w, h: h };
  }

  function layoutLaptop() {
    var r = fitRect();
    laptopImg.style.left = r.x + "px";
    laptopImg.style.top = r.y + "px";
    laptopImg.style.width = r.w + "px";
    laptopImg.style.height = r.h + "px";
    // o scale() do zoom precisa acontecer em torno do centro do viewport
    laptopImg.style.transformOrigin = (innerWidth / 2 - r.x) + "px " + (innerHeight / 2 - r.y) + "px";
  }
  layoutLaptop();
  window.addEventListener("resize", layoutLaptop);

  // quad da tela em px do viewport, considerando o scale atual do notebook
  function screenQuadPx(laptopScale) {
    var r = fitRect();
    var raw = [SCREEN_QUAD.tl, SCREEN_QUAD.tr, SCREEN_QUAD.bl, SCREEN_QUAD.br].map(function (p) {
      return [r.x + p[0] * r.w, r.y + p[1] * r.h];
    });
    var cx = 0, cy = 0;
    raw.forEach(function (p) { cx += p[0] / 4; cy += p[1] / 4; });
    return raw.map(function (p) {
      var x = p[0] + (cx - p[0]) * QUAD_INSET;
      var y = p[1] + (cy - p[1]) * QUAD_INSET;
      // scale do notebook em torno do centro do viewport
      x = innerWidth / 2 + (x - innerWidth / 2) * laptopScale;
      y = innerHeight / 2 + (y - innerHeight / 2) * laptopScale;
      return [x, y];
    });
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  var galaxyHidden = false;

  function applyTransition(p) {
    var e = easeInOut(p);

    // notebook: entra com zoom-out (1.34 -> 1) e fade
    var ls = 1.34 - 0.34 * clamp01(e * 1.18);
    laptopImg.style.transform = "scale(" + ls + ")";
    laptopImg.style.opacity = clamp01((p - 0.04) / 0.3);
    stageTint.style.opacity = clamp01((p - 0.1) / 0.5) * 0.9;
    vignette.style.opacity = clamp01((p - 0.15) / 0.5);
    grain.style.opacity = clamp01((p - 0.2) / 0.5) * 0.07;

    // galáxia: viewport inteiro -> tela do notebook
    var quad = screenQuadPx(ls);
    var corners = [[0, 0], [innerWidth, 0], [0, innerHeight], [innerWidth, innerHeight]];
    var dest = corners.map(function (c, i) {
      return [
        c[0] + (quad[i][0] - c[0]) * e,
        c[1] + (quad[i][1] - c[1]) * e
      ];
    });
    galaxyWrap.style.transform = matrix3dFor(innerWidth, innerHeight, dest);

    // brilho do núcleo refletindo no teclado/mesa
    var gcx = (quad[0][0] + quad[1][0] + quad[2][0] + quad[3][0]) / 4;
    var gcy = (quad[0][1] + quad[1][1] + quad[2][1] + quad[3][1]) / 4;
    screenGlow.style.background =
      "radial-gradient(ellipse " + (26 - 8 * e) + "% " + (30 - 10 * e) + "% at " +
      (gcx / innerWidth * 100).toFixed(2) + "% " + (gcy / innerHeight * 100 + 6).toFixed(2) + "%, " +
      "rgba(242,226,126,.55) 0%, rgba(183,148,246,.32) 40%, transparent 72%)";
    screenGlow.style.opacity = clamp01((p - 0.45) / 0.35) * 0.85;

    // texto final
    var tp = clamp01((p - 0.76) / 0.2);
    transText.style.opacity = tp;
    transText.style.visibility = tp > 0.01 ? "visible" : "hidden";
    transText.style.setProperty("--ty", ((1 - tp) * 44) + "px");
  }

  var starfield = document.getElementById("starfield");

  if (!prefersReduced) {
    var targetP = 0, dispP = 0;
    gsap.ticker.add(function () {
      if (Math.abs(targetP - dispP) < 0.0004) return;
      dispP += (targetP - dispP) * 0.14;
      applyTransition(dispP);
    });

    ScrollTrigger.create({
      trigger: "#transition",
      start: "top top",
      end: isMobile ? "+=170%" : "+=280%",
      pin: true,
      anticipatePin: 1,
      onUpdate: function (self) { targetP = self.progress; },
      onLeave: function () {
        galaxyHidden = true;
        gsap.to(galaxyWrap, {
          autoAlpha: 0, duration: 0.5,
          onComplete: function () { if (galaxyHidden) galaxyApi.setActive(false); }
        });
        gsap.to(starfield, { autoAlpha: 0.9, duration: 1 });
      },
      onEnterBack: function () {
        galaxyHidden = false;
        galaxyApi.setActive(true);
        gsap.to(galaxyWrap, { autoAlpha: 1, duration: 0.4 });
        gsap.to(starfield, { autoAlpha: 0, duration: 0.6 });
      },
      onRefresh: function (self) { targetP = self.progress; dispP = targetP; applyTransition(dispP); }
    });

    if (!laptopImg.complete) {
      laptopImg.addEventListener("load", function () { layoutLaptop(); applyTransition(dispP); });
    }
  } else {
    // fallback estático: notebook composto + texto visível
    galaxyWrap.style.position = "absolute";
    applyTransition(1);
    starfield.style.opacity = 0.9;
  }

  /* ============ Campo de estrelas 2D (pós-transição) ============ */
  (function starfield2D() {
    var ctx = starfield.getContext("2d");
    var stars = [];
    function size() {
      starfield.width = innerWidth; starfield.height = innerHeight;
      stars = [];
      var n = isMobile ? 70 : 150;
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * innerWidth, y: Math.random() * innerHeight,
          r: 0.4 + Math.random() * 1.3,
          tw: 0.5 + Math.random() * 2, ph: Math.random() * 6.28,
          hue: Math.random() < 0.25 ? "242,226,126" : (Math.random() < 0.5 ? "183,148,246" : "245,245,247")
        });
      }
    }
    size();
    window.addEventListener("resize", size);
    var drewOnce = false;
    (function draw(t) {
      requestAnimationFrame(draw);
      if (getComputedStyle(starfield).opacity === "0") { drewOnce = false; return; }
      if (prefersReduced && drewOnce) return;
      drewOnce = true;
      ctx.clearRect(0, 0, starfield.width, starfield.height);
      var s = (t || 0) / 1000;
      stars.forEach(function (st) {
        var a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(s * st.tw + st.ph));
        ctx.fillStyle = "rgba(" + st.hue + "," + a + ")";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
      });
    })(0);
  })();

  /* ============ Reveals genéricos ============ */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    if (el.closest("#hero")) return; // hero tratado na intro
    var chars = splitChars(el);
    if (prefersReduced) return;
    gsap.set(chars, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el, start: "top 86%", once: true,
      onEnter: function () {
        gsap.to(chars, { yPercent: 0, duration: 0.85, stagger: 0.02, ease: "power3.out" });
      }
    });
  });

  if (!prefersReduced) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      gsap.set(el, { autoAlpha: 0, y: 26 });
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () { gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }); }
      });
    });

    // cards de serviços: entram "vindos da órbita"
    ScrollTrigger.create({
      trigger: ".cards-grid", start: "top 82%", once: true,
      onEnter: function () {
        gsap.fromTo(".cards-grid .card",
          { autoAlpha: 0, y: 70, scale: 0.9 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1, stagger: 0.12, ease: "power3.out" });
      }
    });
  }

  /* ============ Tilt 3D nos cards ============ */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -9;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
        gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.45, ease: "power2.out", transformPerspective: 900 });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
      });
    });
  }

  /* ============ Processo: linha do tempo horizontal ============ */
  var track = document.querySelector(".timeline-track");
  var fill = document.querySelector(".timeline-fill");
  var comet = document.querySelector(".comet");

  if (!prefersReduced) {
    var getDist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
    gsap.to(track, {
      x: function () { return -getDist(); },
      ease: "none",
      scrollTrigger: {
        trigger: "#processo",
        start: "top top",
        end: function () { return "+=" + (getDist() + innerHeight * 0.3); },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          fill.style.transform = "scaleX(" + self.progress + ")";
          comet.style.left = (self.progress * 100) + "%";
        }
      }
    });
  } else {
    document.querySelector(".timeline-viewport").style.overflowX = "auto";
    fill.style.transform = "scaleX(1)";
    comet.style.left = "100%";
  }

  /* ============ Portfólio: reveal + parallax ============ */
  if (!prefersReduced) {
    document.querySelectorAll(".p-card").forEach(function (card) {
      gsap.fromTo(card,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power3.inOut",
          scrollTrigger: { trigger: card, start: "top 90%", once: true }
        });
      var speed = parseFloat(card.getAttribute("data-speed") || "0");
      gsap.fromTo(card, { y: speed * 260 }, {
        y: -speed * 260, ease: "none",
        scrollTrigger: { trigger: "#portfolio", start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ============ Números: contadores + partículas douradas ============ */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    var suf = el.getAttribute("data-suffix") || "";
    if (prefersReduced) { el.textContent = end + suf; return; }
    ScrollTrigger.create({
      trigger: el, start: "top 86%", once: true,
      onEnter: function () {
        var obj = { v: 0 };
        gsap.to(obj, {
          v: end, duration: 2.2, ease: "power2.out",
          onUpdate: function () { el.textContent = Math.round(obj.v) + suf; }
        });
      }
    });
  });

  (function goldParticles() {
    if (prefersReduced) return;
    var canvas = document.getElementById("gold-particles");
    var ctx = canvas.getContext("2d");
    var running = false, parts = [];
    function size() {
      var sec = document.getElementById("numeros");
      canvas.width = sec.offsetWidth; canvas.height = sec.offsetHeight;
    }
    function spawn() {
      return {
        x: Math.random() * canvas.width, y: canvas.height + 8,
        vy: 18 + Math.random() * 42, drift: Math.random() * 6.28,
        r: 0.7 + Math.random() * 1.8, a: 0.25 + Math.random() * 0.6
      };
    }
    function loop() {
      if (!running) return;
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      parts.forEach(function (p, i) {
        p.y -= p.vy / 60;
        p.x += Math.sin(p.y / 40 + p.drift) * 0.4;
        var fade = Math.min(1, p.y / (canvas.height * 0.5));
        ctx.fillStyle = "rgba(242,226,126," + (p.a * fade) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        if (p.y < -10) parts[i] = spawn();
      });
    }
    ScrollTrigger.create({
      trigger: "#numeros", start: "top bottom", end: "bottom top",
      onToggle: function (self) {
        running = self.isActive;
        if (running) {
          size();
          if (!parts.length) for (var i = 0; i < (isMobile ? 28 : 60); i++) {
            var p = spawn(); p.y = Math.random() * canvas.height; parts.push(p);
          }
          loop();
        }
      }
    });
    window.addEventListener("resize", function () { if (running) size(); });
  })();

  /* ============ Depoimentos: carrossel fade ============ */
  (function carousel() {
    var root = document.getElementById("carousel");
    if (!root) return;
    var slides = root.querySelectorAll(".slide");
    var dots = root.querySelectorAll(".dot");
    var idx = 0, timer = null;
    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === idx); });
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === idx); });
    }
    function play() { stop(); timer = setInterval(function () { goTo(idx + 1); }, 5600); }
    function stop() { if (timer) clearInterval(timer); }
    dots.forEach(function (d, k) { d.addEventListener("click", function () { goTo(k); play(); }); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    if (!prefersReduced) play();
  })();

  /* ============ Botão magnético + formulário ============ */
  var magBtn = document.getElementById("magnetic-btn");
  if (magBtn && !isTouch && !prefersReduced) {
    var magSpan = magBtn.querySelector("span");
    magBtn.addEventListener("mousemove", function (e) {
      var r = magBtn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      gsap.to(magBtn, { x: dx * 0.32, y: dy * 0.32, duration: 0.4, ease: "power2.out" });
      gsap.to(magSpan, { x: dx * 0.14, y: dy * 0.14, duration: 0.4, ease: "power2.out" });
    });
    magBtn.addEventListener("mouseleave", function () {
      gsap.to([magBtn, magSpan], { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fb = form.querySelector(".form-feedback");
      var nome = form.nome.value.trim(), email = form.email.value.trim(), msg = form.mensagem.value.trim();
      if (!nome || !email || !msg || email.indexOf("@") < 1) {
        fb.textContent = "Preencha todos os campos para iniciarmos a contagem regressiva. 🛰️";
        return;
      }
      fb.textContent = "🚀 Mensagem lançada, " + nome.split(" ")[0] + "! Retornaremos em até 24h no seu e-mail.";
      form.reset();
      if (!prefersReduced && magBtn) {
        gsap.fromTo(magBtn, { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut" });
      }
    });
  }

  /* ============ Footer: constelação ============ */
  (function constellation() {
    var canvas = document.getElementById("constellation");
    var footer = document.getElementById("footer");
    var ctx = canvas.getContext("2d");
    var pts = [], running = false;
    function size() {
      canvas.width = footer.offsetWidth; canvas.height = footer.offsetHeight;
      pts = [];
      var n = isMobile ? 30 : 60;
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          gold: Math.random() < 0.3
        });
      }
    }
    function loop() {
      if (!running) return;
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (!prefersReduced) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
        ctx.fillStyle = p.gold ? "rgba(242,226,126,.8)" : "rgba(183,148,246,.7)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.strokeStyle = "rgba(183,148,246," + (0.14 * (1 - d / 130)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        running = en.isIntersecting;
        if (running) { size(); loop(); }
      });
    });
    io.observe(footer);
    window.addEventListener("resize", function () { if (running) size(); });
  })();

  /* ============ Cursor customizado + trilha estelar ============ */
  (function cursor() {
    if (isTouch || prefersReduced) return;
    var dot = document.getElementById("cursor-dot");
    var canvas = document.getElementById("cursor-canvas");
    var ctx = canvas.getContext("2d");
    var parts = [];
    function size() { canvas.width = innerWidth; canvas.height = innerHeight; }
    size();
    window.addEventListener("resize", size);

    var xTo = gsap.quickTo(dot, "x", { duration: 0.16, ease: "power2.out" });
    var yTo = gsap.quickTo(dot, "y", { duration: 0.16, ease: "power2.out" });

    window.addEventListener("mousemove", function (e) {
      xTo(e.clientX); yTo(e.clientY);
      if (parts.length < 90) {
        parts.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7 + 0.3,
          life: 1, gold: Math.random() < 0.5, r: 0.8 + Math.random() * 1.4
        });
      }
    }, { passive: true });

    document.addEventListener("mouseover", function (e) {
      var hit = e.target.closest && e.target.closest("a, button, input, textarea, .card, .p-card, .dot");
      dot.classList.toggle("grow", !!hit);
    });

    (function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life -= 0.03; p.x += p.vx; p.y += p.vy;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.fillStyle = p.gold
          ? "rgba(242,226,126," + (p.life * 0.75) + ")"
          : "rgba(183,148,246," + (p.life * 0.75) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, 7); ctx.fill();
      }
    })();
  })();

  /* ============ Som ambiente (WebAudio, opcional) ============ */
  (function ambientAudio() {
    var btn = document.getElementById("audio-toggle");
    var ctx = null, master = null, on = false;
    function build() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // ruído "espacial" filtrado
      var len = ctx.sampleRate * 4;
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      var last = 0;
      for (var i = 0; i < len; i++) {
        var white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      var noise = ctx.createBufferSource();
      noise.buffer = buf; noise.loop = true;
      var lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 190; lp.Q.value = 0.6;
      var ng = ctx.createGain(); ng.gain.value = 0.5;
      noise.connect(lp); lp.connect(ng); ng.connect(master);
      noise.start();

      // drone grave
      var osc = ctx.createOscillator();
      osc.type = "sine"; osc.frequency.value = 55;
      var og = ctx.createGain(); og.gain.value = 0.10;
      osc.connect(og); og.connect(master);
      osc.start();

      // respiração lenta do filtro
      var lfo = ctx.createOscillator();
      lfo.type = "sine"; lfo.frequency.value = 0.06;
      var lg = ctx.createGain(); lg.gain.value = 70;
      lfo.connect(lg); lg.connect(lp.frequency);
      lfo.start();
    }
    btn.addEventListener("click", function () {
      if (!ctx) build();
      if (ctx.state === "suspended") ctx.resume();
      on = !on;
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-label", on ? "Desativar som ambiente" : "Ativar som ambiente");
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(on ? 0.055 : 0, ctx.currentTime + 1.2);
    });
  })();

  /* ============ Ajustes finais ============ */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();

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

  /* ============ Galáxia WebGL ============
     three.js carrega async. A construção das partículas é um trabalho pesado
     na thread principal (~200-300 ms), então só acontece depois do load e
     num momento ocioso, para nunca competir com o primeiro paint do hero.
     O canvas entra com fade (CSS .is-ready) em vez de "pipocar". */
  var galaxyWrap = document.getElementById("galaxy-wrap");
  var galaxyApi = null;
  function initGalaxy() {
    if (!window.THREE || !window.AuriusGalaxy) { setTimeout(initGalaxy, 120); return; }
    galaxyApi = AuriusGalaxy.init({
      canvas: document.getElementById("galaxy-canvas"),
      count: isMobile ? 9000 : 42000,
      reducedMotion: prefersReduced,
      maxPixelRatio: isMobile ? 1 : 1.5
    });
    // se o usuário já passou do hero antes da galáxia existir, nasce pausada
    if (galaxyHidden) galaxyApi.setActive(false);
    requestAnimationFrame(function () { galaxyWrap.classList.add("is-ready"); });
  }
  function scheduleGalaxy() {
    // espera a entrada do hero (~0,75 s) terminar antes do trabalho pesado
    setTimeout(function () {
      if ("requestIdleCallback" in window) requestIdleCallback(initGalaxy, { timeout: 800 });
      else initGalaxy();
    }, 450);
  }
  if (document.readyState === "complete") scheduleGalaxy();
  else window.addEventListener("load", scheduleGalaxy);

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

  /* ============ Intro do hero ============
     A entrada do hero é feita em CSS (keyframes .hero-content > *), então o
     conteúdo aparece e fica clicável já no primeiro paint, sem depender do
     carregamento de GSAP/three.js pela CDN nem de um preloader. */

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
    // fromTo: no momento da criação o indicador ainda está no fade-in do CSS (opacity 0)
    gsap.fromTo(".scroll-indicator", { autoAlpha: 1 }, {
      autoAlpha: 0, ease: "none", immediateRender: false,
      scrollTrigger: { trigger: "#hero", start: "top top", end: "18% top", scrub: true }
    });
  }

  /* ============ Galáxia → campo de estrelas ao sair do hero ============ */
  var galaxyHidden = false;
  var starfieldVisible = false;
  var starfield = document.getElementById("starfield");

  if (!prefersReduced) {
    gsap.to(galaxyWrap, {
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "40% top", end: "bottom top", scrub: true }
    });
    ScrollTrigger.create({
      trigger: "#hero", start: "bottom top",
      onEnter: function () {
        galaxyHidden = true;
        starfieldVisible = true;
        if (galaxyApi) galaxyApi.setActive(false);
        gsap.to(starfield, { autoAlpha: 0.9, duration: 0.8 });
      },
      onLeaveBack: function () {
        galaxyHidden = false;
        starfieldVisible = false;
        if (galaxyApi) galaxyApi.setActive(true);
        gsap.to(starfield, { autoAlpha: 0, duration: 0.5 });
      }
    });
  } else {
    // sem animação: a galáxia rola junto com o hero e o campo de estrelas fica estático
    galaxyWrap.style.position = "absolute";
    starfield.style.opacity = 0.9;
    starfieldVisible = true;
  }

  /* ============ Campo de estrelas 2D (pós-hero) ============ */
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
      if (!starfieldVisible) { drewOnce = false; return; }
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

    // cards de serviços: entrada escalonada discreta
    ScrollTrigger.create({
      trigger: ".cards-grid", start: "top 82%", once: true,
      onEnter: function () {
        gsap.fromTo(".cards-grid .card",
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
      }
    });
  }

  /* ============ Tilt 3D nos cards ============ */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
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
  var node = document.querySelector(".timeline-node");

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
          node.style.left = (self.progress * 100) + "%";
        }
      }
    });
  } else {
    document.querySelector(".timeline-viewport").style.overflowX = "auto";
    fill.style.transform = "scaleX(1)";
    node.style.left = "100%";
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
      gsap.to(magBtn, { x: dx * 0.16, y: dy * 0.16, duration: 0.4, ease: "power2.out" });
      gsap.to(magSpan, { x: dx * 0.06, y: dy * 0.06, duration: 0.4, ease: "power2.out" });
    });
    magBtn.addEventListener("mouseleave", function () {
      gsap.to([magBtn, magSpan], { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fb = form.querySelector(".form-feedback");
      var nome = form.nome.value.trim(), email = form.email.value.trim(), msg = form.mensagem.value.trim();
      if (!nome || !email || !msg || email.indexOf("@") < 1) {
        fb.textContent = "Preencha nome, e-mail válido e uma breve descrição do projeto.";
        return;
      }
      fb.textContent = "Obrigado, " + nome.split(" ")[0] + "! Recebemos sua mensagem e retornaremos em até 24 horas úteis.";
      form.reset();
      if (!prefersReduced && magBtn) {
        gsap.fromTo(magBtn, { scale: 1 }, { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut" });
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

  /* ============ Ajustes finais ============ */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();

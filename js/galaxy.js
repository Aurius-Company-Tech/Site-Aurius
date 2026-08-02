/* ============================================================
   AURIUS — Galáxia espiral em Three.js
   Núcleo dourado → braços violeta (paleta da logo)
   Exposto como window.AuriusGalaxy.init(options)
   ============================================================ */
(function () {
  "use strict";

  function makeSprite(size) {
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,.85)");
    g.addColorStop(0.55, "rgba(255,255,255,.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    var tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function init(opts) {
    opts = opts || {};
    var canvas = opts.canvas;
    var count = opts.count || 70000;
    var reduced = !!opts.reducedMotion;

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxPixelRatio || 1.6));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);
    camera.position.set(0, 3.4, 9.6);

    var sprite = makeSprite(64);

    /* ---------- Galáxia espiral ---------- */
    var galaxy = new THREE.Group();
    scene.add(galaxy);

    var params = {
      radius: 11,
      branches: 3,
      spin: 1.35,
      randomness: 0.42,
      randomnessPower: 2.7
    };

    var colorCore = new THREE.Color("#F8ECA6");   // dourado claro (núcleo)
    var colorGold = new THREE.Color("#D9C25A");   // dourado metálico
    var colorLilac = new THREE.Color("#B794F6");  // lilás
    var colorViolet = new THREE.Color("#7C3AED"); // violeta
    var colorDeep = new THREE.Color("#5B21B6");   // roxo profundo

    function buildArms(n) {
      var pos = new Float32Array(n * 3);
      var col = new Float32Array(n * 3);
      var c = new THREE.Color();
      for (var i = 0; i < n; i++) {
        var i3 = i * 3;
        var r = Math.pow(Math.random(), 0.62) * params.radius;
        var branch = ((i % params.branches) / params.branches) * Math.PI * 2;
        var spin = r * params.spin;

        var rndX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * r * 0.55;
        var rndY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * r * 0.14;
        var rndZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * r * 0.55;

        pos[i3] = Math.cos(branch + spin) * r + rndX;
        pos[i3 + 1] = rndY;
        pos[i3 + 2] = Math.sin(branch + spin) * r + rndZ;

        var t = r / params.radius;
        if (t < 0.22) c.copy(colorCore).lerp(colorGold, t / 0.22);
        else if (t < 0.55) c.copy(colorGold).lerp(colorLilac, (t - 0.22) / 0.33);
        else c.copy(Math.random() < 0.5 ? colorViolet : colorLilac).lerp(colorDeep, (t - 0.55) / 0.45);

        col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      return geo;
    }

    function buildBulge(n) {
      var pos = new Float32Array(n * 3);
      var col = new Float32Array(n * 3);
      var c = new THREE.Color();
      for (var i = 0; i < n; i++) {
        var i3 = i * 3;
        // distribuição gaussiana aproximada (soma de aleatórios)
        var gx = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        var gy = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        var gz = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        pos[i3] = gx * 1.7;
        pos[i3 + 1] = gy * 0.55;
        pos[i3 + 2] = gz * 1.7;
        var d = Math.sqrt(gx * gx + gy * gy + gz * gz);
        c.copy(colorCore).lerp(colorGold, Math.min(1, d));
        col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      return geo;
    }

    var matArms = new THREE.PointsMaterial({
      size: 0.055, sizeAttenuation: true, map: sprite,
      vertexColors: true, transparent: true, opacity: 0.9,
      depthWrite: false, blending: THREE.AdditiveBlending
    });
    var matBulge = matArms.clone();
    matBulge.size = 0.075;

    galaxy.add(new THREE.Points(buildArms(Math.floor(count * 0.85)), matArms));
    galaxy.add(new THREE.Points(buildBulge(Math.floor(count * 0.15)), matBulge));

    // inclinação diagonal, como a Andrômeda da referência
    galaxy.rotation.x = -0.62;
    galaxy.rotation.z = 0.38;

    /* ---------- Campo de estrelas (3 camadas, parallax + twinkle) ---------- */
    var starLayers = [];
    var layerDefs = [
      { count: Math.floor(count * 0.02) + 500, rMin: 22, rMax: 38, size: 0.10, speed: 1.6 },
      { count: Math.floor(count * 0.013) + 320, rMin: 34, rMax: 52, size: 0.16, speed: 1.1 },
      { count: Math.floor(count * 0.006) + 160, rMin: 48, rMax: 70, size: 0.26, speed: 0.7 }
    ];
    var starTints = [new THREE.Color("#FFFFFF"), new THREE.Color("#F2E27E"), new THREE.Color("#B794F6"), new THREE.Color("#9db4ff")];

    layerDefs.forEach(function (def, li) {
      var pos = new Float32Array(def.count * 3);
      var col = new Float32Array(def.count * 3);
      for (var i = 0; i < def.count; i++) {
        var i3 = i * 3;
        var r = def.rMin + Math.random() * (def.rMax - def.rMin);
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = r * Math.cos(phi);
        pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        var tint = starTints[Math.floor(Math.random() * starTints.length)];
        var v = 0.55 + Math.random() * 0.45;
        col[i3] = tint.r * v; col[i3 + 1] = tint.g * v; col[i3 + 2] = tint.b * v;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      var mat = new THREE.PointsMaterial({
        size: def.size, sizeAttenuation: true, map: sprite,
        vertexColors: true, transparent: true, opacity: 0.85,
        depthWrite: false, blending: THREE.AdditiveBlending
      });
      var pts = new THREE.Points(geo, mat);
      pts.userData = { speed: def.speed, phase: li * 2.1, depth: li };
      scene.add(pts);
      starLayers.push(pts);
    });

    /* ---------- Estrelas cadentes ---------- */
    var shooters = [];
    var shooterMat = new THREE.SpriteMaterial({
      map: sprite, color: 0xfff6cf, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    for (var s = 0; s < 3; s++) {
      var sp = new THREE.Sprite(shooterMat.clone());
      sp.scale.set(0.5, 0.5, 0.5);
      sp.userData = { active: false, vel: new THREE.Vector3(), life: 0, next: 2 + Math.random() * 6 };
      scene.add(sp);
      shooters.push(sp);
    }

    function fireShooter(sp) {
      sp.userData.active = true;
      sp.userData.life = 0;
      sp.position.set(-14 + Math.random() * 8, 6 + Math.random() * 4, -6 + Math.random() * 4);
      sp.userData.vel.set(9 + Math.random() * 6, -(3 + Math.random() * 3), 0);
      sp.material.opacity = 0;
    }

    /* ---------- Parallax do mouse ---------- */
    var mouse = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
    if (!reduced) {
      window.addEventListener("mousemove", function (e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }

    /* ---------- Loop ---------- */
    var clock = new THREE.Clock();
    var active = true;
    var baseTiltX = galaxy.rotation.x, baseTiltZ = galaxy.rotation.z;

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    function tick() {
      requestAnimationFrame(tick);
      if (!active) return;
      var dt = Math.min(clock.getDelta(), 0.05);
      var t = clock.elapsedTime;

      if (!reduced) {
        galaxy.rotation.y += dt * 0.05;

        // parallax 3D suave (~5°)
        eased.x += (mouse.x - eased.x) * 0.035;
        eased.y += (mouse.y - eased.y) * 0.035;
        galaxy.rotation.x = baseTiltX + eased.y * 0.09;
        galaxy.rotation.z = baseTiltZ + eased.x * 0.06;
        camera.position.x = eased.x * 0.7;
        camera.position.y = 3.4 - eased.y * 0.5;
        camera.lookAt(0, 0, 0);

        // twinkle por camada
        starLayers.forEach(function (pts) {
          pts.material.opacity = 0.62 + Math.sin(t * pts.userData.speed + pts.userData.phase) * 0.28;
          pts.rotation.y += dt * 0.004 * (pts.userData.depth + 1);
        });

        // estrelas cadentes ocasionais
        shooters.forEach(function (sp) {
          var u = sp.userData;
          if (!u.active) {
            u.next -= dt;
            if (u.next <= 0) fireShooter(sp);
          } else {
            u.life += dt;
            sp.position.addScaledVector(u.vel, dt);
            sp.material.opacity = u.life < 0.3 ? u.life / 0.3 : Math.max(0, 1 - (u.life - 0.3) / 1.1);
            if (u.life > 1.5) { u.active = false; u.next = 4 + Math.random() * 8; sp.material.opacity = 0; }
          }
        });
      }

      renderer.render(scene, camera);
    }
    tick();

    var api = {
      renderer: renderer,
      setActive: function (v) { active = v; if (v) clock.getDelta(); },
      renderOnce: function () { renderer.render(scene, camera); },
      resize: resize
    };
    window.AuriusGalaxyInstance = api;
    return api;
  }

  window.AuriusGalaxy = { init: init };
})();

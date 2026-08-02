const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.browser,
        // Bibliotecas carregadas via CDN no index.html
        THREE: "readonly",
        gsap: "readonly",
        ScrollTrigger: "readonly",
        Lenis: "readonly",
        // Exposto por js/galaxy.js
        AuriusGalaxy: "readonly"
      }
    },
    rules: {
      // Foco em erros reais, não em estilo.
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
];

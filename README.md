# Tests E2E du site [saucedemo.com](https://www.saucedemo.com)

Suite de 244 tests end-to-end écrite avec [Playwright](https://playwright.dev/) (TypeScript) sur le site de démonstration e-commerce SauceDemo, qui expose volontairement plusieurs comptes utilisateurs bugués (`problem_user`, `error_user`, `performance_glitch_user`, `visual_user`, `locked_out_user`) en plus d'un compte nominal (`standard_user`) servant de référence au comportement attendu du site.

L'objectif du dépôt est de couvrir l'intégralité du parcours utilisateur (login, catalogue, détail produit, panier, checkout en 3 étapes) pour chacun de ces comptes, et de documenter précisément les comportements défaillants observés.

## Documentation

- [Plan de tests](plan_de_tests.md) : périmètre, priorisation, données de test et scénarios attendus par écran
- [Cahier de tests](cahier_de_tests.md) : résultats de la dernière exécution, détail des échecs et corrélation avec les bugs connus

## Structure du projet

```
tests/       # Spécifications Playwright (une par écran/fonctionnalité)
pages/       # Page Object Model (un objet par écran)
fixtures/    # Jeux de données de test et helpers de setup (comptes, produits, panier...)
utils/       # Fonctions utilitaires (parsing, sélection aléatoire...)
```

## Intégration continue

Les tests sont exécutés automatiquement via [GitHub Actions](.github/workflows/playwright.yml) à chaque `push` et chaque pull request sur `master` : installation des dépendances, installation des navigateurs Playwright, puis exécution complète de la suite (`npx playwright test`). Le rapport HTML est conservé 30 jours en artifact du workflow, consultable depuis l'onglet **Actions** du dépôt GitHub.

## Lancer les tests

```bash
npm install
npx playwright install
npm run test
```

---

*Réalisé par Abel Laroussi*

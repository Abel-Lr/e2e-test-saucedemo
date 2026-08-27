# Cahier de tests E2E du site https://www.saucedemo.com

Ce document consigne les résultats d'exécution de la suite de tests Playwright décrite
dans [plan_de_tests.md](plan_de_tests.md).
Source des résultats : rapport HTML Playwright (`playwright-report/index.html`), exécution du 27/08/2026 à 01:49:16 (
durée totale : 2.0 min, projet `chromium`).

## Sommaire

- [Résumé global](#résumé-global)
- [Résultats par fichier de test](#résultats-par-fichier-de-test)
- [Détail des échecs (corrélés aux bugs connus du plan de test)](#détail-des-échecs-corrélés-aux-bugs-connus-du-plan-de-test)
    - [Login (1 échec)](#login-1-échec)
    - [Inventory (19 échecs)](#inventory-19-échecs)
    - [ItemDetails (14 échecs)](#itemdetails-14-échecs)
    - [CheckoutClientInfo (5 échecs)](#checkoutclientinfo-5-échecs)
    - [CheckoutOverview (3 échecs)](#checkoutoverview-3-échecs)
    - [Basket (2 échecs)](#basket-2-échecs)
    - [Transverse (3 échecs)](#transverse-3-échecs)
    - [CheckoutComplete (0 échec)](#checkoutcomplete-0-échec)
- [Conclusion](#conclusion)

## Résumé global

| Total |   Réussis    |   Échecs    | Instables (flaky) | Ignorés |
|:-----:|:------------:|:-----------:|:-----------------:|:-------:|
|  244  | 197 (80,7 %) | 47 (19,3 %) |         0         |    0    |

**À retenir : la quasi-totalité des 47 échecs ne sont pas des régressions de la suite de tests, mais la matérialisation
attendue des bugs déjà recensés dans le plan de test** pour les comptes `problem_user`, `error_user`,
`performance_glitch_user`, `visual_user` et `locked_out_user`. Le taux de réussite de 81,6 % reflète donc surtout le
volume de scénarios dédiés à documenter ces comportements défaillants du site, plus qu'un défaut de fiabilité des tests
eux-mêmes.

---

## Résultats par fichier de test

| Fichier                                                          |  Total  | Réussis | Échecs | Taux de réussite |
|:-----------------------------------------------------------------|:-------:|:-------:|:------:|:----------------:|
| [login.spec.ts](tests/login.spec.ts)                             |    6    |    5    |   1    |      83,3 %      |
| [inventory.spec.ts](tests/inventory.spec.ts)                     |   70    |   51    |   19   |      72,9 %      |
| [itemDetails.spec.ts](tests/itemDetails.spec.ts)                 |   85    |   71    |   14   |      83,5 %      |
| [basket.spec.ts](tests/basket.spec.ts)                           |    8    |    6    |   2    |      75,0 %      |
| [checkout.clientInfo.spec.ts](tests/checkout.clientInfo.spec.ts) |   16    |   11    |   5    |      68,8 %      |
| [checkout.overview.spec.ts](tests/checkout.overview.spec.ts)     |   14    |   11    |   3    |      78,6 %      |
| [checkout.complete.spec.ts](tests/checkout.complete.spec.ts)     |    9    |    9    |   0    |      100 %       |
| [transverse.spec.ts](tests/transverse.spec.ts)                   |   36    |   33    |   3    |      91,6 %      |
| **Total**                                                        | **244** | **197** | **47** |    **80,7 %**    |

## Détail des échecs (corrélés aux bugs connus du plan de test)

### Login (1 échec)

- `locked_out_user` : le cookie `session-username` est tout de même créé malgré le blocage du compte. Il s'agit d'un BUG
  connu, documenté et annoté dans le test (`login.spec.ts:24`).

### Inventory (19 échecs)

| Cause                                                              | Compte(s)                     | Nb. tests |
|:-------------------------------------------------------------------|:------------------------------|:---------:|
| Données de la liste incohérentes avec les données de test          | `problem_user`, `visual_user` |     2     |
| Tri Name/Price non appliqué (select figé)                          | `problem_user`                |     3     |
| Tri Name/Price déclenche une alerte "Sorting is broken"            | `error_user`                  |     3     |
| Temps de chargement page / temps de tri > 1s                       | `performance_glitch_user`     |     5     |
| Ajout puis retrait progressif : au moins un item ne répond pas     | `problem_user`, `error_user`  |     2     |
| Clic titre/illustration redirige vers un ID incorrect              | `problem_user`                |     2     |
| Timeout (30 000 ms) sur le parcours des 6 clics titre/illustration | `performance_glitch_user`     |     2     |

### ItemDetails (14 échecs)

| Cause                                                                                    | Compte(s)                                                                               | Nb. tests |
|:-----------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------|:---------:|
| Description absente de la page (item connu, 6 IDs)                                       | `error_user`                                                                            |     6     |
| Retrait d'un item du panier sans effet                                                   | `problem_user`, `error_user`                                                            |     2     |
| Ajout d'un ID inconnu qui modifie tout de même le panier (`null` ajouté au lieu de rien) | `standard_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` |     5     |
| Description absente pour l'ID inconnu (timeout)                                          | `error_user`                                                                            |     1     |

Le bug "ajout d'un ID inconnu modifie le panier" est **transverse à tous les comptes** (déjà noté au plan de test,
section *ItemDetail > Accès à un ID inconnu*).

### CheckoutClientInfo (5 échecs)

| Cause                                                                           | Compte(s)                    | Nb. tests |
|:--------------------------------------------------------------------------------|:-----------------------------|:---------:|
| Formulaire opérationnel : Last Name reste vide (saisie corrompue / silencieuse) | `problem_user`, `error_user` |     2     |
| Code postal : espaces, caractères spéciaux et lettres acceptés sans rejet       | `standard_user`              |     3     |

Le défaut de validation du code postal touche en réalité **tous les comptes** (bug transverse déjà documenté).

### CheckoutOverview (3 échecs)

| Cause                                                                                            | Compte(s)       | Nb. tests |
|:-------------------------------------------------------------------------------------------------|:----------------|:---------:|
| Sous-total affiché se rapproche du double du montant réel                                        | `problem_user`  |     1     |
| Clic sur "Finish" ne redirige pas vers CheckoutComplete (erreur silencieuse)                     | `error_user`    |     1     |
| Item dupliqué en LocalStorage affiché en 2 cartes distinctes plutôt qu'une carte avec quantité 2 | `standard_user` |     1     |

### Basket (2 échecs)

- `standard_user` : le bouton "Checkout" reste actif avec un panier vide et redirige quand même, il s'agit d'un BUG
  identifié pendant l'élaboration du plan de test.
- `standard_user` : le badge du panier reste visible/affiché malgré un ID inconnu sans item correspondant, il s'agit d'
  un BUG identifié pendant l'élaboration du plan de test.

### Transverse (3 échecs)

- `visual_user` : le bouton "Checkout" de l'écran Basket n'est pas correctement positionné. Il s'agit d'un BUG identifié
  pendant l'élaboration du plan de test.
- `visual_user` : l'icône du panier n'est pas correctement positionné. Il s'agit d'un BUG identifié pendant
  l'élaboration du plan de test.
- `visual_user` : le bouton du BurgerMenu n'est pas correctement positionné. Il s'agit d'un BUG identifié pendant
  l'élaboration du plan de test.

### CheckoutComplete (0 échec)

Tous les scénarios passent (9/9) : confirmation de commande, génération du PDF et navigation post-achat sont stables sur
les comptes couverts (`standard`, `performance_glitch`, `visual`).

## Conclusion

Sur les 244 tests exécutés, les 47 échecs recensés correspondent à des comportements défectueux du site déjà anticipés
et documentés dans le [plan de test](plan_de_tests.md) pour les comptes de démonstration bugués (`problem_user`,
`error_user`, `performance_glitch_user`, `visual_user`, `locked_out_user`).

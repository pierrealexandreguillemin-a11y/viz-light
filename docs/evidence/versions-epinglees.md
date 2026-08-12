---
authority: ledger
subject: versions
last_verified: 2026-08-12
expires: 2026-11-12
---

# Versions épinglées — mesurées au registre npm, jamais de mémoire

> Toutes les valeurs ci-dessous sortent de `npm view <pkg> version` /
> `npm view <pkg> peerDependencies` exécuté le **2026-08-12**. Aucune n'est un
> souvenir de modèle. Re-mesurer avant de repousser `expires`.

## 1. Environnement local (mesuré)

| Outil | Version |
|---|---|
| Node | v24.5.0 |
| pnpm | 10.30.2 |
| npm | 11.5.1 |

Gestionnaire de paquets retenu : **pnpm**, comme ma-nfl.

## 2. Le seul conflit réel : TypeScript

`npm view typescript dist-tags` → **latest = 7.0.2**. Mais :

```
typescript-eslint@8.67.0            peer typescript >=4.8.4 <6.1.0
typescript-eslint@8.67.1-alpha.2    peer typescript >=4.8.4 <6.1.0   (canary)
@typescript-eslint/parser@latest    peer typescript >=4.8.4 <6.1.0
```

Aucune version publiée de `typescript-eslint`, canary comprise, n'accepte
TypeScript 7. Épingler TS 7 revient à **perdre le lint type-aware**, exigé par
`SPEC.md §5`. → **TypeScript 6.0.3** (dernier 6.x publié :
`6.0.2`, `6.0.3`). Décision et sortie de reconquête :
[ADR 0007](../decisions/0007-typescript-6-plafonne-par-le-lint-type-aware.md).

## 3. Compatibilités vérifiées (peerDependencies lues, pas supposées)

| Paquet | Contrainte déclarée | Verdict |
|---|---|---|
| `eslint-config-next@16.3.0` | `eslint >=9.0.0`, `typescript >=3.3.1` | ⛔ **déclaration fausse en pratique**, cf. §3bis |
| `typescript-eslint@8.67.0` | `eslint ^8.57 \|\| ^9 \|\| ^10` | ✅ |
| `eslint-plugin-sonarjs@4.2.0` | `eslint ^8 \|\| ^9 \|\| ^10` | ✅ |
| `eslint-config-prettier@10.1.8` | `eslint >=7.0.0` | ✅ |
| `@vitest/coverage-v8@4.1.10` | `vitest 4.1.10` (exact) | ✅ verrouillé à l'identique |
| `next@16.3.0` | `react ^19.0.0`, `react-dom ^19.0.0` | ✅ |

## 3bis. ESLint 9.39.5, et pourquoi pas 10 — la déclaration mentait

Premier épinglage : ESLint **10.8.1**, au motif que tous les plugins du socle
déclaraient `^10`. **C'était faux, et c'est l'exécution qui l'a montré**, pas la
lecture des `peerDependencies`.

`eslint-config-next@16.3.0` dépend transitivement de
`eslint-plugin-react@7.37.5`, dont le peer réel est
`eslint: ^3 || … || ^9.7`. `pnpm install` l'a signalé ; `pnpm lint` a planté :

```
ESLint: 10.8.1
TypeError: Error while loading rule 'react/display-name':
  contextOrFilename.getFilename is not a function
    at resolveBasedir (eslint-plugin-react/lib/util/version.js:31:100)
```

→ **`eslint` épinglé à 9.39.5** (dernière 9.x publiée). `pnpm lint` sort alors
en 0.

**Leçon retenue, applicable à tout ce document** : un `peerDependencies` de
surface ne prouve rien — il ne voit pas l'arbre transitif. Un épinglage n'est
vérifié que quand la commande qu'il sert a réellement tourné. C'est le même
principe que « un seuil documenté que rien n'exécute n'est pas un gate ».

## 4. Table d'épinglage (exact, sans `^`)

### Production

| Paquet | Version |
|---|---|
| `next` | 16.3.0 |
| `react` | 19.2.8 |
| `react-dom` | 19.2.8 |

### Développement

| Paquet | Version | Rôle dans le socle |
|---|---|---|
| `typescript` | **6.0.3** | plafonné, cf. §2 |
| `@types/node` | 24.13.3 | **aligné sur le runtime local (Node 24)**, pas sur le latest 26.2.0 — sinon on type-vérifie des API absentes à l'exécution |
| `@types/react` | 19.2.18 | |
| `@types/react-dom` | 19.2.4 | |
| `tailwindcss` | 4.3.3 | OKLCH |
| `@tailwindcss/postcss` | 4.3.3 | |
| `eslint` | **9.39.5** | plafonné en pratique, cf. §3bis |
| `eslint-config-next` | 16.3.0 | aligné sur `next` |
| `typescript-eslint` | 8.67.0 | règles type-aware |
| `eslint-plugin-sonarjs` | 4.2.0 | complexité **cognitive** |
| `eslint-config-prettier` | 10.1.8 | |
| `prettier` | 3.9.6 | formatage |
| `vitest` | 4.1.10 | |
| `@vitest/coverage-v8` | 4.1.10 | couverture |
| `@vitejs/plugin-react` | 6.0.5 | |
| `jsdom` | 30.0.1 | environnement de test |
| `husky` | 9.1.7 | pre-commit |
| `lint-staged` | 17.3.0 | |
| `@commitlint/cli` | 21.2.1 | message conventionnel |
| `@commitlint/config-conventional` | 21.2.0 | |
| `jscpd` | 5.0.14 | duplication **inter-fichiers** |
| `puppeteer` | 25.6.0 | bench + captures de fidélité |
| `@testing-library/react` | 16.3.2 | ajouté à l'étape 5 : tester qu'une viz se monte VRAIMENT |
| `@testing-library/dom` | 10.4.1 | peer exigé par le précédent |
| `@testing-library/jest-dom` | 7.0.1 | |

Les trois `@testing-library` ont été ajoutés **après** le scaffold, à l'étape 5,
quand il a fallu prouver qu'une viz se montait réellement dans le DOM
(`tests/scene-viz.test.tsx`). Leur peer déclaré `react ^18 || ^19` est satisfait.

## 5. Écarts assumés avec le moule ma-nfl / ma-cdm

Le moule fixe l'**architecture** (Next 16 App Router, React 19, TS strict,
Tailwind 4, OKLCH, scripts `pnpm`), pas ses numéros de version, qui sont son
instantané à sa date. Écarts retenus ici, chacun mesuré :

- ESLint **9.39.5** — identique à ma-nfl, mais après une tentative mesurée en 10
  qui a échoué (§3bis), pas par recopie ;
- TypeScript **6.0.3** — identique à ma-nfl, mais pour une raison documentée
  (§2, ADR 0007), pas par recopie ;
- `@types/node` **24.13.3** au lieu de `^26` : suit le runtime réel ;
- pas de `@base-ui/react`, `zustand`, `@tanstack/react-query`, `shadcn`,
  `lucide-react`, Playwright, Vercel Analytics : aucun besoin en v1 (YAGNI).
  Le catalogue est statique, sans état partagé ni données distantes.
- ajouts propres à ce projet : `jscpd`, `commitlint`, `puppeteer`.

## 6. Vérification à l'exécution (2026-08-12) — l'épinglage a tourné

Un épinglage qui n'a pas été exécuté n'est pas vérifié (§3bis). Sorties réelles
après `pnpm install` :

```
> pnpm lint          → exit 0
> pnpm typecheck     → exit 0   (tsc --noEmit)
> pnpm build         → exit 0
  ▲ Next.js 16.3.0 (Turbopack)
  ✓ Compiled successfully in 9.2s
  ✓ Generating static pages using 4 workers (3/3) in 708ms
  Route (app)  ┌ ○ /   └ ○ /_not-found     ○ (Static) prerendered as static content
```

L'export statique produit bien `out/` (`index.html`, `404.html`, `_next/`) —
`output: "export"` de `next.config.ts` est donc actif, pas seulement déclaré.

**Puppeteer** (`pnpm.onlyBuiltDependencies`, sinon pnpm saute son postinstall et
le binaire n'est jamais téléchargé — un Puppeteer sans navigateur passerait
l'install en silence et casserait à l'étape 6) :

```
chrome (151.0.7922.77) downloaded to C:\Users\pierr\.cache\puppeteer\chrome\win64-151.0.7922.77
> node -e "puppeteer.launch() …"   → VERSION: Chrome/151.0.7922.77   TITRE: ok
```

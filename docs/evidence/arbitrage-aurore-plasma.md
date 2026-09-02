---
authority: ledger
subject: arbitrage-lot-2-easter-eggs
last_verified: 2026-09-02
expires: never
---

# Arbitrage aurore / plasma — les deux versions, côte à côte

> Lot 2 du [plan de portage Easter_eggs](../plans/portage-easter-eggs.md) §3.2.
> **Ce document ne tranche rien** : le verdict visuel appartient à l'utilisateur
> (SPEC §4, « la version validée par l'utilisateur gagne »). Il rassemble les
> quatre captures et rappelle la contrainte déjà posée.

## 1. La contrainte pré-tranchée (2026-08-21)

**Les curseurs sont obligatoires.** Nos deux fonds portent 8 réglages chacun ;
les versions Easter_eggs n'en exposent aucun. Une version Easter_eggs ne peut
gagner que si elle est **préférée visuellement** *et* qu'on lui **crée** des
réglages (comme pour les trois shaders du Lot 1). Jamais adoptée nue.

## 2. Les captures — regardées, pas seulement produites

Format carré, souris au centre (défaut des deux côtés), ~4 s d'animation,
Chrome headless shell, même machine.

| Viz | Version Easter_eggs (`Shader Wallpapers.html`) | Notre catalogue (`src/viz/`) |
|---|---|---|
| Aurore | [`aurore-boreale--easter-eggs.png`](captures/aurore-boreale--easter-eggs.png) | [`aurore-boreale--catalogue.png`](captures/aurore-boreale--catalogue.png) |
| Plasma | [`plasma-deforme--easter-eggs.png`](captures/plasma-deforme--easter-eggs.png) | [`plasma-deforme--catalogue.png`](captures/plasma-deforme--catalogue.png) |

Ce qu'on y voit, décrit pour que la comparaison ne dépende pas de mon goût :

- **Aurore, Easter_eggs (fs3 « Aurora Veil »)** : une *scène* — ciel bleu nuit
  étoilé, deux ou trois rubans nets (vert-cyan dominant, un ruban périwinkle),
  colline noire en silhouette en bas, reflet dans l'eau. La souris déplace le
  ruban (X) et sa teinte (Y). Le rendu est figuratif, presque une carte postale.
- **Aurore, catalogue** : des *rideaux* diffus, bleu-violet en haut, cyan-vert
  en bas, sans horizon ni étoiles — un fond abstrait qui se fond derrière du
  contenu. 8 réglages (octaves, rideaux, vitesse, échelle, intensité, ciel,
  deux teintes).
- **Plasma, Easter_eggs (fs1 « Plasma Tide »)** : masse violette *lumineuse*,
  très saturée, avec un halo rose autour de la souris et une vignette sombre
  aux bords ; le flux est lent et visqueux.
- **Plasma, catalogue** : nappes marbrées bleu marine / magenta plus
  *contrastées* et plus mates, sans halo souris, sans vignette. 8 réglages
  (octaves, déformation, vitesse, échelle, contraste, trois couleurs).

Fait technique utile au verdict : les deux versions Easter_eggs réagissent à la
souris (halo, déplacement du ruban) ; nos deux fonds **ne déclarent pas
`u_mouse`** (ADR 0017, opt-in). Si l'utilisateur garde les nôtres mais veut
l'accent souris, c'est un uniform et un curseur « Influence de la souris » à
ajouter — pas un remplacement.

## 3. Les trois issues possibles

1. **Garder la nôtre** → la version Easter_eggs est notée en `variantes` du
   manifest, rien n'est porté. Coût : nul.
2. **Prendre l'Easter_eggs** → elle remplace l'implémentation **sous le même
   slug**, la nôtre passe en `variantes`, et on lui **crée** au moins 6
   réglages (dont une couleur et l'influence de la souris). Coût : une viz
   du Lot 1, mesurée et regardée.
3. **Garder la nôtre + emprunter** (halo souris, étoiles, horizon…) → c'est
   une **évolution** de notre fond, avec ses curseurs conservés et de nouveaux
   ajoutés. Coût : entre les deux.

## 4. Rejouer les captures

Aucun script versionné (banc jetable, comme pour les paires p5) ; la procédure
tient en cinq lignes, Puppeteer `headless: "shell"` :

1. Source : ouvrir `file:///…/sources/easter-eggs/Shader%20Wallpapers.html` en
   800 × 800, presser la touche `1` (plasma) ou `3` (aurore), masquer tout sauf
   `canvas#gl`, attendre 4 s, capturer le canvas.
2. Catalogue : `pnpm build`, servir `out/`, ouvrir en 1440 × 1000, masquer tous
   les `article` sauf celui dont `[data-viz="<slug>"]`, attendre 4 s, capturer le
   `canvas` de l'article visible.

Attendu : quatre images non noires, correspondant aux descriptions du §2.

# Explorateur de fractales — notes de portage

## Manipulation, sans légende

- **Glisser** déplace. **Molette** zoome vers le curseur. **Double-clic**
  rapproche d'un cran. **Deux doigts** pincent. Un doigt sur la fractale la
  pilote au lieu de faire défiler la page (`touch-action: none`, ADR 0018) :
  on défile par les zones autour.
- **Changer de famille remet la vue** à celle de la famille — c'est l'exception
  « graine » de l'exigence n°1 : un changement qui redistribue tout. Tous les
  autres réglages (itérations, palette, cycle, défilement, intérieur)
  s'appliquent sans toucher au centre ni à l'échelle.
- « Constante de Julia » n'agit que sur la famille **Julia** — ce sont sept
  ensembles célèbres nommés, jamais deux curseurs à légende (ADR 0015).

## Ce que l'instrument mesure — et ce qu'il ne dit pas

- Le calcul est **progressif** : blocs de 8, 4, 2 puis 1 pixel, une tranche par
  image sous un budget de 8 ms. La première passe ignore le budget (elle est bon
  marché) pour qu'un glissé montre toujours une image entière.
- Au repos, le mouvement vient du **défilement des couleurs** : à chaque image,
  tous les pixels sont recoloriés à travers la table — c'est le coût mesuré par
  `pnpm bench`. Mettre « Défilement » à 0 rend la viz immobile une fois affinée,
  et le JavaScript par image tombe à ~0 ms.
- **Un zoom ou un glissé coûte un rafale** de calcul (une à deux secondes à
  256 itérations, plein cadre) que la fenêtre de mesure de 7 s au repos ne
  montre pas. Le chiffre du manifest est celui du repos ; le curseur
  « Itérations » arbitre le coût des rafales.

## Une scène non élue s'affine seule

Une seule viz anime à la fois (ADR 0011). Si on manipule celle-ci alors qu'une
autre est élue, elle finit son image par ses propres `requestAnimationFrame`,
jusqu'au dernier pixel puis s'arrête — un affinage **fini**, pas une animation
concurrente. Dès que le socle reprend la main (`frame` avec `delta > 0`), elle
se tait.

## Précision

L'échelle est bornée à 1e-13 : en dessous, la précision des nombres flottants
lâche et l'image devient une bouillie de blocs. Ce n'est pas un défaut de
rendu, c'est la limite du double.

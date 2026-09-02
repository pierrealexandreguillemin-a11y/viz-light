# Carte iridescente — notes de portage

## L'effet, pas l'illustration

La source habillait une carte à jouer (« Ace of Auras », SVG 360 × 540) et
masquait le reflet iridescent par ce dessin. Le dessin est resté à la source
(plan §3.6) ; la surface est nue et le reflet couvre tout le champ, comme le
préréglage clair de la source. Les seize réglages du panneau d'origine qui ont
encore un sens sans illustration sont conservés ; sont tombés avec elle
« couleur du trait », « masque », « verso » et la durée de transition (le
lissage se fait dans `frame()`).

## Tout le mouvement dans `frame()`

- Le pointeur est **lissé** à chaque image (pas de `transition` CSS) : c'est ce
  qui fait revenir la carte à plat en douceur quand on la quitte.
- Au repos, l'angle du reflet **dérive** (« Dérive au repos », en degrés par
  seconde) : sans elle, une carte non survolée serait immobile et l'instrument
  mesurerait une page qui ne change pas. Mettre à 0 pour une carte figée hors
  survol.
- L'inclinaison 3D, la tache spéculaire et la teinte du halo suivent le même
  pointeur ; le halo sous la carte prend la teinte du reflet par `hue-rotate`.

## Ce que l'instrument mesure

Le JavaScript par image est minime (quelques chaînes CSS posées). Le coût réel
est celui du navigateur : un dégradé conique recalculé, un flou de 60 px, des
modes de fusion. S'il pèse, l'instrument le montrera en _GPU-bound_ ; « Flou du
halo » et « Halo » sont les curseurs qui l'allègent.

## Tactile

`touch-action: none` et `pointerdown` (ADR 0018) : une pression place le
pointeur, un glissé incline la carte ; on défile par les zones autour.

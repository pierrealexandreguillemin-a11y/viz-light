---
authority: ledger
subject: erreurs
last_verified: 2026-08-12
expires: never
---

# Erreurs commises — et le garde-fou qui empêche chacune de revenir

> Ce document existe parce qu'une erreur non consignée se refait. Chaque entrée
> donne le défaut, **ce qui l'a rendu possible**, et le mécanisme qui l'attrape
> désormais. Sans mécanisme, l'entrée n'est qu'une bonne résolution.

## 1. L'instrument mesurait le vide (2026-08-12)

**Défaut** : l'effet de montage lisait les dimensions du `ResizeObserver` tout
en les excluant de ses dépendances (`eslint-disable`). Aucune viz ne se montait,
et l'instrument annonçait **59,9 i/s et 0 ms de JavaScript** — il chronométrait
une boucle vide. Le bench allait tamponner ces chiffres dans un manifest publié.

**Ce qui l'a rendu possible** : avoir tu un avertissement de gate au lieu de
supprimer sa cause. `eslint-disable` sur `exhaustive-deps` est un aveu.

**Garde-fou** : `tests/scene-viz.test.tsx` exige un élément dans l'hôte, calibré
dans les deux sens. **Règle** : ne jamais croire un chiffre sans avoir vérifié
que l'objet mesuré existe — et se méfier des valeurs trop rondes (0 ms, 100 %).

## 2. Un gate écrit que la chaîne n'exécutait pas (2026-08-12)

**Défaut** : `pnpm verify` lançait `test` et non `test:cov`. Le plancher de
couverture était configuré et **exécuté par rien**.

**Garde-fou** : `verify` enchaîne `test:cov`. **Règle** : après avoir écrit un
seuil, vérifier qu'une commande de la chaîne le franchit vraiment — et le voir
rougir.

## 3. Le bench cassé qui sortait proprement (2026-08-12)

**Défaut** : le bench cherchait `.cout[data-fps]`, une classe disparue avec un
composant supprimé. Il ne relevait plus rien **et rendait un code de sortie 0**.

**Garde-fou** : il échoue désormais si `releves.length === 0`. **Règle** : un
outil de mesure doit crier quand il ne mesure rien ; le silence n'est pas un
succès.

## 4. Un épinglage déclaré compatible mais cassé (2026-08-12)

**Défaut** : ESLint 10 épinglé sur la foi des `peerDependencies` ; la dépendance
transitive `eslint-plugin-react` plafonnait à `^9.7` et `pnpm lint` plantait.

**Règle** : un `peerDependencies` ne voit pas l'arbre transitif. Un épinglage
n'est vérifié qu'après exécution de la commande qu'il sert.

## 5. Une palette « par défaut » prise pour un choix (2026-08-12)

**Défaut** : fond quasi-noir + accent cyan vif au scaffold — l'un des trois
looks vers lesquels la génération assistée converge, indépendamment du sujet.

**Garde-fou** : [ADR 0009](../decisions/0009-direction-artistique-planche-contact.md)
et l'étape 5b du fil d'Ariane. **Règle** : quand un choix visuel serait le même
pour n'importe quel autre projet, ce n'est pas un choix.

## 6. Une légende pour expliquer une interface (2026-08-12)

**Défaut** : une barre de coût de 3 px accompagnée d'une légende de trois
entrées. **Rappel de l'utilisateur** : « si tu as besoin d'une légende, c'est
que ton UI/UX est mauvaise ; les UX doivent s'expliquer d'elles-mêmes. »

**Règle** : la légende est le symptôme, pas la solution. Si un élément a besoin
d'être expliqué, remplacer l'élément — ici, la barre par la phrase qu'elle
codait.

## 7. Les réglages perdus à la migration (2026-08-12)

**Défaut** : le banc d'essai d'origine se réglait en direct ; le catalogue
déclarait les paramètres dans le manifest **sans les exposer**. La chose la plus
utile du matériel d'origine avait disparu en silence.

**Garde-fou** : `InstanceViz.regler()` au contrat, panneau de réglages par
spécimen. **Règle** : à chaque migration, lister ce que l'original SAIT FAIRE,
pas seulement ce qu'il montre — et vérifier que la copie le fait encore.

## 8. Prose en monospace, en-tête surdimensionné (2026-08-12)

**Défaut** : quatre lignes de prose en monospace dans l'en-tête (mur illisible),
et un titre occupant autant de hauteur que la viz elle-même.

**Règle** : sur un catalogue de visuels, l'espace appartient aux visuels. Et une
règle typographique qu'on énonce (« mono = étiquettes et nombres ») s'applique
d'abord à soi.

## 9. Encodage détruit par PowerShell (2026-08-12)

**Défaut** : `Get-Content -Raw | ConvertFrom-Json` lit en ANSI sous
PowerShell 5.1 : les accents du manifest sont devenus `poussiÃ¨re`,
`TraÃ®nÃ©e`, affichés tels quels dans l'interface.

**Règle** : ne jamais faire transiter un fichier UTF-8 par un aller-retour
PowerShell. Utiliser l'outil d'écriture de fichiers, ou Node. Même famille de
piège que le BOM signalé au handoff de genèse.

## 12. Avoir reporté les effets les plus simples (2026-08-12)

**Défaut** : les 10 effets du banc d'essai — grain de film, orbes floutées, mesh
gradient, constellation, poussière d'étoiles — sont les plus SIMPLES du lot, et
les seuls de catégorie `fond`. Je les ai reportés au motif que leur source est
un bundle minifié, et j'ai migré à la place des sketches p5 plus spectaculaires.
Résultat : la section « Fonds » est restée vide, alors que c'est elle que
l'utilisateur voulait voir séparée.

**Ce qui l'a rendu possible** : avoir pris « la source est minifiée » pour un
obstacle. Un grain de film ou un dégradé flouté s'écrit depuis sa description et
ses paramètres — tous deux lisibles en clair dans le fichier rapatrié
(`claim`, `reality`, `params`). Le désassemblage n'était nécessaire pour aucun
d'eux.

**Règle** : trier les migrations par **ce que l'utilisateur attend de voir**, pas
par le confort de la source. Et quand un obstacle est invoqué pour reporter,
vérifier qu'il s'applique vraiment — ici il ne s'appliquait pas.

## 11. « Recharge, c'est en place » — sur un serveur mort (2026-08-12)

**Défaut** : toutes mes vérifications visuelles passaient par un serveur statique
que je lançais moi-même sur un port de test, servant `out/`. J'ai dit à
l'utilisateur de recharger `localhost:3000` sans jamais vérifier ce port. Le
serveur de développement était tombé — il n'avait plus rien à afficher.

**Ce qui l'a rendu possible** : vérifier une *représentation* du produit au lieu
du produit tel que l'utilisateur y accède.

**Règle** : la vérification doit porter sur l'URL que la personne va ouvrir, pas
sur un équivalent commode. Et « HTTP 200 » ne suffit pas : contrôler que la page
rend bien ce qu'elle promet (éléments présents, canvas non vides).

## 13. Le script `docs` ouvrait npmjs.com dans le navigateur de l'utilisateur (2026-08-12)

**Défaut** : `package.json` définissait un script nommé `docs`, appelé par
`pnpm verify`. Or `docs` est AUSSI une commande intégrée du gestionnaire de
paquets, dont le rôle est d'ouvrir `npmjs.com/package/<nom>` dans le
navigateur. À chaque chaîne complète, la page `npmjs.com/package/viz-light`
— un paquet étranger sans rapport — s'ouvrait chez l'utilisateur, **pendant
trois sessions**, sans que personne ne relie la fenêtre à sa cause.

**Ce qui l'a rendu possible** : nommer un script comme une commande intégrée,
et ne pas prendre au sérieux un symptôme signalé par l'utilisateur tant que le
mécanisme n'était pas compris.

**Garde-fou** : script renommé `check-docs`. **Règle** : ne jamais donner à un
script npm/pnpm le nom d'une commande intégrée (`docs`, `test` mis à part,
`start`, `restart`, `stop`…) ; et un symptôme signalé deux fois mérite une
traque immédiate, pas une hypothèse.

## 14. Le bench mesurait un environnement bridé — et tamponnait (2026-08-12)

**Défaut** : toutes les viz sortaient à ~10 i/s « GPU-bound », y compris un
fond à 0,1 ms de JavaScript, et ces chiffres ont été ÉCRITS dans les manifests
(écrasant les 59,9 de la veille). Cause : le mode headless par défaut de Chrome
bride son compositeur à ~10 i/s sur cette machine — une page VIDE plafonnait
déjà à 10 i/s.

**Ce qui l'a rendu possible** : un instrument qui mesurait juste, dans une
pièce déformée — le jumeau de l'erreur n°1 (mesurer le vide) : ici on mesurait
le bridage.

**Garde-fou** : `scripts/bench.ts` s'étalonne sur une page vide avant toute
mesure et **refuse** (ROUGE) sous 55 i/s ; il lance Chrome en `headless:
"shell"`, mesuré sain (59 i/s). **Règle** : étalonner l'instrument sur un cas
de coût nul avant de mesurer quoi que ce soit ; une valeur uniforme sur des
sujets hétérogènes accuse l'environnement, pas les sujets.

## 15. Vérifier la fidélité contre une traduction, pas contre l'original (2026-08-12)

**Défaut** : les 5 œuvres p5 ont d'abord été « vérifiées » contre
`sources/tweet-sketches-artifact.html` — qui est lui-même une TRADUCTION
(dé-golfage fait côté claude.ai, avec ses propres erreurs corrigées en cours de
route). L'utilisateur a dû exiger la relecture des one-liners golfés de la
conversation d'origine.

**Ce qui l'a rendu possible** : prendre le document le plus commode pour le
document de référence. Une chaîne de copies a toujours un maillon zéro.

**Garde-fou** : les golfés intégraux sont rapatriés dans
`sources/tweets-golfes.md`, et `SPEC.md` §4 nomme ce fichier comme LA référence
du régime « œuvre ». **Règle** : avant toute vérification de fidélité,
identifier le maillon zéro de la chaîne — et vérifier contre lui, jamais contre
un intermédiaire.

## 16. Une capture de preuve qui prouvait le contraire (2026-08-13)

**Défaut** : le banc de captures comparées a produit trois fois de suite des
images qui ne prouvaient rien, sans jamais échouer :

1. Le clic sur « Origine » partait AVANT l'hydratation React — bouton présent
   dans le HTML, sans écouteur. Rendu capturé : l'aligné, couleur et traînée
   comprises.
2. Corrigé, le clic visait `document.querySelectorAll("button")` — donc le
   bouton du PREMIER article du document, pas celui de la viz visée (les autres
   sont masqués en `display:none` mais toujours dans le DOM).
3. Le chronomètre partait de la navigation, pas du montage de la viz : les deux
   images comparées étaient prises à des instants différents de l'animation, ce
   qui déphase une figure qui tourne et rend la comparaison illisible.

**Ce qui l'a rendu possible** : chacune de ces trois versions se terminait par
« capturé » et un fichier PNG bien formé. Un instrument de preuve qui ne peut
pas échouer bruyamment ne prouve rien — jumeau des erreurs n°1 et n°14.

**Garde-fou** : le banc attend le canvas (signal d'hydratation), porte le clic
sur l'article de la viz, **vérifie `aria-pressed="true"`** avant de capturer, et
cale son chronomètre sur l'apparition du canvas. **Règle** : une preuve visuelle
se relit à l'œil avant d'être versée au dossier — le fichier produit n'est pas
la preuve, l'image l'est.

## 17. Cinq golfés du fichier de référence ne s'exécutent pas (2026-08-13)

**Constat** : dans `sources/tweets-golfes.md`, cinq blocs (7 mai, 10 mars,
8 mars #2, 7 mars, 22 février) se terminent par `}#つぶやきProcessing` **sans
les `//`**. Tel quel, le script ne PARSE pas : p5 ne démarre jamais, et le banc
de captures attendait un `frameCount` qui ne viendrait pas — symptôme lu à tort
comme de la lenteur pendant quinze minutes.

**Nature** : artefact de transcription du rapatriement, pas du code d'auteur.
Le fichier reste la référence de fidélité (erreur n°15) et n'a **pas** été
édité ; c'est le banc de captures qui neutralise la fin de ligne.

**Garde-fou** : le banc échoue en 15 s si `frameCount` n'apparaît jamais, au
lieu d'attendre son long délai. **Règle** : distinguer « lent » de « mort » par
un signal de démarrage, jamais par la patience.

## 18. L'observation a réinitialisé l'observé (2026-08-13)

**Défaut** : les captures de l'Atelier génératif montraient une spirale
minuscule et des orbites sans traînée, alors que l'original animé était
identique au portage. Cause : `elementHandle.screenshot()` de Puppeteer
redimensionne temporairement la fenêtre (`captureBeyondViewport`) ; l'Atelier
écoute `windowResized` et **recrée son sketch** — la capture montrait donc une
œuvre remise à zéro trois images plus tôt.

**Ce qui l'a rendu possible** : croire qu'une capture est passive. Elle ne
l'est pas dès que la page réagit à la taille de la fenêtre.

**Garde-fou** : capturer par découpe (`page.screenshot({ clip,
captureBeyondViewport: false })`), jamais par capture d'élément, sur toute page
qui écoute le redimensionnement. **Règle** : avant de conclure d'après une
image, vérifier que l'acte de mesurer ne change pas ce qui est mesuré — et
recouper par un chiffre pris SANS capture (ici : pixels allumés, 3 632 contre
3 577, soit 1,5 % d'écart, qui disait la vérité quand l'image mentait).

## 10. Un « défaut » corrigé sans être constaté (2026-08-12, évité)

**Ce qui a failli arriver** : croire voir des valeurs dupliquées à gauche de la
page et « corriger » une mise en page saine.

**Ce qui a été fait** : interroger le DOM (chaque valeur n'y est qu'une fois) et
découper la zone en haute résolution (rien). C'était une erreur de lecture d'une
capture redimensionnée.

**Règle** : constater avant de corriger. Un correctif appliqué à un défaut
inexistant en crée un vrai.

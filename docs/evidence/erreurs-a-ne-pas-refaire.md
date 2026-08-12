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

## 10. Un « défaut » corrigé sans être constaté (2026-08-12, évité)

**Ce qui a failli arriver** : croire voir des valeurs dupliquées à gauche de la
page et « corriger » une mise en page saine.

**Ce qui a été fait** : interroger le DOM (chaque valeur n'y est qu'une fois) et
découper la zone en haute résolution (rien). C'était une erreur de lecture d'une
capture redimensionnée.

**Règle** : constater avant de corriger. Un correctif appliqué à un défaut
inexistant en crée un vrai.

---
authority: annex
last_verified: 2026-08-21
expires: never
---

# Handoff — 2026-08-21 (5e session) · déploiement production, trois verdicts utilisateur

**Point de départ** : `pnpm session` VERT, étape 6 close (31/31), étape 8
(recette) seule ouverte. Demande initiale : « point sur le dev et les plans »,
puis trois verdicts sur des arbitrages en attente, puis « lance une planche
autonome que je puisse regarder et juger hors session ».
**Point d'arrivée** : **la planche est en production, autonome** —
https://viz-light.vercel.app. Trois décisions utilisateur consignées. `pnpm
verify` toujours vert (code inchangé, tampon valide) ; les changements de cette
session sont **purement documentaires**.

## 1. Trois verdicts de l'utilisateur, consignés

Aucun ne relève d'une mesure : ce sont des décisions, prises hors du lot
Easter_eggs qu'elles concernent (hors v1). Rangées dans l'annexe vivante
`plans/portage-easter-eggs.md` et le registre `evidence/sources-easter-eggs.md` ;
elles seront formalisées (ADR 0013/0014) quand le lot démarrera.

1. **« On garde les curseurs. »** L'arbitrage aurore/plasma (nos versions à 8
   curseurs contre les shaders Easter_eggs sans réglage) est désormais cadré par
   une **contrainte non négociable** : la version qui ship doit exposer des
   curseurs. En pratique nos `aurore-boreale`/`plasma-deforme` restent la base ;
   une version Easter_eggs ne serait adoptée que si préférée visuellement *et*
   dotée de curseurs créés (travail neuf). Plan §3.2.
2. **La carte iridescente est un candidat de plein droit.** J'avais sous-vendu
   l'effet en le présentant comme « carte à jouer, candidat faible » —
   confusion entre l'**objet** (l'illustration « Ace of Auras », qu'on laisse) et
   l'**effet** (le `conic-gradient` iridescent qui suit le pointeur, qu'on
   importe, exactement comme le halo de Miami). Corrigé : plan §3.6, tableau,
   ordre d'exécution, et registre de source §2.5.
3. **Incohérence de compte corrigée.** Le plan §1 annonçait « Huit éléments
   retenus » ; SPEC §4, le handoff du 2026-08-13 et le tableau du plan disent
   tous **neuf**. Recompté contre le fichier (13 inventoriés → 9 retenus) et
   corrigé.

## 2. Le déploiement production — le livrable

**Demande** : une planche « autonome, hors session ». Premier réflexe livré —
un serveur statique local en tâche de fond — **n'était pas autonome** (lié au
processus de session). L'utilisateur l'a dit sans détour ; il avait raison.
Livré ensuite ce qu'« autonome » veut dire : une URL de production qui vit seule.

- **URL** : https://viz-light.vercel.app (alias canonique).
- **Comment** : `VERCEL_TOKEN` était déjà présent dans l'environnement — déploiement
  non-interactif via la CLI Vercel (installée cette session, `npm i -g vercel`,
  ce que le hook de démarrage recommandait). Aucune information demandée à
  l'utilisateur.
- **Build depuis les sources** par Vercel (`next build`, Turbopack, TypeScript
  OK, `output: export`), pas un dépôt de fichiers statiques. Projet `viz-light`,
  Node 24.x, région iad1.
- **Vérifié en regardant le réseau** : `/` → HTTP 200, contenu `viz·light`
  présent, un chunk JS et le CSS → 200, **aucun mur d'authentification Vercel**.

### Effets de bord, honnêtement

- **Un projet « out » créé puis supprimé.** Mon premier `vercel deploy` a tourné
  depuis `C:\Dev\viz-light\out` (un `cd out` résiduel de mes tests de serveur
  local avait collé au shell) : Vercel a créé un projet « out » servant l'export
  statique. Fonctionnel mais sale. Refait proprement depuis la racine, puis
  `vercel project rm out` — vérifié : seul `viz-light` subsiste.
- **CLI Vercel installée globalement** sur la machine. Le serveur local détaché
  (PID 10728) a été tué une fois l'URL en ligne.
- **`.gitignore` re-nettoyé** : la CLI y avait ajouté un `.vercel` en double
  (déjà ignoré) ; restauré.

## 3. État à la passation

- Fil d'Ariane : 0-7 ✅, **étape 8 ⬜ (recette — se fait maintenant sur l'URL
  live)**, **étape 9 🟨 déployée** (reste le CATALOG.md final après recette),
  étape 10 ⬜. Le réordonnancement 9-avant-8 est consigné dans SPEC §8 et respecte
  l'ADR 0006.
- `pnpm verify` : **vert et tamponné**, code inchangé cette session (le tampon
  `hashDuCode` ne couvre que src/scripts/tests/config — un commit documentaire
  ne le périme pas). `pnpm check-docs` : VERT.
- Commits de cette session : documentaires uniquement. **Aucun `git push`.** Le
  déploiement Vercel n'est pas un push git — il n'existe aucun remote git.
- Couverture inchangée depuis le 2026-08-13 (95,55 / 94,69 / 97,56 / 100).

## 4. Ce que la prochaine session doit faire

**La recette (étape 8), sur https://viz-light.vercel.app.** Elle appartient
entièrement à l'utilisateur : parcourir les 31 viz et dire, viz par viz, ce qui
reste / part / se règle autrement. Une grille de recette (31 viz par section, à
cocher) a été proposée ; à produire s'il la demande.

**Aucune décision technique laissée en suspens.** Les choix restants sont tous à
l'utilisateur, tous nommés :

1. Le verdict de recette sur chacune des 31 viz (étape 8).
2. Le verdict **visuel** final aurore/plasma quand le lot Easter_eggs démarre —
   mais désormais avec curseurs garantis (§1.1). Hors v1.
3. Après recette : le **CATALOG.md final** et un éventuel redéploiement pour
   clore l'étape 9.

Le lot Easter_eggs (étape 10) ne commence toujours pas avant la recette ; quand
il commencera, il commencera par les ADR 0013 (SOURCES) et 0014 (genre `choix`),
pas par une viz — et les deux verdicts du §1 y seront formalisés.

## 5. Auto-évaluation — ALERTE

Trois reprises de l'utilisateur dans une même session, dont deux évitables :
j'ai **sous-vendu la carte iridescente** (confusion objet/effet que le plan
lui-même dissipait déjà) et **livré un premier « autonome » qui ne l'était pas**
(serveur lié à la session). Le fond a fini juste et prouvé — mais deux allers-
retours de trop. Leçon écrite en mémoire : *un livrable « autonome/hors session »
ne se prouve pas par un processus que ma session tient en vie.*

---
authority: annex
adr_status: accepted
last_verified: 2026-08-12
expires: never
---

# ADR 0011 — Une seule scène vivante à la fois

## Contexte

La planche affiche 15+ viz. Le socle pausait déjà hors viewport, mais 2-3 viz
simultanément visibles se partageaient la machine : la cadence perçue en
défilant ne correspondait pas aux chiffres tamponnés dans les manifests
(mesurés une viz seule). L'utilisateur a posé la question du coût, et tranché.

## Décision (utilisateur, 2026-08-12)

**Seule la viz la plus visible du viewport anime.** Les autres restent figées
sur une image peinte. Élection par observateur partagé
(`src/core/hooks/useScenePrincipale.ts`) : taux de visibilité d'abord,
distance au centre du viewport en départage, stabilité en cas d'égalité
parfaite (l'élue en place reste — pas de clignotement).

## Conséquences

- La facture d'animation de la planche est constante quelle que soit sa
  longueur — c'est ce qui rend le scrolldown long préférable aux onglets.
- La cadence perçue rejoint celle des manifests.
- Une scène figée doit se REPEINDRE elle-même après tout réglage ou
  redimensionnement (`canvas.width = …` efface le canvas) — c'est câblé dans
  `SceneViz` et gardé par `tests/scene-principale.test.tsx`.
- Le bench n'est pas affecté : il masque les autres viz, l'unique restante est
  élue.

---
authority: ledger
subject: perf
last_verified: 2026-08-13
expires: never
---

# Cadence mesurée — ce que l'instrument dit, et ce qu'il ne dit pas

> Les chiffres par viz vivent dans les `manifest.json` (`perf`), écrits par
> `pnpm bench` exécuté. **Ce document ne recopie pas les 31 relevés** : il note
> les cas qui demandent une lecture, parce qu'un chiffre isolé s'y interprète
> mal. Étalon des deux passes du 2026-08-13 : **page vide à 61 i/s**.

## 1. Trois viz ne tiennent pas 60 i/s — pour deux raisons différentes

| Viz | Cadence | Cause, mesurée |
|---|---|---|
| `attracteur-de-lorenz` | 30 i/s | **CPU** — ~33 ms de JavaScript par image |
| `couronne-battante` | 30 i/s | **CPU** — ~33 ms de JavaScript par image |
| `orbes-floutees` | 30 i/s | **GPU** — 0,1 ms de JavaScript seulement |

Les deux premières sont **structurelles et assumées** : trente mille points par
image, c'est ce que demande le one-liner golfé. Ce n'est pas un défaut de
portage, et le curseur « Points » laisse l'utilisateur arbitrer.

`orbes-floutees` est **un cas tout autre, et une correction** : son manifest
portait 59,9 i/s (mesure du 2026-08-12). Les deux passes du 2026-08-13 la
donnent à **30 i/s, `gpuBound: true`**, avec 0,1 ms de JavaScript — le
processeur ne fait rien, c'est le flou qui coûte. Reproductible deux fois de
suite : ce n'est pas du bruit. Aucun code de cette viz n'a changé entre les deux
dates ; la mesure du 12 était donc optimiste, ou la machine hôte a changé d'état
graphique. **Le chiffre qui fait foi est celui du manifest**, re-mesuré.

## 2. Un piège de lecture : les viz assises sur le budget d'image

À 60 i/s, une image dispose de **16,7 ms**. Plusieurs sketches p5 consomment
entre 16 et 19 ms de JavaScript — c'est-à-dire exactement la frontière. Ceux-là
**basculent d'une passe à l'autre** sans qu'aucune ligne n'ait changé :

| Viz | Passe 1 (2026-08-13) | Passe 2 (2026-08-13) |
|---|---|---|
| `ruban-ondule` | 30,1 i/s · JS 18,7 ms | **59,9 i/s** · JS 18,3 ms |
| `ruban-plisse` | 59,7 i/s · JS 17,85 ms | 59,9 i/s · JS 17,4 ms |
| `anemone-marine` | 59,9 i/s · JS 16,7 ms | 59,9 i/s · JS 16,3 ms |

**À retenir** : une cadence de 30 i/s sur une viz dont le JS est proche de
16,7 ms ne prouve rien à elle seule — c'est le temps JS qu'il faut lire. Une
cadence de 30 i/s avec un JS à 0,1 ms (le cas d'`orbes-floutees`) est en
revanche un verdict net : le coût est ailleurs que dans notre code.

## 3. Méthode, pour que ces chiffres restent comparables

- `pnpm bench` **s'étalonne avant de mesurer** : il refuse de travailler si la
  page vide ne tient pas la cadence attendue. Il avait déjà refusé à 54 i/s.
  Un étalon vert ne garantit pourtant pas la stabilité pendant les 31 × 7 s qui
  suivent — d'où le §2.
- **Machine calme obligatoire** : couper `pnpm dev` avant de mesurer. Un
  précédent documenté (2026-08-13, 3e session) a vu cinq viz de plus tomber à
  30 i/s à cause d'un autre travail en cours.
- **Un chiffre aberrant accuse d'abord l'environnement.** On re-mesure avant de
  conclure ; on ne conclut jamais sur une passe unique.
- Les chiffres ne sont **jamais** estimés, jamais « attendus ». Un manifest sans
  perf rend `pnpm catalog` rouge, et c'est voulu.

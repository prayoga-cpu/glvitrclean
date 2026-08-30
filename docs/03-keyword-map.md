# 03 — Keyword map

Every page must have a target query. No exceptions. If you cannot name it, do
not build the page.

## Pattern tiers

| Tier | Pattern | Example | Volume | Competition | Owns |
|---|---|---|---|---|---|
| Money | `[service] [commune]` | nettoyage vitres Arpajon | low | low | `/zones/[commune]/[service]` |
| Money | `[service] [dept]` | laveur de vitres Essonne | medium | medium | `/services/[slug]` |
| Money | `[commune] [trade]` | société de nettoyage Étampes | low | medium | `/zones/[commune]` |
| Decision | `[service] crédit d'impôt` | nettoyage vitres crédit d'impôt | medium | medium | `/credit-impot` |
| Decision | `[service] prix` / `tarif` | prix nettoyage terrasse m2 | medium | low | service page pricing block |
| Blue ocean | `nettoyage poubelles [commune]` | nettoyage poubelles Étampes | very low | **none** | `/zones/[commune]/poubelles` |
| B2B | `nettoyage vitrine [commune]` | nettoyage vitrine Arpajon | low | medium | `/professionnels` |
| Brand | `glvitr clean` | — | low | owned | `/` |

## Service slugs and their head terms

| Slug | Head term | Long tail seeds |
|---|---|---|
| `vitres` | nettoyage de vitres | laveur de vitres, lavage vitres maison, nettoyage baies vitrées, nettoyage véranda |
| `terrasse` | nettoyage de terrasse | démoussage terrasse, nettoyage dallage, karcher terrasse |
| `menage` | ménage à domicile | aide ménagère, entretien maison, grand ménage |
| `volets-portes` | nettoyage volets | nettoyage portes, nettoyage volets roulants |
| `facade` | nettoyage de façade | ravalement léger, démoussage mur, nettoyage crépi |
| `poubelles` | nettoyage de poubelles | désinfection bacs, nettoyage conteneurs |

## AEO targets

Answer-engine queries. Each gets an FAQ entry whose **first sentence is a
complete direct answer**, because that first sentence is what gets quoted.

| Question | Page |
|---|---|
| Le nettoyage de vitres ouvre-t-il droit au crédit d'impôt ? | `/credit-impot` |
| Comment fonctionne l'avance immédiate de l'URSSAF ? | `/credit-impot` |
| Le nettoyage de façade est-il éligible au crédit d'impôt ? | `/services/facade` |
| Combien coûte un nettoyage de vitres pour une maison ? | `/services/vitres` |
| Quel est le plafond du crédit d'impôt services à la personne ? | `/credit-impot` |
| Faut-il être imposable pour en bénéficier ? | `/credit-impot` |

The facade question is the highest-value one on this list. Everybody else dodges
it. Answering it honestly is both the legal position and the trust play.

## Title and description templates

Owned by `src/lib/seo.ts`. Never hand-write these.

```
service × commune  →  "{Service} à {Commune} (91) | GLVITR'CLEAN"
commune hub        →  "Nettoyage à {Commune} (91) : vitres, terrasse, ménage | GLVITR'CLEAN"
service            →  "{Service} en Essonne (91) | GLVITR'CLEAN"
```

Descriptions vary by service *and* commune so no two collide. The uniqueness
check enforces it. It exists because 39 of 51 pages on prionation.io went
unindexed for exactly this reason.

## Anti-patterns

- Do not create a page per commune per *long tail* term. 72 is the ceiling.
- Do not target `nettoyage Paris` or anything outside the service radius.
- Do not chase `société de nettoyage` unqualified. National, hopeless, worthless.
- Do not put the same H1 on two pages, ever.

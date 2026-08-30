# 10 — Discovery questionnaire (Phase 0)

The questions that unblock the build. Claude cannot answer any of them.

Send the French text to the client as-is. The **Fills** line names the exact
field the answer goes into, so nothing gets collected twice or lost in a
thread. Record every answer in `STATUS.md` on the day it arrives.

Order matters: 1 to 3 block copy that is already written. 4 to 8 block launch.

---

## 1. La coopérative et le numéro SAP

> Quelle est la coopérative qui émet vos factures, et quel est son numéro de
> déclaration Services à la Personne ? (format `SAP` + 9 chiffres)

**Fills:** `company.sapDeclaration.holder`, `company.sapDeclaration.number`
**Blocks:** the tax credit badge leaving pending mode on four service pages.
Until the number is a real value the site describes the scheme without
claiming the client is registered under it. See `docs/04-compliance-sap.md`.

---

## 2. La facture et l'attestation fiscale

> Trois questions liées :
> a. Qui émet la facture au client final — vous, ou la coopérative ?
> b. Qui envoie l'attestation fiscale annuelle que le client joint à sa
>    déclaration d'impôts ?
> c. L'avance immédiate URSSAF est-elle disponible via la coopérative ?

**Fills:** `company.sapDeclaration.mode` (`prestataire` if the cooperative
contracts with the customer, `mandataire` if the client does),
`company.sapDeclaration.attestationIssuer`,
`company.sapDeclaration.avanceImmediate`
**Blocks:** the legal wording on `/credit-impot`. `mandataire` and
`prestataire` are not interchangeable — they change who the customer's
contract is with, and therefore what the page is allowed to state.

---

## 3. Le secteur d'intervention définitif

> Jusqu'où vous déplacez-vous réellement ? Uniquement l'Essonne (91), ou
> également la Seine-et-Marne (77) et le Val-de-Marne (94) ?
>
> Et dans l'Essonne : y a-t-il des communes de la liste ci-dessous où vous
> n'iriez pas, ou des communes qui manquent ?
>
> Linas, Montlhéry, Arpajon, Saint-Germain-lès-Arpajon, La Ville-du-Bois,
> Ollainville, Bruyères-le-Châtel, Égly, Brétigny-sur-Orge, Marcoussis,
> Étampes, Étréchy.

**Fills:** `company.serviceArea.departments`, `company.serviceArea.confirmed`,
and the contents of `src/data/communes.ts`
**Blocks:** 84 of the 97 routes. This is the single most expensive answer to
get wrong — every commune added or removed changes six pages. Ask before
Phase 3, not during it.

---

## 4. Le domaine

> Chez quel prestataire le domaine `glvitrclean.com` est-il enregistré, et
> avez-vous encore les identifiants ?

**Fills:** nothing in code. Tracked in `STATUS.md` only.
**Blocks:** the Phase 6 DNS cutover. If the registrar login is lost, recovery
takes weeks — start this early even though it is the last phase.

---

## 5. Le logo

> Avez-vous le fichier d'origine du logo ? Idéalement en `.ai`, `.svg` ou
> `.pdf`. À défaut, le PNG le plus grand que vous ayez.

**Fills:** `public/assets/`, and the favicon set
**Blocks:** Phase 5. A logo pulled from the Facebook header is too small for a
favicon and will look broken on retina screens.

---

## 6. Les photos

> Le dossier Drive avec vos photos de chantier : pouvons-nous y accéder, et
> avons-nous votre accord pour les publier ?
>
> Ce qui a le plus de valeur : des paires avant / après du même endroit, et le
> nom de la commune où la photo a été prise.

**Fills:** `public/assets/`, `/realisations`
**Blocks:** Phase 5. Placeholder images stay visibly marked as placeholders
until real ones land — see CLAUDE.md rule 4.

---

## 7. Les réseaux sociaux

> Les adresses exactes de vos pages Facebook et Instagram.

**Fills:** `company.social`
**Blocks:** the footer, and the `sameAs` property in the LocalBusiness JSON-LD.
`sameAs` is how Google ties the site to the same business entity as the social
profiles, so an empty array costs real local ranking signal.

---

## 8. La fiche Google

> Avez-vous déjà une fiche Google Business Profile pour GLVITR'CLEAN, même
> ancienne ou jamais utilisée ? Si oui, avec quelle adresse e-mail ?

**Fills:** `company.googleBusinessProfile`
**Blocks:** Phase 7. A forgotten duplicate fiche competing with a new one is
worse than no fiche. Find it before creating another.

---

## Also worth asking now

Not in the Phase 0 list, but cheap to ask in the same message and expensive to
discover at launch. Logged as items 11–13 in `STATUS.md`.

> - Votre assurance responsabilité civile professionnelle : quel assureur, et
>   quel numéro de contrat ? (obligatoire dans les mentions légales)
> - Êtes-vous inscrit au Répertoire des Métiers pour le nettoyage de façade ?
>   Si non, nous retirons cette prestation du site.
> - Quels prix, ou quelles fourchettes de prix, acceptez-vous de publier ?
>   Une fourchette avec une base claire ("à partir de X € pour une maison de
>   100 m²") convertit mieux qu'aucun prix du tout.

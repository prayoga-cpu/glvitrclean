# 08 — Non-code work (human only)

Phase 5 of the PRIONATION handbook. Claude cannot do any of this. When a task
depends on one of these, stop and log it in `STATUS.md`.

## Blocking the build

- [ ] **Cooperative name and SAP declaration number.** Blocks the tax credit
      badge leaving pending mode. Ask: "Quelle est la coopérative qui émet vos
      factures, et quel est son numéro de déclaration SAP ?"
- [ ] **Who issues the invoice and the attestation fiscale.** Determines whether
      the customer actually gets the credit, and whether the avance immédiate is
      available.
- [ ] **Final service area.** 91 only, or 91 + 77 + 94. Drives 84 of the 97
      routes.
- [x] ~~**Registrar and DNS access** for `glvitrclean.com`.~~ Superseded
      2026-09-20: the client registered **`glvitr-clean.com`** (Squarespace)
      and the site lives there. See `docs/07-migration-plan.md`.

## Blocking the domain move (2026-10-05)

- [ ] **IONOS access for the old `glvitrclean.com`.** A few DNS records there
      turn the old WordPress site into 301s to the new one — after the two old
      hosts are attached in Vercel, never before. Exact values and order in
      `docs/07-migration-plan.md`, "The old domain". Do **not** touch its MX
      records — they carry `contact@glvitrclean.com`. Until this is done the
      old site keeps showing an unbacked "50% de crédit d'impôt" under the
      client's name (`docs/04`).
- [ ] **Who owns the Squarespace account for `glvitr-clean.com`?** It renews
      on 2027-09-20; the client must hold it (or at least have access) before
      handover — it now carries the site, the mail and Search Console.
- [ ] **Keep `glvitrclean.com` registered.** Paid at IONOS until 2028-02-06.
      Cancelling the IONOS contract deletes it (and the mailbox) early, and a
      lapsed domain with this name and phone-number history can be bought by
      anyone.
- [ ] **Create `contact@glvitr-clean.com`** in the Google Workspace that
      already receives the new domain's mail, send it a test, then forward
      `contact@glvitrclean.com` to it at IONOS for at least 12 months. Only
      then does `company.email` change — one edit.
- [ ] **Search Console domain property for `glvitr-clean.com`** (DNS TXT at
      Squarespace — two `google-site-verification` records already exist, so
      check first), then submit `https://www.glvitr-clean.com/sitemap.xml`.

## Blocking launch

- [ ] Logo file, highest resolution available
- [ ] Photo archive from the client's Drive folder, with permission to publish
- [ ] Facebook and Instagram page URLs
- [ ] RC Pro insurance details for the mentions légales
- [ ] Confirmation the client is registered for facade work (Répertoire des
      Métiers), otherwise remove the facade service entirely
- [ ] Prices or price ranges the client is willing to publish

## Google Business Profile

- [ ] Create the profile as a **service-area business**, not a storefront
- [ ] Primary category: Service de nettoyage de vitres
- [ ] Secondary: Service de nettoyage, Entreprise de nettoyage
- [ ] Service area: the twelve communes
- [ ] Postal verification — **can take a week, start it early**
- [ ] Upload ten photos of real work
- [ ] Set hours, phone, and site URL — `https://www.glvitr-clean.com/`, not
      the old domain
- [ ] Write the description using the same NAP wording as the site

## Reviews

- [ ] Short ask script for the client, to use at the end of every job
- [ ] QR code linking directly to the GBP review form
- [ ] Do **not** add `AggregateRating` schema until real reviews exist

## Directories

- [ ] PagesJaunes listing, NAP identical
- [ ] Facebook page: update address, phone, site link
- [ ] Instagram bio: site link

## Post-launch

- [ ] Search Console verified, sitemap submitted — for `glvitr-clean.com`; and,
      once the old domain 301s, verify `glvitrclean.com` too and run Change of
      Address from it
- [ ] Baseline recorded: indexed count, impressions, brand position
- [ ] Client walkthrough of how to edit content
- [ ] Handover of domain, hosting, repository, and GBP ownership — both domains
- [x] IndexNow — key file and `npm run indexnow`, first submission 2026-10-05
- [x] ~~30-day IONOS retention for rollback~~ — moot: the new site never ran on
      the old domain, so there is nothing to roll back to. The old domain is
      kept as a permanent redirect source instead (above).

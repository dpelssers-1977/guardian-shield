# 🔐 Security Policy

> Bestandslocatie in project: `/guardian-shield/.github/SECURITY.md`

## Ondersteunde versies

| Versie | Ondersteund |
| ------ | ----------- |
| 0.1.x  | ✅ Actief   |

## Een kwetsbaarheid melden

Als je een beveiligingsprobleem vindt in Guardian Shield, meld het dan **niet** als publiek Issue.

### Verantwoordelijke Melding (Responsible Disclosure)

1. **Email:** Stuur een beschrijving naar `security@guardianshield.org`
2. **Encryptie:** Gebruik onze PGP-sleutel (wordt gepubliceerd op de website)
3. **Inhoud:** Beschrijf de kwetsbaarheid, impact, en stappen om te reproduceren
4. **Reactie:** We streven ernaar binnen 48 uur te reageren
5. **Oplossing:** We werken samen aan een fix en crediten je in de release notes (tenzij je anoniem wilt blijven)

### Wat valt hieronder?

- Kwetsbaarheden in de browser extension
- Problemen met de cryptografische ondertekening van updates
- Bypass van phishing/malware detectie die bewust kan worden misbruikt
- Data-lekken in de backend of dashboard
- Kwetsbaarheden in de update-pipeline

### Wat valt hier NIET onder?

- Fout-positieven (valse alarmen) — meld deze als gewoon Issue
- Gemiste detecties (vals negatieven) — meld deze via het Threat Report template
- Feature requests
- Vragen over gebruik

## Beveiligingsarchitectuur

Guardian Shield gebruikt de volgende beveiligingsmaatregelen:

- **Ed25519 cryptografische ondertekening** van alle data-updates
- **SHA-256 hash verificatie** van alle gedownloade bestanden
- **Geen externe data-verzending** tenzij de gebruiker dit expliciet inschakelt
- **Lokale verwerking** — alle analyse gebeurt op het apparaat van de gebruiker
- **Geen tracking, geen analytics** standaard
- **Open-source** — alle code is publiek controleerbaar

## Dankbetuigingen

Wij waarderen beveiligingsonderzoekers die verantwoordelijk kwetsbaarheden melden.
Erkende melders worden hier vermeld (met toestemming):

_Nog geen meldingen._

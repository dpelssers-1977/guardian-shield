# 🤝 Bijdragen aan Guardian Shield

> Bestandslocatie in project: `/guardian-shield/docs/CONTRIBUTING.md`

Bedankt voor je interesse in Guardian Shield! Elke bijdrage — groot of klein — helpt mensen veiliger online te zijn.

---

## Hoe kun je bijdragen?

### 🐛 Bugs melden
1. Controleer of het probleem al gemeld is in [Issues](../../issues)
2. Maak een nieuw issue aan met het **Bug Report** template
3. Beschrijf duidelijk: wat je verwachtte, wat er gebeurde, en stappen om het te reproduceren

### 🌍 Vertalingen
- Vertalingen staan in `/extension/_locales/{taalcode}/messages.json`
- Nieuwe taal toevoegen? Kopieer de `en/` map en vertaal alle strings
- Bestaande vertalingen verbeteren? Dien een PR in met je correcties

### 🏦 Whitelists aanvullen
- Whitelists staan in `/extension/data/whitelist-*.json`
- Voeg ontbrekende banken, overheidsinstanties of diensten toe per land
- Gebruik altijd het **officiële hoofddomein** (niet subpagina's)
- Controleer dubbel dat het domein echt officieel is voordat je het toevoegt

### 🔍 Phishing-patronen melden
- Gebruik het **Threat Report** issue template
- Deel de verdachte URL, email-tekst, of SMS (anonimiseer persoonlijke data)
- Wij voegen het patroon toe aan de detectie-engine

### 💻 Code bijdragen
1. Fork de repository
2. Maak een feature branch: `git checkout -b feature/mijn-feature`
3. Commit je wijzigingen: `git commit -m "Voeg [feature] toe"`
4. Push naar je fork: `git push origin feature/mijn-feature`
5. Open een Pull Request

---

## Code Standaarden

### JavaScript (Extension & Dashboard)
- ES2020+ syntax
- Geen externe dependencies in de extension core (houd het licht)
- JSDoc comments bij publieke functies
- Engelse variabelenamen, Nederlandse comments zijn OK

### Python (Backend)
- Python 3.10+
- Type hints bij alle functie-parameters en return values
- Docstrings (Google style)
- Formattering met `black`, linting met `ruff`

### Algemeen
- Alle bestanden bevatten bovenaan een comment met hun volledige pad in het project
- Commit messages in het Engels of Nederlands, beschrijvend
- Geen gevoelige data (API keys, wachtwoorden) in de code

---

## Pull Request Checklist

- [ ] Code werkt lokaal zonder fouten
- [ ] Bestaande tests slagen nog (`pytest` voor backend, handmatige test voor extension)
- [ ] Nieuwe functionaliteit heeft tests (waar mogelijk)
- [ ] Geen hardcoded API keys of secrets
- [ ] Vertalingen zijn bijgewerkt (als UI is gewijzigd)
- [ ] CHANGELOG.md is bijgewerkt

---

## Gedragscode

- Wees respectvol en constructief
- Geen discriminatie, intimidatie of persoonlijke aanvallen
- Focus op de inhoud, niet op de persoon
- Help beginners — dit project is er ook voor niet-technici

---

## Vragen?

Open een [Discussion](../../discussions) of maak een Issue aan. We helpen graag!

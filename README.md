# 🛡️ Guardian Shield

### Gratis, Open-Source Persoonlijke Beveiligingssuite

> Bestandslocatie in project: `/guardian-shield/README.md`

---

**Guardian Shield** beschermt gewone mensen tegen phishing, malware, scams en online oplichting — zonder betaald abonnement, zonder technische kennis, en met maximaal respect voor privacy. Alles draait lokaal op je eigen computer.

🌍 **Talen:** Nederlands · Français · English · Deutsch

---

## ✨ Wat doet Guardian Shield?

| Bescherming | Hoe |
|---|---|
| 🔗 **Nep-websites detectie** | Herkent namaak-banksites, typosquatting, homoglyph/IDN-aanvallen |
| 📧 **Email phishing scanner** | Scant Gmail & Outlook op verdachte afzenders, links en patronen |
| ⬇️ **Download bescherming** | Blokkeert verdachte bestanden en dubbele extensies (.pdf.exe) |
| 🔒 **Wachtwoord bescherming** | Waarschuwt bij gelekte wachtwoorden (HaveIBeenPwned) |
| 🕵️ **Tracker & cryptominer blokkering** | Blokkeert trackers, fingerprinting en mining-scripts |
| 🛡️ **Malware & keylogger detectie** | Scant processen, bestanden, en geheugen op dreigingen |
| 🌐 **Netwerk monitor** | Detecteert verdachte verbindingen, ARP spoofing, open poorten |
| 🔐 **Ransomware bescherming** | Honeypot-bestanden, massa-encryptie detectie |
| 🤖 **AI-assistent** | Stel vragen over verdachte emails, SMS'jes, telefoontjes (lokaal, geen cloud) |
| 📊 **Security Dashboard** | Overzichtelijk dashboard met beveiligingsscore en rapportage |

---

## 🏗️ Architectuur

```
┌─────────────────────────────────────────────────────────┐
│  LAAG 1: BROWSER EXTENSION (Chrome / Edge / Firefox)    │
│  Real-time bescherming tijdens browsen en email          │
├─────────────────────────────────────────────────────────┤
│  LAAG 2: LOKALE PYTHON SERVICE (achtergrondproces)      │
│  Diepe analyse, scanning, monitoring                    │
├─────────────────────────────────────────────────────────┤
│  LAAG 3: SECURITY DASHBOARD (React Web UI)              │
│  Overzicht, rapportage, instellingen                    │
├─────────────────────────────────────────────────────────┤
│  LAAG 4: THREAT INTELLIGENCE DATABASE                   │
│  Continu bijgewerkte dreigingsinformatie (6-uurlijks)   │
├─────────────────────────────────────────────────────────┤
│  LAAG 5: LOKALE AI-ASSISTENT (optioneel)                │
│  Open-source LLM + RAG — draait 100% lokaal             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Installatie

### Vereisten

- **Browser:** Chrome, Edge, of Firefox (recente versie)
- **Node.js:** v18+ (voor development) — [Download](https://nodejs.org)
- **Python:** 3.10+ (voor backend) — [Download](https://python.org)
- **Ollama** (optioneel, voor AI-assistent) — [Download](https://ollama.com)

### Snelle start

```bash
# 1. Clone de repository
git clone https://github.com/jouw-gebruikersnaam/guardian-shield.git
cd guardian-shield

# 2. Configuratie
cp .env.example .env
# Bewerk .env met je eigen instellingen (optioneel)

# 3. Browser Extension laden
# Open Chrome → chrome://extensions → Developer mode AAN
# Klik "Load unpacked" → selecteer de /extension/ map

# 4. Backend starten (optioneel, voor geavanceerde features)
cd backend
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate          # Windows
pip install -r requirements.txt
python main.py

# 5. Dashboard starten (optioneel)
cd ../dashboard
npm install
npm start
# Opent op http://localhost:3000
```

---

## 📁 Projectstructuur

```
guardian-shield/
├── extension/              # Browser Extension (Chrome/Edge/Firefox)
│   ├── background/         # Service worker & achtergrondlogica
│   ├── content/            # Content scripts (site-analyse, email scan)
│   ├── popup/              # Popup UI (klik op extensie-icoon)
│   ├── options/            # Instellingenpagina
│   ├── alerts/             # Waarschuwingspagina's (phishing, download)
│   ├── icons/              # Extensie-iconen
│   ├── data/               # Whitelists, patronen, homoglyphs (JSON)
│   ├── utils/              # Gedeelde utility functies
│   └── _locales/           # Vertalingen (nl, fr, en, de)
├── backend/                # Python Backend Service
│   ├── api/                # REST API endpoints (FastAPI)
│   ├── scanners/           # Bestandscanner, malware, keylogger detectie
│   ├── network/            # Netwerk monitoring (DNS, poorten, Wi-Fi)
│   ├── system/             # Systeem audit (OS, firewall, encryptie)
│   ├── ransomware/         # Ransomware bescherming (honeypots)
│   ├── threat_db/          # SQLite threat database & sync
│   ├── ai/                 # Ollama + RAG AI-assistent
│   ├── utils/              # Backend utilities
│   ├── data/               # YARA rules, whitelists
│   └── tests/              # Unit tests
├── dashboard/              # React Security Dashboard
│   ├── public/             # Statische bestanden
│   └── src/                # React componenten, services, hooks
├── threat-intel/           # Threat Intelligence Pipeline
│   ├── collectors/         # Data collectors (PhishTank, URLhaus, etc.)
│   ├── processors/         # Verwerking (dedup, validatie, verrijking)
│   ├── publishers/         # Publicatie (GitHub, CDN)
│   └── crypto/             # Ed25519 ondertekening
├── shared/                 # Gedeelde schemas & constanten
│   ├── schemas/            # JSON Schema definities
│   └── constants/          # Gedeelde constanten
├── installer/              # Platform-specifieke installers
├── docs/                   # Documentatie
├── website/                # Landingspagina
└── .github/                # GitHub templates & workflows
```

---

## 🔒 Beveiliging van Updates

Alle data-updates (whitelists, threat database, patronen) worden cryptografisch ondertekend met **Ed25519**. De extension verifieert elke update met een hard-coded publieke sleutel voordat deze wordt toegepast. Bij elke mismatch wordt de update geweigerd en blijft de vorige versie actief.

Zie [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) voor technische details.

---

## 🤝 Bijdragen

We verwelkomen bijdragen! Lees [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) voor richtlijnen.

**Manieren om bij te dragen:**
- 🐛 Bugs melden via [Issues](../../issues)
- 🌍 Vertalingen toevoegen of verbeteren
- 🏦 Whitelists aanvullen met ontbrekende banken/diensten per land
- 🔍 Phishing-patronen melden die niet worden gedetecteerd
- 💻 Code bijdragen (features, bugfixes, tests)

---

## 📋 Roadmap

- [x] Projectstructuur & tooling
- [ ] Browser Extension MVP (website verificatie)
- [ ] Email bescherming (Gmail & Outlook)
- [ ] Download guard & tracker blokkering
- [ ] Wachtwoord bescherming
- [ ] Threat Intelligence Database & Secure Updates
- [ ] Python Backend Service
- [ ] Security Dashboard
- [ ] Lokale AI-Assistent
- [ ] Bonus modules (QR scanner, SMS checker, IoT scanner)
- [ ] Cross-Language Pattern Engine
- [ ] Packaging & Distributie
- [ ] Documentatie & Lancering

Zie [docs/STAPPENPLAN.md](docs/STAPPENPLAN.md) voor het gedetailleerde bouwplan.

---

## 📄 Licentie

[MIT License](LICENSE) — Gratis te gebruiken, aan te passen en te verspreiden.

---

## ⚠️ Disclaimer

Guardian Shield is een aanvullend beveiligingstool en vervangt geen professionele antivirus-software, firewall of security-audit. Het biedt een extra beschermingslaag, specifiek gericht op de meest voorkomende dreigingen voor gewone gebruikers in België, Nederland en de rest van Europa.

---

> **Bescherm jezelf en je naasten. Gratis. Open-source. Privacyvriendelijk.** 🛡️

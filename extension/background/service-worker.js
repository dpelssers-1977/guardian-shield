/**
 * Guardian Shield — Service Worker (Hoofd Achtergrondscript)
 * Bestandslocatie in project: /guardian-shield/extension/background/service-worker.js
 *
 * Dit is het hart van de extension. Het draait op de achtergrond en:
 * - Luistert naar navigatie-events (welke sites bezoekt de gebruiker?)
 * - Coördineert de URL-analyse
 * - Beheert de badge-icoon status (groen/oranje/rood)
 * - Communiceert met content scripts
 * - Beheert alarmen voor periodieke updates
 */

// ============================================================
// Importeer modules (worden later aangemaakt in volgende stappen)
// ============================================================

// import { analyzeURL } from './url-analyzer.js';       // Stap 1.3
// import { syncThreatDB } from './threat-db-sync.js';   // Fase 5

// ============================================================
// Constanten
// ============================================================

const RISK_COLORS = {
  safe:       '#22c55e',  // groen
  suspicious: '#f59e0b',  // oranje
  dangerous:  '#ef4444',  // rood
  critical:   '#dc2626',  // donkerrood
  unknown:    '#6b7280',  // grijs
};

const BADGE_TEXT = {
  safe:       '✓',
  suspicious: '!',
  dangerous:  '✗',
  critical:   '✗',
  unknown:    '?',
};

// ============================================================
// Installatie & Activatie
// ============================================================

/**
 * Wordt uitgevoerd bij eerste installatie of update van de extensie.
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[Guardian Shield] Extension geïnstalleerd/bijgewerkt:', details.reason);

  if (details.reason === 'install') {
    // Eerste installatie — stel standaardinstellingen in
    await initializeDefaultSettings();
    console.log('[Guardian Shield] Standaardinstellingen opgeslagen.');

    // Open welkomstpagina (optioneel, later toe te voegen)
    // chrome.tabs.create({ url: 'options/options.html#welcome' });
  }

  if (details.reason === 'update') {
    console.log('[Guardian Shield] Bijgewerkt van', details.previousVersion, 'naar', chrome.runtime.getManifest().version);
  }
});

/**
 * Service worker wordt geactiveerd.
 */
self.addEventListener('activate', () => {
  console.log('[Guardian Shield] Service worker actief.');
});

// ============================================================
// Standaardinstellingen
// ============================================================

async function initializeDefaultSettings() {
  const defaults = {
    gs_language: 'nl',
    gs_protection: {
      website_verification: true,
      email_scanning: true,
      download_protection: true,
      tracker_blocking: true,
      keylogger_protection: true,
      password_breach_check: true,
      link_hover_preview: true,
      form_protection: true,
    },
    gs_notifications: {
      enabled: true,
      sound: true,
      minimum_severity: 'medium',
    },
    gs_updates: {
      auto_update_whitelists: true,
      auto_update_threat_db: true,
      update_interval_hours: 24,
    },
    gs_privacy: {
      send_anonymous_statistics: false,
      report_phishing_automatically: false,
      local_only_mode: false,
    },
    gs_custom_whitelist: [],
    gs_family_mode: false,
    gs_stats: {
      threats_blocked: 0,
      sites_scanned: 0,
      emails_scanned: 0,
      downloads_checked: 0,
      installed_date: new Date().toISOString(),
    },
  };

  // Sla alleen op wat nog niet bestaat (behoud bestaande instellingen bij update)
  const existing = await chrome.storage.local.get(null);
  const toStore = {};

  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in existing)) {
      toStore[key] = value;
    }
  }

  if (Object.keys(toStore).length > 0) {
    await chrome.storage.local.set(toStore);
  }
}

// ============================================================
// Navigatie Listener — Analyse bij elk paginabezoek
// ============================================================

/**
 * Luistert naar voltooide navigatie-events.
 * Bij elke pagina die de gebruiker bezoekt, wordt de URL geanalyseerd.
 */
chrome.webNavigation.onCompleted.addListener(async (details) => {
  // Alleen hoofdframe (niet iframes, advertenties, etc.)
  if (details.frameId !== 0) return;

  const url = details.url;

  // Sla interne pagina's over
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') ||
      url.startsWith('about:') || url.startsWith('edge://') ||
      url.startsWith('moz-extension://')) {
    return;
  }

  console.log('[Guardian Shield] Navigatie gedetecteerd:', url);

  try {
    // Voorlopige placeholder — wordt vervangen door echte analyse in Stap 1.3
    const result = await performBasicAnalysis(url);
    await updateBadge(details.tabId, result);
    await updateStats('sites_scanned');
  } catch (error) {
    console.error('[Guardian Shield] Analyse fout:', error);
    await updateBadge(details.tabId, { verdict: 'unknown', risk_score: 0 });
  }
});

// ============================================================
// Tijdelijke Basis-Analyse (wordt vervangen in Stap 1.3)
// ============================================================

/**
 * Simpele analyse op basis van protocol-check.
 * Wordt vervangen door de volledige URL Analyzer in Stap 1.3.
 */
async function performBasicAnalysis(url) {
  try {
    const urlObj = new URL(url);

    // HTTP zonder S = verdacht
    if (urlObj.protocol === 'http:') {
      return {
        url: url,
        verdict: 'suspicious',
        risk_score: 30,
        checks: [{ check_name: 'https_check', passed: false, details: 'Site gebruikt geen HTTPS' }],
      };
    }

    // Standaard: onbekend (wordt pas echt geanalyseerd met de URL Analyzer)
    return {
      url: url,
      verdict: 'safe',
      risk_score: 0,
      checks: [{ check_name: 'basic_check', passed: true, details: 'Basiscontrole doorstaan' }],
    };
  } catch (e) {
    return { url: url, verdict: 'unknown', risk_score: 0, checks: [] };
  }
}

// ============================================================
// Badge (Icoon) Bijwerken
// ============================================================

/**
 * Werkt het extensie-icoon bij op basis van het scan-resultaat.
 * Toont een gekleurde badge met een kort symbool.
 */
async function updateBadge(tabId, result) {
  const verdict = result.verdict || 'unknown';
  const color = RISK_COLORS[verdict] || RISK_COLORS.unknown;
  const text = BADGE_TEXT[verdict] || '?';

  try {
    await chrome.action.setBadgeBackgroundColor({ color: color, tabId: tabId });
    await chrome.action.setBadgeText({ text: text, tabId: tabId });
    await chrome.action.setTitle({
      title: `Guardian Shield — ${verdict.charAt(0).toUpperCase() + verdict.slice(1)} (Score: ${result.risk_score})`,
      tabId: tabId,
    });
  } catch (e) {
    // Tab kan gesloten zijn tijdens analyse
    console.warn('[Guardian Shield] Badge update mislukt (tab mogelijk gesloten):', e.message);
  }
}

// ============================================================
// Statistieken Bijwerken
// ============================================================

async function updateStats(field) {
  try {
    const data = await chrome.storage.local.get('gs_stats');
    const stats = data.gs_stats || {};
    stats[field] = (stats[field] || 0) + 1;
    await chrome.storage.local.set({ gs_stats: stats });
  } catch (e) {
    console.warn('[Guardian Shield] Stats update mislukt:', e.message);
  }
}

// ============================================================
// Berichten van Content Scripts & Popup
// ============================================================

/**
 * Centraal berichtenverkeer.
 * Content scripts en popup communiceren via chrome.runtime.sendMessage().
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Guardian Shield] Bericht ontvangen:', message.type);

  switch (message.type) {
    case 'GET_SITE_STATUS':
      // Popup vraagt om status van huidige tab
      handleGetSiteStatus(message, sender, sendResponse);
      return true; // async response

    case 'GET_STATS':
      // Popup vraagt om statistieken
      handleGetStats(sendResponse);
      return true;

    case 'REPORT_PHISHING':
      // Gebruiker meldt phishing
      handleReportPhishing(message, sendResponse);
      return true;

    case 'SCAN_PAGE':
      // Handmatige scan aangevraagd
      handleManualScan(message, sender, sendResponse);
      return true;

    default:
      console.warn('[Guardian Shield] Onbekend berichttype:', message.type);
      sendResponse({ error: 'Onbekend berichttype' });
      return false;
  }
});

async function handleGetSiteStatus(message, sender, sendResponse) {
  try {
    const url = message.url;
    const result = await performBasicAnalysis(url);
    sendResponse({ success: true, result: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetStats(sendResponse) {
  try {
    const data = await chrome.storage.local.get('gs_stats');
    sendResponse({ success: true, stats: data.gs_stats || {} });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleReportPhishing(message, sendResponse) {
  console.log('[Guardian Shield] Phishing gemeld:', message.url);
  // Later: opslaan in lokale database en optioneel doorsturen
  sendResponse({ success: true, message: 'Bedankt voor je melding!' });
}

async function handleManualScan(message, sender, sendResponse) {
  try {
    const result = await performBasicAnalysis(message.url);
    sendResponse({ success: true, result: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// ============================================================
// Alarmen (periodieke taken)
// ============================================================

// Stel alarm in voor periodieke updates (wordt uitgebreid in Fase 5)
chrome.alarms.create('guardian-shield-update-check', {
  delayInMinutes: 5,          // Eerste check na 5 minuten
  periodInMinutes: 60 * 24,   // Daarna dagelijks
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'guardian-shield-update-check') {
    console.log('[Guardian Shield] Periodieke update check...');
    // Later: syncThreatDB() en whitelist updates (Fase 5)
  }
});

// ============================================================
// Startup
// ============================================================

console.log('[Guardian Shield] Service worker geladen. Versie:', chrome.runtime.getManifest().version);

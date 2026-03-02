/**
 * Guardian Shield — Popup Logic (Minimale versie)
 * Bestandslocatie in project: /guardian-shield/extension/popup/popup.js
 * Wordt volledig uitgebreid in Fase 1, Stap 1.6.
 */

const STATUS_CONFIG = {
  safe:       { icon: '✅', text: 'Veilig', class: 'status-safe' },
  suspicious: { icon: '⚠️', text: 'Verdacht — Wees voorzichtig', class: 'status-suspicious' },
  dangerous:  { icon: '🚨', text: 'Gevaarlijk!', class: 'status-dangerous' },
  critical:   { icon: '🚨', text: 'KRITIEK GEVAAR!', class: 'status-dangerous' },
  unknown:    { icon: '🛡️', text: 'Wordt geanalyseerd...', class: 'status-unknown' },
};

document.addEventListener('DOMContentLoaded', async () => {
  // Versie tonen
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = `v${manifest.version}`;

  // Huidige tab ophalen
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url) {
      const url = new URL(tab.url);
      document.getElementById('statusDomain').textContent = url.hostname;

      // Vraag status op bij de service worker
      chrome.runtime.sendMessage(
        { type: 'GET_SITE_STATUS', url: tab.url },
        (response) => {
          if (response && response.success) {
            updateStatus(response.result);
          } else {
            updateStatus({ verdict: 'unknown', risk_score: 0 });
          }
        }
      );
    } else {
      document.getElementById('statusDomain').textContent = 'Interne pagina';
      updateStatus({ verdict: 'safe', risk_score: 0 });
    }
  } catch (error) {
    console.error('[Popup] Fout:', error);
    updateStatus({ verdict: 'unknown', risk_score: 0 });
  }

  // Statistieken ophalen
  chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
    if (response && response.success && response.stats) {
      document.getElementById('sitesScanned').textContent =
        formatNumber(response.stats.sites_scanned || 0);
      document.getElementById('threatsBlocked').textContent =
        formatNumber(response.stats.threats_blocked || 0);
    }
  });
});

function updateStatus(result) {
  const verdict = result.verdict || 'unknown';
  const config = STATUS_CONFIG[verdict] || STATUS_CONFIG.unknown;

  const card = document.getElementById('statusCard');
  // Verwijder oude status-klassen
  card.className = 'status-card ' + config.class;

  document.getElementById('statusIcon').textContent = config.icon;
  document.getElementById('statusText').textContent = config.text;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Guardian Shield — Storage Abstractie Module
 * Bestandslocatie in project: /guardian-shield/extension/utils/storage.js
 *
 * Vereenvoudigt het werken met chrome.storage.local.
 * Alle data wordt lokaal opgeslagen op het apparaat van de gebruiker.
 * Er wordt NIETS naar externe servers gestuurd.
 */

const Storage = {

  // ============================================================
  // Basis Operaties
  // ============================================================

  /**
   * Haal een waarde op uit de lokale opslag.
   * @param {string} key - De sleutel om op te halen
   * @param {*} defaultValue - Standaardwaarde als de sleutel niet bestaat
   * @returns {Promise<*>} De opgeslagen waarde of de standaardwaarde
   */
  async get(key, defaultValue = null) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] !== undefined ? result[key] : defaultValue;
    } catch (error) {
      console.error(`[Storage] Fout bij ophalen '${key}':`, error);
      return defaultValue;
    }
  },

  /**
   * Haal meerdere waarden tegelijk op.
   * @param {string[]} keys - Array van sleutels
   * @returns {Promise<Object>} Object met sleutel-waarde paren
   */
  async getMultiple(keys) {
    try {
      return await chrome.storage.local.get(keys);
    } catch (error) {
      console.error('[Storage] Fout bij ophalen meerdere sleutels:', error);
      return {};
    }
  },

  /**
   * Haal alle opgeslagen data op.
   * @returns {Promise<Object>} Alle opgeslagen data
   */
  async getAll() {
    try {
      return await chrome.storage.local.get(null);
    } catch (error) {
      console.error('[Storage] Fout bij ophalen alle data:', error);
      return {};
    }
  },

  /**
   * Sla een waarde op.
   * @param {string} key - De sleutel
   * @param {*} value - De waarde (wordt automatisch geserialiseerd)
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async set(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return true;
    } catch (error) {
      console.error(`[Storage] Fout bij opslaan '${key}':`, error);
      return false;
    }
  },

  /**
   * Sla meerdere waarden tegelijk op.
   * @param {Object} items - Object met sleutel-waarde paren
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async setMultiple(items) {
    try {
      await chrome.storage.local.set(items);
      return true;
    } catch (error) {
      console.error('[Storage] Fout bij opslaan meerdere items:', error);
      return false;
    }
  },

  /**
   * Verwijder een waarde.
   * @param {string} key - De sleutel om te verwijderen
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async remove(key) {
    try {
      await chrome.storage.local.remove(key);
      return true;
    } catch (error) {
      console.error(`[Storage] Fout bij verwijderen '${key}':`, error);
      return false;
    }
  },

  /**
   * Wis alle opgeslagen data.
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async clear() {
    try {
      await chrome.storage.local.clear();
      return true;
    } catch (error) {
      console.error('[Storage] Fout bij wissen alle data:', error);
      return false;
    }
  },

  // ============================================================
  // Guardian Shield Specifieke Functies
  // ============================================================

  /**
   * Haal een specifieke instelling op.
   * @param {string} settingPath - Pad naar de instelling (bv. 'protection.website_verification')
   * @returns {Promise<*>} De waarde van de instelling
   */
  async getSetting(settingPath) {
    const parts = settingPath.split('.');
    const rootKey = 'gs_' + parts[0];
    const data = await this.get(rootKey, {});

    if (parts.length === 1) return data;

    // Navigeer naar de juiste geneste waarde
    let current = data;
    for (let i = 1; i < parts.length; i++) {
      if (current === null || current === undefined) return null;
      current = current[parts[i]];
    }
    return current;
  },

  /**
   * Sla een specifieke instelling op.
   * @param {string} settingPath - Pad naar de instelling
   * @param {*} value - Nieuwe waarde
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async setSetting(settingPath, value) {
    const parts = settingPath.split('.');
    const rootKey = 'gs_' + parts[0];
    const data = await this.get(rootKey, {});

    if (parts.length === 1) {
      return await this.set(rootKey, value);
    }

    // Navigeer naar de juiste geneste locatie en stel de waarde in
    let current = data;
    for (let i = 1; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;

    return await this.set(rootKey, data);
  },

  /**
   * Haal de gebruikers taalinstelling op.
   * @returns {Promise<string>} Taalcode (nl, fr, en, de)
   */
  async getLanguage() {
    return await this.get('gs_language', 'nl');
  },

  /**
   * Haal de persoonlijke whitelist op.
   * @returns {Promise<string[]>} Array van vertrouwde domeinen
   */
  async getCustomWhitelist() {
    return await this.get('gs_custom_whitelist', []);
  },

  /**
   * Voeg een domein toe aan de persoonlijke whitelist.
   * @param {string} domain - Het domein om toe te voegen
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async addToCustomWhitelist(domain) {
    const whitelist = await this.getCustomWhitelist();
    const normalized = domain.toLowerCase().trim();
    if (!whitelist.includes(normalized)) {
      whitelist.push(normalized);
      return await this.set('gs_custom_whitelist', whitelist);
    }
    return true; // Al in de lijst
  },

  /**
   * Verwijder een domein van de persoonlijke whitelist.
   * @param {string} domain - Het domein om te verwijderen
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async removeFromCustomWhitelist(domain) {
    const whitelist = await this.getCustomWhitelist();
    const normalized = domain.toLowerCase().trim();
    const filtered = whitelist.filter(d => d !== normalized);
    return await this.set('gs_custom_whitelist', filtered);
  },

  /**
   * Werk een statistiek bij (verhoog met 1).
   * @param {string} field - Naam van het statistiekveld
   * @returns {Promise<boolean>} true als het is gelukt
   */
  async incrementStat(field) {
    const stats = await this.get('gs_stats', {});
    stats[field] = (stats[field] || 0) + 1;
    return await this.set('gs_stats', stats);
  },

  /**
   * Haal alle statistieken op.
   * @returns {Promise<Object>} Statistieken object
   */
  async getStats() {
    return await this.get('gs_stats', {
      threats_blocked: 0,
      sites_scanned: 0,
      emails_scanned: 0,
      downloads_checked: 0,
    });
  },

  // ============================================================
  // Opslag Info
  // ============================================================

  /**
   * Controleer hoeveel opslagruimte wordt gebruikt.
   * @returns {Promise<Object>} { bytesUsed, bytesTotal, percentUsed }
   */
  async getStorageInfo() {
    try {
      const bytesUsed = await chrome.storage.local.getBytesInUse(null);
      const bytesTotal = chrome.storage.local.QUOTA_BYTES || 10485760; // 10MB standaard
      return {
        bytesUsed,
        bytesTotal,
        percentUsed: ((bytesUsed / bytesTotal) * 100).toFixed(1),
        megabytesUsed: (bytesUsed / 1048576).toFixed(2),
      };
    } catch (error) {
      console.error('[Storage] Fout bij ophalen opslag-info:', error);
      return { bytesUsed: 0, bytesTotal: 0, percentUsed: '0', megabytesUsed: '0' };
    }
  },
};

// Exporteer voor gebruik in andere modules
// In een non-module context (content scripts), wordt dit globaal beschikbaar
if (typeof globalThis !== 'undefined') {
  globalThis.GuardianStorage = Storage;
}

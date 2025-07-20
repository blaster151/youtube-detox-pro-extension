import { ExtensionMessenger } from './utils/messaging';
import { MessageRequest } from './types';

// DOM elements
const statsContainer = document.getElementById('stats-container') as HTMLElement;
const configForm = document.getElementById('config-form') as HTMLFormElement;
const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
const enabledToggle = document.getElementById('enabled-toggle') as HTMLInputElement;
const showToastToggle = document.getElementById('show-toast-toggle') as HTMLInputElement;
const removeAdsToggle = document.getElementById('remove-ads-toggle') as HTMLInputElement;
const removeSuggestionsToggle = document.getElementById('remove-suggestions-toggle') as HTMLInputElement;
const removeShortsToggle = document.getElementById('remove-shorts-toggle') as HTMLInputElement;
const removeDisguisedShortsToggle = document.getElementById('remove-disguised-shorts-toggle') as HTMLInputElement;

/**
 * Update the stats display
 */
async function updateStats(): Promise<void> {
  try {
    const response = await ExtensionMessenger.sendMessage({ type: 'GET_STATS' });
    if (response.type === 'STATS') {
      const { counters } = response;
      statsContainer.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Ads Removed:</span>
          <span class="stat-value">${counters.ads}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Suggestions Removed:</span>
          <span class="stat-value">${counters.suggestions}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Shorts Shelves Removed:</span>
          <span class="stat-value">${counters.shelfShorts}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Disguised Shorts Removed:</span>
          <span class="stat-value">${counters.disguisedShorts}</span>
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to get stats:', error);
  }
}

/**
 * Load configuration and update form
 */
async function loadConfig(): Promise<void> {
  try {
    const response = await ExtensionMessenger.sendMessage({ type: 'GET_CONFIG' });
    if (response.type === 'CONFIG') {
      const { config } = response;
      enabledToggle.checked = config.enabled;
      showToastToggle.checked = config.showToast;
      removeAdsToggle.checked = config.removeAds;
      removeSuggestionsToggle.checked = config.removeSuggestions;
      removeShortsToggle.checked = config.removeShorts;
      removeDisguisedShortsToggle.checked = config.removeDisguisedShorts;
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

/**
 * Save configuration
 */
async function saveConfig(): Promise<void> {
  try {
    const config = {
      enabled: enabledToggle.checked,
      showToast: showToastToggle.checked,
      toastPosition: 'top-right' as const,
      removeAds: removeAdsToggle.checked,
      removeSuggestions: removeSuggestionsToggle.checked,
      removeShorts: removeShortsToggle.checked,
      removeDisguisedShorts: removeDisguisedShortsToggle.checked
    };

    await ExtensionMessenger.sendMessage({ type: 'UPDATE_CONFIG', config });
    console.log('Configuration saved');
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

/**
 * Reset statistics
 */
async function resetStats(): Promise<void> {
  try {
    await ExtensionMessenger.sendMessage({ type: 'RESET_STATS' });
    await updateStats();
    console.log('Statistics reset');
  } catch (error) {
    console.error('Failed to reset stats:', error);
  }
}

// Event listeners
enabledToggle.addEventListener('change', saveConfig);
showToastToggle.addEventListener('change', saveConfig);
removeAdsToggle.addEventListener('change', saveConfig);
removeSuggestionsToggle.addEventListener('change', saveConfig);
removeShortsToggle.addEventListener('change', saveConfig);
removeDisguisedShortsToggle.addEventListener('change', saveConfig);
resetButton.addEventListener('click', resetStats);

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  await updateStats();
}); 
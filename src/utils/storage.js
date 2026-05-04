/**
 * localStorage Helpers
 * Manage session history and settings persistence
 */

const STORAGE_KEYS = {
  SESSIONS: 'vta_sessions',
  SETTINGS: 'vta_settings'
};

/**
 * Save an analysis session
 * @param {object} session - Session data to save
 */
export function saveSession(session) {
  try {
    const sessions = getSessions();
    sessions.unshift({
      ...session,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 sessions
    const trimmed = sessions.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(trimmed));
    return trimmed;
  } catch (error) {
    console.error('Failed to save session:', error);
    // If quota exceeded, try to clear old sessions
    if (error.name === 'QuotaExceededError') {
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSIONS);
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([{
          ...session,
          id: Date.now().toString(36),
          timestamp: new Date().toISOString()
        }]));
      } catch (retryError) {
        console.error('Failed to save even after cleanup:', retryError);
      }
    }
    return [];
  }
}

/**
 * Get all saved sessions
 * @returns {Array} Array of session objects
 */
export function getSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Delete a session by ID
 * @param {string} id - Session ID to delete
 */
export function deleteSession(id) {
  const sessions = getSessions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  return sessions;
}

/**
 * Clear all sessions
 */
export function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
}

/**
 * Get settings
 */
export function getSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Save settings
 */
export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

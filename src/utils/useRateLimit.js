/**
 * @file useRateLimit.js
 * @description Daily rate-limiting utility for AI features (ATS Checker & Chatbot).
 *
 * Usage:
 *   import { getDailyUsage, incrementDailyUsage, getRemainingUsage } from '../utils/useRateLimit';
 *
 * Keys stored in localStorage:
 *   ait_rate_<feature>_<userId>_<YYYY-MM-DD>  →  { count: number }
 *
 * Resets automatically every new calendar day (date-based key).
 */

/**
 * Returns today's date string in YYYY-MM-DD format (local timezone).
 */
function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Derives a safe user ID from the stored ait-profile.
 * Falls back to 'guest' if not logged in.
 */
function getUserId() {
  try {
    const profile = JSON.parse(localStorage.getItem('ait-profile') || '{}');
    return (profile.uid || profile.regNo || profile.email || 'guest')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .slice(0, 40);
  } catch {
    return 'guest';
  }
}

/**
 * Returns the localStorage key for a given feature and user for today.
 * @param {string} feature - e.g. 'ats', 'chatbot'
 */
function buildKey(feature) {
  return `ait_rate_${feature}_${getUserId()}_${getTodayKey()}`;
}

/**
 * Gets the current usage count for a feature today.
 * @param {string} feature
 * @returns {number}
 */
export function getDailyUsage(feature) {
  try {
    const raw = localStorage.getItem(buildKey(feature));
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return typeof parsed.count === 'number' ? parsed.count : 0;
  } catch {
    return 0;
  }
}

/**
 * Increments the usage count for a feature today by 1.
 * @param {string} feature
 * @returns {number} - new count after increment
 */
export function incrementDailyUsage(feature) {
  try {
    const key = buildKey(feature);
    const current = getDailyUsage(feature);
    const newCount = current + 1;
    localStorage.setItem(key, JSON.stringify({ count: newCount, date: getTodayKey() }));
    return newCount;
  } catch {
    return 0;
  }
}

/**
 * Returns how many uses remain for a feature today.
 * @param {string} feature
 * @param {number} dailyLimit - maximum allowed per day
 * @returns {number} - remaining count (min 0)
 */
export function getRemainingUsage(feature, dailyLimit) {
  return Math.max(0, dailyLimit - getDailyUsage(feature));
}

/**
 * Returns true if the user has NOT exceeded their daily limit.
 * @param {string} feature
 * @param {number} dailyLimit
 * @returns {boolean}
 */
export function isWithinLimit(feature, dailyLimit) {
  return getDailyUsage(feature) < dailyLimit;
}

/**
 * Returns the time string for when the limit resets (midnight tonight).
 * @returns {string} e.g. "11:59 PM"
 */
export function getResetTimeString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

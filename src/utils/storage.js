// utils/storage.js
const STORAGE_KEY = 'soulai_conversations_v1';

export function loadConversations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveConversations(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export function ensureSeed(stubs) {
  const existing = loadConversations();
  if (!existing) {
    saveConversations(stubs);
    return stubs;
  }
  return existing;
}

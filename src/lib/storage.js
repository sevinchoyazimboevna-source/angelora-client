// Clean localStorage abstraction — all persistence routes through here.
const PREFIX = "angelora:";

export const loadState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveState = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable (private mode) — fail silently */
  }
};

export const removeState = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
};
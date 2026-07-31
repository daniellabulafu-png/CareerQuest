const GUEST_KEY = 'guestMode';

export function isGuest() {
  return localStorage.getItem(GUEST_KEY) === 'true';
}

export function setGuest() {
  localStorage.setItem(GUEST_KEY, 'true');
}

export function clearGuest() {
  localStorage.removeItem(GUEST_KEY);
}

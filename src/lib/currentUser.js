import { base44 } from '@/api/base44Client';

// Caches the current authenticated user so entity hooks can filter by
// created_by_id without re-calling base44.auth.me() on every query.
let cachedUser = null;
let pending = null;

export async function getCurrentUser() {
  if (cachedUser) return cachedUser;
  if (pending) return pending;
  pending = base44.auth.me()
    .then((u) => { cachedUser = u; return u; })
    .catch(() => null)
    .finally(() => { pending = null; });
  return pending;
}

export function clearCachedUser() {
  cachedUser = null;
  pending = null;
}
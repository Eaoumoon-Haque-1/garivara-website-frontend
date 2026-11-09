const sessionTokenStorageKey = 'token'

export function getStoredSessionToken() {
  const token = localStorage.getItem(sessionTokenStorageKey)

  if (typeof token !== 'string' || !token.trim()) {
    localStorage.removeItem(sessionTokenStorageKey)
    return null
  }

  return token.trim()
}
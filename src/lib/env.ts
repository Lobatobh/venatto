export function validateEnv(): boolean {
  const required = [
    'DATABASE_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`)
    return false
  }

  return true
}
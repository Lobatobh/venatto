export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
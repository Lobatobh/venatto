import { PrismaClient } from '@prisma/client'
import { validateEnv } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let dbInstance: PrismaClient | null = null

function getDb(): PrismaClient {
  if (!dbInstance) {
    // Validate environment variables only when first accessing db
    if (!validateEnv()) {
      throw new Error('Database environment variables not configured')
    }

    dbInstance = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
      log: ['query'],
    })

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = dbInstance
    }
  }

  return dbInstance
}

// Create a proxy that lazily initializes the db
export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const instance = getDb()
    return (instance as any)[prop]
  }
})
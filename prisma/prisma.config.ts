import { defineConfig } from '@prisma/config'

export default defineConfig({
  migrations: {
    seed: 'node --env-file=.env prisma/seed.js',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
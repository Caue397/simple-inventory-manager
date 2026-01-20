import path from 'node:path'
import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    // Use DIRECT_URL for migrations (direct connection, not pooled)
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})

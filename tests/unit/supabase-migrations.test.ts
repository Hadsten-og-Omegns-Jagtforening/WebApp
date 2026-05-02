import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function readMigrations() {
  const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations')

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .map((file) => fs.readFileSync(path.join(migrationsDir, file), 'utf8'))
    .join('\n')
}

describe('supabase storage migrations', () => {
  it('provisions the news-images bucket used by the admin uploader', () => {
    const sql = readMigrations()

    expect(sql).toContain('storage.buckets')
    expect(sql).toContain("'news-images'")
  })

  it('defines storage object policies for the news-images bucket', () => {
    const sql = readMigrations()

    expect(sql).toContain('storage.objects')
    expect(sql).toContain('bucket_id = \'news-images\'')
  })

  it('provisions reusable news categories', () => {
    const sql = readMigrations()

    expect(sql).toContain('create table public.news_categories')
    expect(sql).toContain('news_categories_lower_name_idx')
    expect(sql).toContain("'Præmieskydning'")
  })
})

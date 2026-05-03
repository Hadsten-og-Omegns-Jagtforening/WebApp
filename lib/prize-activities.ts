import type { PrizeActivity, PrizeActivityInsert } from '@/lib/database.types'
import { isPrizeActivityIcon } from '@/lib/prize-activity-options'
import { generateSlug } from '@/lib/slug'
import { sanitizeBody } from '@/lib/sanitize'

export const FALLBACK_PRIZE_ACTIVITIES: PrizeActivity[] = [
  {
    id: 'fallback-fastelavn',
    slug: 'fastelavnsskydning',
    title: 'Fastelavnsskydning',
    month_label: 'Februar',
    card_description: 'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    body: '<p>Fastelavnsskydningen er en af årets faste traditioner på banen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    icon: 'trophy',
    sort_order: 10,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'fallback-hoj-cup',
    slug: 'hoj-cup',
    title: 'HOJ Cup',
    month_label: 'April-september',
    card_description: 'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    body: '<p>HOJ Cup samler skytter gennem sæsonen. Detaljer, tilmelding og resultater offentliggøres her, når runderne nærmer sig.</p>',
    icon: 'trophy',
    sort_order: 20,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'fallback-skt-hans',
    slug: 'skt-hans-midsommer',
    title: 'Skt. Hans / Midsommer',
    month_label: 'Juni',
    card_description: 'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    body: '<p>Skt. Hans / Midsommer er en hyggelig skydning i sommersæsonen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    icon: 'trophy',
    sort_order: 30,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'fallback-maerkeskydning',
    slug: 'maerkeskydning',
    title: 'Mærkeskydning',
    month_label: 'August',
    card_description: 'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    body: '<p>Mærkeskydning afholdes i løbet af sæsonen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    icon: 'trophy',
    sort_order: 40,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'fallback-80-duer',
    slug: '80-duers-jagtskydning',
    title: '80 duers jagtskydning',
    month_label: 'April',
    card_description: 'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    body: '<p>80 duers jagtskydning er for dig, der vil have en længere skydedag. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    icon: 'claypigeon',
    sort_order: 50,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'fallback-juleskydning',
    slug: 'juleskydning',
    title: 'Juleskydning',
    month_label: 'December',
    card_description: 'Detaljer, tilmelding og resultater offentliggøres i nyheder og kalender, når skydningen nærmer sig.',
    body: '<p>Juleskydningen runder året af på banen. Detaljer, tilmelding og resultater offentliggøres her, når skydningen nærmer sig.</p>',
    icon: 'trophy',
    sort_order: 60,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
]

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function parseSortOrder(value: string) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function parsePrizeActivityForm(formData: FormData): { data?: PrizeActivityInsert; error?: string } {
  const title = getString(formData, 'title')
  const monthLabel = getString(formData, 'month_label')
  const cardDescription = getString(formData, 'card_description')
  const icon = getString(formData, 'icon')
  const body = sanitizeBody(String(formData.get('body') ?? ''))

  if (!title) return { error: 'Skriv en titel.' }
  if (!monthLabel) return { error: 'Skriv måned eller periode.' }
  if (!cardDescription) return { error: 'Skriv en kort beskrivelse.' }
  if (!body) return { error: 'Skriv indhold til detaljesiden.' }
  if (!isPrizeActivityIcon(icon)) return { error: 'Vælg et gyldigt ikon.' }

  return {
    data: {
      slug: generateSlug(title),
      title,
      month_label: monthLabel,
      card_description: cardDescription,
      body,
      icon,
      sort_order: parseSortOrder(getString(formData, 'sort_order')),
      is_active: formData.get('is_active') === 'true',
    },
  }
}

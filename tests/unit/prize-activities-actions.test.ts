import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const revalidatePath = vi.fn()
  const redirect = vi.fn()
  const getUser = vi.fn()
  const single = vi.fn()
  const selectAfterInsert = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select: selectAfterInsert }))
  const eq = vi.fn()
  const update = vi.fn(() => ({ eq }))
  const orderFinal = vi.fn()
  const order = vi.fn(() => ({ order: orderFinal }))
  const eqSelect = vi.fn(() => ({ order }))
  const select = vi.fn(() => ({ eq: eqSelect, order }))
  const from = vi.fn(() => ({ insert, update, select }))
  const createAdminClient = vi.fn(() => ({ from }))
  const createClient = vi.fn(async () => ({ auth: { getUser } }))

  return {
    revalidatePath,
    redirect,
    getUser,
    single,
    insert,
    update,
    eq,
    order,
    orderFinal,
    eqSelect,
    from,
    createAdminClient,
    createClient,
  }
})

vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: mocks.createAdminClient }))
vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }))

import {
  createPrizeActivity,
  listPublicPrizeActivities,
  updatePrizeActivity,
} from '@/lib/actions/prize-activities'

function formData(overrides: Record<string, string> = {}) {
  const fd = new FormData()
  fd.set('title', 'HOJ Cup')
  fd.set('month_label', 'April-september')
  fd.set('card_description', 'Detaljer og tilmelding offentliggøres her.')
  fd.set('body', '<p>Lang beskrivelse</p>')
  fd.set('icon', 'trophy')
  fd.set('sort_order', '20')
  fd.set('is_active', 'true')
  for (const [key, value] of Object.entries(overrides)) fd.set(key, value)
  return fd
}

describe('prize activity actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mocks.single.mockResolvedValue({ data: { id: 'activity-1' }, error: null })
    mocks.eq.mockResolvedValue({ error: null })
    mocks.orderFinal.mockResolvedValue({ data: [], error: null })
  })

  it('creates prize activities with generated slug and sanitized body', async () => {
    await createPrizeActivity(formData({ body: '<script>x</script><p>Ok</p>' }))

    expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
      slug: 'hoj-cup',
      title: 'HOJ Cup',
      icon: 'trophy',
      body: '<p>Ok</p>',
      is_active: true,
      sort_order: 20,
    }))
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/aktiviteter/premieskydninger')
    expect(mocks.redirect).toHaveBeenCalledWith('/admin/premieskydninger/activity-1')
  })

  it('rejects unsupported icons', async () => {
    await expect(createPrizeActivity(formData({ icon: 'bad-icon' }))).resolves.toEqual({
      error: 'Vælg et gyldigt ikon.',
    })
  })

  it('updates existing prize activities', async () => {
    await updatePrizeActivity('activity-1', 'old-slug', formData({ title: 'Ny titel' }))

    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({
      slug: 'ny-titel',
      title: 'Ny titel',
    }))
    expect(mocks.eq).toHaveBeenCalledWith('id', 'activity-1')
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/aktiviteter/premieskydninger/old-slug')
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/aktiviteter/premieskydninger/ny-titel')
  })

  it('lists public activities as active rows sorted by sort_order', async () => {
    await listPublicPrizeActivities()

    expect(mocks.eqSelect).toHaveBeenCalledWith('is_active', true)
    expect(mocks.order).toHaveBeenCalledWith('sort_order', { ascending: true })
  })
})

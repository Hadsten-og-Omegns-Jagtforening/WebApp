import { createAdminClient } from '@/lib/supabase/admin'
import InviteForm from './InviteForm'

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('da-DK', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default async function BrugerePage() {
  const db = createAdminClient()
  let users: Array<{ id: string; email?: string; last_sign_in_at?: string | null; created_at: string }> = []
  let loadError: string | null = null

  try {
    const { data, error } = await db.auth.admin.listUsers()
    if (error) throw new Error(error.message)
    users = data.users
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Ukendt fejl'
    console.error('[admin/brugere] Failed to list users', err)
  }

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard / Brugere</div>
          <h1>Brugere</h1>
          <p className="subtitle">Administrer adgang til admin-panelet.</p>
        </div>
      </div>

      <div className="adm-card" style={{ padding: '20px 24px', marginBottom: 18 }}>
        <h2 className="panel-heading" style={{ marginBottom: 6 }}>Inviter ny bruger</h2>
        <p style={{ fontSize: 14, color: 'var(--fg2)', marginBottom: 16 }}>
          Den inviterede modtager en e-mail med et link til at oprette en adgangskode og få adgang til admin.
        </p>
        <InviteForm />
      </div>

      <div className="adm-card">
        <div className="panel-heading-row">
          <h2>Eksisterende brugere</h2>
          <span style={{ fontSize: 13, color: 'var(--fg3)' }}>{users.length} bruger{users.length !== 1 ? 'e' : ''}</span>
        </div>
        {loadError ? (
          <div className="adm-empty">{loadError}</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Oprettet</th>
                <th>Senest logget ind</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="adm-empty">Ingen brugere endnu</td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td>{user.email ?? '—'}</td>
                  <td className="date-cell">{formatDate(user.created_at)}</td>
                  <td className="date-cell">{formatDate(user.last_sign_in_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

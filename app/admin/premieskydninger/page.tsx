import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'
import { listPrizeActivities } from '@/lib/actions/prize-activities'
import { isPrizeActivityIcon } from '@/lib/prize-activity-options'

export default async function AdminPremieskydningerPage() {
  const { activities, error } = await listPrizeActivities()

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Dashboard / Præmieskydninger</div>
          <h1>Præmieskydninger</h1>
          <p className="subtitle">Rediger aktiviteterne på /aktiviteter/premieskydninger.</p>
        </div>
        <Link href="/admin/premieskydninger/ny" className="btn primary">
          + Ny præmieskydning
        </Link>
      </div>

      {error && (
        <div className="adm-card" role="alert">
          <div className="adm-empty">Kunne ikke hente præmieskydninger fra Supabase. Viser standardindhold. {error}</div>
        </div>
      )}

      <div className="adm-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Ikon</th>
              <th>Titel</th>
              <th>Periode</th>
              <th>Sortering</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr><td colSpan={6} className="adm-empty">Ingen præmieskydninger endnu</td></tr>
            ) : activities.map(activity => {
              const icon = isPrizeActivityIcon(activity.icon) ? activity.icon as IconName : 'trophy'
              return (
                <tr key={activity.id}>
                  <td><span className="icon-wrap compact"><Icon name={icon} size={18} /></span></td>
                  <td className="title-cell">
                    <div className="title">{activity.title}</div>
                    <div className="excerpt">{activity.card_description}</div>
                  </td>
                  <td className="date-cell">{activity.month_label}</td>
                  <td>{activity.sort_order}</td>
                  <td>
                    <span className={`adm-status ${activity.is_active ? 'published' : 'draft'}`}>
                      {activity.is_active ? 'Synlig' : 'Skjult'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link href={`/admin/premieskydninger/${activity.id}`} className="btn ghost icon-only" title="Rediger">
                      <Icon name="pencil" size={15} />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

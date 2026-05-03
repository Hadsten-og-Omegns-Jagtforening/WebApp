import Link from 'next/link'
import { notFound } from 'next/navigation'
import Icon, { type IconName } from '@/components/Icon'
import { getPrizeActivityBySlug } from '@/lib/actions/prize-activities'
import { isPrizeActivityIcon } from '@/lib/prize-activity-options'

type Props = { params: Promise<{ slug: string }> }

export default async function PremieskydningDetailPage({ params }: Props) {
  const { slug } = await params
  const activity = await getPrizeActivityBySlug(slug)
  if (!activity) notFound()

  const icon = isPrizeActivityIcon(activity.icon) ? activity.icon as IconName : 'trophy'

  return (
    <section className="section">
      <article className="container article">
        <div className="meta">AKTIVITETER · {activity.month_label}</div>
        <h1>{activity.title}</h1>
        <div className="info-panel" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div className="icon-wrap" aria-hidden="true">
              <Icon name={icon} size={22} />
            </div>
            <p style={{ margin: 0 }}>{activity.card_description}</p>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: activity.body }} />
        <p style={{ marginTop: 28 }}>
          <Link href="/aktiviteter/premieskydninger" className="btn secondary">Tilbage til præmieskydninger</Link>
        </p>
      </article>
    </section>
  )
}

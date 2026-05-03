import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'
import { listPublicPrizeActivities } from '@/lib/actions/prize-activities'
import { isPrizeActivityIcon } from '@/lib/prize-activity-options'

export default async function PremieskydningerPage() {
  const prizes = await listPublicPrizeActivities()

  return (
    <section className="section">
      <div className="container">
        <div className="page-intro">
          <span className="eyebrow">Aktiviteter</span>
          <h1>Præmieskydninger</h1>
          <p className="lede">
            Gennem året samles vi om en håndfuld faste skydninger - fra fastelavnsskydningen i februar til juleskydningen i december.
            De fleste er åbne for alle, og som medlem er du altid med.
          </p>
        </div>

        <div className="grid-3">
          {prizes.map((prize) => {
            const icon = isPrizeActivityIcon(prize.icon) ? prize.icon as IconName : 'trophy'
            return (
              <Link
                key={prize.id}
                className="tile"
                href={`/aktiviteter/premieskydninger/${prize.slug}`}
                aria-label={prize.title}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div className="icon-wrap"><Icon name={icon} size={22} /></div>
                  <span className="badge">{prize.month_label}</span>
                </div>
                <h2 className="tile-title">{prize.title}</h2>
                <p>{prize.card_description}</p>
                <span className="arrow">Læs mere her</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

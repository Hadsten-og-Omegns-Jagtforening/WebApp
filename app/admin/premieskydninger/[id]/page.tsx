import { notFound } from 'next/navigation'
import PrizeActivityForm from '@/components/admin/PrizeActivityForm'
import {
  getPrizeActivityForAdmin,
  updatePrizeActivity,
} from '@/lib/actions/prize-activities'

type Props = { params: Promise<{ id: string }> }

export default async function EditPrizeActivityPage({ params }: Props) {
  const { id } = await params
  const activity = await getPrizeActivityForAdmin(id)
  if (!activity) notFound()

  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Præmieskydninger / Rediger</div>
          <h1>Rediger præmieskydning</h1>
          <p className="subtitle">Sidst opdateret {new Date(activity.updated_at).toLocaleString('da-DK')}</p>
        </div>
      </div>
      <PrizeActivityForm
        activity={activity}
        onSubmit={async (formData) => {
          'use server'
          return updatePrizeActivity(id, activity.slug, formData)
        }}
      />
    </div>
  )
}

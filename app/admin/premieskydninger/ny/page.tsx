import PrizeActivityForm from '@/components/admin/PrizeActivityForm'
import { createPrizeActivity } from '@/lib/actions/prize-activities'

export default function NewPrizeActivityPage() {
  return (
    <div className="adm-content">
      <div className="adm-page-head">
        <div>
          <div className="adm-breadcrumb">Præmieskydninger / Opret</div>
          <h1>Ny præmieskydning</h1>
        </div>
      </div>
      <PrizeActivityForm onSubmit={createPrizeActivity} />
    </div>
  )
}

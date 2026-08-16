import { getIndustries } from '@/actions/industry-actions'
import { IndustriesManagerClient } from './IndustriesManagerClient'

export const dynamic = 'force-dynamic'

export default async function IndustriesPage() {
  const result = await getIndustries()
  const industries = result.success ? result.industries || [] : []

  return (
    <IndustriesManagerClient initialIndustries={industries} />
  )
}

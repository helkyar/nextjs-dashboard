import { fetchRevenueData } from '@/lib/data'
import { Card } from '@/ui/charts'
import { BarChartWithSwitch } from '@/ui/dashboard/bar-chart-with-switch'
import { lusitana } from '@/ui/fonts'

export async function RevenueChart() {
  const data = await fetchRevenueData()
  return (
    <Card className='w-full md:col-span-4 flex flex-col'>
      <h3 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h3>
      <BarChartWithSwitch data={data} />
    </Card>
  )
}

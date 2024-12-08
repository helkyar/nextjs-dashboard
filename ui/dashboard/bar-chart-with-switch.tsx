'use client'
import { RevenueData } from '@/lib/data'
import { BarChart, Divider, Switch } from '@/ui/charts'
import { useState, useMemo } from 'react'

function valueFormatter(number: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    notation: 'compact',
    compactDisplay: 'short',
    style: 'currency',
    currency: 'USD',
  }).format(number)
}

type PropTypes = {
  data: RevenueData
}

const categoriesCompared = [
  'This year revenue',
  'Last year revenue',
  'This year debt',
  'Last year debt',
]
type Colors = ['blue', 'cyan', 'red', 'pink']
const colorsCompared: Colors = ['blue', 'cyan', 'red', 'pink']

const filterByProperty = (
  categories: string[],
  lastYear: boolean,
  debt: boolean
) => {
  const filteredCategories = categories.filter((_, i) => {
    if (!lastYear && (i === 1 || i === 3)) return false
    if (!debt && i > 1) return false
    return true
  })
  return filteredCategories
}

export function BarChartWithSwitch({ data }: PropTypes) {
  const [showLastYear, setShowLastYear] = useState(false)
  const [showDebt, setShowDebt] = useState(false)

  const categories = useMemo(
    () => filterByProperty(categoriesCompared, showLastYear, showDebt),
    [showLastYear, showDebt]
  )
  const colors = useMemo(
    () => filterByProperty(colorsCompared, showLastYear, showDebt) as Colors,
    [showLastYear, showDebt]
  )

  return (
    <>
      <BarChart
        data={data}
        index='date'
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        yAxisWidth={50}
        className='mt-6 hidden grow-0 sm:block'
      />
      <BarChart
        data={data}
        index='date'
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        showYAxis={false}
        className='mt-4 h-56 sm:hidden'
      />
      <Divider />
      <div className='mb-2 flex gap-3 justify-center'>
        <Switch
          onChange={() => setShowLastYear((ly) => !ly)}
          label=' Toggle last year'
        />
        <Switch
          onChange={() => setShowDebt((d) => !d)}
          label='Toggle debt chart'
        />
      </div>
    </>
  )
}

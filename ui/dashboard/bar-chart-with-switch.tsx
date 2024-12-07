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
  return categories.filter((_, i) => {
    if (!lastYear && (i === 1 || i === 3)) return false
    if (!debt && i > 1) return false
    return true
  })
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
        // onValueChange={(value) => console.log(value)}
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
        <div className='space-x-1 flex items-center'>
          <Switch
            id='comparison'
            onClick={() => setShowLastYear((ly) => !ly)}
          />
          <label
            htmlFor='comparison'
            className='text-tremor-default text-tremor-content dark:text-dark-tremor-content'
          >
            Show last year
          </label>
        </div>
        <div className='space-x-1 flex items-center'>
          <Switch id='debt' onClick={() => setShowDebt((d) => !d)} />
          <label
            htmlFor='debt'
            className='text-tremor-default text-tremor-content dark:text-dark-tremor-content'
          >
            Show debt
          </label>
        </div>
      </div>
    </>
  )
}

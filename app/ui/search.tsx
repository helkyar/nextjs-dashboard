'use client'

import { useParamsFromUrl } from '@/app/lib/params-url'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type PropTypes = {
  placeholder: string
  query: string
}

export default function Search({ placeholder, query }: PropTypes) {
  const { updateUrlParams, currentParam } = useParamsFromUrl(query)

  const handleChange = (value: string) => {
    updateUrlParams({ [query]: value, page: '1' })
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={currentParam}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  )
}

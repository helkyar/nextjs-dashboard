import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

const delay = 300

export function useParamsFromUrl(query: string | string[]) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  let currentParam = ''
  let currentParams: Record<string, string> = {}

  if (!(query instanceof Array)) {
    currentParam = searchParams.get(query) || ''
  } else {
    searchParams.forEach((value, key) => {
      currentParams = { ...currentParams, [key]: value }
    })
  }

  const updateUrlParam = useDebouncedCallback((text: string) => {
    if (query instanceof Array)
      throw new Error(
        'Initialize the hook useParamsFromUrl with a STRING query to use "updateParam" function'
      )

    const allParams = new URLSearchParams(searchParams)

    if (text) allParams.set(query, text)
    else allParams.delete(query)

    replace(`${pathname}?${allParams.toString()}`)
  }, delay)

  const updateUrlParams = useDebouncedCallback(
    (params: Record<string, string>) => {
      const allParams = new URLSearchParams(searchParams)

      for (const param of Object.keys(params)) {
        if (params[param]) allParams.set(param, params[param])
        else allParams.delete(param)
      }

      replace(`${pathname}?${allParams.toString()}`)
    },
    delay
  )

  const createUrl = (text: string | number): string => {
    if (query instanceof Array)
      throw new Error(
        'Initialize the hook useParamsFromUrl with a STRING query to use "updateParam" function'
      )
    const allParams = new URLSearchParams(searchParams)

    if (text) {
      allParams.set(query, text.toString())
    } else allParams.delete(query)

    return `${pathname}?${allParams.toString()}`
  }

  return {
    updateUrlParam,
    updateUrlParams,
    createUrl,
    currentParam,
    currentParams,
  }
}

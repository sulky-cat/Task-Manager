import { useSearchParams } from 'react-router'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const status = searchParams.get('status') ?? ''
  const debouncedQuery = useDebouncedValue(q, 300)
  const query = debouncedQuery.trim()
  const hasQuery = query.length > 0

  function updateParam(key: string, value: string, replace: boolean) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace },
    )
  }

  return {
    q,
    status,
    query,
    hasQuery,
    handleSearchChange: (value: string) => updateParam('q', value, true),
    handleStatusChange: (value: string) => updateParam('status', value, false),
  }
}

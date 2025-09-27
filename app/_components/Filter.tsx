'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'

type CapacityFilter = 'all' | 'small' | 'medium' | 'large'

export default function Filter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const activeFilter = (searchParams.get('capacity') ?? 'all') as CapacityFilter

  function handleFilter(next: CapacityFilter) {
    const params = new URLSearchParams(searchParams)
    params.set('capacity', next)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="border border-primary-800 inline-flex rounded-md overflow-hidden">
      <FilterButton label="All cabins" active={activeFilter === 'all'} onClick={() => handleFilter('all')} />
      <FilterButton label="1—3 guests" active={activeFilter === 'small'} onClick={() => handleFilter('small')} />
      <FilterButton label="4—7 guests" active={activeFilter === 'medium'} onClick={() => handleFilter('medium')} />
      <FilterButton label="8—12 guests" active={activeFilter === 'large'} onClick={() => handleFilter('large')} />
    </div>
  )
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`px-5 py-2 text-sm md:text-base border-l border-primary-800 first:border-l-0 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 ${
        active ? 'bg-primary-700 text-primary-50' : 'bg-primary-900 text-primary-200'
      } cursor-pointer`}
    >
      {label}
    </button>
  )
}

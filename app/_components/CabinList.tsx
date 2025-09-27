import CabinCard, { Cabin } from '@/app/_components/CabinCard'
import { getCabins } from '@/app/_lib/data-service'

type Capacity = 'all' | 'small' | 'medium' | 'large'

export default async function CabinList({ filter }: { filter: { [key: string]: string | string[] | undefined } }) {
  const cabins = await getCabins()

  if (!cabins.length) return null

  const raw = filter?.capacity
  const capacity: Capacity = Array.isArray(raw) ? (raw[0] as Capacity) : ((raw ?? 'all') as Capacity)

  let displayedCabins: Cabin[]
  switch (capacity) {
    case 'small':
      displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3)
      break
    case 'medium':
      displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7)
      break
    case 'large':
      displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8)
      break
    case 'all':
    default:
      displayedCabins = cabins
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins?.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  )
}

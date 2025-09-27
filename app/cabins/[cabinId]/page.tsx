import Cabin from '@/app/_components/Cabin'
import Reservation from '@/app/_components/Reservation'
import Spinner from '@/app/_components/Spinner'
import { getCabin, getCabins } from '@/app/_lib/data-service'
import { Suspense } from 'react'

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ cabinId: string }> }) {
  const { cabinId } = await params
  const cabin = await getCabin(cabinId)
  return {
    title: `Cabin ${cabin.name}`,
    description: `Cabin ${cabin.name} Page`,
  }
}

export async function generateStaticParams() {
  const cabins = await getCabins()
  return cabins.map((cabin: { id: string }) => ({ cabinId: cabin.id.toString() }))
}

export default async function Page({ params }: { params: Promise<{ cabinId: string }> }) {
  const { cabinId } = await params
  const cabin = await getCabin(cabinId)
  const { name } = cabin

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
      </div>
      <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  )
}

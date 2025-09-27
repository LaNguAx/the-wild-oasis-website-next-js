import { auth } from '@/app/_lib/auth'
import { getBookings } from '@/app/_lib/data-service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReservationList from '@/app/_components/ReservationList'

export interface Booking {
  id: string
  guestId: string
  startDate: string
  endDate: string
  numNights: number
  numGuests: number
  totalPrice: number
  status: string
  created_at: string
  cabins: { name: string; image: string }
}

export const metadata = {
  title: 'Reservations',
}

export default async function Page() {
  // CHANGE
  const session = await auth()
  if (!session?.user?.guestId) return notFound()
  const bookings: Booking[] = await getBookings(session.user.guestId)

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">Your reservations</h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{' '}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  )
}

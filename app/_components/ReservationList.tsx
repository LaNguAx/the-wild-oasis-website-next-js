'use client'
import { useOptimistic } from 'react'
import ReservationCard from './ReservationCard'
import { Booking } from '@/app/account/reservations/page'
import { deleteReservation } from '@/app/_lib/actions'

export default function ReservationList({ bookings }: { bookings: Booking[] }) {

  const [optimisticBookings, optimisticDelete] = useOptimistic(bookings, (currentBookings, bookingId) => {
    return currentBookings.filter((booking) => booking.id !== bookingId)
  })

  async function handleDelete(bookingId: string) {
    optimisticDelete(bookingId)
    await deleteReservation(bookingId)
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings?.map((booking: Booking) => (
        <ReservationCard onDelete={handleDelete} booking={booking} key={booking.id} />
      ))}
    </ul>
  )
}

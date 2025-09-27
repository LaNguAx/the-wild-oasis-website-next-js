import { updateReservation } from '@/app/_lib/actions'
import { getBooking, getCabin } from '@/app/_lib/data-service'
import UpdateReservationButton from '@/app/_components/UpdateReservationButton'
import { auth } from '@/app/_lib/auth'

export default async function Page({ params }: { params: Promise<{ reservationId: string }> }) {
  const { reservationId } = await params
  const booking = await getBooking(reservationId)
  const cabin = await getCabin(booking?.cabinId)
  const session = await auth()
  if (session?.user?.guestId !== booking?.guestId) throw new Error('You are not authorized to edit this reservation!')

  const { maxCapacity } = cabin || -1
  const { numGuests: currentNumGuests, observations: currentObservations } = booking || -1

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">Edit Reservation #{reservationId}</h2>

      <form action={updateReservation} className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            defaultValue={currentNumGuests}
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity || 1 }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <input type="hidden" name="bookingId" value={reservationId} />
        <div className="space-y-2">
          <label htmlFor="observations">Anything we should know about your stay?</label>
          <textarea
            name="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            defaultValue={currentObservations}
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <UpdateReservationButton />
        </div>
      </form>
    </div>
  )
}

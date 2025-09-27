import { auth } from '../_lib/auth'
import { getBookedDatesByCabinId, getSettings } from '../_lib/data-service'
import { Cabin } from './CabinCard'
import DateSelector from './DateSelector'
import LoginMessage from './LoginMessage'
import ReservationForm from './ReservationForm'

export default async function Reservation({ cabin }: { cabin: Cabin }) {
  const [settings, bookedDates] = await Promise.all([getSettings(), getBookedDatesByCabinId(cabin.id.toString())])

  const session = await auth()

  return (
    <>
      <DateSelector settings={settings} bookedDates={bookedDates} cabin={cabin} />
      {session?.user ? <ReservationForm cabin={cabin} user={session?.user} /> : <LoginMessage />}
    </>
  )
}

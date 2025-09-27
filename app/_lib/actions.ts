'use server'

import { auth, signIn, signOut } from '@/app/_lib/auth'
import {
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest as updateGuestDataService,
} from '@/app/_lib/data-service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateGuest(formData: FormData) {
  console.log('server action updateGuest', formData)
  const session = await auth()
  if (!session) throw new Error('You must be logged in!')

  const nationalID = formData.get('nationalID')?.toString() ?? ''
  const [nationality = '', countryFlag = ''] = (formData.get('nationality')?.toString() ?? '').split('%')

  if (!/^[A-Za-z0-9]{6,12}$/.test(nationalID))
    throw new Error('National ID must be 6-12 characters long and contain only letters and numbers')

  const updateData = { nationality, countryFlag, nationalID }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guestId = (session as any)?.user?.guestId as string | null
  await updateGuestDataService(guestId ?? '', updateData)
  revalidatePath('/account/profile')
}

export async function signInAction() {
  await signIn('google', {
    redirectTo: '/account',
  })
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/',
  })
}

export async function deleteReservation(bookingId: string) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in!')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guestId = (session as any)?.user?.guestId as string | null
  const guestBooking = await getBookings(guestId ?? '')
  const guestBookingIds = guestBooking.map((booking) => booking.id)
  if (!guestBookingIds.includes(bookingId)) throw new Error('You are not authorized to delete this reservation!')

  await deleteBooking(bookingId)
  revalidatePath('/account/reservations')
}

export async function updateReservation(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in!')
  const bookingId = formData.get('bookingId')?.toString() ?? ''
  const numGuests = formData.get('numGuests')?.toString() ?? ''
  const observations = formData.get('observations')?.toString() ?? ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guestId = (session as any)?.user?.guestId as string | null
  const guestBooking = await getBookings(guestId ?? '')
  const guestBookingIds: number[] = guestBooking.map((booking) => booking.id)
  console.log(guestBookingIds, bookingId)
  if (!guestBookingIds.includes(parseInt(bookingId)))
    throw new Error('You are not authorized to update this reservation!')

  const updateData = { numGuests, observations }

  await updateBooking(bookingId, updateData)
  // revalidatePath(`/account/reservations/edit/${bookingId}`)
  redirect('/account/reservations')
}

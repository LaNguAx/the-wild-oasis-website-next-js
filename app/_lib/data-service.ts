import { eachDayOfInterval } from 'date-fns'
import { supabase } from '@/app/_lib/supabase'
import { notFound } from 'next/navigation'

/////////////
// GET

export async function getCabin(id: string) {
  const { data, error } = await supabase.from('cabins').select('*').eq('id', id).single()

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error)
    notFound()
  }

  return data
}

export async function getCabinPrice(id: string) {
  const { data, error } = await supabase.from('cabins').select('regularPrice, discount').eq('id', id).single()

  if (error) {
    console.error(error)
  }

  return data
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from('cabins')
    .select('id, name, maxCapacity, regularPrice, discount, image')
    .order('name')

  if (error) {
    console.error(error)
    throw new Error('Cabins could not be loaded')
  }

  return data
}

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data } = await supabase.from('guests').select('*').eq('email', email).single()

  // No error here! We handle the possibility of no guest in the sign in callback
  return data
}

export async function getBooking(id: string) {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single()

  if (error) {
    console.error(error)
    throw new Error('Booking could not get loaded')
  }

  return data
}

export async function getBookings(guestId: string) {
  const { data, error } = await supabase
    .from('bookings')
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, status, guestId, cabinId, cabins(name, image)',
    )
    .eq('guestId', guestId)
    .order('startDate')

  if (error) {
    console.error(error)
    throw new Error('Bookings could not get loaded')
  }

  // Ensure nested relation `cabins` is a single object, not an array
  type CabinRef = { name: string; image: string }
  const normalized = (data ?? []).map((booking) => {
    const cabinsField = (booking as { cabins?: CabinRef | CabinRef[] | null }).cabins
    const cabinsObj = Array.isArray(cabinsField) ? cabinsField[0] : cabinsField
    const cabins: CabinRef = cabinsObj ?? { name: '', image: '' }
    return {
      ...booking,
      cabins,
    }
  })

  return normalized
}

export async function getBookedDatesByCabinId(cabinId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayISO = today.toISOString()

  // Get bookings that are in the future or currently active
  const { data, error } = await supabase
    .from('bookings')
    .select('startDate, endDate, status')
    .eq('cabinId', cabinId)
    .or(`endDate.gte.${todayISO},status.eq.checked-in`)

  if (error) {
    console.error(error)
    throw new Error('Bookings could not get loaded')
  }

  // Disable nights from startDate up to but NOT including endDate (checkout is free)
  const bookedDates = data
    .map((booking) => {
      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)

      // Subtract one day so checkout day stays enabled
      const endInclusive = new Date(end)
      endInclusive.setDate(endInclusive.getDate() - 1)

      if (endInclusive < start) return []

      return eachDayOfInterval({ start, end: endInclusive })
    })
    .flat()

  return bookedDates
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single()

  // await new Promise((res) => setTimeout(res, 10000))

  if (error) {
    console.error(error)
    throw new Error('Settings could not be loaded')
  }

  return data
}

export async function getCountries() {
  try {
    const res = await fetch('https://restcountries.com/v2/all?fields=name,flag')
    const countries = await res.json()
    return countries
  } catch {
    throw new Error('Could not fetch countries')
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: Record<string, unknown>) {
  const { data, error } = await supabase.from('guests').insert([newGuest])

  if (error) {
    console.error(error)
    throw new Error('Guest could not be created')
  }

  return data
}

export async function createBooking(newBooking: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('Booking could not be created')
  }

  return data
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: string, updatedFields: Partial<Record<string, unknown>>) {
  const { data, error } = await supabase.from('guests').update(updatedFields).eq('id', id).select().single()

  if (error) {
    console.error(error)
    throw new Error('Guest could not be updated')
  }
  return data
}

export async function updateBooking(id: string, updatedFields: Partial<Record<string, unknown>>) {
  const { data, error } = await supabase.from('bookings').update(updatedFields).eq('id', id).select().single()

  if (error) {
    console.error(error)
    throw new Error('Booking could not be updated')
  }
  return data
}

/////////////
// DELETE

export async function deleteBooking(id: string) {
  const { data, error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be deleted')
  }
  return data
}

import { getBookedDatesByCabinId, getCabin } from '@/app/_lib/data-service'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ cabinId: string }> }) {
  const { cabinId } = await params
  try {
    const [cabin, bookedDates] = await Promise.all([getCabin(cabinId), getBookedDatesByCabinId(cabinId)])

    return NextResponse.json({ cabin, bookedDates })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { message: `Error fetching cabin ${cabinId} ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    )
  }
}

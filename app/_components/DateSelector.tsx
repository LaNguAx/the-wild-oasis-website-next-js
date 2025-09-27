'use client'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { Cabin } from './CabinCard'
import { useReservation } from './ReservationContext'
import { differenceInDays, isBefore, isSameDay, startOfToday } from 'date-fns'

// / (reserved) Helper could be added here in future to validate booked dates

type Settings = {
  minBookingLength: number
  maxBookingLength: number
}

function DateSelector({ settings, bookedDates, cabin }: { settings: Settings; bookedDates: Date[]; cabin: Cabin }) {
  const { range, setRange, resetRange } = useReservation()

  const { regularPrice, discount } = cabin
  const numNights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0
  const cabinPrice = numNights * (regularPrice - discount)

  // SETTINGS

  const { minBookingLength, maxBookingLength } = settings
  console.log(minBookingLength, maxBookingLength)
  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={new Date()}
        endMonth={new Date(new Date().getFullYear() + 5, 11, 31)}
        captionLayout="dropdown"
        numberOfMonths={2}
        showOutsideDays
        fixedWeeks
        selected={range}
        onSelect={setRange}
        disabled={(curDate) =>
          isBefore(curDate, startOfToday()) || bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">${regularPrice}</span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{' '}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button className="border border-primary-800 py-2 px-4 text-sm font-semibold" onClick={() => resetRange()}>
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default DateSelector

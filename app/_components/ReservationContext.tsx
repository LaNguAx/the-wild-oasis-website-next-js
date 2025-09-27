'use client'
import { createContext, use, useState } from 'react'
import { type DateRange } from 'react-day-picker'

export type ReservationContextType = {
  range: DateRange | undefined
  setRange: (range: DateRange | undefined) => void
  resetRange: () => void
}

const initialState: DateRange | undefined = undefined

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange | undefined>(initialState)

  const resetRange = () => setRange(initialState)

  return <ReservationContext.Provider value={{ range, setRange, resetRange }}>{children}</ReservationContext.Provider>
}

function useReservation() {
  const context = use(ReservationContext)
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider')
  }
  return context
}

export { ReservationContext as ReservationContextType, ReservationProvider, useReservation }

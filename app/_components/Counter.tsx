'use client'
import { useState } from 'react'

export default function Counter({ users }: { users: unknown[] }) {
  const [count, setCount] = useState(0)
  console.log(users)
  return (
    <div>
      <h1>Counter</h1>
      <p>There are {users.length} users</p>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

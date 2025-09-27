'use client'
import { useState } from 'react'

function TextExpander({ children }: { children: React.ReactNode | string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const displayText = isExpanded ? (children as string) : (children as string).split(' ').slice(0, 40).join(' ') + '...'

  return (
    <span>
      {displayText}{' '}
      <button
        className="text-primary-700 border-b border-primary-700 leading-3 pb-1 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  )
}

export default TextExpander

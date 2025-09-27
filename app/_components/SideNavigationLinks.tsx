'use client'
import Link from 'next/link'
import {  type SideNavigationLink } from './SideNavigation'
import { usePathname } from 'next/navigation'

export default function SideNavigationLinks({ navigationLinks }: { navigationLinks: SideNavigationLink[] }) {
  const pathName = usePathname()
  return (
    <>
      {navigationLinks.map((link: SideNavigationLink) => (
        <li key={link.name}>
          <Link
            className={`py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 ${
              pathName === link.href ? 'bg-primary-900' : ''
            }`}
            href={link.href}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        </li>
      ))}
    </>
  )
}

import { CalendarDaysIcon, HomeIcon, UserIcon } from '@heroicons/react/24/solid'
import SignOutButton from './SignOutButton'
import SideNavigationLinks from './SideNavigationLinks'

const navLinks = [
  {
    name: 'Home',
    href: '/account',
    icon: <HomeIcon className="h-5 w-5 text-primary-600" />,
  },
  {
    name: 'Reservations',
    href: '/account/reservations',
    icon: <CalendarDaysIcon className="h-5 w-5 text-primary-600" />,
  },
  {
    name: 'Guest profile',
    href: '/account/profile',
    icon: <UserIcon className="h-5 w-5 text-primary-600" />,
  },
]

export type SideNavigationLink = (typeof navLinks)[number]

export default function SideNavigation() {
  return (
    <nav className="border-r border-primary-900">
      <ul className="flex flex-col gap-2 h-full text-lg">
        <SideNavigationLinks navigationLinks={navLinks} />
        <li className="mt-auto">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  )
}

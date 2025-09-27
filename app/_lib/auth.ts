import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { createGuest, getGuest } from './data-service'

const authConfig = {
  providers: [Google],
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  callbacks: {
    authorized: async ({ auth, request }: { auth: unknown; request: Request }) => {
      // @ts-expect-error NextAuth is not typed
      return !!auth?.user
    },
    signIn: async ({ user }: { user: { email: string; name: string } }) => {
      try {
        const guest = await getGuest(user.email!)
        if (!guest) {
          await createGuest({ email: user.email, fullName: user.name })
        }
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    session: async ({ session, token }: { session: unknown; token: unknown }) => {
      const guest = await getGuest(session?.user?.email!)
      session.user.guestId = guest?.id
      return session
    },
  },
}
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig)

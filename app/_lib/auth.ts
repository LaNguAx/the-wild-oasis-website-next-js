import NextAuth, { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

const authConfig: NextAuthConfig = {
  providers: [Google],
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth?.user
    },
    signIn: async ({ user }) => {
      try {
        // Lazy-load to keep middleware (Edge) bundle free of Node-only deps
        const { getGuest, createGuest } = await import('./data-service')

        if (!user?.email || !user?.name) return false

        const guest = await getGuest(user.email)
        if (!guest) await createGuest({ email: user.email, fullName: user.name })
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    session: async ({ session }) => {
      // Lazy-load to avoid importing supabase on the Edge
      const { getGuest } = await import('./data-service')

      const userEmail = session?.user?.email ?? null
      if (!userEmail) return session

      const guest = await getGuest(userEmail)
      // Attach guestId for convenience
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(session as any).user.guestId = guest?.id ?? null
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

import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const authConfig = {
  providers: [Google],
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  callbacks: {
    authorized: async ({ auth }: { auth: unknown }) => {
      // @ts-expect-error NextAuth is not typed
      return !!auth?.user
    },
    signIn: async ({ user }: { user: { email: string; name: string } }) => {
      try {
        // Lazy-load to keep middleware (Edge) bundle free of Node-only deps
        const { getGuest, createGuest } = await import('./data-service')

        if (!user?.email) return false

        const guest = await getGuest(user.email)
        if (!guest) await createGuest({ email: user.email, fullName: user.name })
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    session: async ({ session }: { session: unknown }) => {
      // Lazy-load to avoid importing supabase on the Edge
      const { getGuest } = await import('./data-service')

      const userEmail = (session as any)?.user?.email
      if (!userEmail) return session

      const guest = await getGuest(userEmail)
      if ((session as any)?.user) (session as any).user.guestId = guest?.id
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

import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

type SessionUser = {
  email?: string | null
  guestId?: string | null
}

type SessionShape = {
  user?: SessionUser | null
}

const authConfig = {
  providers: [Google],
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  callbacks: {
    authorized: async ({ auth }: { auth: SessionShape | null }) => {
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
    session: async ({ session }: { session: SessionShape }) => {
      // Lazy-load to avoid importing supabase on the Edge
      const { getGuest } = await import('./data-service')

      const userEmail = session?.user?.email ?? null
      if (!userEmail) return session

      const guest = await getGuest(userEmail)
      if (session?.user) session.user.guestId = guest?.id ?? null
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

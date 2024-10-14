// auth.d.ts
declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    email: string
    avatar: string | null
    githubId?: number | null
    githubUsername?: string | null
    verifiedAt: string | null
  }

  interface UserSession {
  }
}

export {}

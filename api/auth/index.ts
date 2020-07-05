import { guard, object, string } from 'decoders'

export type AuthLink = {
  id: number
  email: string
  token: string
  browser_id: string
  expires_at: string
  created_at: string
}

export const guards = {
  generateLinkPayload: guard(
    object({
      email: string
    })
  ),
  validateLinkPayload: guard(
    object({
      token: string
    })
  )
}

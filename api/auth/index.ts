import { guard, object, string } from 'decoders'

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

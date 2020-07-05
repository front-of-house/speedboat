import createError from 'http-errors'
import { Event } from 'sstack'
import { Guard } from 'decoders'

export function decode<T> (event: Event, guard: Guard<T>) {
  try {
    return guard(event.body)
  } catch (e) {
    throw createError(400, e.message)
  }
}

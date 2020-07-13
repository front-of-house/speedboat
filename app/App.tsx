import React from 'react'
import { Route } from 'react-router-dom'

import { Index } from '@/app/pages/Index'
import { Token } from '@/app/pages/auth/link/Token'
import { Generate } from '@/app/pages/auth/link/Generate'

export function App () {
  return (
    <>
      <Route exact path='/sign-in' component={Generate} />
      <Route exact path='/sign-in/:token' component={Token} />
      <Route exact path='/' component={Index} />
    </>
  )
}

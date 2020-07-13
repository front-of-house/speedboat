import { sstack, GET } from 'sstack'
// @ts-ignore
import helmet from '@sstack/helmet'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router } from 'react-router-dom'

import { document } from '@/app/lib/document'
import { App } from '@/app/App'

export const handler = sstack(
  [
    GET(async event => {
      const ctx = {}
      const body = renderToString(
        <Router location={event.path} context={ctx}>
          <App />
        </Router>
      )

      return {
        statusCode: 200,
        headers: {
          'content-type': 'text/html'
        },
        body: document({
          body
        })
      }
    }),
    helmet()
  ],
  [
    req => {
      req.response = {
        isBase64Encoded: false,
        statusCode: 500,
        headers: {
          'content-type': 'text/html'
        },
        body: renderToString(<h1>500 - Server Error</h1>)
      }
    }
  ]
)

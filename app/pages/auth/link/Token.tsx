import React from 'react'
import { useParams } from 'react-router'

export function Token () {
  const { token } = useParams()
  const [authd, authdSet] = React.useState(false)

  React.useEffect(() => {
    fetch(`/api/v1/auth/validateLink`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ token })
    }).then(res => {
      if (res.ok) {
        authdSet(true)
      }
    })
  }, [])

  return <h1>Signed {authd ? 'in' : 'out'}</h1>
}

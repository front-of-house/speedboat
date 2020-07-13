import React from 'react'

export function Generate () {
  const [sent, sentSet] = React.useState(false)
  const [email, emailSet] = React.useState('')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        fetch(`/api/v1/auth/generateLink`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email
          })
        }).then(res => {
          if (res.ok) {
            sentSet(true)
          }
        })
      }}
    >
      <input
        type='email'
        value={email}
        placeholder='Email'
        onChange={e => {
          emailSet(e.target.value)
        }}
      />
      <button type='submit'>Submit</button>

      {sent && <h1>Sent!</h1>}
    </form>
  )
}

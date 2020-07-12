import sendgrid from '@sendgrid/mail'

const { SENDGRID_API_KEY } = process.env

if (SENDGRID_API_KEY) {
  sendgrid.setApiKey(SENDGRID_API_KEY as string)
}

export function sendAuthLink ({ to, link }: { to: string; link: string }) {
  sendgrid.send({
    to,
    from: 'eric@sure-thing.net',
    subject: `Your signin link to speedboat`,
    text: `Click here to sign in.`,
    html: `Click <a href="${link}">here to sign in.`
  })
}

export function sendLoginNotice ({ to }: { to: string }) {
  sendgrid.send({
    to,
    from: 'eric@sure-thing.net',
    subject: `Your recent login to speedboat`,
    text: `Hey there, just confirming your recent login.`,
    html: `Hey there, just confirming your recent login.`
  })
}

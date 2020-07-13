export function document ({ body }: { body: string }) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>speedboat</title>
  </head>
  <body>
    <div id="root">${body}</div>
    <script src="/static/appClient.js"></script>
  </body>
</html>`
}

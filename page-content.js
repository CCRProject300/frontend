export default function ({ head, html, reduxState }) {
  return `
    <!DOCTYPE html>
    <html ${head.htmlAttributes.toString()}>
      ${headHtml(head)}
      <body>
        <div id="root">${html}</div>
        <script>window.__REDUX_STATE__ = ${reduxState}</script>
        <script src="/bundle.js?v=2"></script>
      </body>
    </html>
  `
}

export function staticPageContent ({ head, html }) {
  return `
    <!DOCTYPE html>
    <html ${head.htmlAttributes.toString()}>
      ${headHtml(head)}
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `
}

function headHtml (head) {
  return `
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${head.title.toString()}
      ${head.meta.toString()}
      ${head.link.toString()}
      ${head.script.toString()}
    </head>
  `
}

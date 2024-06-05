import { renderToString } from 'react-dom/server'

export function generateHTML(components?: any) {
  const html = renderToString(components)

  return html
}

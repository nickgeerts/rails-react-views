import { IncomingMessage } from 'http'
import { parse } from 'querystring'

const FORM_URLENCODED = 'application/x-www-form-urlencoded'

type Params = {
  context?: string
}

async function requestParams(req: IncomingMessage): Promise<Params> {
  if (req.headers['content-type'] !== FORM_URLENCODED) return {}

  return new Promise((resolve) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      resolve(parse(body))
    })
  })
}

export { requestParams }

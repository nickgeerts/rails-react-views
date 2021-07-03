import { exit } from 'process'
import zlib from 'zlib'

import { initConfig } from './config'
import { prerender } from './prerender'
import { PrerenderContext } from '../types'

function decodeText(text: string) {
  const buffer = Buffer.from(text, 'base64')
  return zlib.inflateSync(buffer).toString()
}

function decodeContext(text: string) {
  const json = decodeText(text)
  return JSON.parse(json)
}

function encodeText(text: string) {
  const buffer = zlib.deflateSync(text)
  return buffer.toString('base64')
}

function encodeContext(context: PrerenderContext) {
  const json = JSON.stringify(context)
  return encodeText(json)
}

async function cmd() {
  const encodedContext = process.argv[2]
  if (!encodedContext) {
    console.log('Command argument should be encoded context')
    exit(1)
  }

  const decodedContext = decodeContext(encodedContext)
  const { view, path, props } = decodedContext
  const config = await initConfig(false)
  const html = await prerender({ view, path, props, config })

  const encodedHtml = encodeText(html)
  process.stdout.write(encodedHtml)
  exit(0)
}

export { cmd, decodeContext, encodeContext }

import http, { IncomingMessage, ServerResponse } from 'http'
import cluster from 'cluster'
import os from 'os'

import { InputContext, RailsReactViewsConfig } from '../types'
import { initConfig } from './config'
import { prerender } from './prerender'
import { requestParams } from './request'

function buildHtml(title: string, body: string) {
  return `<!DOCTYPE html><html><html><title>${title}</title><body>${body}</body></html>`
}

function validContext(context: any) {
  return context.view && context.path && context.props
}

async function ping(_req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.write(buildHtml('Ping', 'Ping? Pong!'))
  res.end()
}

function invalidResponse(res: ServerResponse, text: string) {
  res.writeHead(400, { 'Content-Type': 'text/html; charset=UTF-8' })
  res.write(buildHtml('404', text))
  res.end()
}

async function render(req: IncomingMessage, res: ServerResponse, config: RailsReactViewsConfig) {
  const params = await requestParams(req)
  if (!params.context) {
    return invalidResponse(res, 'No prerender context found')
  }

  const context = JSON.parse(params.context) as InputContext
  if (!validContext(context)) {
    return invalidResponse(res, 'Invalid prerender context')
  }

  console.log(`Prerendering '${context.path}'`)
  const html = await prerender({ ...context, config })
  res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' })
  res.write(html)
  res.end()
}

function notFound(_req: IncomingMessage, res: ServerResponse) {
  const text = buildHtml('404', 'Not found')
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write(text)
  res.end()
}

async function start(config: RailsReactViewsConfig, verbose: boolean) {
  const port = config?.port ?? 3030

  if (process.env.NODE_ENV === 'production') {
    console.log(`Rails React Views worker '${process.pid}' started on port ${port}`)
  } else if (verbose) {
    console.log(`🚀 Rails React Views server started on port ${port}`)
  } else {
    console.log('Ready')
  }

  http
    .createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.url === '/ping') {
        return ping(req, res)
      }

      if (req.method === 'POST' && (req.url === '/' || req.url === '/prerender')) {
        return render(req, res, config)
      }

      return notFound(req, res)
    })
    .listen(port)
}

async function server(verbose: boolean = true) {
  const config = await initConfig(verbose && cluster.isMaster)

  if (cluster.isMaster && process.env.NODE_ENV === 'production') {
    const workers = config?.workers ?? os.cpus().length
    console.log(`🚀 React server starting ${workers} workers...`)

    for (let i = 0; i < workers; i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker, _code, _signal) => {
      console.log(`Worker '${worker.process.pid}' died, restarting...`)
      cluster.fork()
    })
  } else {
    start(config, verbose)
  }
}

export { server }

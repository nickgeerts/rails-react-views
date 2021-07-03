import React, { FC } from 'react'
import { renderToString } from 'react-dom/server'

import { Provider } from '../Provider'
import { InputContext, PrerenderContext, PrerenderOutput, RailsReactViewsConfig } from '../types'

type AppProps = {
  view: string
  path: string
  Component: FC
  props: object
}

function buildApp({ view, path, Component, props }: AppProps) {
  return () => (
    <Provider view={view} path={path}>
      <Component {...props} />
    </Provider>
  )
}

function basicPrerender(context: PrerenderContext): PrerenderOutput {
  const { App } = context
  const body = renderToString(<App />)
  return { head: '', body }
}

async function prerender({
  view,
  path,
  props,
  config
}: InputContext & { config: RailsReactViewsConfig }) {
  const jsRoot =
    process.env.NODE_ENV === 'production' ? `${process.cwd()}/.rails-react-views` : process.cwd()
  const Component = (await import(`${jsRoot}/app/javascript/views/${view}`)).default
  const App = buildApp({ view, path, Component, props })

  const context: PrerenderContext = { App, path, view, Component, props }
  const prerender = config?.prerender ?? basicPrerender
  const { head, body }: PrerenderOutput = prerender(context)
  const wrappedHead = head ? `<head>${head}</head>` : ''

  return `<!DOCTYPE html><html>${wrappedHead}<body>${body ?? ''}</body></html>`
}

export { prerender }

import React from 'react'
import { hydrate, render } from 'react-dom'

import { Provider } from './Provider'
import { Transition, Loader } from './types'

function validContext(context: any) {
  return context && context.view && context.path && context.props
}

type Options = {
  transition?: Transition
}

async function hydrateView(loader: Loader, { transition }: Options = {}) {
  const element = document.getElementById('rails-react-view')
  const context = window.__RAILS_REACT_VIEW_CONTEXT__
  if (!element || !validContext(context)) return

  const { view, path, props } = context
  const Page = (await loader(view)).default
  const renderMethod = element.innerHTML.length > 0 ? hydrate : render

  renderMethod(
    <Provider view={view} path={path} transition={transition} loader={loader}>
      <Page {...props} />
    </Provider>,
    element
  )
}

export { hydrateView }

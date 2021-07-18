import React, { createContext, ReactNode, useEffect, useReducer } from 'react'

import { State, Action, reducer, defaultState } from './reducer'
import { Transitioner } from './Transitioner'
import { Loader, Transition, PushOptions } from './types'

type TContext = {
  state: State
  dispatch: (action: Action) => void
  loadPage: (path: string, options: PushOptions) => void
  path: string
  view: string
}

const initialContext: TContext = {
  state: defaultState,
  dispatch: () => {},
  loadPage: () => {},
  path: '',
  view: ''
}

const Context = createContext<TContext>(initialContext)

type Props = {
  children: ReactNode
  view: string
  path: string
  loader?: Loader
  transition?: Transition
}

function Provider({ children, transition, loader, view, path }: Props) {
  const initialState: State = { ...defaultState, path, view }
  const [state, dispatch] = useReducer(reducer, initialState)
  const { Component, props, loading, transitioning, ready } = state

  const context: TContext = {
    state,
    dispatch,
    loadPage,
    path,
    view
  }

  useEffect(() => {
    window.addEventListener('popstate', updatePage)
    return () => window.removeEventListener('popstate', updatePage)
  }, [])

  useEffect(() => {
    dispatch({ type: 'APP_READY' })
  }, [])

  useEffect(() => {
    if (!loading && !transitioning && state.scroll) {
      window.scrollTo({ top: 0 })
    }
  }, [loading, transitioning])

  function updatePage() {
    loadPage(window.location.pathname, { shallow: true, scroll: true })
  }

  async function loadPage(path: string, options: PushOptions = {}) {
    if (!loader) return

    history.pushState({}, '', path)
    if (options.shallow) {
      if (options.scroll) window.scrollTo({ top: 0 })
      return
    }

    if (transition?.duration) {
      dispatch({ type: 'ROUTING_STARTED', path, transitioning: true, scroll: !!options.scroll })
      setTimeout(() => dispatch({ type: 'TRANSITION_ENDED' }), transition?.duration)
    } else {
      dispatch({ type: 'ROUTING_STARTED', path, transitioning: false, scroll: !!options.scroll })
    }

    const context = await loadPageContext(path)
    const { view, props } = context

    const Component = (await loader(view)).default
    dispatch({ type: 'LOADING_ENDED', view, props, Component, path })
  }

  async function loadPageContext(path: string) {
    // Redirect if no JSON found
    const response = await fetch(`${path}.json`, { headers: { Accept: 'application/json' } })
    if (!response.ok) window.location.href = path

    // Redirect if no valid Rails React View context
    const context = await response.json()
    if (!validContext(context)) window.location.href = path

    return context
  }

  function validContext(context: any) {
    return context.__type === 'RailsReactView' && context.props && context.view && context.path
  }

  return (
    <Context.Provider value={context}>
      {Component ? <Component {...props} /> : children}
      {ready && transition?.Component && (
        <Transitioner transition={transition} loading={loading} transitioning={transitioning} />
      )}
    </Context.Provider>
  )
}

export { Context, Provider }

import { FC } from 'react'

declare global {
  interface Window {
    __RAILS_REACT_VIEW_CONTEXT__: { view: string; path: string; props: object }
  }
}

export type InputContext = {
  view: string
  path: string
  props: object
}

export type PrerenderContext = {
  App: FC
  view: string
  path: string
  Component: FC
  props: object
}

export type PrerenderOutput = {
  head?: string
  body?: string
}

export type Transition = {
  Component?: FC<{ className?: string }>
  className?: string
  duration?: number
}

export type PushOptions = {
  shallow?: boolean
  scroll?: boolean
}

export type RailsReactViewsConfig = {
  server: boolean
  port: number
  workers: number
  cmd: boolean
  layout: string
  prerender: null | Prerender
}

export type Prerender = (prerenderContext: PrerenderContext) => PrerenderOutput

export type Loader = (view: string) => Promise<{ default: FC }>

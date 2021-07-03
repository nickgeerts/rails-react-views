import { FC } from 'react'

export type State = {
  path: string
  view: string
  props: object
  loading: boolean
  transitioning: boolean
  nextView: string
  nextComponent: null | FC
  nextProps: object
  Component: null | FC
  ready: boolean
}

export type Action =
  | {
      type: 'APP_READY'
    }
  | {
      type: 'ROUTING_STARTED'
      path: string
      transitioning: boolean
    }
  | {
      type: 'TRANSITION_ENDED'
    }
  | {
      type: 'LOADING_ENDED'
      path: string
      view: string
      props: object
      Component: FC
    }

const defaultState: State = {
  path: '',
  view: '',
  Component: null,
  props: {},
  nextView: '',
  nextComponent: null,
  nextProps: {},
  loading: false,
  transitioning: false,
  ready: false
}

function reducer(state: State = defaultState, action: Action): State {
  switch (action.type) {
    case 'APP_READY':
      return { ...state, ready: true }

    case 'ROUTING_STARTED':
      return { ...state, loading: true, transitioning: action.transitioning, path: action.path }

    case 'TRANSITION_ENDED':
      if (state.loading) {
        return { ...state, transitioning: false }
      }

      // Routing ended:
      return {
        ...state,
        view: state.nextView,
        Component: state.nextComponent,
        props: state.nextProps,
        transitioning: false
      }

    case 'LOADING_ENDED':
      if (action.path !== state.path) return state

      if (state.transitioning) {
        return {
          ...state,
          nextView: action.view,
          nextComponent: action.Component,
          nextProps: action.props,
          loading: false
        }
      }

      // Routing ended:
      return {
        ...state,
        view: action.view,
        Component: action.Component,
        props: action.props,
        nextView: action.view,
        nextComponent: action.Component,
        nextProps: action.props,
        loading: false
      }

    default:
      return state
  }
}

export { defaultState, reducer }

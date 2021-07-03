import React from 'react'
import { Transition } from './types'

type TransitionerProps = {
  loading: boolean
  transitioning: boolean
  transition: Transition
}

function Transitioner({ loading, transitioning, transition }: TransitionerProps) {
  const { Component, className, duration } = transition
  if (!Component) return null

  if (className) {
    if (duration) {
      return <Component className={loading || transitioning ? className : ''} />
    } else {
      return <Component className={loading ? className : ''} />
    }
  }

  if (loading) {
    return <Component />
  }

  return null
}

export { Transitioner }

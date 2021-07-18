import { useContext } from 'react'

import { Context } from './Provider'
import { PushOptions } from './types'

function searchToQuery(search: string) {
  return Object.fromEntries(new URLSearchParams(search))
}

function useRouter() {
  const { state, loadPage } = useContext(Context)
  const { path, loading, transitioning } = state
  const [pathname, rawSearch] = path.split('?')
  const search = rawSearch ?? ''
  const query = searchToQuery(search)

  function push(path: string, options: PushOptions = {}) {
    loadPage(path, options)
  }

  return { pathname, search, query, loading: loading || transitioning, push }
}

export { useRouter }

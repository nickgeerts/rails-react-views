import { useContext } from 'react'
import { Context } from './Provider'

function useRouter() {
  const { state, loadPage } = useContext(Context)
  const { path, loading, transitioning } = state

  function push(path: string) {
    loadPage(path, true)
  }

  return { path, loading: loading || transitioning, push }
}

export { useRouter }

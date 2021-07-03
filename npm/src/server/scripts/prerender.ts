import { initConfig } from '../config'
import { prerender as render } from '../prerender'

async function prerender() {
  const [_node, _command, view, propsJson] = process.argv
  const props = JSON.parse(propsJson)
  const config = await initConfig()
  const output = await render({ path: '', view, props, config })

  console.log(output)
}

prerender()

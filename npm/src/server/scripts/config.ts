import { formatConfig, initConfig } from '../config'

async function config() {
  const config = await initConfig()
  const output = formatConfig(config)

  console.log(JSON.stringify(output))
}

config()

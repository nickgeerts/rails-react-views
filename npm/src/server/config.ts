import os from 'os'

import { RailsReactViewsConfig } from '../types'

const defaultConfig: RailsReactViewsConfig = {
  server: true,
  port: 3030,
  workers: os.cpus().length,
  cmd: true,
  layout: 'application',
  prerender: null
}

function configPath() {
  if (process.env.NODE_ENV === 'production') {
    return `${process.cwd()}/.rails-react-views/rails-react-views.config`
  } else {
    return `${process.cwd()}/rails-react-views.config`
  }
}

async function initConfig(verbose: boolean = false): Promise<RailsReactViewsConfig> {
  let loadedConfig = {}
  try {
    loadedConfig = (await import(configPath())).default
  } catch (error) {
    // Silent import fail
  }

  const config = {
    ...defaultConfig,
    ...loadedConfig
  }

  if (verbose) {
    console.log(loadedConfig ? "Loaded 'react-rails-views.config.js':" : 'Using default config:')
    console.table(formatConfig(config))
  }

  return config
}

function formatConfig(config: RailsReactViewsConfig) {
  return {
    ...config,
    prerender: config.prerender ? 'custom' : 'default'
  }
}

export { defaultConfig, initConfig, formatConfig }

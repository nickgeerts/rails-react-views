#!/usr/bin/env node

import { execSync } from 'child_process'

import { VERSION } from '../version'

function help() {
  console.log(`Rails-react-views v${VERSION} usage\n`)
  console.log('rails-react-views dev                      : start development server')
  console.log('rails-react-views prerender <view> <props> : prerender view for testing')
  console.log('rails-react-views build                    : build production views')
  console.log('rails-react-views start                    : start production server')
  console.log('rails-react-views --version                : show version')
}

function dev() {
  execSync(
    "BABEL_ENV=test node_modules/.bin/babel-node -x '.js,.jsx,.ts,.tsx' node_modules/rails-react-views/dist/cjs/server/scripts/watcher.js",
    {
      stdio: 'inherit'
    }
  )
}

async function prerender(view: string, props: string = '{}') {
  execSync(
    `BABEL_ENV=test node_modules/.bin/babel-node -x '.js,.jsx,.ts,.tsx' node_modules/rails-react-views/dist/cjs/server/scripts/prerender.js '${view}' '${props}'`,
    { stdio: 'inherit' }
  )
}

function build() {
  console.log('Building production rails-react-views server views...')
  execSync(
    "rm -rf .rails-react-views && BABEL_ENV=test node_modules/.bin/babel -x '.js,.jsx,.ts,.tsx' rails-react-views.config.* -d .rails-react-views && BABEL_ENV=test node_modules/.bin/babel -x '.js,.jsx,.ts,.tsx' app/javascript -d .rails-react-views/app/javascript"
  )
}

function start() {
  execSync(
    'NODE_ENV=production node node_modules/rails-react-views/dist/cjs/server/scripts/server.js',
    {
      stdio: 'inherit'
    }
  )
}

function version() {
  console.log(`Rails-react-views v${VERSION}`)
}

async function main() {
  const [_node, _command, argument, view, props] = process.argv

  switch (argument) {
    case 'dev':
      dev()
      break
    case 'prerender':
      await prerender(view, props)
      break
    case 'build':
      build()
      break
    case 'start':
      start()
      break
    case '-v':
    case '--version':
    case 'version':
      version()
      break
    default:
      help()
      break
  }
}

main()

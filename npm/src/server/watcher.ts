import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { spawn } from 'child_process'

type Md5Tree = {
  [key: string]: string
}

const JS_DIR = `${process.cwd()}/app/javascript`
const CMD =
  "BABEL_ENV=test node_modules/.bin/babel-node -x '.js,.jsx,.ts,.tsx' node_modules/rails-react-views/dist/cjs/server/scripts/server.js"

function fileTree(dir: string): string[] {
  const files = fs.readdirSync(dir)

  return files.reduce((result: string[], file) => {
    const fullPath = path.join(dir, file)
    const fileStat = fs.statSync(fullPath)

    if (fileStat.isDirectory()) {
      return result.concat(fileTree(fullPath))
    }

    return result.concat(fullPath)
  }, [])
}

function md5Tree(dir: string): Md5Tree {
  const files = fileTree(dir)

  return files.reduce((result: Md5Tree, file) => {
    result[file] = fileMd5(file)
    return result
  }, {})
}

function fileMd5(file: string): string {
  const content = fs.readFileSync(file, { encoding: 'utf-8' })
  const text = content.toString()

  return crypto.createHash('md5').update(text).digest('hex')
}

function watcher() {
  let child = spawn('sh', ['-c', CMD], { stdio: 'inherit' })

  console.log(`Watching 'app/javascript' for changes...`)
  const md5s = md5Tree(JS_DIR)
  let debounce = false

  fs.watch(JS_DIR, { recursive: true }, (_event, filename) => {
    if (!filename || debounce) return

    debounce = true
    setTimeout(() => (debounce = false), 100)

    const fullPath = path.join(JS_DIR, filename)
    const md5 = fileMd5(fullPath)
    if (md5 !== md5s[fullPath]) {
      md5s[fullPath] = md5
      console.log(`File '${filename}' changed, restarting...`)
      child.kill('SIGINT')
      child.on('exit', () => {
        child = spawn('sh', ['-c', `${CMD} --silent`], { stdio: 'inherit' })
      })
    }
  })
}

export { watcher }

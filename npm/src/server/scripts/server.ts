import { server } from '../server'

const [_command, _script, argument] = process.argv
const verbose = argument !== '--silent'

server(verbose)

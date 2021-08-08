import Debug from 'debug'
const debug = Debug('app:socket')
import route from 'koa-route'
import { GlobalState } from '../state'

export const socket_handler = route.all('/socket', async function (ctx: any) {
  debug('new socket connected')
  GlobalState.instance().add_socket('test',ctx.websocket)
})

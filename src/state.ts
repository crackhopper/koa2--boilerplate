import { Setting} from "./models";
import WebSocket from "ws";

export class GlobalState{
  private constructor(){}
  // 全局唯一实例
  private static _state: GlobalState|null = null  
  static instance():GlobalState {
    if(this._state===null){
      this._state = new GlobalState()
    }
    return this._state
  }

  setting: any
  async async_init(){
    this.setting = await Setting.findOne()
  }
  sockets: Map<string, WebSocket> = new Map<string, WebSocket>([])
  add_socket(key:string, s:WebSocket){
    this.sockets.set(key, s)
  }
  get_socket(key:string){
    return this.sockets.get(key)
  }

  static _loop_interval: number = 1000;
  loop_tick(){
    // do something
  }
  private loop_timer_handler?:NodeJS.Timeout
  start_loop(){
    this.stop_loop()
    this.loop_timer_handler = setInterval(()=>{
      this.loop_tick()
    }, GlobalState._loop_interval)
  }
  stop_loop(){
    if(this.loop_timer_handler!==undefined){
      clearInterval(this.loop_timer_handler)
      this.loop_timer_handler=undefined
    }
  }
}
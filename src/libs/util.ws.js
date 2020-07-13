/*
 * @Date: 2020-06-05 11:29:57
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-09 13:58:05
 * @FilePath: \senseIDC-fe\src\libs\util.ws.js
 */
import { cloneDeep } from 'lodash'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

/**
 * 示例
const ws = new util.WS(
  {
    url: 'http://192.168.2.2:10104/webSocket',
    subscribe:['/topic/capture']
  },
  'sockjs'
)
ws.addEventListener('/topic/capture', () => {
  const msg = JSON.parse(ws.MsgConsume())
  if (msg.targetType === 'target') {
    // audio.play()
    // 语音播报
    const utterThis = new window.SpeechSynthesisUtterance()
    utterThis.text = `${msg.personName}，考勤成功！`
    window.speechSynthesis.speak(utterThis)
    this.push(msg)
  }
})
*/

export default class ws extends EventTarget {
  constructor(info, type) {
    super()
    this.msgQueue = []
    this.closecb = () => { }
    this.info = info
    this.type = type

    if (String(type).toLocaleLowerCase() === 'sockjs') {
      const socket = new SockJS(info.url)
      this.socket = Stomp.over(socket)
      this.connect()
    } else {
      this.socket = new WebSocket(info.url, info.subscribe)
      this.socket.addEventListener('message', this.msgHandle.bind(this))
      this.socket.addEventListener('close', this.reset.bind(this))
      this.socket.addEventListener('error', this.errHandle.bind(this))
    }
  }

  connect() {
    this.socket.connect({},
      (frame) => {
        for (const it of this.info.subscribe) {
          this.socket.subscribe(it, (response) => {
            this.msgHandle({ data: response.body }, it)
          }, (err) => {
            this.errHandle(err)
            this.reset()
          })
        }
      }

    )
  }

  msgHandle(event, e) {
    this.msgQueue.unshift(event.data)

    this.dispatchEvent(new CustomEvent(e))
  }

  MsgConsume() {
    return cloneDeep(this.msgQueue.pop())
  }

  errHandle(err) {
    console.error('WebSocket error observed:', err)
  }

  reset(closeEvent) {
    if (closeEvent === 1000) {
      this.closecb()
      this.closecb = () => { }
      return
    }
    setTimeout(() => {
      if (String(this.type).toLocaleLowerCase() === 'sockjs') {
        this.connect()
      } else {
        this.socket = new WebSocket(this.info.url)
        this.socket.addEventListener('message', this.msgHandle.bind(this))
        this.socket.addEventListener('close', this.reset.bind(this))
        this.socket.addEventListener('error', this.errHandle.bind(this))
      }
    }, 3000)
  }

  GetMsgQueue() {
    return cloneDeep(this.msgQueue)
  }

  Close(cb = () => { }) {
    if (String(this.type).toLocaleLowerCase() === 'sockjs') {
      this.socket.abort()
    } else {
      this.socket.close()
    }
  }

  Send(data, cb = () => { }) {
    this.socket.send(data)
    cb()
  }
}

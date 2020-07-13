/*
 * @Date: 2020-06-05 14:28:15
 * @LastEditors: songlin
 * @LastEditTime: 2020-06-05 16:44:26
 * @FilePath: \d2-admin\test.node.js
 */

const WebSocket = require('ws')

// 引用Server类:
const WebSocketServer = WebSocket.Server

// 实例化:
const ws = new WebSocketServer({
  port: 3000
})
console.log('websocket server is on!')
ws.on('connection', function (ws) {
  console.log('websocket connection!')

  ws.on('message', function (message) {
    console.log(`[SERVER] Received: ${message}`)
    ws.send(`ECHO: ${message}`, (err) => {
      if (err) {
        console.log(`[SERVER] error: ${err}`)
      }
    })
  })

  setInterval(() => {
    const msg = {
      avatar: '',
      personName: Math.random().toString(),
      group: '木工组',
      personWorkerPosition: '木工',
      eventTime: new Date().toLocaleString(),
      event: '入场'
    }
    ws.send(JSON.stringify(msg))
  }, 5000)
})

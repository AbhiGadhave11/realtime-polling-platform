import { WebSocket } from 'ws'
import { Server as HTTPServer } from 'http'

export interface BroadcastMessage {
  type: 'vote' | 'like' | 'new_poll'
  pollId: string
  data: any
}

export class WebSocketServer {
  public wss: any
  private clients: Set<WebSocket> = new Set()

  constructor(server: HTTPServer) {
    this.wss = new WebSocket.Server({ server, path: '/api/ws' })
    this.setupConnection()
  }

  private setupConnection() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected')
      this.clients.add(ws)

      ws.on('close', () => {
        console.log('Client disconnected')
        this.clients.delete(ws)
      })

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error)
      })
    })
  }

  broadcast(message: BroadcastMessage) {
    const data = JSON.stringify(message)
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  getClientCount(): number {
    return this.clients.size
  }
}

let wssInstance: WebSocketServer | null = null

export function initializeWebSocketServer(server: HTTPServer): WebSocketServer {
  if (!wssInstance) {
    wssInstance = new WebSocketServer(server)
    // Store globally so API routes can access it
    ;(global as any).wssInstance = wssInstance
  }
  return wssInstance
}

export function getWebSocketServer(): WebSocketServer | null {
  return wssInstance || ((global as any).wssInstance as WebSocketServer)
}


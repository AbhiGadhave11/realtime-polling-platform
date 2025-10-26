import { useEffect, useRef, useState } from 'react'

interface UseWebSocketReturn {
  connected: boolean
  lastMessage: MessageEvent | null
  sendMessage: (message: any) => void
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [connected, setConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const connect = () => {
      try {
        // Create WebSocket connection
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}${url}`
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          console.log('WebSocket connected')
          setConnected(true)
        }

        ws.onmessage = (event) => {
          setLastMessage(event)
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          setConnected(false)
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setConnected(false)
          
          // Reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, 3000)
        }

        wsRef.current = ws
      } catch (error) {
        console.error('Error creating WebSocket:', error)
        // Retry after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 3000)
      }
    }

    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [url])

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }

  return { connected, lastMessage, sendMessage }
}


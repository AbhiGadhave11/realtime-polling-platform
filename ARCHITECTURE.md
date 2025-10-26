# QuickPoll Architecture Documentation

## System Design Overview

QuickPoll is built as a real-time polling platform with a clean separation between frontend, backend, and data layers.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  React Components │  │  WebSocket Client │  │  HTTP Client │ │
│  │  - PollCard      │──│  useWebSocket    │──│  fetch API   │ │
│  │  - CreateModal   │  │  (Real-time)     │  │  (CRUD)      │ │
│  │  - VoteButton    │  └─────────────────┘  └──────────────┘ │
│  └─────────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Server                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  API Routes     │  │  WebSocket      │                  │
│  │  /api/polls     │  │  Server         │                  │
│  │  /api/vote      │──│  (Broadcast)    │                  │
│  │  /api/like      │  │                 │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                            ↕ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │  users  │  polls  │  poll_options  │  votes  │  likes │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Poll Creation Flow

```
User → Form → POST /api/polls
  ↓
Validates with Zod
  ↓
Prisma creates Poll + Options
  ↓
WebSocket broadcast to all clients
  ↓
All users see new poll instantly
```

### 2. Voting Flow

```
User → Click Option → POST /api/vote
  ↓
Check if user voted (unique constraint)
  ↓
Create vote record
  ↓
Calculate vote stats
  ↓
WebSocket broadcast with updated percentages
  ↓
All clients update UI in real-time
```

### 3. Like Flow

```
User → Click Like → POST /api/like
  ↓
Check existing like
  ↓
Toggle like (create or delete)
  ↓
Calculate total likes
  ↓
WebSocket broadcast updated count
  ↓
All clients update like count
```

## Database Schema (ERD)

```
┌──────────┐
│  User    │
├──────────┤
│ id (PK)  │──┐
│ email    │  │
│ name     │  │
└──────────┘  │
              │
              │ 1:N
              ├──────────────────┐
              │                  │
┌──────────┐  │              ┌──────────┐
│  Poll    │  │              │  Like    │
├──────────┤  │              ├──────────┤
│ id (PK)  │◄─┴──────────────│ pollId   │
│ title    │  N:1            │ userId   │
│ desc     │                 └──────────┘
└──────┬───┘
       │
       │ 1:N
       ├─────────────────┐
       │                 │
┌─────────────┐      ┌──────────┐
│ PollOption  │      │   Vote   │
├─────────────┤      ├──────────┤
│ id (PK)     │      │ id (PK)  │
│ pollId (FK) │◄─────│ optionId │
│ text        │ N:1  │ userId   │
└─────────────┘      └──────────┘
```

## Component Hierarchy

```
app/
└── page.tsx (Main Page)
    ├── PollCard[] (List of polls)
    │   ├── VoteButton[] (For each option)
    │   ├── ProgressBar[] (Show percentages)
    │   ├── LikeButton (Toggle like)
    │   └── Poll metadata
    └── CreatePollModal (Form)
        ├── Title input
        ├── Description textarea
        ├── Option inputs[]
        └── Submit button
```

## API Design

### RESTful Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/polls` | Get all polls | No |
| POST | `/api/polls` | Create poll | No |
| GET | `/api/polls/[id]` | Get specific poll | No |
| POST | `/api/vote` | Cast a vote | No* |
| POST | `/api/like` | Toggle like | No* |

*User ID is optional and stored in localStorage

### WebSocket Messages

**Client → Server:**
- None currently (server pushes only)

**Server → Client:**
```typescript
{
  type: 'vote' | 'like' | 'new_poll',
  pollId: string,
  data: {
    // Vote: { options: [...], totalVotes: number }
    // Like: { totalLikes: number, liked: boolean }
    // New Poll: { poll object }
  }
}
```

## Real-Time Implementation

### WebSocket Server

Located in `lib/websocket.ts`:
- Maintains connection pool
- Broadcasts to all connected clients
- Auto-reconnects on disconnection
- No message queuing (stateless)

### WebSocket Client

Located in `hooks/useWebSocket.ts`:
- Connects on mount
- Auto-reconnects on disconnect
- Handles errors gracefully
- Provides connection status

## Security Considerations

- **No Authentication**: Open to all users (MVP)
- **Duplicate Prevention**: Unique constraints on votes/likes
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection**: Handled by Prisma ORM
- **XSS**: React escapes content by default
- **Rate Limiting**: Not implemented (can add with middleware)

## Performance Optimizations

1. **Database Indexes**: On frequently queried fields (pollId, userId)
2. **Selective Queries**: Only fetch required fields
3. **Connection Pooling**: Managed by Prisma
4. **WebSocket Efficiency**: One connection per client
5. **Optimistic UI**: Instant feedback before server confirmation

## Scalability Considerations

### Current Limitations
- Single server instance (WebSocket doesn't scale horizontally)
- No message queuing
- No database sharding

### Future Improvements
- Use Redis pub/sub for multi-instance WebSocket broadcasting
- Add message queuing (Redis/RabbitMQ)
- Implement caching layer (Redis)
- Add CDN for static assets
- Database read replicas
- Horizontal scaling with stateless API

## Deployment Architecture

```
GitHub → Vercel
          ↓
    Next.js App
          ↓
    PostgreSQL (NeonDB)
    
WebSocket: Single Vercel instance only
(For production multi-instance: Use Upstash Redis)
```


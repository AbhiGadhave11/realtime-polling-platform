# QuickPoll - Visual Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  React Components                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐     │  │
│  │  │ PollCard    │  │ VoteButton  │  │ LikeButton   │     │  │
│  │  │             │  │             │  │              │     │  │
│  │  │ - Display   │  │ - Vote      │  │ - Toggle     │     │  │
│  │  │ - Stats     │  │ - State     │  │ - Count      │     │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘     │  │
│  │                                                             │  │
│  │  ┌─────────────┐  ┌─────────────┐                       │  │
│  │  │ CreateModal │  │ ProgressBar │                       │  │
│  │  │             │  │             │                       │  │
│  │  │ - Form      │  │ - Percentage│                       │  │
│  │  │ - Validate  │  │ - Animation│                       │  │
│  │  └─────────────┘  └─────────────┘                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↕ HTTP + WS                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Communication Layer                     │  │
│  │  ┌──────────────────┐      ┌──────────────────┐        │  │
│  │  │  WebSocket Hook  │      │   HTTP Client    │        │  │
│  │  │                  │      │                  │        │  │
│  │  │ - Connect        │      │ - GET /api/polls │        │  │
│  │  │ - Auto-reconnect │      │ - POST /api/vote │        │  │
│  │  │ - Listen events  │      │ - POST /api/like │        │  │
│  │  └──────────────────┘      └──────────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 ↕
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js Custom Server (server.ts)            │  │
│  │                                                            │  │
│  │  ┌──────────────────┐      ┌──────────────────┐          │  │
│  │  │  HTTP Handler    │      │  WebSocket Server│          │  │
│  │  │                  │      │                  │          │  │
│  │  │ - Next.js pages  │      │ - Connection mgmt│          │  │
│  │  │ - API routes     │      │ - Broadcast     │          │  │
│  │  │ - Middleware     │      │ - Reconnection   │          │  │
│  │  └──────────────────┘      └──────────────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      API Routes                            │  │
│  │                                                            │  │
│  │  GET  /api/polls      → Get all polls                     │  │
│  │  POST /api/polls      → Create poll                       │  │
│  │  GET  /api/polls/:id  → Get specific poll                 │  │
│  │  POST /api/vote       → Cast a vote                       │  │
│  │  POST /api/like       → Toggle like                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Business Logic                         │  │
│  │                                                            │  │
│  │  - Input validation (Zod)                                │  │
│  │  - Vote statistics calculation                            │  │
│  │  - Like counting                                           │  │
│  │  - Broadcast message creation                             │  │
│  │  - Error handling                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↕ Prisma ORM                          │
└─────────────────────────────────────────────────────────────────┘
                                 ↕
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                              │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                   │  │
│  │  PostgreSQL DB   │  │   Prisma Client  │                   │  │
│  │                  │  │                  │                   │  │
│  │  Tables:         │  │  - Type-safe     │                   │  │
│  │  - users         │  │  - Query builder │                   │  │
│  │  - polls         │  │  - Migrations    │                   │  │
│  │  - poll_options  │  │  - Studio        │                   │  │
│  │  - votes         │  │                  │                   │  │
│  │  - likes         │  │                  │                   │  │
│  └──────────────────┘  └──────────────────┘                   │  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Poll Creation Flow

```
User fills form → Click "Create"
    ↓
Validate inputs (Zod)
    ↓
Create poll in DB (Prisma)
    ↓
Create poll options
    ↓
Broadcast to all clients (WebSocket)
    ↓
All users see new poll instantly
```

### Voting Flow

```
User clicks option → POST /api/vote
    ↓
Check if already voted
    ↓
If new → Create vote record
    ↓
Fetch poll with all votes
    ↓
Calculate percentages
    ↓
Update option vote counts
    ↓
Broadcast update (WebSocket)
    ↓
All clients update UI (percentages, leader)
```

### Real-Time Update Flow

```
Action occurs (vote/like/new poll)
    ↓
Server updates database
    ↓
Server creates broadcast message
    ↓
WebSocket server sends to all clients
    ↓
Each client's WebSocket hook receives
    ↓
State updates in React
    ↓
UI re-renders with new data
```

## Component Hierarchy

```
Page (app/page.tsx)
│
├── Header
│   └── Connection Status
│
├── Create Poll Button
│   └── CreatePollModal
│       ├── Title Input
│       ├── Description Textarea
│       ├── Option Inputs (2-10)
│       └── Submit Button
│
└── Poll List
    └── PollCard (for each poll)
        ├── LikeButton
        │   └── Heart Icon + Count
        ├── Title + Description
        ├── Options (VoteButton array)
        │   └── ProgressBar
        └── Footer (vote count, date)
```

## Database Schema

```
┌─────────────────────────────────────────────┐
│                   DATABASE                   │
└─────────────────────────────────────────────┘

┌──────────────────┐
│      User        │
├──────────────────┤
│ id (PK)          │────┐
│ email (Unique)   │    │
│ name              │    │
│ createdAt         │    │
│ updatedAt         │    │
└──────────────────┘    │
                        │ 1:N
                        │
                        ├──────────────────────┐
                        │                      │
                        │                      │
┌──────────────────┐   │   ┌───────────────┐ │
│      Poll        │   │   │     Like      │ │
├──────────────────┤   │   ├───────────────┤ │
│ id (PK)          │◄──┴───┤ pollId (FK)   │ │
│ title            │ N:1   │ userId (FK)    │◄┘
│ description      │       │ createdAt      │
│ createdAt        │       └───────────────┘
│ updatedAt        │
└────────┬─────────┘
         │ 1:N
         │
         ├──────────────────┐
         │                  │
┌──────────────┐      ┌─────────────┐
│ PollOption   │      │    Vote     │
├──────────────┤      ├─────────────┤
│ id (PK)      │      │ id (PK)     │
│ pollId (FK)  │◄─────│ optionId    │
│ text         │ N:1  │ pollId (FK) │
│ votes        │      │ userId (FK) │
└──────────────┘      │ createdAt   │
                      └─────────────┘
```

## Sequence Diagrams

### Create and Vote on Poll

```
User A          User B          Server           Database
  │              │               │                 │
  │──POST /polls──┼───────────────▶                 │
  │              │               │                 │
  │              │              │─Create poll─────▶│
  │              │              │◄─Poll created───│
  │              │              │                 │
  │◄──New poll────────────────┼─◄                │
  │◄─Broadcast WS─────────────┼──────────────────┼─┘
  │              │             │                 │
  │              │◄─New poll───┼─────────────────┘
  │              │             │                 │
  │              │─POST /vote──▶                 │
  │              │             │                 │
  │              │             │─Create vote─────▶│
  │              │             │◄─Vote created───│
  │              │             │                 │
  │              │◄─Updated stats───────────────┼─┐
  │◄─Broadcast WS─────────────┼─────────────────┼─┤
  │              │◄─Updated stats───────────────┼─┘
  │              │             │                 │
```

## Technology Stack

```
┌────────────────────────────────────────────────────┐
│                    QuickPoll                       │
└────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────────────┐ ┌──────────────┐ ┌───────────────┐
│   Frontend    │ │   Backend    │ │   Database    │
├───────────────┤ ├──────────────┤ ├───────────────┤
│ Next.js 15    │ │ Next.js API │ │ PostgreSQL    │
│ React 18      │ │ Express      │ │ (NeonDB)      │
│ TypeScript    │ │ WebSocket    │ │               │
│ TailwindCSS   │ │ Prisma ORM   │ │               │
│               │ │ Zod          │ │               │
└───────────────┘ └──────────────┘ └───────────────┘
```

## File Structure Tree

```
quickpoll/
├── app/
│   ├── api/
│   │   ├── polls/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── vote/
│   │   │   └── route.ts
│   │   └── like/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── PollCard.tsx
│   ├── VoteButton.tsx
│   ├── LikeButton.tsx
│   ├── ProgressBar.tsx
│   └── CreatePollModal.tsx
├── hooks/
│   └── useWebSocket.ts
├── lib/
│   ├── prisma.ts
│   └── websocket.ts
├── prisma/
│   └── schema.prisma
├── types/
│   └── poll.ts
├── server.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```


# 🚀 QuickPoll – Real-Time Opinion Polling Platform

A modern, real-time opinion polling platform built with Next.js 15, TypeScript, and WebSockets. Users can create polls, vote, like, and see instant live updates across all connected clients.

![QuickPoll](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2d3748?style=flat-square&logo=prisma)
![WebSocket](https://img.shields.io/badge/WebSocket-8.16-010101?style=flat-square&logo=socket.io)

## ✨ Features

- 📊 **Poll Creation**: Create polls with multiple options, titles, and descriptions
- ✅ **Voting System**: One vote per user per poll with real-time vote count updates
- ❤️ **Like System**: Like polls with instant live updates
- 🔄 **Real-Time Updates**: WebSocket-powered live synchronization across all clients
- 📱 **Responsive Design**: Beautiful, mobile-friendly UI with TailwindCSS
- 🎨 **Modern UI/UX**: Smooth animations and visual feedback
- 🏆 **Leader Indicators**: See which option is winning in real-time
- ⚡ **Fast Performance**: Server-side rendering with optimized API routes

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Next.js 15    │ ← Frontend (React + TypeScript)
│    Frontend     │ ← WebSocket Client
└────────┬────────┘
         │ HTTP + WebSocket
         ↓
┌─────────────────┐
│  Next.js API    │ ← API Routes (REST)
│    Routes       │ ← WebSocket Server
└────────┬────────┘
         │ Prisma ORM
         ↓
┌─────────────────┐
│  PostgreSQL     │ ← Database (via NeonDB)
│   Database      │
└─────────────────┘
```

### Component Architecture

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Main page (poll list)
├── api/
│   ├── polls/
│   │   ├── route.ts     # GET, POST polls
│   │   └── [id]/route.ts # GET specific poll
│   ├── vote/route.ts    # POST vote
│   └── like/route.ts    # POST like
└── globals.css

components/
├── PollCard.tsx         # Individual poll display
├── VoteButton.tsx       # Voting button component
├── LikeButton.tsx       # Like button component
├── ProgressBar.tsx      # Vote percentage bar
└── CreatePollModal.tsx  # Create poll form

lib/
├── prisma.ts            # Prisma client
└── websocket.ts         # WebSocket server logic

hooks/
└── useWebSocket.ts      # WebSocket client hook

types/
└── poll.ts              # TypeScript interfaces
```

### Database Schema

```
users
├── id (String, PK)
├── name (String?)
├── email (String?, Unique)
├── createdAt (DateTime)
└── updatedAt (DateTime)

polls
├── id (String, PK)
├── title (String)
├── description (String?)
├── createdAt (DateTime)
├── updatedAt (DateTime)
└── relations: options, votes, likes

poll_options
├── id (String, PK)
├── pollId (String, FK → polls)
├── text (String)
├── votes (Int, default: 0)
└── index: pollId

votes
├── id (String, PK)
├── pollId (String, FK → polls)
├── optionId (String, FK → poll_options)
├── userId (String?, FK → users)
├── createdAt (DateTime)
├── unique: (pollId, userId)
└── indexes: pollId

likes
├── id (String, PK)
├── pollId (String, FK → polls)
├── userId (String?, FK → users)
├── createdAt (DateTime)
├── unique: (pollId, userId)
└── indexes: pollId
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or NeonDB account)
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
cd voting-project
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your database URL:

```env
DATABASE_URL="postgresql://username:password@host:5432/quickpoll?schema=public"
```

For NeonDB:
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string and paste it in your `.env` file

4. **Set up the database**

```bash
npx prisma db push
```

This will create the database schema based on your Prisma schema.

5. **Generate Prisma Client**

```bash
npm run db:generate
```

### Running the Development Server

The project includes a custom server (`server.ts`) that integrates WebSocket support with Next.js. Run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

To run with the custom WebSocket server:

```bash
# For custom WebSocket server (recommended)
node server.ts

# Or use ts-node
npx ts-node server.ts
```

## 🎯 Usage

### Creating a Poll

1. Click the **"+ Create New Poll"** button
2. Enter a poll title (required)
3. Optionally add a description
4. Add at least 2 options (up to 10)
5. Click **"Create Poll"**

### Voting

1. Click on any option to vote
2. See real-time vote counts and percentages
3. Your vote is highlighted
4. The leading option is marked with a trophy icon 🏆

### Liking Polls

1. Click the heart icon to like/unlike a poll
2. See the total like count update in real-time

### Real-Time Updates

- All connected users see instant updates when someone votes or likes
- Vote percentages update automatically
- Leader indicators change dynamically
- Connection status is shown in the header

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 3.4
- **Database**: PostgreSQL (via NeonDB)
- **ORM**: Prisma 5.7
- **Real-Time**: WebSocket (ws library)
- **Validation**: Zod
- **ID Generation**: nanoid

## 📦 Project Structure

```
quickpoll/
├── app/
│   ├── api/              # API routes
│   │   ├── polls/
│   │   ├── vote/
│   │   └── like/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── PollCard.tsx
│   ├── VoteButton.tsx
│   ├── LikeButton.tsx
│   ├── ProgressBar.tsx
│   └── CreatePollModal.tsx
├── hooks/                # Custom hooks
│   └── useWebSocket.ts
├── lib/                  # Utilities
│   ├── prisma.ts
│   └── websocket.ts
├── prisma/
│   └── schema.prisma     # Database schema
├── types/                # TypeScript types
│   └── poll.ts
├── server.ts             # Custom server with WebSocket
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔧 API Endpoints

### GET `/api/polls`

Get all polls with options, vote counts, and like counts.

**Response:**
```json
{
  "polls": [
    {
      "id": "clx...",
      "title": "What's your favorite language?",
      "options": [
        {
          "id": "clx...",
          "text": "TypeScript",
          "votes": 45,
          "percentage": 45.0
        }
      ],
      "totalVotes": 100,
      "totalLikes": 23
    }
  ]
}
```

### POST `/api/polls`

Create a new poll.

**Request Body:**
```json
{
  "title": "What's your favorite language?",
  "description": "Optional description",
  "options": ["TypeScript", "JavaScript", "Python"]
}
```

### POST `/api/vote`

Cast a vote.

**Request Body:**
```json
{
  "pollId": "clx...",
  "optionId": "clx...",
  "userId": "userId..."
}
```

### POST `/api/like`

Like or unlike a poll.

**Request Body:**
```json
{
  "pollId": "clx...",
  "userId": "userId..."
}
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**
   - Import your GitHub repository on [vercel.com](https://vercel.com)
   - Add your `DATABASE_URL` environment variable
   - Deploy!

3. **Update WebSocket URL** (if needed)
   - For production, update the WebSocket connection in `hooks/useWebSocket.ts`
   - Use `wss://` for secure connections

### Environment Variables for Production

- `DATABASE_URL`: Your NeonDB PostgreSQL connection string
- `PORT`: Server port (optional, default: 3000)
- `HOSTNAME`: Server hostname (optional)

## 🧪 Testing

```bash
# Run Prisma Studio to view database
npm run db:studio

# Check database schema
npx prisma db pull
```

## 📝 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on the GitHub repository.

---

**Built with ❤️ using Next.js, TypeScript, and WebSockets**


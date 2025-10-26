# QuickPoll - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (NeonDB recommended)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Get a free PostgreSQL database from [NeonDB](https://neon.tech):

1. Sign up at neon.tech
2. Create a new project
3. Copy the connection string

Create a `.env` file in the root directory:

```bash
cat > .env << EOF
DATABASE_URL="your-connection-string-from-neon"
PORT=3000
HOSTNAME=localhost
EOF
```

### 3. Initialize Database

```bash
npx prisma db push
npx prisma generate
```

### 4. Start the Server

For full WebSocket support:

```bash
npm run dev:ws
```

Or for basic functionality:

```bash
npm run dev
```

### 5. Open Browser

Navigate to: `http://localhost:3000`

## Usage

1. **Create a Poll**: Click "Create New Poll"
2. **Add Options**: Enter at least 2 options
3. **Submit**: Click "Create Poll"
4. **Vote**: Click on any option
5. **Like**: Click the heart icon
6. **Watch**: See real-time updates across all browsers

## Troubleshooting

### Port Already in Use

Change the port:
```bash
PORT=3001 npm run dev:ws
```

### Database Connection Error

Check your `.env` file and ensure DATABASE_URL is correct.

### WebSocket Not Working

Make sure you're using `npm run dev:ws` not `npm run dev`.

## Next Steps

- Read the full [README.md](./README.md)
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- See [SETUP.md](./SETUP.md) for detailed setup

Enjoy QuickPoll! 🚀


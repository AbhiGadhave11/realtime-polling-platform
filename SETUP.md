# QuickPoll Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quickpoll?schema=public"

# Server Configuration (optional)
HOSTNAME=localhost
PORT=3000
```

### Getting a Database URL

#### Option 1: NeonDB (Recommended for quick setup)

1. Sign up for free at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it in your `.env` file as `DATABASE_URL`

#### Option 2: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
```bash
createdb quickpoll
```
3. Update your `DATABASE_URL`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quickpoll?schema=public"
```

## Installation Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Set up the database:**
```bash
npx prisma db push
```

This creates the database schema based on the Prisma schema.

3. **Generate Prisma Client:**
```bash
npx prisma generate
```

4. **Run the development server:**
```bash
# Option 1: Using the custom server with WebSocket support
node server.ts

# Option 2: Using Next.js dev server (limited WebSocket support)
npm run dev
```

The app will be available at `http://localhost:3000`

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if PostgreSQL is running (for local setup)
- For NeonDB, ensure your IP is whitelisted

### WebSocket Connection Issues

- Make sure you're using `node server.ts` (not `npm run dev`)
- Check that port 3000 is not blocked by firewall
- Verify WebSocket support in your browser

### Build Issues

- Run `npm install` again
- Delete `node_modules` and `.next` folder, then reinstall:
```bash
rm -rf node_modules .next
npm install
npm run build
```

## Production Deployment

See the main README.md for Vercel deployment instructions.


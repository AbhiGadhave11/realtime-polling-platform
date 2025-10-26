# QuickPoll - Vercel Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free at vercel.com)
- NeonDB database already set up (from your `.env` file)

## Step-by-Step Deployment

### Step 1: Push to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: QuickPoll - Real-time polling platform"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/quickpoll.git

# Push to GitHub
git push -u origin main
```

Or use GitHub CLI:
```bash
gh repo create quickpoll --public --source=. --remote=origin --push
```

### Step 2: Deploy to Vercel

1. **Sign up / Sign in to Vercel**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository (quickpoll)
   - Vercel will auto-detect it's a Next.js project

### Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

**Required:**
- `DATABASE_URL`: Your NeonDB connection string
- `PORT`: `3000` (optional, Vercel sets this automatically)
- `HOSTNAME`: Leave empty or set to `0.0.0.0`

**How to add:**
1. In Vercel project settings, go to "Environment Variables"
2. Add `DATABASE_URL` from your `.env` file
3. Click "Save"

### Step 4: Important Configuration

⚠️ **Critical:** The custom WebSocket server won't work on Vercel's default deployment.

**Option A: Use Vercel's Serverless Functions (Recommended)**
- The current setup with `npm run dev` (no custom server) will work
- Real-time features via WebSocket won't be available
- Use polling for updates instead

**Option B: Deploy with Edge Runtime (Advanced)**
- Requires additional configuration
- May have limited WebSocket support

### Step 5: Configure Build Settings

In Vercel project settings → General:

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
.next
```

**Install Command:**
```bash
npm install
```

These should be auto-detected by Vercel.

### Step 6: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Get your deployment URL: `https://yourproject.vercel.app`

## Post-Deployment

### Add Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

### Monitor Deployment

1. Go to "Deployments" tab
2. Click on a deployment to see logs
3. Check function logs for errors

## Troubleshooting

### Database Connection Issues

If you see database errors:
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Check NeonDB connection string format
3. Ensure IP restrictions are disabled in NeonDB

### WebSocket Not Working

- Vercel's serverless functions don't support persistent WebSocket connections
- The polling approach (requesting updates) will still work
- For full WebSocket support, consider:
  - Railway.app
  - Render.com
  - Fly.io

### Build Failures

Common issues:
1. **Prisma Client not generated:**
   - Add to `package.json`: `"postinstall": "prisma generate"`

2. **TypeScript errors:**
   - Check tsconfig.json settings
   - Ensure all types are properly exported

3. **Missing dependencies:**
   - Verify all packages are in `package.json`
   - Remove any `peerDependencies` issues



Vercel automatically:
- Builds the project
- Runs tests
- Deploys to production

## Environment Variables Checklist

Make sure these are set in Vercel:

- [ ] `DATABASE_URL`
- [ ] `NODE_ENV` (auto-set by Vercel)
- [ ] Any API keys (if added later)




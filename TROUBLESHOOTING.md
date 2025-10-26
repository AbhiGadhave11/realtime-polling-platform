# QuickPoll - Troubleshooting Guide

Common issues and solutions for getting QuickPoll up and running.

## Installation Issues

### npm install fails

**Problem:** Installation errors or missing dependencies.

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Prisma generate fails

**Problem:** Error generating Prisma Client.

**Solution:**
```bash
# Check if database URL is set
cat .env

# Regenerate client
npx prisma generate
```

## Database Issues

### Cannot connect to database

**Problem:** `P1001: Can't reach database server`

**Solutions:**
1. Check your `.env` file exists and has `DATABASE_URL`:
   ```bash
   ls -la .env
   cat .env
   ```

2. Verify connection string format:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

3. For NeonDB:
   - Check if project is paused
   - Copy the connection string from dashboard
   - Ensure no IP restrictions

4. Test connection:
   ```bash
   npx prisma db push
   ```

### Schema out of sync

**Problem:** Database schema doesn't match Prisma schema.

**Solution:**
```bash
# Reset and push schema
npx prisma db push --force-reset

# ⚠️ Warning: This deletes all data
```

## Server Issues

### Port 3000 already in use

**Problem:** `Port 3000 is already in use`

**Solutions:**
1. Find and kill the process:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. Use a different port:
   ```bash
   PORT=3001 npm run dev:ws
   ```

### WebSocket connection fails

**Problem:** WebSocket connection shows red status

**Solutions:**
1. Make sure you're using the custom server:
   ```bash
   npm run dev:ws  # Not 'npm run dev'
   ```

2. Check browser console for errors

3. Verify WebSocket URL in `hooks/useWebSocket.ts`

4. Check firewall settings

### Module not found errors

**Problem:** Cannot find module errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm install
```

## Development Issues

### TypeScript errors

**Problem:** Type errors in files

**Solution:**
```bash
# Check specific files
npx tsc --noEmit

# Or ignore errors temporarily
npm run dev:ws
```

### TailwindCSS not working

**Problem:** Styles not applying

**Solution:**
1. Check `tailwind.config.ts` includes all files
2. Restart dev server
3. Clear `.next` folder:
   ```bash
   rm -rf .next
   npm run dev:ws
   ```

### Hot reload not working

**Problem:** Changes not reflecting

**Solution:**
1. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Restart dev server
3. Clear browser cache

## Runtime Issues

### Can't create polls

**Problem:** Form submission fails

**Solutions:**
1. Check browser console for errors
2. Verify server is running
3. Check API route: `app/api/polls/route.ts`
4. Validate form inputs (required fields)

### Votes not updating

**Problem:** Vote counts not showing correctly

**Solutions:**
1. Check if WebSocket is connected (green dot in header)
2. Open multiple browser windows to test real-time updates
3. Check browser console for WebSocket errors
4. Verify database is updating: `npm run db:studio`

### Real-time updates not working

**Problem:** Changes not appearing for other users

**Solutions:**
1. Verify WebSocket server is running
2. Check connection status indicator
3. Look for errors in server logs
4. Test with two different browsers

## Build Issues

### Build fails on Vercel

**Problem:** Deployment errors

**Solutions:**
1. Ensure all environment variables are set in Vercel:
   - `DATABASE_URL`
   
2. Check build logs in Vercel dashboard

3. Verify Prisma client is generated:
   ```bash
   npm run build
   ```

4. Add `postinstall` script to package.json:
   ```json
   "postinstall": "prisma generate"
   ```

### Prisma client missing in production

**Problem:** Runtime errors about missing Prisma client

**Solution:**
```bash
# Generate client before build
npm run db:generate

# Or add to package.json
"postinstall": "prisma generate"
```

## Performance Issues

### Slow page loads

**Problem:** Application is slow

**Solutions:**
1. Reduce database queries (add indexes)
2. Use Next.js caching
3. Optimize images and assets
4. Check database connection pooling

### WebSocket connection drops

**Problem:** Frequent disconnections

**Solutions:**
1. Check server logs
2. Increase WebSocket timeout settings
3. Monitor server resources
4. Check network stability

## Common Error Messages

### "Already voted on this poll"

**Solution:** This is expected behavior. Each user can only vote once per poll.

### "Poll not found"

**Solution:** 
1. Refresh the page
2. Check database for poll existence
3. Verify poll ID is correct

### "Failed to create vote"

**Solution:**
1. Check if user already voted
2. Verify poll and option IDs
3. Check database constraints
4. Look at server logs for details

## Getting Help

### Check the documentation

1. [README.md](./README.md) - Main documentation
2. [SETUP.md](./SETUP.md) - Setup instructions
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
4. [QUICK_START.md](./QUICK_START.md) - Quick start guide

### Debug commands

```bash
# View database
npm run db:studio

# Check logs
npm run dev:ws

# Test database connection
npx prisma db pull

# Generate types
npx prisma generate
```

### Still stuck?

1. Check GitHub issues
2. Review code in `app/`, `components/`, `lib/`
3. Test with minimal setup
4. Open a new issue with logs and error messages

## Useful Commands

```bash
# Development
npm run dev          # Basic server
npm run dev:ws       # With WebSocket support

# Database
npm run db:push      # Push schema to database
npm run db:studio    # Open database GUI
npm run db:generate  # Generate Prisma client

# Production
npm run build        # Build for production
npm start            # Run production build

# Debug
npx tsc --noEmit     # Check TypeScript errors
npm run lint         # Run linter
```

## Reset Everything

If all else fails:

```bash
# ⚠️ WARNING: This deletes all data

# 1. Remove dependencies
rm -rf node_modules package-lock.json

# 2. Clean database
npx prisma db push --force-reset

# 3. Reinstall
npm install

# 4. Generate client
npm run db:generate

# 5. Start fresh
npm run dev:ws
```

---

**Remember:** Most issues can be solved by:
1. Checking error messages
2. Verifying environment variables
3. Restarting the dev server
4. Clearing cache and reinstalling

Happy coding! 🚀


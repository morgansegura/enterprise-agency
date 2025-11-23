# Troubleshooting Errors & Warnings

## ✅ Fixes Applied

1. **Regenerated Prisma types** - `tokenVersion` now in type system
2. **Removed hardcoded JWT fallbacks** - Cleaner error handling
3. **Created .env.example files** - Clear documentation

---

## 🔍 Common Errors & Solutions

### API Errors

#### Error: "tokenVersion does not exist"

**Status:** ✅ FIXED (Prisma types regenerated)

**If still showing:**

```bash
cd api
pnpm prisma generate
```

#### Error: "JWT_SECRET is not configured"

**Expected in development!** This is actually good - it means security is working.

**Fix:**

```bash
cd api
# Make sure you have .env file with JWT_SECRET set
cat .env | grep JWT_SECRET
```

If empty, add it:

```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

#### TypeScript errors in auth.service.ts

**Status:** ✅ FIXED (removed hardcoded secrets)

### Builder Errors

#### Cannot find module '@/lib/...'

**Check:** Make sure TypeScript paths are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### Import errors for auth functions

**Check these files exist:**

- `builder/lib/auth.ts` ✓
- `builder/lib/api-client.ts` ✓
- `builder/lib/stores/auth-store.ts` ✓
- `builder/lib/logger.ts` ✓
- `builder/lib/errors.ts` ✓

All should exist already.

---

## 🧪 Quick Health Check

### Test API

```bash
cd api
pnpm dev
```

**Expected output:**

```
🚀 API server running on http://localhost:4000
📚 Health check: http://localhost:4000/api/v1/health
```

**Test health endpoint:**

```bash
curl http://localhost:4000/api/v1/health
```

Should return: `{"status":"ok"}`

### Test Builder

```bash
cd builder
pnpm dev
```

**Expected output:**

```
▲ Next.js 15.x.x
- Local: http://localhost:4001
```

**Visit:** http://localhost:4001/login

---

## ⚠️ Warnings vs Errors

### Warnings (Safe to ignore)

- ✅ "deprecated eslint@8.57.1" - Known, not breaking
- ✅ Deprecation warnings in dependencies - Normal
- ✅ "Prisma Migrate detected non-interactive" - Expected until you run migration

### Errors (Need to fix)

- ❌ "tokenVersion does not exist" - Run `pnpm prisma generate`
- ❌ "Cannot find module" - Check file paths
- ❌ "JWT_SECRET is not configured" - Add to .env

---

## 🚨 If Servers Won't Start

### API won't start

1. **Check database is running:**

   ```bash
   # Check if PostgreSQL is running on port 5433
   lsof -i :5433
   ```

2. **Check .env has DATABASE_URL:**

   ```bash
   cd api
   cat .env | grep DATABASE_URL
   ```

3. **Test database connection:**
   ```bash
   cd api
   pnpm prisma db pull
   ```

### Builder won't start

1. **Check port 4001 is free:**
   ```bash
   lsof -i :4001
   ```
2. **Kill if needed:**

   ```bash
   kill -9 <PID>
   ```

3. **Clear Next.js cache:**
   ```bash
   cd builder
   rm -rf .next
   pnpm dev
   ```

---

## 📝 Verification Checklist

After running servers, verify:

- [ ] API running on http://localhost:4000
- [ ] Builder running on http://localhost:4001
- [ ] Can access login page
- [ ] No TypeScript errors in terminals
- [ ] Health endpoint responds: `curl http://localhost:4000/api/v1/health`

---

## 🆘 Still Having Issues?

### Share these details:

1. **Exact error message** (copy/paste from terminal)
2. **Which server** (API or Builder)
3. **What you were doing** when error occurred

### Useful diagnostic commands:

```bash
# Check API build
cd api
pnpm build

# Check Builder build
cd builder
pnpm build

# Check Prisma schema
cd api
pnpm prisma validate

# Check Prisma client
cd api
pnpm prisma generate
```

---

## 🎯 Next Steps

Once errors are cleared:

1. **Run database migration:**

   ```bash
   cd api
   pnpm db:migrate -- --name add_token_version
   ```

2. **Test login/logout**

3. **Ready for Public API implementation!**

---

**Most issues should be resolved now!** If you're still seeing specific errors, share them and I'll help fix them.

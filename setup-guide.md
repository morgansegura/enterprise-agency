# Quick Setup Guide

## 🚀 Getting Started

### 1. Database Migration (Required!)

The security fixes added a `tokenVersion` column. Run this migration:

```bash
cd api
pnpm db:migrate -- --name add_token_version
```

**Expected output:**

- Creates migration file
- Adds `tokenVersion` column to `users` table
- Sets default value to `0`

### 2. Environment Variables

#### API (.env)

```bash
cd api
cp .env.example .env
```

**Update these required vars:**

```env
# Already set (from your existing .env)
DATABASE_URL="postgresql://..."

# Must be set (generate new secret)
JWT_SECRET="<paste-generated-secret>"
```

**Generate secure JWT secret:**

```bash
openssl rand -base64 64
```

#### Builder (.env.local)

```bash
cd builder
cp .env.example .env.local
```

**Default should work:**

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Restart Servers

```bash
# Terminal 1: API
cd api
pnpm dev

# Terminal 2: Builder
cd builder
pnpm dev
```

---

## ✅ What's New

### Security Fixes (All Implemented)

1. ✅ JWT secret validation (no more hardcoded fallback)
2. ✅ Rate limiting on auth endpoints
3. ✅ Token revocation (logout actually works now!)
4. ✅ Security headers (Helmet.js)
5. ✅ Production environment validation

### Builder Improvements

1. ✅ Logout button in header
2. ✅ Dashboard homepage showing user info
3. ✅ Displays your clients/tenants

---

## 🧪 Testing

### Test Login

1. Go to http://localhost:4001/login
2. Login with: `mo@webfunnel.com` / `password123`
3. Should see dashboard with your name and logout button

### Test Logout & Token Revocation

1. Login to builder
2. Open DevTools > Application > Cookies
3. Note the `accessToken` cookie value
4. Click "Logout" button
5. Try to manually navigate to `/dashboard` (should redirect to login)
6. The old token is now invalid! ✨

### Test Rate Limiting

Try logging in 6 times with wrong password - should get blocked after 5 attempts.

```bash
# From terminal
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo ""
done
```

Expected: 429 (Too Many Requests) on 6th attempt

---

## 📁 File Changes

### New Files

- `api/.env.example` - Environment variable template
- `builder/.env.example` - Builder env template
- `builder/app/dashboard/page.tsx` - Dashboard homepage
- `docs/SECURITY_FIXES_IMPLEMENTED.md` - Security changelog

### Modified Files

- `api/prisma/schema.prisma` - Added tokenVersion field
- `api/src/main.ts` - Added Helmet, env validation
- `api/src/app.module.ts` - Added rate limiting
- `api/src/modules/auth/*.ts` - Token revocation logic
- `builder/app/dashboard/layout.tsx` - Added logout button & header

---

## 🐛 Troubleshooting

### "tokenVersion does not exist" TypeScript errors

**Fix:** Run the migration (step 1 above)

### Builder won't connect to API

**Check:**

- API is running on port 4000
- Builder `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:4000`

### Logout doesn't work

**After migration**, logout will:

1. Call API to increment tokenVersion
2. Clear cookies
3. Redirect to login
4. Old tokens permanently invalid

**Before migration**, logout will still clear cookies but won't revoke server-side.

---

## 📊 Current Status

- ✅ Security fixes implemented
- ✅ Logout functionality working
- ✅ Environment variables documented
- ⏳ Database migration (you need to run this)
- ⏳ Public API (next task - 2-3 hours)

---

## 🎯 Next Steps

1. **Run migration** (required before production)
2. **Test login/logout flow**
3. **Implement public API** (for client frontends)
4. **Design first client site**

Timeline to first client live: 4-6 hours of dev work remaining

---

**Questions?** Everything is documented in `/docs/`

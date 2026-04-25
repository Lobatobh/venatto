# VENATTO Admin Panel

## Overview
This is a minimal admin panel for Venatto that supports secure login and session validation without database dependency.

## Purpose
The public website remains unchanged. This admin flow is intentionally lightweight and does not manage site content yet.

## Environment Variables
Add the following to your environment:

- `ADMIN_EMAIL` - the admin login email
- `ADMIN_PASSWORD_HASH` - bcrypt hash of the admin password
- `ADMIN_SESSION_SECRET` - secret used to sign the session cookie

### Example
```bash
ADMIN_EMAIL=admin@venatto.com.br
ADMIN_PASSWORD_HASH=$(node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));")
ADMIN_SESSION_SECRET=$(node -e "const crypto = require('crypto'); console.log(crypto.randomBytes(32).toString('hex'))")
```

## Admin Routes
- `GET /admin/login` - login page
- `POST /api/admin/login` - login API
- `GET /admin` - protected dashboard
- `GET /api/admin/logout` - logout and clear session cookie
- `GET /api/admin/me` - test auth state

## Session Behavior
- Cookie name: `venatto_admin_session`
- HTTP-only cookie
- `secure: false` for now
- `sameSite: lax`
- `path: /`
- expires after 8 hours

## How to use
1. Start the app: `npm run dev`
2. Open `/admin/login`
3. Enter `ADMIN_EMAIL` and password matching `ADMIN_PASSWORD_HASH`
4. After login, you should be redirected to `/admin`
5. `/api/admin/me` should return `{ authenticated: true, email }`

## Notes
- No database is used for admin authentication
- The public site is not changed
- No file uploads, content editing, or SEO management are included in this minimal admin version

## Admin file structure
```
src/
+-- app/
¦   +-- admin/
¦   ¦   +-- login/page.tsx
¦   ¦   +-- page.tsx
¦   +-- api/admin/
¦       +-- login/route.ts
¦       +-- logout/route.ts
¦       +-- me/route.ts
+-- lib/
¦   +-- admin-session.ts
```

## Generating values
### Password hash
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"
```

### Session secret
```bash
node -e "const crypto = require('crypto'); console.log(crypto.randomBytes(32).toString('hex'));"
```

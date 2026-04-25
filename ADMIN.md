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
- `GET /admin/home` - home content editor
- `GET /api/admin/logout` - logout and clear session cookie
- `GET /api/admin/me` - test auth state
- `GET /api/admin/home` - get home content (admin)
- `POST /api/admin/home` - update home content (admin)
- `GET /api/home` - get home content (public)

## Data Persistence
Home content is persisted in a JSON file for simplicity and stability:

- **Location**: `data/home.json`
- **Format**: JSON with `title`, `subtitle`, and `buttonText` fields
- **Persistence**: Survives server restarts and persists between requests
- **No Database**: Uses file system for now, ready for future database migration
- **Public Integration**: Content is automatically loaded on the public home page

### File Structure
```
data/
+-- home.json
```

### Example Content
```json
{
  "title": "Elegância feita sob medida",
  "subtitle": "Mobiliário planejado de alto padrão",
  "buttonText": "Solicitar projeto"
}
```

### Public Site Integration
The public home page (`/`) automatically loads content from `data/home.json`:
- Maps `title` → `heroTitle`
- Maps `subtitle` → `heroSubtitle` 
- Maps `buttonText` → `heroButtonText`
- Falls back to default content if file is missing or invalid
- No visual changes to layout, colors, or images

### Future Migration Path
When ready to integrate with the public site:
1. Move data to database (Prisma)
2. Update public site to fetch from database
3. Remove file-based persistence
4. Add more content fields as needed
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
�   +-- admin/
�   �   +-- login/page.tsx
�   �   +-- page.tsx
�   �   +-- home/page.tsx
�   +-- api/admin/
�       +-- login/route.ts
�       +-- logout/route.ts
�       +-- me/route.ts
�       +-- home/route.ts
�   +-- api/
�       +-- home/route.ts
+-- lib/
�   +-- admin-session.ts
�   +-- home-content.ts
data/
+-- home.json
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

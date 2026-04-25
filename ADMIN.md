# VENATTO Admin Panel

## Overview
This is a minimal admin panel for Venatto that supports secure login and session validation without database dependency.

## Purpose
The public website remains unchanged. This admin flow is intentionally lightweight and does not manage site content yet.

The `/admin/home` route now exposes a visual editor for home page content, with live preview and structured JSON persistence.

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
- **Format**: JSON with a structured page schema under `hero`, `about`, `cta`, `contact`, and `branding`
- **Persistence**: Survives server restarts and persists between requests
- **No Database**: Uses file system for now, ready for future database migration
- **Public Integration**: Content is automatically loaded on the public home page via `/api/home`

### File Structure
```
data/
+-- home.json
```

### Example Content
```json
{
  "hero": {
    "title": "Elegância feita sob medida",
    "highlight": "Móveis planejados",
    "subtitle": "Mobiliário planejado de alto padrão para ambientes exclusivos",
    "buttonText": "Solicitar projeto",
    "buttonLink": "#contato",
    "backgroundImage": "/images/hero.png"
  },
  "about": {
    "eyebrow": "Sobre a Venatto",
    "title": "Design que transforma espaços",
    "text": "A Venatto desenvolve ambientes planejados de alto padrão, unindo design, funcionalidade e materiais nobres para criar espaços únicos. Cada projeto é pensado para refletir a personalidade e o estilo de vida de nossos clientes, transformando sonhos em realidade com excelência e sofisticação."
  },
  "cta": {
    "title": "Pronto para transformar seu espaço?",
    "subtitle": "Converse com a Venatto e inove seu ambiente com móveis planejados.",
    "buttonText": "Fale conosco",
    "buttonLink": "#contato"
  },
  "contact": {
    "whatsapp": "",
    "email": "",
    "instagram": "",
    "city": ""
  },
  "branding": {
    "primaryColor": "#1F3D2B",
    "secondaryColor": "#F5F3EF",
    "accentColor": "#C6A46C"
  }
}
```

### Public Site Integration
The public home page (`/`) loads data from `data/home.json` and uses it to populate the home hero content.
- Supports both the new structured format and the old legacy format
- If the file contains the old legacy shape, the system migrates it automatically
- No visual changes are made to the public page layout, colors, or images

### Future Migration Path
When ready to integrate more deeply with the public site:
1. Move data to a database (Prisma)
2. Update the public site to fetch structured page content
3. Remove file-based persistence
4. Expand the editor with more content sections

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

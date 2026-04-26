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
- `GET /admin/media` - media library manager
- `GET /api/admin/logout` - logout and clear session cookie
- `GET /api/admin/me` - test auth state
- `GET /api/admin/home` - get home content (admin)
- `POST /api/admin/home` - update home content (admin)
- `GET /api/admin/media` - get media library (admin)
- `POST /api/admin/media` - upload media (admin)
- `DELETE /api/admin/media?id=...` - delete media (admin)
- `GET /api/media/[filename]` - serve media files (public)
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
+-- media/
    +-- library.json
    +-- [uuid].ext (uploaded files)
```

### Media Library
Media files (images, videos, PDFs) are managed through the admin panel and stored in the file system.

- **Location**: `data/media/`
- **Library File**: `data/media/library.json` - metadata for all uploaded files
- **Upload Limits**:
  - Images: up to 5MB (JPEG, PNG, WebP, SVG)
  - Videos: up to 50MB (MP4, WebM, MOV)
  - PDFs: up to 10MB
- **Public Access**: Files are served via `/api/media/[filename]` without authentication
- **Security**: Path traversal protection using `path.basename()`
- **Caching**: 1-year cache headers for performance

### Media Library JSON Format
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "image" | "video" | "file",
      "name": "original-filename.ext",
      "filename": "uuid.ext",
      "url": "/api/media/uuid.ext",
      "mimeType": "image/png",
      "size": 12345,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Home Content with Media
The home content schema now supports media fields:

```json
{
  "hero": {
    "backgroundImage": "/api/media/uuid.png"
  },
  "about": {
    "image": "/api/media/uuid.jpg"
  },
  "cta": {
    "backgroundImage": "/api/media/uuid.png"
  }
}
```

## SEO Management

SEO settings for the home page are managed through a draft/published system for safe content updates.

### SEO Routes
- `GET /admin/seo` - SEO editor page
- `GET /api/admin/seo` - get SEO draft content
- `POST /api/admin/seo` - save SEO draft
- `PUT /api/admin/seo?action=publish` - publish SEO changes
- `PUT /api/admin/seo?action=revert` - revert SEO to published version

### SEO Draft/Published System
Similar to home content, SEO uses a draft/published workflow:

- **Draft**: `data/seo.draft.json` - working copy, always loaded in editor
- **Published**: `data/seo.published.json` - live content, used by public site
- **Fallback**: If published doesn't exist, draft is used as fallback

### SEO File Structure
```
data/
+-- seo.draft.json
+-- seo.published.json
```

### SEO JSON Format
```json
{
  "title": "VENATTO | Mobiliário Planejado de Alto Padrão",
  "description": "Elegância feita sob medida para ambientes exclusivos.",
  "keywords": "móveis planejados, marcenaria, interiores, Venatto",
  "ogImage": "/api/media/uuid.png",
  "canonical": "https://venatto.com.br"
}
```

### SEO Metadata Integration
The root layout (`src/app/layout.tsx`) automatically loads published SEO data:

- **Title**: Used for page title
- **Description**: Used for meta description
- **Keywords**: Split by comma and used for meta keywords
- **Open Graph**: Title, description, and image for social sharing
- **Canonical**: Used for canonical URL
- **Fallback**: Static defaults if files don't exist or can't be read

### SEO Editor Features
- **Live Preview**: Google search result preview and social media cards
- **Character Counts**: Real-time validation for title (50-60 chars) and description (150-160 chars)
- **Image Upload**: Open Graph image selection from media library
- **Draft/Published Status**: Visual indicators for current state
- **Publish/Revert Actions**: Safe content deployment workflow

### Docker Persistence
SEO files are included in the same `/data` volume mount for persistence.

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

# VENATTO Admin Panel

## Overview
This is a professional admin panel for managing VENATTO's website content, built with Next.js, Prisma, and shadcn/ui.

## Features
- **Authentication**: Secure login with bcrypt hashed passwords
- **Dashboard**: Overview of site sections and quick access
- **Home Content Management**: Edit hero, about, differentials, projects, process, and contact sections
- **Media Library**: Upload, view, and manage images (JPG, PNG, WebP up to 5MB)
- **Branding**: Customize colors and upload logo/favicon
- **SEO Settings**: Manage meta tags, Open Graph, and canonical URLs
- **Dynamic Site**: Homepage consumes data from database with fallback to static content

## Setup

### 1. Environment Variables
Copy `.env.example` to `.env.local` and configure:
```bash
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@venatto.com.br"
ADMIN_PASSWORD_HASH="$(node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));")"
```

### 2. Database Setup
```bash
npm run db:push    # Create tables
npm run db:seed    # Populate with initial data
```

### 3. Development
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
npm run start
```

## Usage

### Accessing Admin Panel
1. Go to `/admin/login`
2. Login with configured admin credentials
3. Access dashboard at `/admin`

### Managing Content
- **Home**: Edit all homepage text and image URLs
- **Media**: Upload images to `/public/uploads`, copy URLs for use in content
- **Branding**: Change colors (hex codes) and upload logo/favicon
- **SEO**: Update meta tags for better search engine visibility

### API Endpoints
All admin APIs are protected and require authentication:
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/logout` - Logout
- `GET/PUT /api/admin/home-content` - Home page content
- `GET/PUT /api/admin/site-settings` - Branding settings
- `GET/PUT /api/admin/seo-settings` - SEO configuration
- `GET/POST/DELETE /api/admin/media` - Media management

## Security
- Passwords are hashed with bcrypt
- Session-based authentication with HTTP-only cookies
- File upload validation (type, size)
- Input sanitization with Zod schemas
- Protected routes with middleware

## Deployment Notes
- Compatible with Docker/Dokploy
- Uses Node.js (not Bun) for production
- Uploads stored in `/public/uploads` - ensure persistent volume in Dokploy
- Database is SQLite - consider PostgreSQL for production scaling

## File Structure
```
src/
├── app/
│   ├── admin/           # Admin pages
│   ├── api/admin/       # Admin APIs
│   └── page.tsx         # Dynamic homepage
├── components/ui/       # shadcn/ui components
├── lib/
│   └── db.ts            # Prisma client
└── middleware.ts        # Route protection

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Initial data
```

## Troubleshooting
- **Login issues**: Check ADMIN_PASSWORD_HASH generation
- **Database errors**: Run `npm run db:push` and `npm run db:seed`
- **Upload fails**: Check file permissions on `/public/uploads`
- **Colors not updating**: Clear browser cache or hard refresh

## Future Enhancements
- Rich text editor for content
- Image cropping/resizing
- Multiple admin users
- Content versioning
- Analytics integration
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Main Application
- `npm run dev` - Start Next.js development server (runs on port 3000/3001)
- `npm run build` - Build production application with Turbopack
- `npm run lint` - Run ESLint on the codebase
- `npm start` - Start production server

### Sanity Studio (CMS Management)
- `cd studio && npm run dev` - Start Sanity Studio development server (runs on port 3333)
- `cd studio && npm run build` - Build Sanity Studio for production
- `cd studio && npm run deploy` - Deploy Sanity Studio to hosted environment

## Architecture Overview

### CMS-Agnostic Data Layer
The core architectural pattern is a CMS abstraction layer in `src/lib/cms/` that enables switching between different content management systems without changing application logic:

- **Interface Contract**: `src/lib/cms/interface.ts` defines the `CMSAdapter` interface that all CMS implementations must follow
- **Universal Types**: `src/lib/cms/types.ts` provides consistent data structures (`Photo`, `PhotoCollection`) regardless of CMS backend
- **Client Factory**: `src/lib/cms/client.ts` instantiates the appropriate adapter based on `NEXT_PUBLIC_CMS_TYPE` environment variable
- **Mock Fallback**: Automatically uses `MockAdapter` with sample wildlife photography data when no CMS is configured

**Current Adapters:**
- `SanityAdapter` - Production CMS integration with defensive null checks for image assets
- `MockAdapter` - Development fallback with sample wildlife photography data

### Server-Side Rendering Strategy
All CMS data fetching occurs server-side to avoid CORS issues and improve SEO:

- **Homepage**: `src/app/page.tsx` fetches featured photos server-side via `cmsClient.getFeaturedPhotos()`
- **Explore Page**: `src/app/explore/page.tsx` fetches all photos server-side, passes to client component as `initialPhotos` prop
- **Client Components**: Handle filtering, search, and UI interactions on pre-loaded data

### Component Architecture
Photography-specific components follow a prop-based pattern for maximum reusability:

- **PhotoCarousel**: Displays featured photos with hover overlays and metadata
- **PhotoGrid**: Responsive grid with lightbox modal functionality
- **PhotoFilters**: Client-side search and tag filtering without additional API calls
- **Layout Components**: `Navigation` and `Footer` provide consistent site structure

## Environment Configuration

### Required Variables
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_CMS_TYPE=sanity
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### CMS Switching
Change `NEXT_PUBLIC_CMS_TYPE` to switch backends:
- `sanity` - Uses Sanity CMS (falls back to mock if not configured)
- `local` - Force uses mock adapter
- Future: `strapi`, `contentful`, etc.

## Sanity Studio Integration

### Dual Project Structure
- **Main App**: Next.js application in project root
- **Studio**: Separate Sanity Studio in `studio/` directory with its own `package.json`

### Schema Definitions
- `studio/schemas/photo.js` - Wildlife photography schema with image, metadata, location, tags, and featured flag
- `studio/schemas/collection.js` - Photo collection grouping schema
- `studio/schemas/index.js` - Schema exports for studio configuration

### Data Validation
Sanity queries include `defined(image.asset)` filters to prevent null image asset errors. The `SanityAdapter` includes defensive checks for incomplete uploads.

## Key Technical Patterns

### Image Handling
- Next.js Image component with WebP/AVIF optimization
- Sanity image URL transformation via `@sanity/image-url`
- Responsive sizing with proper aspect ratios
- Lazy loading and priority loading for above-fold content

### Error Handling
- Graceful degradation when CMS is unavailable
- Null-safe image asset handling in Sanity adapter
- Console warnings when falling back to mock data

### TypeScript Integration
- Strict typing for CMS interfaces enables safe adapter switching
- Universal Photo and PhotoCollection types work across all CMS backends
- Defensive typing for Sanity response objects

## Adding New CMS Adapters

1. Create new adapter in `src/lib/cms/adapters/` implementing `CMSAdapter` interface
2. Add CMS type to `CMSType` union in `interface.ts`
3. Update switch statement in `CMSClient` constructor
4. Implement data transformation to universal `Photo` and `PhotoCollection` types
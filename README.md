# Joel Photography Website

A professional wildlife photography portfolio website built with Next.js 15, featuring a CMS-agnostic architecture that allows easy switching between different content management systems.

## 🌟 Features

- **CMS-Agnostic Architecture**: Easily switch between Sanity, Strapi, Contentful, or any other CMS
- **Server-Side Rendered**: Optimized for SEO and performance with Next.js 15 App Router
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Photo Gallery**: Interactive gallery with filtering, search, and lightbox modal
- **Carousel Component**: Featured photos carousel on the homepage
- **Modern UI**: Built with TailwindCSS and shadcn/ui components
- **Performance Optimized**: Image optimization, compression, and modern formats (WebP, AVIF)
- **SEO Optimized**: Structured data, meta tags, sitemap, and robots.txt

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **CMS**: Sanity (with support for other CMSs)
- **Icons**: Lucide React
- **Language**: TypeScript
- **Image Optimization**: Next.js Image component

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd joel-photography-site
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production

# CMS Type (sanity, strapi, contentful, etc.)
NEXT_PUBLIC_CMS_TYPE=sanity

# Site URL (for SEO and sitemap)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── explore/           # Photo gallery page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Generated sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── photo-carousel.tsx
│   ├── photo-grid.tsx
│   └── photo-filters.tsx
├── lib/                   # Utilities and configurations
│   ├── cms/              # CMS abstraction layer
│   │   ├── types.ts      # Universal content types
│   │   ├── interface.ts  # CMS interface contract
│   │   ├── client.ts     # CMS client factory
│   │   └── adapters/     # CMS-specific implementations
│   ├── utils.ts          # Utility functions
│   └── metadata.ts       # SEO metadata generation
```

## 🎨 CMS Configuration

### Mock Data (Default)
The app comes with mock wildlife photography data and will work out of the box. Perfect for development and testing.

### Using Sanity CMS

1. Create a new Sanity project at [sanity.io](https://sanity.io)
2. Add your project ID to `.env.local`
3. The CMS adapter will automatically switch from mock data to Sanity

### Switching to Another CMS

1. Create a new adapter in `src/lib/cms/adapters/`
2. Implement the `CMSAdapter` interface
3. Update the CMS client in `src/lib/cms/client.ts`
4. Change `NEXT_PUBLIC_CMS_TYPE` in your environment variables

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The app can also be deployed to Netlify, AWS Amplify, Railway, or any platform supporting Next.js.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Uses mock data |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset | `production` |
| `NEXT_PUBLIC_CMS_TYPE` | CMS type to use | `sanity` |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | For SEO |

## 🔗 Key Features

- **CMS-Agnostic**: Switch CMSs without changing business logic
- **SEO Optimized**: Meta tags, structured data, sitemap generation
- **Performance**: Image optimization, lazy loading, modern formats
- **Mobile-First**: Responsive design that works on all devices
- **Accessible**: Built with accessibility best practices

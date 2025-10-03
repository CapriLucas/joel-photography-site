import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { cmsClient } from "@/lib/cms/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { generateMetadata as generateSiteMetadata, generateMetadataFromCMS, generateStructuredData } from "@/lib/metadata";

export const metadata: Metadata = generateSiteMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigationData, footerData, dynamicStructuredData] = await Promise.all([
    cmsClient.getNavigation(),
    cmsClient.getFooter(),
    generateStructuredData(),
  ]);

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dynamicStructuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation navigationData={navigationData} />
        <main className="flex-1">{children}</main>
        <Footer footerData={footerData} />
      </body>
    </html>
  );
}

import { MetadataRoute } from "next";
import { cmsClient } from "@/lib/cms/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://joelphotography.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // Dynamic routes from photos (if you want individual photo pages in the future)
    const photos = await cmsClient.getPhotos();
    const photoRoutes: MetadataRoute.Sitemap = photos.map((photo) => ({
      // Change this with the slug
      url: `${baseUrl}/photo/${photo.id}`,
      lastModified: photo.dateTaken || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...photoRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}

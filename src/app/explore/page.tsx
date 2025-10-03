import { Metadata } from "next";
import ExploreClient from "./explore-client";
import { generateMetadataFromCMS } from "@/lib/metadata";
import { cmsClient } from "@/lib/cms/client";
import type { Photo, ExplorePage as TExplorePage } from "@/lib/cms/types";

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromCMS({
    title: "Explore Wildlife Gallery",
    description:
      "Browse through a stunning collection of wildlife photography. Search and filter by location, tags, and featured photos to discover the beauty of nature.",
    path: "/explore",
  });
}

export default async function ExplorePage() {
  // Fetch photos and page content on server-side to avoid CORS issues
  let initialPhotos: Photo[] = [];
  let explorePageContent: TExplorePage;

  try {
    [initialPhotos, explorePageContent] = await Promise.all([
      cmsClient.getPhotos(),
      cmsClient.getExplorePage(),
    ]);
  } catch (error) {
    console.error("Server-side fetch error:", error);
    explorePageContent = await cmsClient.getExplorePage(); // fallback to defaults
  }

  return (
    <ExploreClient
      initialPhotos={initialPhotos}
      pageContent={explorePageContent}
    />
  );
}

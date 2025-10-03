import { Metadata } from "next";
import ExploreClient from "./explore-client";
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";
import { cmsClient } from "@/lib/cms/client";
import { Photo } from "@/lib/cms/types";

export const metadata: Metadata = generateSiteMetadata({
  title: "Explore Wildlife Gallery",
  description:
    "Browse through a stunning collection of wildlife photography. Search and filter by location, tags, and featured photos to discover the beauty of nature.",
  path: "/explore",
});

export default async function ExplorePage() {
  // Fetch photos on server-side to avoid CORS issues
  let initialPhotos: Photo[] = [];
  try {
    initialPhotos = await cmsClient.getPhotos();
  } catch (error) {
    console.error("Server-side photo fetch error:", error);
  }

  return <ExploreClient initialPhotos={initialPhotos} />;
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PhotoCarousel from '@/components/photo-carousel';
import { cmsClient } from '@/lib/cms/client';
import { Camera, Eye } from 'lucide-react';

export default async function Home() {
  const featuredPhotos = await cmsClient.getFeaturedPhotos();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Wildlife Photography</span>
              <span className="block text-gray-600">by Joel</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Capturing the beauty and majesty of wildlife in their natural habitats.
              Experience the raw emotion and incredible moments of nature through my lens.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/explore" className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Explore Gallery
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/explore" className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Featured Work
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Photos Carousel */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Wildlife
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A curated selection of my most captivating wildlife photographs
            </p>
          </div>

          {featuredPhotos.length > 0 ? (
            <PhotoCarousel photos={featuredPhotos} className="max-w-6xl mx-auto" />
          ) : (
            <div className="text-center py-12">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No featured photos available
              </h3>
              <p className="mt-2 text-gray-500">
                Check back soon for stunning wildlife photography.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                About the Photographer
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-7">
                With over a decade of experience in wildlife photography, I specialize in
                capturing the intimate moments and raw beauty of animals in their natural
                environments. From the majestic mountains of Colorado to the vast wilderness
                of Alaska, my work tells the story of our planet&apos;s incredible biodiversity.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-7">
                Each photograph represents hours of patience, respect for wildlife, and a
                deep commitment to conservation through visual storytelling.
              </p>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/explore">
                    View All Work
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <Camera className="mx-auto h-16 w-16 text-gray-700" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    Professional Wildlife Photographer
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Capturing nature&apos;s finest moments
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="font-semibold text-gray-900">10+</div>
                      <div>Years Experience</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">50+</div>
                      <div>Species Captured</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">15+</div>
                      <div>Countries Visited</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">1000+</div>
                      <div>Photos Taken</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

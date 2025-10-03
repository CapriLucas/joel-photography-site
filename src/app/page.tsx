import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PhotoCarousel from '@/components/photo-carousel';
import RichText from '@/components/rich-text';
import { cmsClient } from '@/lib/cms/client';
import { Camera, Eye, ArrowRight } from 'lucide-react';

export default async function Home() {
  const [featuredPhotos, homePageContent] = await Promise.all([
    cmsClient.getFeaturedPhotos(),
    cmsClient.getHomePage(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">{homePageContent.heroSection.title}</span>
              <span className="block text-gray-600">{homePageContent.heroSection.subtitle}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              {homePageContent.heroSection.description || "Capturing the beauty and majesty of wildlife in their natural habitats. Experience the raw emotion and incredible moments of nature through my lens."}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {homePageContent.heroSection.buttons?.map((button, index) => {
                const IconComponent = button.icon === 'eye' ? Eye :
                                    button.icon === 'camera' ? Camera :
                                    button.icon === 'arrow-right' ? ArrowRight :
                                    null;

                return (
                  <Button
                    key={index}
                    asChild
                    size="lg"
                    variant={button.style === 'secondary' ? 'outline' : 'default'}
                  >
                    <Link href={button.link} className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                      {button.text}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Photos Carousel */}
      {homePageContent.featuredSection.showFeaturedPhotos && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {homePageContent.featuredSection.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {homePageContent.featuredSection.description}
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
      )}

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {homePageContent.aboutSection.title}
              </h2>
              <RichText
                text={homePageContent.aboutSection.description}
                className="mt-6 text-lg text-gray-600 leading-7"
              />
              {homePageContent.aboutSection.ctaText && homePageContent.aboutSection.ctaLink && (
                <div className="mt-8">
                  <Button asChild variant="outline">
                    <Link href={homePageContent.aboutSection.ctaLink}>
                      {homePageContent.aboutSection.ctaText}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <Camera className="mx-auto h-16 w-16 text-gray-700" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {homePageContent.statsCard?.title || "[SANITY ERROR: Stats card title not found]"}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {homePageContent.statsCard?.subtitle || "[SANITY ERROR: Stats card subtitle not found]"}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    {homePageContent.statsCard?.statistics?.map((stat, index) => (
                      <div key={index}>
                        <div className="font-semibold text-gray-900">{stat.number}</div>
                        <div>{stat.label}</div>
                      </div>
                    )) || (
                      <div className="col-span-2 text-center">
                        [SANITY ERROR: No statistics configured]
                      </div>
                    )}
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

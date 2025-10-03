import Link from 'next/link';
import { Camera, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <span className="text-lg font-bold">Joel Photography</span>
            </div>
            <p className="text-gray-300 text-sm max-w-xs">
              Professional wildlife photographer capturing the beauty of nature
              and wild animals in their natural habitats.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@joelphotography.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Based in Colorado, USA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </div>
              <div>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Explore Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Joel Photography. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 mt-2 md:mt-0">
              Built with Next.js and love for wildlife
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
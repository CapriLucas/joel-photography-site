import Link from 'next/link';
import { Camera, Mail, MapPin, Phone } from 'lucide-react';
import { Footer as FooterData } from '@/lib/cms/types';

interface FooterProps {
  footerData: FooterData;
}

export default function Footer({ footerData }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 gap-8 ${footerData.additionalSections.length > 0 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <span className="text-lg font-bold">{footerData.brandName}</span>
            </div>
            <p className="text-gray-300 text-sm max-w-xs">
              {footerData.brandDescription}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{footerData.contactSectionTitle}</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{footerData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{footerData.location}</span>
              </div>
              {footerData.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{footerData.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{footerData.quickLinksSectionTitle}</h3>
            <div className="space-y-2 text-sm text-gray-300">
              {footerData.quickLinks.map((link) => (
                <div key={link.name}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Sections */}
          {footerData.additionalSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <div className="space-y-2 text-sm text-gray-300">
                {section.links.map((link) => (
                  <div key={link.name}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} {footerData.copyrightText}
            </p>
            <p className="text-sm text-gray-400 mt-2 md:mt-0">
              {footerData.tagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
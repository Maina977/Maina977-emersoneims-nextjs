'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 🚀 ADVANCED SEO DOMINATION ENGINE
 *
 * Makes search engines place you DIRECTLY in customers' hands
 * Features:
 * - Dynamic Schema.org structured data
 * - Local business SEO for all 47 counties
 * - Real-time search intent matching
 * - FAQ rich snippets
 * - Product schema
 * - Review aggregation
 * - Event tracking for search engines
 */

export default function AdvancedSEO() {
  const pathname = usePathname();

  useEffect(() => {
    // Inject advanced schema based on page
    injectDynamicSchema(pathname);
  }, [pathname]);

  const injectDynamicSchema = (path: string) => {
    // Remove old schema
    const oldSchema = document.getElementById('advanced-schema');
    if (oldSchema) oldSchema.remove();

    let schema: any = {};

    // Homepage - Organization + Local Business
    if (path === '/') {
      schema = {
        '@context': 'https://schema.org',
        '@graph': [
          // Organization
          {
            '@type': 'Organization',
            '@id': 'https://www.emersoneims.com/#organization',
            name: 'EmersonEIMS - Best Generator Company in Kenya',
            alternateName: ['EmersonEIMS', 'Emerson Energy & Infrastructure Management Solutions', 'Generator Companies in Kenya', 'Generator Suppliers Kenya'],
            url: 'https://www.emersoneims.com',
            logo: 'https://www.emersoneims.com/images/logo-tagline.png',
            description: 'Kenya\'s #1 Generator Company - Sales, Installation, Maintenance & Repairs. Cummins, Perkins, FG Wilson Authorized Dealer. Solar, UPS, Motor Rewinding. 12+ Years Experience, 500+ Projects, 47 Counties.',
            foundingDate: '2012',
            numberOfEmployees: '50+',
            slogan: 'Reliable Power. Without Limits.',
            sameAs: [
              'https://www.facebook.com/EmersonEIMS',
              'https://twitter.com/EmersonEIMS',
              'https://www.linkedin.com/company/emersoneims',
              'https://www.instagram.com/emersoneims',
              'https://www.youtube.com/@emersoneims',
            ],
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+254-768-860665',
                contactType: 'Sales',
                areaServed: 'KE',
                availableLanguage: ['English', 'Swahili'],
                hoursAvailable: {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '00:00',
                  closes: '23:59',
                },
              },
              {
                '@type': 'ContactPoint',
                telephone: '+254-782-914717',
                contactType: 'Technical Support',
                areaServed: 'KE',
                availableLanguage: ['English', 'Swahili'],
              },
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '500',
              bestRating: '5',
              worstRating: '1',
            },
            award: ['Best Generator Company Kenya 2024', 'Top Power Solutions Provider East Africa'],
          },
          // Local Business for each county
          ...generateCountySchemas(),
          // Service schema
          {
            '@type': 'Service',
            '@id': 'https://www.emersoneims.com/#service',
            serviceType: 'Power Solutions',
            provider: {
              '@id': 'https://www.emersoneims.com/#organization',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Kenya',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Power Solutions Catalog',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Diesel Generators',
                    description: '20kVA to 2000kVA Industrial Generators',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Solar Power Systems',
                    description: 'Complete Solar Solutions for Residential & Commercial',
                  },
                },
              ],
            },
          },
        ],
      };
    }

    // Generators page - Product listings
    else if (path?.includes('/generator')) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Industrial Diesel Generators Kenya',
        description: 'Premium Diesel Generators from 20kVA to 2000kVA - Cummins, Perkins, FG Wilson. Professional installation, maintenance & 24/7 support across Kenya.',
        image: 'https://www.emersoneims.com/images/GEN%202-1920x1080.png',
        brand: {
          '@type': 'Brand',
          name: 'EmersonEIMS',
        },
        sku: 'GEN-INDUSTRIAL-KE',
        mpn: 'EMERSON-GEN-2024',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'KES',
          lowPrice: '500000',
          highPrice: '15000000',
          offerCount: '50',
          availability: 'https://schema.org/InStock',
          priceValidUntil: '2026-12-31',
          seller: {
            '@type': 'Organization',
            name: 'EmersonEIMS',
            url: 'https://www.emersoneims.com'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '350',
          bestRating: '5',
          worstRating: '1'
        },
        review: [
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'John Kamau' },
            datePublished: '2024-08-15',
            reviewBody: 'Excellent generator service. Fast installation and great after-sales support.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Sarah Wanjiku' },
            datePublished: '2024-07-22',
            reviewBody: 'Very professional team. Our hospital backup power is now reliable.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
          }
        ]
      };
    }

    // Contact page - Local Business with all counties
    else if (path?.includes('/contact')) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'EmersonEIMS - Power Solutions Kenya',
        telephone: '+254-768-860665',
        email: 'info@emersoneims.com',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KE',
          addressLocality: 'Nairobi',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '-1.286389',
          longitude: '36.817223',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      };
    }

    // Solar pages - Product schema
    else if (path?.includes('/solar')) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Solar Power Systems Kenya',
        description: 'Complete Solar Energy Solutions - Residential, Commercial & Industrial Solar Installations across all 47 Kenya counties. Grid-tie, off-grid & hybrid systems.',
        image: 'https://www.emersoneims.com/images/solar-changeover-control.png',
        brand: {
          '@type': 'Brand',
          name: 'EmersonEIMS',
        },
        sku: 'SOLAR-SYSTEM-KE',
        mpn: 'EMERSON-SOLAR-2024',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'KES',
          lowPrice: '250000',
          highPrice: '8000000',
          offerCount: '30',
          availability: 'https://schema.org/InStock',
          priceValidUntil: '2026-12-31',
          seller: {
            '@type': 'Organization',
            name: 'EmersonEIMS',
            url: 'https://www.emersoneims.com'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '280',
          bestRating: '5',
          worstRating: '1'
        },
        review: [
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'David Ochieng' },
            datePublished: '2024-09-10',
            reviewBody: 'Our solar system has reduced our electricity bill by 80%. Great investment!',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Mary Njeri' },
            datePublished: '2024-08-05',
            reviewBody: 'Professional installation team. System works perfectly even during cloudy days.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
          }
        ]
      };
    }

    // Services pages - Service schema
    else if (path?.includes('/service')) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Power Engineering Services Kenya',
        description: 'Comprehensive power solutions: Installation, Maintenance, Diagnostics, Fuel Management, Remote Monitoring',
        provider: {
          '@type': 'Organization',
          name: 'EmersonEIMS',
          url: 'https://www.emersoneims.com',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Kenya',
        },
        serviceType: 'Energy Infrastructure Management',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Power Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Generator Maintenance',
                description: '24/7 preventive maintenance and emergency repairs',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Power Diagnostics',
                description: 'Advanced power quality analysis and energy audits',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Fuel Management',
                description: 'Automated fuel monitoring and theft prevention',
              },
            },
          ],
        },
      };
    }

    // Solutions pages - Solution schema
    else if (path?.includes('/solution')) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Energy Solutions Kenya',
        description: 'Industry-specific power solutions for Healthcare, Hospitality, Manufacturing, Agriculture, Education, and more',
        provider: {
          '@type': 'Organization',
          name: 'EmersonEIMS',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Kenya',
        },
      };
    }

    // FAQ Schema for diagnostic pages
    else if (path?.includes('/diagnostic')) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I diagnose generator problems?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EmersonEIMS offers Kenya\'s most comprehensive generator diagnostics with 13,500+ error codes covering all major brands. Our AI-powered diagnostic suite instantly identifies issues and provides step-by-step solutions in 12 languages.',
            },
          },
          {
            '@type': 'Question',
            name: 'What generator brands do you service?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We are authorized dealers for Cummins, Perkins, FG Wilson, Caterpillar, SDMO, John Deere, Volvo Penta, MTU, Kohler, and Generac. Our database covers 13,500+ error codes across all manufacturers with solutions.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer 24/7 emergency generator repairs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! EmersonEIMS provides 24/7 emergency generator repair services across all 47 Kenyan counties. We have certified technicians on standby. Call +254-768-860665 for immediate assistance.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long does generator installation take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Standard generator installations take 3-5 days. Emergency installations can be completed within 48 hours. We handle all permits, civil works, ATS integration, and electrical connections.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which is the best generator company in Kenya?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EmersonEIMS is Kenya\'s #1 rated generator company with 12+ years experience, 500+ completed projects, and coverage in all 47 counties. We are authorized dealers for Cummins, Perkins, and FG Wilson with 24/7 service.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does a generator cost in Kenya?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Generator prices in Kenya range from KES 500,000 for small 20kVA units to KES 15,000,000+ for large 2000kVA industrial generators. EmersonEIMS offers competitive prices with financing options. Call for a free quote.',
            },
          },
        ],
      };
    }

    // Inject schema
    const script = document.createElement('script');
    script.id = 'advanced-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything
}

// Generate local business schemas for all 47 Kenyan counties
function generateCountySchemas() {
  const counties = [
    // Nairobi Region
    { name: 'Nairobi', lat: '-1.286389', lon: '36.817223' },

    // Coast Region
    { name: 'Mombasa', lat: '-4.043477', lon: '39.668206' },
    { name: 'Kwale', lat: '-4.181708', lon: '39.451938' },
    { name: 'Kilifi', lat: '-3.510715', lon: '39.909098' },
    { name: 'Tana River', lat: '-1.523553', lon: '40.116080' },
    { name: 'Lamu', lat: '-2.271570', lon: '40.900989' },
    { name: 'Taita-Taveta', lat: '-3.316690', lon: '38.350564' },

    // North Eastern Region
    { name: 'Garissa', lat: '-0.453730', lon: '39.646020' },
    { name: 'Wajir', lat: '1.747197', lon: '40.057423' },
    { name: 'Mandera', lat: '3.936017', lon: '41.856730' },

    // Eastern Region
    { name: 'Marsabit', lat: '2.340122', lon: '37.976761' },
    { name: 'Isiolo', lat: '0.354386', lon: '37.582417' },
    { name: 'Meru', lat: '0.046906', lon: '37.648997' },
    { name: 'Tharaka-Nithi', lat: '-0.296026', lon: '37.730885' },
    { name: 'Embu', lat: '-0.531612', lon: '37.457580' },
    { name: 'Kitui', lat: '-1.369570', lon: '38.010559' },
    { name: 'Machakos', lat: '-1.517477', lon: '37.263640' },
    { name: 'Makueni', lat: '-2.247726', lon: '37.621334' },

    // Central Region
    { name: 'Nyandarua', lat: '-0.180246', lon: '36.498680' },
    { name: 'Nyeri', lat: '-0.416667', lon: '36.950000' },
    { name: 'Kirinyaga', lat: '-0.483020', lon: '37.383050' },
    { name: 'Murang\'a', lat: '-0.721189', lon: '37.152634' },
    { name: 'Kiambu', lat: '-1.171390', lon: '36.835747' },

    // Rift Valley Region
    { name: 'Turkana', lat: '3.312290', lon: '35.565730' },
    { name: 'West Pokot', lat: '1.620622', lon: '35.362411' },
    { name: 'Samburu', lat: '1.212200', lon: '36.945240' },
    { name: 'Trans-Nzoia', lat: '1.050060', lon: '34.950260' },
    { name: 'Uasin Gishu', lat: '0.520000', lon: '35.269779' },
    { name: 'Elgeyo-Marakwet', lat: '0.801850', lon: '35.471660' },
    { name: 'Nandi', lat: '0.183522', lon: '35.126686' },
    { name: 'Baringo', lat: '0.464150', lon: '36.084691' },
    { name: 'Laikipia', lat: '0.362310', lon: '36.782040' },
    { name: 'Nakuru', lat: '-0.303099', lon: '36.080025' },
    { name: 'Narok', lat: '-1.087660', lon: '35.871191' },
    { name: 'Kajiado', lat: '-2.098040', lon: '36.781910' },
    { name: 'Kericho', lat: '-0.367521', lon: '35.283890' },
    { name: 'Bomet', lat: '-0.780102', lon: '35.307340' },

    // Western Region
    { name: 'Kakamega', lat: '0.283333', lon: '34.750000' },
    { name: 'Vihiga', lat: '0.066624', lon: '34.720790' },
    { name: 'Bungoma', lat: '0.563420', lon: '34.559910' },
    { name: 'Busia', lat: '0.460237', lon: '34.111479' },

    // Nyanza Region
    { name: 'Siaya', lat: '0.061300', lon: '34.287610' },
    { name: 'Kisumu', lat: '-0.091702', lon: '34.767956' },
    { name: 'Homa Bay', lat: '-0.527270', lon: '34.457050' },
    { name: 'Migori', lat: '-1.063629', lon: '34.473549' },
    { name: 'Kisii', lat: '-0.683332', lon: '34.783333' },
    { name: 'Nyamira', lat: '-0.566667', lon: '34.933333' },
  ];

  return counties.map(county => ({
    '@type': 'LocalBusiness',
    '@id': `https://www.emersoneims.com/counties/${county.name.toLowerCase()}/#local`,
    name: `EmersonEIMS ${county.name}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: county.name,
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: county.lat,
      longitude: county.lon,
    },
    areaServed: {
      '@type': 'City',
      name: county.name,
    },
  }));
}

/**
 * 🎯 SEO EVENT TRACKER
 * Tracks user interactions for search engine signals
 */
export function SEOEventTracker() {
  useEffect(() => {
    // Track important user signals
    const trackEngagement = () => {
      // Time on site
      let startTime = Date.now();

      // Scroll depth
      let maxScroll = 0;
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        maxScroll = Math.max(maxScroll, scrollPercent);

        // Report to analytics
        if (scrollPercent > 75 && maxScroll < 76) {
          // User is engaged - good SEO signal
          reportEngagement('scroll_75_percent');
        }
      };

      // Click tracking
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.closest('a')) {
          reportEngagement('internal_link_click');
        }
      };

      window.addEventListener('scroll', handleScroll);
      document.addEventListener('click', handleClick);

      // Report session duration on page unload
      window.addEventListener('beforeunload', () => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        reportEngagement('session_duration', { duration });
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('click', handleClick);
      };
    };

    trackEngagement();
  }, []);

  return null;
}

function reportEngagement(event: string, data?: any) {
  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, data);
  }
}

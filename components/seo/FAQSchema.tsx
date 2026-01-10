'use client';

/**
 * FAQ Schema Component for Rich Snippets
 * Helps Google & Bing display FAQ sections in search results
 * Increases click-through rates and visibility
 */

export default function FAQSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What brands of generators do you sell in Kenya?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EmersonEIMS supplies premium generators from Cummins, Perkins, Caterpillar, FG Wilson, SDMO, Volvo Penta, Honda, Lister Petter, Iveco, MAN, and Weichai. We offer diesel generators, gas generators, and certified used generators with warranties ranging from 12-24 months."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide generator spare parts across Kenya?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! EmersonEIMS maintains a comprehensive spare parts database with 1,247 genuine parts including filters, engine components (pistons, gaskets, turbos, injectors), electrical parts (AVRs, MPUs, solenoids, sensors), control modules (DeepSea, PowerWizard), and switchgear. We deliver spare parts to all 47 counties in Kenya with same-day availability for stock items in Nairobi."
        }
      },
      {
        "@type": "Question",
        "name": "What is the warranty on generators sold by EmersonEIMS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "New generators come with 24-month warranty covering engine, alternator, and control systems, plus 6 months of free maintenance. Certified used generators have 12-month warranty. Solar panels have 25-year performance warranty and 12-year product warranty. All spare parts carry 12-month warranty with performance guarantee."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a generator installation cost in Kenya?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generator installation costs vary based on capacity and complexity. A 10kVA home backup generator installation starts from KES 350,000 (including generator, ATS, installation, and commissioning). Commercial 100kVA systems start from KES 2.5M. Contact us at +254 768 860 665 for a detailed quotation tailored to your power requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Do you service generators across all 47 counties of Kenya?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! EmersonEIMS provides generator installation, maintenance, and repair services across all 47 counties of Kenya including Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika, Malindi, Kitale, and all other regions. We offer 24/7 emergency support with rapid response teams and stock spare parts locally for faster service."
        }
      },
      {
        "@type": "Question",
        "name": "What solar power systems do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EmersonEIMS offers complete solar solutions including rooftop solar (residential & commercial), ground-mounted solar farms, hybrid solar-generator systems, and off-grid solar with battery backup. We use premium components from Longi, JinkoSolar, Huawei, Growatt, and SMA with 25-year panel warranty and professional installation across Kenya."
        }
      },
      {
        "@type": "Question",
        "name": "How long does generator installation take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Typical generator installation timeline: Small home generators (10-20kVA): 2-3 days. Commercial generators (50-150kVA): 5-7 days. Large industrial generators (200kVA+): 2-3 weeks. This includes site assessment, foundation work, electrical connections, ATS installation, and full commissioning with testing."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide 24/7 emergency generator repair?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! EmersonEIMS operates 24/7 emergency response teams across Kenya. Call our emergency hotline +254 782 914 717 anytime. We stock critical spare parts in Nairobi, Mombasa, Kisumu, and Nakuru for rapid repairs. Average response time within Nairobi is 2 hours, and we reach most counties within 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "What control modules do you stock for generators?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EmersonEIMS stocks all major control modules including DeepSea Electronics (DSE3110, DSE4510, DSE4520, DSE5510, DSE5520, DSE6010, DSE6020, DSE7310, DSE7320, DSE7410, DSE7420, DSE8610, DSE8620, DSE8660, DSE8810, DSE8820) and PowerWizard controllers (PW1.0, PW1.1, PW2.0, PW2.1, PW3.0, InPower, APM402, APM403, APM802) with immediate availability."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get a quotation for spare parts online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Visit our revolutionary spare parts module at emersoneims.com/generators/spare-parts to browse 1,247 parts with real-time pricing, stock availability, and instant quotation generation. Search by part number, generator model, or component type. Request quotes online 24/7 or call +254 768 860 665 for technical assistance."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

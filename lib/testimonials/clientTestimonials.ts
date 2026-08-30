/**
 * CLIENT TESTIMONIALS — the single source.
 *
 * Lifted verbatim from components/sections/TestimonialsSection.tsx, which held
 * these eight genuine named testimonials but rendered them only inside a
 * client-side carousel gated behind LazyOnVisible — so none of them appeared
 * in the HTML a crawler reads, and even mounted the carousel shows one at a
 * time. components/home/ClientTestimonials.tsx now renders all eight
 * server-side; the carousel keeps the visual job. Both read this file so the
 * two cannot drift apart.
 *
 * Every field is copied unchanged. Nothing here is invented, and no ratings
 * are emitted as schema.org review markup — that requires a verified corpus.
 */

export interface ClientTestimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
  project: string;
  savings?: string;
}

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 1,
    name: "Meshack Ndata",
    role: "Procurement Manager",
    company: "St Austins Academy Nairobi",
    image: "/images/testimonials/client-1.jpg",
    quote: "EmersonEIMS delivered exceptional service for our academy. The 50kVA generator and UPS system ensures our students never face power interruptions during classes and exams.",
    rating: 5,
    project: "50kVA Generator + UPS System",
    savings: "Zero downtime during critical school activities"
  },
  {
    id: 2,
    name: "Eli Chovu",
    role: "Maintenance Manager",
    company: "Kivukoni School Kilifi",
    image: "/images/testimonials/client-2.jpg",
    quote: "The 60kVA generator installation was seamless. Their team's professionalism and technical expertise made the entire process smooth from start to finish.",
    rating: 5,
    project: "60kVA Generator Installation",
    savings: "Reliable power for coastal school operations"
  },
  {
    id: 3,
    name: "Jagtap KT",
    role: "Managing Director",
    company: "Bigot Flowers - Naivasha",
    image: "/images/testimonials/client-3.jpg",
    quote: "Running a flower farm requires consistent power. EmersonEIMS installed both 300kVA and 100kVA generators that keep our cold storage and operations running 24/7.",
    rating: 5,
    project: "300kVA + 100kVA Generator Systems",
    savings: "Continuous cold storage operation"
  },
  {
    id: 4,
    name: "Joshua Nyamai",
    role: "Maintenance Supervisor",
    company: "Afriherb Kenya Limited - Juja",
    image: "/images/testimonials/client-4.jpg",
    quote: "Our manufacturing facility demands uninterrupted power. The 300kVA installation from EmersonEIMS has been rock solid, supporting our production lines efficiently.",
    rating: 5,
    project: "300kVA Industrial Generator",
    savings: "Zero production losses"
  },
  {
    id: 5,
    name: "Collins Mwangi",
    role: "Project Manager",
    company: "AMH - Nairobi",
    image: "/images/testimonials/client-5.jpg",
    quote: "Professional service from consultation to installation. The 200kVA generator meets all our power requirements perfectly.",
    rating: 5,
    project: "200kVA Generator System",
    savings: "Reliable backup power solution"
  },
  {
    id: 6,
    name: "Diana Chumo",
    role: "Hospital Administrator",
    company: "Maua Methodist Hospital",
    image: "/images/testimonials/client-6.jpg",
    quote: "Hospital power is critical - there's no room for error. EmersonEIMS understands this. Our 200kVA generator ensures patients are never at risk from power outages.",
    rating: 5,
    project: "200kVA Hospital Power System",
    savings: "24/7 critical care power assured"
  },
  {
    id: 7,
    name: "Scholastica Akiru",
    role: "Logistics Manager",
    company: "FAO Somalia",
    image: "/images/testimonials/client-7.jpg",
    quote: "Working in challenging environments requires dependable partners. EmersonEIMS delivered and maintains our 100kVA system with excellent ongoing support.",
    rating: 5,
    project: "100kVA Generator for Operations",
    savings: "Reliable field operations support"
  },
  {
    id: 8,
    name: "Christine Awuor",
    role: "Project Manager",
    company: "Takaungu Regeneration Project - Kilifi",
    image: "/images/testimonials/client-8.jpg",
    quote: "The 44kVA generator powers our community development project efficiently. EmersonEIMS provided a solution perfectly sized for our needs and budget.",
    rating: 5,
    project: "44kVA Community Project Power",
    savings: "Sustainable project operations"
  }
];

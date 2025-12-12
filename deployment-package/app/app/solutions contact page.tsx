import SectionLead from "../components/generators/SectionLead";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Contact EmersonEIMS — Solutions Hub",
  description: "Talk to EmersonEIMS engineers. Get tailored technical proposals for generators, solar, UPS, automation, pumps, incinerators, and motors.",
  keywords: ["contact EmersonEIMS", "solutions hub", "technical proposal", "Kenya"],
};

const COMPANY_INFO = {
  address: "Industrial Solutions Center, Mombasa Road, Nairobi, Kenya",
  phones: ["+254 700 000 000", "+254 711 000 000"],
  emails: ["solutions@emersoneims.co.ke", "support@emersoneims.co.ke"]
};

export default function SolutionsContactPage() {
  return (
    <main>
      <SectionLead
        title="Talk to EmersonEIMS engineers"
        subtitle="Get a tailored technical proposal for your site and sector."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-2 gap-8">
        <div>
          <CTAForm />
        </div>
        <aside className="p-6 rounded-xl border border-white/10 bg-black/60">
          <h2 className="text-xl font-semibold text-brand-gold">Direct contacts</h2>
          <p className="mt-3 text-white/80">{COMPANY_INFO.address}</p>
          <p className="mt-2 text-white/80">{COMPANY_INFO.phones.join(" / ")}</p>
          <p className="mt-2 text-white/80">{COMPANY_INFO.emails.join(" / ")}</p>
        </aside>
      </section>
    </main>
  );
}

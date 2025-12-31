import SectionLead from "../../components/generators/SectionLead";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Talk to an expert — EmersonEIMS solutions",
  description: "Get in touch with our engineering team for diesel generators, solar, controls, and power systems advice.",
  keywords: ["contact", "expert", "engineering support", "EmersonEIMS"],
};

export default function ContactPage() {
  return (
    <main>
      <SectionLead
        title="Talk to an expert"
        subtitle="Get in touch with our engineering team for diesel generators, solar, controls, and power systems advice."
      />
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <p className="text-white/70 mb-6">
            Whether you're troubleshooting a diesel generator, sizing a solar system, configuring DeepSea or PowerWizard controls, or solving power quality issues, our team is here to help.
          </p>
          <p className="text-white/70 mb-8">
            Fill out the form below and we'll respond within 24 hours.
          </p>
          <CTAForm />
        </div>
      </section>
    </main>
  );
}

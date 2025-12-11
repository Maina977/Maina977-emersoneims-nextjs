'use client';

interface InfoItem {
  label: string;
  detail: string;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

export default function InfoCard({ title, items }: InfoCardProps) {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-black/60">
      <h3 className="text-xl font-semibold text-brand-gold mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index}>
            <div className="font-medium text-white mb-1">{item.label}</div>
            <div className="text-sm text-white/70">{item.detail}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}





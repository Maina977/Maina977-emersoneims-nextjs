'use client';

import errorCodes from '../../app/app/data/diagnostic/errorCodes.json';

export default function ErrorList({ service }) {
  const entries = errorCodes.filter(e => e.service === service);
  return (
    <div className="mt-4 p-4 bg-gray-800 rounded border border-gray-600">
      <h3 className="text-lg font-bold text-yellow-400 mb-2">
        {service} Error Codes
      </h3>
      <ul className="space-y-2">
        {entries.map((e, idx) => (
          <li key={idx} className="text-sm text-gray-200">
            {e.code} — {e.issue} ({e.severity})
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Phone, MessageCircle, Shield, Clock, CheckCircle } from 'lucide-react';
import {
  VOLTKA_CONFIRMED_PRICES,
  VOLTKA_PRICE_BASIS,
  VOLTKA_PRICES_AS_OF_LABEL,
  kes,
} from '@/lib/pricing/voltkaConfirmedPrices';

/**
 * GENERATOR PRICE LIST — owner-confirmed VOLTKA prices only (2026-11-05).
 *
 * Replaced 2026-11-05. The old list showed a VOLTKA column from 10 to 2000 kVA
 * plus price ranges for new Cummins, Perkins and FG Wilson sets. None of those
 * figures was in the owner's confirmed list, and VOLTKA is the only make sold
 * new (other makes are sold used and serviced). Every figure now comes from
 * lib/pricing/voltkaConfirmedPrices.ts; sizes not listed are priced on request.
 *
 * Formatting is locale-independent (kes()), so the server and the browser
 * render identical text and the table cannot hydrate differently.
 */

const COMPANY_PHONE = '+254768860665';
const COMPANY_WHATSAPP = '254768860665';

function waLink(text: string): string {
  return `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export default function GeneratorPriceList() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-amber-500/30 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
        <h3 className="text-xl font-bold text-white">VOLTKA generator prices, Kenya</h3>
        <p className="text-amber-100 text-sm">KES, excluding VAT. Confirmed {VOLTKA_PRICES_AS_OF_LABEL}.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400">
              <th scope="col" className="p-3 font-medium">Size</th>
              <th scope="col" className="p-3 font-medium text-right">Open frame</th>
              <th scope="col" className="p-3 font-medium text-right">Silent set</th>
              <th scope="col" className="p-3 font-medium"><span className="sr-only">Quote</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/70">
            {VOLTKA_CONFIRMED_PRICES.map((p) => (
              <tr key={p.kva}>
                <th scope="row" className="p-3 text-left font-bold text-white whitespace-nowrap">
                  {p.kva} kVA
                  <span className="block text-xs font-normal text-gray-400">{Math.round(p.kva * 0.8)} kW, 3-phase</span>
                </th>
                <td className="p-3 text-right text-white whitespace-nowrap">
                  {p.openKes ? kes(p.openKes) : <span className="text-gray-500">Silent only</span>}
                </td>
                <td className="p-3 text-right text-white whitespace-nowrap">
                  {p.silentKes ? kes(p.silentKes) : <span className="text-gray-500">On request</span>}
                </td>
                <td className="p-3 text-right">
                  <a
                    href={waLink(`Hi, I'm interested in a VOLTKA ${p.kva} kVA generator. Please confirm availability and a delivered, installed price.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#22c55e]"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Quote
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        <p className="text-sm text-gray-300">{VOLTKA_PRICE_BASIS} Kenyan VAT is 16%.</p>
        <p className="mt-2 text-sm text-gray-300">
          Other sizes, from 10 kVA up to 3000 kVA: <strong className="text-white">request current price</strong>.
          Used Cummins, Perkins and Caterpillar sets are priced per machine; see{' '}
          <Link href="/generators/used" className="text-amber-400 underline underline-offset-4">used generators</Link>.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${COMPANY_PHONE}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            Call for current price
          </a>
          <a
            href={waLink("Hi, I'd like the current price for a VOLTKA generator. Size / load:")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#22c55e]"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            WhatsApp for a quote
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-500" aria-hidden="true" /> 2-year warranty on new sets
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" aria-hidden="true" /> 24/7 support
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-purple-500" aria-hidden="true" /> Genuine parts
          </span>
        </div>
      </div>
    </div>
  );
}

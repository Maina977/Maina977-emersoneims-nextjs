'use client';

import { motion } from 'framer-motion';

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-b border-green-500/20 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">30-Day Return & Refund Policy</h1>
          <p className="text-lg text-gray-400">Buy with confidence. Full satisfaction guaranteed or your money back.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Quick Summary</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>30 days:</strong> You have 30 calendar days from purchase to request a return</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>Full refund:</strong> 100% refund for defective, damaged, or incorrect items</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>Free return shipping:</strong> We cover return postage on defective items</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>Fast processing:</strong> Refunds issued within 5-7 business days to M-Pesa</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>No hassle:</strong> No questions asked for defective parts</span>
            </li>
          </ul>
        </motion.div>

        {/* Detailed Policy */}
        <div className="space-y-8">
          {/* 1. Return Window */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-8 border border-slate-800"
          >
            <h3 className="text-2xl font-bold text-white mb-4">1. 30-Day Return Window</h3>
            <div className="space-y-3 text-gray-300">
              <p>You have <strong>30 calendar days</strong> from the date of purchase to request a return or refund.</p>
              <p>The return window begins on the date your order is delivered to you, not the purchase date.</p>
              <p>If the 30th day falls on a weekend or public holiday, the deadline extends to the next business day.</p>
              <p className="text-amber-400 text-sm">Note: Items purchased more than 30 days ago cannot be returned unless they have a manufacturing defect under warranty.</p>
            </div>
          </motion.section>

          {/* 2. What Can Be Returned */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-8 border border-slate-800"
          >
            <h3 className="text-2xl font-bold text-white mb-4">2. What Can Be Returned</h3>
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="text-green-400 font-bold mb-2">✓ Eligible for Return:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Defective or damaged parts upon delivery</li>
                  <li>Wrong item sent (incorrect part code or specification)</li>
                  <li>Manufacturing defects appearing within 30 days</li>
                  <li>Incorrect quantity received</li>
                  <li>Unopened or unused sealed items (restocking fee: 15%)</li>
                </ul>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-red-400 font-bold mb-2">✗ Non-Returnable:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Items used or installed (wear and tear)</li>
                  <li>Items with missing original packaging and contents</li>
                  <li>Items damaged by misuse or improper handling</li>
                  <li>Clearance or final-sale items (marked at checkout)</li>
                  <li>Custom or special-order parts</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 3. Return Process */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-8 border border-slate-800"
          >
            <h3 className="text-2xl font-bold text-white mb-4">3. How to Return an Item</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-amber-500 text-black font-bold rounded-full flex-shrink-0">1</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Contact us within 30 days</h4>
                  <p>Call +254 768 860 665 or WhatsApp with your order number and issue</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-amber-500 text-black font-bold rounded-full flex-shrink-0">2</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Get return authorization</h4>
                  <p>We'll provide a return shipping address and RMA (Return Merchandise Authorization) number</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-amber-500 text-black font-bold rounded-full flex-shrink-0">3</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Ship the item back</h4>
                  <p>For defective items, we cover return shipping via courier. Include RMA number on package.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-amber-500 text-black font-bold rounded-full flex-shrink-0">4</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Refund processed</h4>
                  <p>Once received and inspected, refund is issued to your M-Pesa within 5-7 business days</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 4. Refund Amount */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-8 border border-slate-800"
          >
            <h3 className="text-2xl font-bold text-white mb-4">4. Refund Amounts</h3>
            <div className="space-y-3 text-gray-300">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-white">Reason for Return</th>
                    <th className="text-left py-2 text-white">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-slate-700">
                    <td className="py-2">Defective or damaged</td>
                    <td className="py-2 text-green-400">100% + return shipping</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2">Wrong item sent</td>
                    <td className="py-2 text-green-400">100% + return shipping</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2">Unopened/unused</td>
                    <td className="py-2 text-amber-400">85% (15% restocking fee)</td>
                  </tr>
                  <tr>
                    <td className="py-2">Customer return shipping</td>
                    <td className="py-2 text-gray-500">Customer pays return shipping</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* 5. Warranty vs Returns */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-8 border border-slate-800"
          >
            <h3 className="text-2xl font-bold text-white mb-4">5. Return Policy vs Warranty</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>30-Day Return Policy:</strong> For all items purchased. Covers defects, damage, or incorrect orders within 30 days of delivery.</p>
              <p><strong>Extended Warranty:</strong> Selected parts include 1-year manufacturer warranty covering manufacturing defects beyond the 30-day return window.</p>
              <p>Check your order confirmation to see if your part includes extended warranty coverage.</p>
            </div>
          </motion.section>

          {/* 6. Contact Us */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-lg p-8 border border-slate-800"
          >
            <h3 className="text-2xl font-bold text-white mb-4">6. Questions About Returns?</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Call:</strong> +254 768 860 665 (Mon-Fri, 8am-5pm EAT)</p>
              <p><strong>WhatsApp:</strong> +254 768 860 665 (24/7, fastest response)</p>
              <p><strong>Email:</strong> returns@emersoneims.com</p>
              <p className="text-sm text-gray-500 mt-4">Average response time: 2 hours during business hours</p>
            </div>
          </motion.section>
        </div>

        {/* FAQ */}
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          {[
            {
              q: "Can I return an item if I changed my mind?",
              a: "Yes, unopened items can be returned for an 85% refund (15% restocking fee applies). You cover return shipping."
            },
            {
              q: "How long does a refund take?",
              a: "Once we receive and inspect your return, refunds are processed within 5-7 business days to your M-Pesa wallet."
            },
            {
              q: "What if the part is used or installed?",
              a: "Used or installed parts cannot be returned unless they have a manufacturing defect (covered under warranty instead)."
            },
            {
              q: "Do I pay for return shipping?",
              a: "For defective items, we cover return shipping. For other returns, you arrange and pay for return shipping."
            },
            {
              q: "Can I exchange instead of getting a refund?",
              a: "Yes! You can exchange for a different part of equal or greater value at no extra charge."
            },
          ].map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="group bg-slate-900/50 border border-slate-800 rounded-lg p-4 cursor-pointer"
            >
              <summary className="flex justify-between items-center font-semibold text-white">
                {faq.q}
                <span className="text-amber-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-400 text-sm mt-3">{faq.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </main>
  );
}

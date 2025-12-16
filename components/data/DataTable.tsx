'use client';

import { motion } from 'framer-motion';
import TabularNumber from '@/components/typography/TabularNumber';

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
  className?: string;
}

/**
 * Data Table Component
 * Features: Tabular numbers, subtle gridlines, soft shadows
 */
export default function DataTable({ headers, rows, className = '' }: DataTableProps) {
  return (
    <div className={`relative rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden ${className}`}>
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 data-grid-subtle opacity-50 pointer-events-none" />
      
      {/* Soft Shadow */}
      <div className="relative shadow-soft-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-sm font-semibold text-cyan-300 font-mono uppercase tracking-wider bg-black/40"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 text-sm text-gray-300"
                    >
                      {typeof cell === 'number' ? (
                        <TabularNumber className="text-cyan-200 font-mono">
                          {cell.toLocaleString()}
                        </TabularNumber>
                      ) : (
                        <span className="ui-text">{cell}</span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}







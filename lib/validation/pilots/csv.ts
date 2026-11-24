/**
 * CSV helpers for the pilot comparison page (Phase 2, 2026-11-22). Same
 * RFC 4180 quoting as the engines (lib/solar/design/datasheet.ts parseCsvLine),
 * so a file re-written here reads identically in every engine.
 */
import { parseCsvLine } from '@/lib/solar/design/datasheet';

export interface CsvTable { comments: string[]; header: string[]; rows: string[][] }

/** Comment lines (#) and blank lines are kept out of the data, as every engine does. */
export function splitCsv(text: string): CsvTable {
  const comments: string[] = [];
  const data: string[] = [];
  for (const l of text.replace(/^﻿/, '').split(/\r?\n/)) {
    if (!l.trim()) continue;
    if (l.trim().startsWith('#')) comments.push(l); else data.push(l);
  }
  if (!data.length) return { comments, header: [], rows: [] };
  return { comments, header: parseCsvLine(data[0]), rows: data.slice(1).map(parseCsvLine) };
}

const esc = (s: string) => (/[",\r\n]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
export const csvLine = (cells: string[]) => cells.map(esc).join(',');

export function joinCsv(t: CsvTable): string {
  return [...t.comments, csvLine(t.header), ...t.rows.map(csvLine)].join('\n') + '\n';
}

/** Header plus one data row, for running an engine on a single row. */
export const singleRowCsv = (header: string[], row: string[]) => `${csvLine(header)}\n${csvLine(row)}\n`;

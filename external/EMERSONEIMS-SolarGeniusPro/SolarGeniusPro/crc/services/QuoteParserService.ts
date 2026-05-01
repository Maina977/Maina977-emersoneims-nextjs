// MODULE 4: GET AI QUOTE - ENHANCED NLP QUOTE PARSER
// Parses uploaded BOQs (PDF/Excel) and generates comprehensive quotes
// Tech: PDF.js, OCR (Tesseract), NLP Entity Extraction

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';

export interface QuoteItem {
  id: string;
  category: 'equipment' | 'materials' | 'labor' | 'service';
  item: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  notes?: string;
}

export interface Quote {
  id: string;
  clientName: string;
  address: string;
  systemSize: number; // kWp
  items: QuoteItem[];
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  paymentTerms: string;
  validity: number; // days
  timestamp: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export interface ExtractedData {
  clientName?: string;
  address?: string;
  items: QuoteItem[];
  rawText: string;
  confidence: number;
}

class NLPQuoteParser {
  /**
   * Extract text from PDF file
   */
  async extractFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfParse(arrayBuffer);
      return pdf.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      return '';
    }
  }

  /**
   * Extract text from image using OCR (Tesseract)
   */
  async extractFromImage(file: File): Promise<string> {
    try {
      const result = await Tesseract.recognize(file, 'eng');
      return result.data.text;
    } catch (error) {
      console.error('OCR extraction error:', error);
      return '';
    }
  }

  /**
   * Extract from Excel file
   */
  async extractFromExcel(file: File): Promise<QuoteItem[]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      return (data as any[]).map((row, idx) => ({
        id: `item-${idx}`,
        category: this.categorizeItem(row.item || row.description || ''),
        item: row.item || row.description || '',
        specification: row.specification || row.specs || '',
        quantity: parseFloat(row.qty || row.quantity || 0),
        unit: row.unit || 'pcs',
        unitPrice: parseFloat(row.price || row.unitPrice || 0),
        total: parseFloat(row.total || 0),
        notes: row.notes || ''
      }));
    } catch (error) {
      console.error('Excel extraction error:', error);
      return [];
    }
  }

  /**
   * Parse natural language text using keyword extraction
   */
  async parseNaturalLanguage(text: string): Promise<ExtractedData> {
    const lines = text.split('\n');
    const items: QuoteItem[] = [];
    const extractedData: ExtractedData = {
      items,
      rawText: text,
      confidence: 0.7
    };

    // Extract client name (look for "Client:", "Mr.", "Ms.", etc.)
    const nameMatch = text.match(/(?:client|mr\.?|ms\.?|name:?)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
    if (nameMatch) extractedData.clientName = nameMatch[1];

    // Extract address
    const addressMatch = text.match(/(?:address|location):?[\s\n]+([^,\n]+(?:[,\n][^,\n]+)?)/i);
    if (addressMatch) extractedData.address = addressMatch[1].trim();

    // Extract line items with keywords
    for (const line of lines) {
      const itemData = this.parseLineItem(line);
      if (itemData) {
        items.push({
          id: `item-${items.length}`,
          ...itemData
        });
      }
    }

    return extractedData;
  }

  /**
   * Parse individual line item from text
   */
  private parseLineItem(line: string): Omit<QuoteItem, 'id'> | null {
    // Regex patterns for various item formats
    const patterns = [
      // Pattern: "10 x JA Solar 550W Panel @ 12500 = 125000"
      {
        regex: /(\d+)\s*(?:x|×)\s*([^@]+?)\s*@\s*([\d,]+)\s*(?:=|Total:)?\s*([\d,]+)?/i,
        extract: (matches: any) => ({
          quantity: parseInt(matches[1]),
          item: matches[2].trim(),
          unitPrice: this.parseNumber(matches[3]),
          total: matches[4] ? this.parseNumber(matches[4]) : parseInt(matches[1]) * this.parseNumber(matches[3])
        })
      },
      // Pattern: "Solar Panels: 550W x 10 = KSh 125,000"
      {
        regex: /([^:]+?):\s*(\d+w?)\s*x\s*(\d+)\s*=\s*[^0-9]*([\d,]+)/i,
        extract: (matches: any) => ({
          item: `${matches[1]} (${matches[2]})`,
          quantity: parseInt(matches[3]),
          unitPrice: this.parseNumber(matches[4]) / parseInt(matches[3]),
          total: this.parseNumber(matches[4])
        })
      }
    ];

    for (const pattern of patterns) {
      const matches = line.match(pattern.regex);
      if (matches) {
        const parsed = pattern.extract(matches);
        return {
          category: this.categorizeItem(line),
          item: parsed.item || line,
          specification: '',
          quantity: parsed.quantity || 1,
          unit: this.extractUnit(line),
          unitPrice: parsed.unitPrice || 0,
          total: parsed.total || 0
        };
      }
    }

    return null;
  }

  /**
   * Categorize item based on keywords
   */
  private categorizeItem(text: string): 'equipment' | 'materials' | 'labor' | 'service' {
    const lower = text.toLowerCase();

    if (lower.includes('panel') || lower.includes('inverter') || lower.includes('battery') || lower.includes('controller')) {
      return 'equipment';
    }
    if (lower.includes('cable') || lower.includes('breaker') || lower.includes('mount') || lower.includes('structure')) {
      return 'materials';
    }
    if (lower.includes('labor') || lower.includes('installation') || lower.includes('commission')) {
      return 'labor';
    }
    return 'service';
  }

  /**
   * Extract unit from text
   */
  private extractUnit(text: string): string {
    if (text.match(/\b(?:pcs|pieces|units?)\b/i)) return 'pcs';
    if (text.match(/\b(?:m|meters?)\b/i)) return 'm';
    if (text.match(/\b(?:kg|kilograms?)\b/i)) return 'kg';
    return 'unit';
  }

  /**
   * Parse number from string (handle commas, currency symbols)
   */
  private parseNumber(str: string): number {
    return parseFloat(str.replace(/[^0-9.-]/g, ''));
  }

  /**
   * Generate quote from extracted data
   */
  generateQuote(extractedData: ExtractedData, systemSize: number): Quote {
    const items = extractedData.items;
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * 0.16; // 16% VAT for Kenya

    return {
      id: `EIMS-SOLAR-${Date.now()}`,
      clientName: extractedData.clientName || 'Unknown Client',
      address: extractedData.address || '',
      systemSize,
      items,
      subtotal,
      vat,
      total: subtotal + vat,
      currency: 'KSH',
      paymentTerms: '30% deposit, 70% on completion',
      validity: 30,
      timestamp: new Date(),
      status: 'draft'
    };
  }
}

// React Component
export const QuoteParserUI: React.FC<{ onQuoteGenerated: (quote: Quote) => void }> = ({ onQuoteGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [systemSize, setSystemSize] = useState(5.6);
  const parserRef = React.useRef(new NLPQuoteParser());

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    try {
      let extracted: ExtractedData | null = null;

      if (uploadedFile.type === 'application/pdf') {
        const text = await parserRef.current.extractFromPDF(uploadedFile);
        extracted = await parserRef.current.parseNaturalLanguage(text);
      } else if (uploadedFile.type.includes('spreadsheet') || uploadedFile.name.endsWith('.xlsx')) {
        const items = await parserRef.current.extractFromExcel(uploadedFile);
        extracted = {
          items,
          rawText: `Excel file with ${items.length} items`,
          confidence: 0.9
        };
      } else if (uploadedFile.type.startsWith('image/')) {
        const text = await parserRef.current.extractFromImage(uploadedFile);
        extracted = await parserRef.current.parseNaturalLanguage(text);
      }

      if (extracted) {
        setExtractedData(extracted);

        // Generate quote automatically
        const generatedQuote = parserRef.current.generateQuote(extracted, systemSize);
        setQuote(generatedQuote);
        onQuoteGenerated(generatedQuote);
      }
    } catch (error) {
      console.error('File processing error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-parser-container">
      <div className="parser-header">
        <h2>📄 Get AI Quote</h2>
        <p>Upload BOQ, utility bill, or bill of quantities - AI generates quote instantly</p>
      </div>

      <div className="parser-controls">
        <div className="file-upload">
          <input
            type="file"
            accept=".pdf,.xlsx,.xls,.jpg,.png,.gif"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <button disabled={loading}>
            {loading ? '⏳ Processing...' : '📁 Choose File'}
          </button>
        </div>

        <div className="system-size-input">
          <label>System Size (kWp):</label>
          <input
            type="number"
            value={systemSize}
            onChange={(e) => setSystemSize(parseFloat(e.target.value))}
            step="0.1"
          />
        </div>
      </div>

      {extractedData && (
        <div className="extracted-preview">
          <h3>📋 Extracted Data</h3>
          <div className="preview-grid">
            <div className="preview-item">
              <span className="label">Client:</span>
              <span>{extractedData.clientName || 'Not extracted'}</span>
            </div>
            <div className="preview-item">
              <span className="label">Address:</span>
              <span>{extractedData.address || 'Not extracted'}</span>
            </div>
            <div className="preview-item">
              <span className="label">Items Found:</span>
              <span>{extractedData.items.length}</span>
            </div>
            <div className="preview-item">
              <span className="label">Extraction Confidence:</span>
              <span>{(extractedData.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {quote && (
        <div className="quote-display">
          <h3>✅ Generated Quote</h3>
          <div className="quote-header">
            <h4>{quote.id}</h4>
            <p className="client-info">
              {quote.clientName} | {quote.address}
            </p>
          </div>

          <table className="quote-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map(item => (
                <tr key={item.id}>
                  <td>{item.item}</td>
                  <td className="numeric">{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td className="numeric">{item.unitPrice.toLocaleString()}</td>
                  <td className="numeric">{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="quote-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span className="amount">KSh {quote.subtotal.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>VAT (16%):</span>
              <span className="amount">KSh {quote.vat.toLocaleString()}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span className="amount">KSh {quote.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="quote-actions">
            <button className="btn-send">📧 Send to Client</button>
            <button className="btn-download">📥 Download PDF</button>
            <button className="btn-edit">✏️ Edit Quote</button>
          </div>
        </div>
      )}

      <div className="supported-formats">
        <h3>📎 Supported File Formats</h3>
        <div className="format-list">
          <div className="format">
            <span>📄 PDF</span>
            <p>Bills of Quantity, invoices, scanned documents</p>
          </div>
          <div className="format">
            <span>📊 Excel</span>
            <p>.xlsx, .xls files with item lists and pricing</p>
          </div>
          <div className="format">
            <span>🖼️ Images</span>
            <p>JPG, PNG photos of bills or quotes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteParserUI;
export { NLPQuoteParser };

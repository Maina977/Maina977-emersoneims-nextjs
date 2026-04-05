/**
 * BOQ Parser API - Real Document Analysis
 * Parses Bill of Quantities documents (Excel, PDF, CSV)
 *
 * Extracts:
 * - Equipment items and specifications
 * - Quantities and units
 * - Pricing information
 * - Labor costs
 * - Project totals
 */

import { NextRequest, NextResponse } from 'next/server';

interface BOQParseRequest {
  document: string;           // Base64 encoded document or text content
  documentType?: 'excel' | 'pdf' | 'csv' | 'text' | 'auto';
  projectType?: 'solar' | 'electrical' | 'construction' | 'general';
}

interface BOQItem {
  id: string;
  itemNumber?: string;
  description: string;
  specification?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: string;
  brand?: string;
  model?: string;
  notes?: string;
}

interface ParsedBOQ {
  projectInfo: {
    name?: string;
    client?: string;
    location?: string;
    date?: string;
    reference?: string;
  };
  items: BOQItem[];
  categories: {
    name: string;
    itemCount: number;
    subtotal: number;
  }[];
  summary: {
    totalItems: number;
    subtotal: number;
    vat: number;
    vatRate: number;
    grandTotal: number;
    currency: string;
  };
  solarAnalysis?: {
    panelCount: number;
    panelWattage: number;
    totalCapacity: number;      // kWp
    inverterCapacity: number;   // kW
    batteryCapacity: number;    // kWh
    mountingType: string;
    estimatedProduction: number; // kWh/year
    recommendations: string[];
  };
}

interface BOQParseResponse {
  success: boolean;
  data?: {
    parsedBOQ: ParsedBOQ;
    rawText?: string;
    confidence: number;
    processingTime: number;
  };
  error?: string;
  configRequired?: boolean;
}

const OPENAI_API = 'https://api.openai.com/v1/chat/completions';

const BOQ_PARSE_PROMPT = `You are an expert quantity surveyor analyzing a Bill of Quantities document.

Parse this BOQ document and extract all items, quantities, and pricing. Return a structured JSON response.

For solar projects, also analyze the system specifications and provide recommendations.

JSON structure required:
{
  "projectInfo": {
    "name": "<project name if found>",
    "client": "<client name if found>",
    "location": "<location if found>",
    "date": "<date if found>",
    "reference": "<reference number if found>"
  },
  "items": [
    {
      "id": "item_1",
      "itemNumber": "<original item number>",
      "description": "<full item description>",
      "specification": "<technical specs if any>",
      "quantity": <number>,
      "unit": "<unit: pcs, m, kg, set, lot, etc>",
      "unitPrice": <number>,
      "totalPrice": <number>,
      "category": "<category: panels, inverters, batteries, mounting, cables, accessories, labor, etc>",
      "brand": "<brand if specified>",
      "model": "<model if specified>",
      "notes": "<any notes>"
    }
  ],
  "categories": [
    {
      "name": "<category name>",
      "itemCount": <number>,
      "subtotal": <number>
    }
  ],
  "summary": {
    "totalItems": <number>,
    "subtotal": <number>,
    "vat": <number>,
    "vatRate": <percentage as number>,
    "grandTotal": <number>,
    "currency": "KES|USD|EUR|etc"
  },
  "solarAnalysis": {
    "panelCount": <number>,
    "panelWattage": <W per panel>,
    "totalCapacity": <kWp>,
    "inverterCapacity": <kW>,
    "batteryCapacity": <kWh>,
    "mountingType": "<roof/ground/carport>",
    "estimatedProduction": <kWh/year, based on 5 peak sun hours>,
    "recommendations": ["<rec1>", "<rec2>"]
  }
}

Notes:
- If currency is not specified, assume KES (Kenyan Shillings)
- Calculate totals if not provided
- Use standard VAT rate of 16% for Kenya if not specified
- For solar production estimate: kWp × 5 hours × 365 days × 0.8 efficiency

Respond ONLY with valid JSON.`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: BOQParseRequest = await request.json();
    const { document, documentType = 'auto', projectType = 'solar' } = body;

    // Check configuration
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API not configured. Add OPENAI_API_KEY to environment variables.',
          configRequired: true,
        },
        { status: 503 }
      );
    }

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Missing document data' },
        { status: 400 }
      );
    }

    // Prepare content for analysis
    let contentForAnalysis = '';
    let isImage = false;

    // Check if it's base64 encoded
    if (document.includes('base64,') || /^[A-Za-z0-9+/=]+$/.test(document.substring(0, 100))) {
      // Could be an image/PDF
      const base64Data = document.includes('base64,')
        ? document.split('base64,')[1]
        : document;

      // Check for image signatures
      const signature = atob(base64Data.substring(0, 10));
      if (signature.startsWith('\x89PNG') || signature.startsWith('\xFF\xD8')) {
        isImage = true;
      } else if (signature.startsWith('%PDF')) {
        // PDF - would need PDF parsing library
        // For now, return guidance
        return NextResponse.json(
          {
            success: false,
            error: 'PDF parsing requires additional setup. Please convert to text or Excel first, or upload as image.',
            guidance: {
              option1: 'Convert PDF to Excel and upload',
              option2: 'Copy text content and paste directly',
              option3: 'Take screenshot and upload as image',
            },
          },
          { status: 400 }
        );
      }
    }

    // If not image, treat as text/CSV content
    if (!isImage) {
      contentForAnalysis = document;

      // If it looks like base64 text, try to decode
      if (/^[A-Za-z0-9+/=]+$/.test(document.substring(0, 50)) && document.length > 100) {
        try {
          contentForAnalysis = atob(document);
        } catch (e) {
          contentForAnalysis = document;
        }
      }
    }

    console.log(`[BOQ Parser] Analyzing ${isImage ? 'image' : 'text'} document...`);

    // Build API request
    let messages: any[];

    if (isImage) {
      messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: BOQ_PARSE_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: document.includes('base64,') ? document : `data:image/png;base64,${document}`,
                detail: 'high',
              },
            },
          ],
        },
      ];
    } else {
      messages = [
        {
          role: 'user',
          content: `${BOQ_PARSE_PROMPT}\n\nDOCUMENT CONTENT:\n\`\`\`\n${contentForAnalysis}\n\`\`\``,
        },
      ];
    }

    const response = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: isImage ? 'gpt-4o' : 'gpt-4o',
        messages,
        max_tokens: 4000,
        temperature: 0.1,  // Very low temperature for accurate parsing
      }),
      signal: AbortSignal.timeout(90000),  // 90 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[BOQ Parser] OpenAI error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.error?.message || 'BOQ parsing failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawAnalysis = data.choices?.[0]?.message?.content || '';

    // Parse JSON response
    let parsedBOQ: ParsedBOQ;
    try {
      let jsonStr = rawAnalysis;
      if (rawAnalysis.includes('```json')) {
        jsonStr = rawAnalysis.split('```json')[1].split('```')[0].trim();
      } else if (rawAnalysis.includes('```')) {
        jsonStr = rawAnalysis.split('```')[1].split('```')[0].trim();
      }
      parsedBOQ = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[BOQ Parser] Parse error:', rawAnalysis);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse BOQ analysis results',
          rawText: rawAnalysis,
        },
        { status: 500 }
      );
    }

    // Validate and enhance the parsed data
    if (!parsedBOQ.items || parsedBOQ.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No items found in document. Please ensure the document contains BOQ items.',
        },
        { status: 400 }
      );
    }

    // Calculate summary if not properly calculated
    if (!parsedBOQ.summary?.grandTotal) {
      const subtotal = parsedBOQ.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      const vatRate = parsedBOQ.summary?.vatRate || 16;
      const vat = subtotal * (vatRate / 100);

      parsedBOQ.summary = {
        totalItems: parsedBOQ.items.length,
        subtotal,
        vat,
        vatRate,
        grandTotal: subtotal + vat,
        currency: parsedBOQ.summary?.currency || 'KES',
      };
    }

    const processingTime = Date.now() - startTime;
    console.log(`[BOQ Parser] Complete in ${processingTime}ms - ${parsedBOQ.items.length} items parsed`);

    return NextResponse.json({
      success: true,
      data: {
        parsedBOQ,
        rawText: isImage ? undefined : contentForAnalysis.substring(0, 500),
        confidence: parsedBOQ.items.length > 0 ? 85 : 50,
        processingTime,
      },
    });

  } catch (error) {
    console.error('[BOQ Parser] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'BOQ parsing failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      configured: !!process.env.OPENAI_API_KEY,
      supportedFormats: [
        'Text/CSV - Paste or upload directly',
        'Excel - Convert to CSV or paste content',
        'Image - Screenshot of BOQ table (JPG/PNG)',
      ],
      projectTypes: ['solar', 'electrical', 'construction', 'general'],
      features: [
        'Automatic item extraction',
        'Category grouping',
        'Total calculations',
        'Solar system analysis',
        'VAT calculation (16% Kenya default)',
      ],
    },
  });
}

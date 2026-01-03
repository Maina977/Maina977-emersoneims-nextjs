/**
 * AI GENERATOR DIAGNOSTIC API
 * Dedicated endpoint for AI-powered fault code analysis
 * 
 * Endpoints:
 * POST /api/ai/diagnose - Analyze symptoms/codes
 * 
 * @copyright 2026 EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  analyzeSymptoms, 
  searchFaultCodes, 
  getExactCode,
  DiagnosticResult,
  MatchedCode
} from '@/lib/ai/diagnosticAI';

type DiagnoseRequestBody = {
  query: string;
  brand?: string;
  category?: string;
  mode?: 'analyze' | 'search' | 'lookup';
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DiagnoseRequestBody;
    const { query, brand, category, mode = 'analyze' } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid query' },
        { status: 400 }
      );
    }

    let result: DiagnosticAPIResponse;

    switch (mode) {
      case 'lookup':
        // Direct code lookup
        result = handleLookup(query);
        break;
      
      case 'search':
        // Keyword search
        result = handleSearch(query);
        break;
      
      case 'analyze':
      default:
        // Full AI analysis
        result = handleAnalysis(query);
        break;
    }

    return NextResponse.json({
      success: true,
      mode,
      query,
      timestamp: Date.now(),
      ...result
    });

  } catch (error) {
    console.error('Diagnostic API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process diagnostic request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

type DiagnosticAPIResponse = {
  found: boolean;
  confidence?: number;
  results?: MatchedCode[];
  analysis?: DiagnosticResult;
  code?: MatchedCode;
  summary?: string;
};

/**
 * Direct fault code lookup
 */
function handleLookup(query: string): DiagnosticAPIResponse {
  // Extract code pattern from query
  const codeMatch = query.match(/[A-Z]{1,3}[-_]?\d{2,5}/i);
  const searchCode = codeMatch ? codeMatch[0] : query.trim();
  
  const code = getExactCode(searchCode);
  
  if (code) {
    return {
      found: true,
      confidence: 100,
      code,
      summary: `Found exact match for code ${code.code}: ${code.title}`
    };
  }
  
  // Try fuzzy search if exact match fails
  const searchResults = searchFaultCodes(searchCode, 5);
  if (searchResults.length > 0) {
    return {
      found: true,
      confidence: searchResults[0].confidence,
      results: searchResults,
      summary: `Found ${searchResults.length} similar codes`
    };
  }
  
  return {
    found: false,
    summary: `No fault code found matching "${searchCode}"`
  };
}

/**
 * Keyword search in fault codes
 */
function handleSearch(query: string): DiagnosticAPIResponse {
  const results = searchFaultCodes(query, 20);
  
  if (results.length > 0) {
    return {
      found: true,
      confidence: results[0].confidence,
      results,
      summary: `Found ${results.length} fault codes matching "${query}"`
    };
  }
  
  return {
    found: false,
    results: [],
    summary: `No fault codes found matching "${query}"`
  };
}

/**
 * Full AI symptom analysis
 */
function handleAnalysis(query: string): DiagnosticAPIResponse {
  const analysis = analyzeSymptoms(query);
  
  if (analysis.matchedCodes.length > 0) {
    return {
      found: true,
      confidence: analysis.confidence,
      analysis,
      results: analysis.matchedCodes,
      summary: analysis.aiSummary
    };
  }
  
  return {
    found: false,
    confidence: 0,
    analysis,
    summary: 'Unable to match symptoms to specific fault codes. Please provide more details or check our Diagnostic Suite.'
  };
}

/**
 * GET endpoint for simple code lookup
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const query = searchParams.get('query');
  const search = searchParams.get('search');
  
  if (code) {
    const result = getExactCode(code);
    if (result) {
      return NextResponse.json({
        success: true,
        code: result
      });
    }
    return NextResponse.json({
      success: false,
      error: 'Code not found'
    }, { status: 404 });
  }
  
  if (query) {
    const analysis = analyzeSymptoms(query);
    return NextResponse.json({
      success: true,
      analysis
    });
  }
  
  if (search) {
    const results = searchFaultCodes(search, 10);
    return NextResponse.json({
      success: true,
      results
    });
  }
  
  return NextResponse.json({
    success: false,
    error: 'Missing required parameter: code, query, or search',
    usage: {
      lookup: '/api/ai/diagnose?code=E1001',
      analyze: '/api/ai/diagnose?query=generator+overheating',
      search: '/api/ai/diagnose?search=fuel+pressure'
    }
  }, { status: 400 });
}

/**
 * AI CHAT API
 * Enhanced with AI-Powered Generator Diagnostic Engine
 * 
 * Features:
 * - Natural language fault code analysis
 * - Symptom-to-code mapping
 * - Brand-specific diagnostics
 * - Confidence scoring
 * - Step-by-step solutions
 * 
 * @copyright 2026 EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeSymptoms, getExactCode, DiagnosticResult } from '@/lib/ai/diagnosticAI';
import { isClaudeAPIEnabled, chatWithContext, analyzeDiagnostic, estimateCost } from '@/lib/ai/claudeService';

type ChatContext = {
  page?: string;
  interests?: string[];
  isDiagnostic?: boolean;
};

type ChatRequestBody = {
  conversationId?: string;
  message?: string;
  context?: ChatContext;
  history?: unknown[];
};

// Diagnostic keywords that trigger AI analysis
const DIAGNOSTIC_TRIGGERS = [
  'error', 'fault', 'code', 'problem', 'issue', 'not working', 'won\'t',
  'doesn\'t', 'smoke', 'overheating', 'shutdown', 'low power', 'noise',
  'vibration', 'leak', 'pressure', 'temperature', 'voltage', 'diagnose',
  'troubleshoot', 'fix', 'repair', 'what\'s wrong', 'why is my', 'help with'
];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const conversationId = body.conversationId;
    const message = body.message;
    const context = body.context;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid message' },
        { status: 400 }
      );
    }

    // Check if this is a diagnostic query
    const isDiagnosticQuery = checkDiagnosticQuery(message, context);

    let response: string;
    let diagnosticData: DiagnosticResult | null = null;
    let tokenUsage: { inputTokens: number; outputTokens: number } | null = null;

    // Try Claude API first if enabled
    if (isClaudeAPIEnabled()) {
      try {
        if (isDiagnosticQuery) {
          // Use Claude for enhanced diagnostic analysis
          diagnosticData = analyzeSymptoms(message);
          const claudeResult = await analyzeDiagnostic(
            message,
            diagnosticData.detectedBrand || undefined,
            diagnosticData.matchedCodes.map(c => c.code)
          );

          // Combine Claude analysis with our pattern matching
          response = formatClaudeDiagnosticResponse(message, diagnosticData, claudeResult.analysis);
          tokenUsage = claudeResult.usage;
        } else {
          // Use Claude for general chat
          const result = await chatWithContext(message, context ?? {});
          response = result.response;
          tokenUsage = result.usage;
        }
      } catch (error) {
        console.error('Claude API failed, falling back to rule-based system:', error);
        // Fallback to rule-based system
        if (isDiagnosticQuery) {
          diagnosticData = analyzeSymptoms(message);
          response = formatDiagnosticResponse(message, diagnosticData);
        } else {
          response = await generateAIResponse(message, context ?? {});
        }
      }
    } else {
      // Use rule-based system
      if (isDiagnosticQuery) {
        diagnosticData = analyzeSymptoms(message);
        response = formatDiagnosticResponse(message, diagnosticData);
      } else {
        response = await generateAIResponse(message, context ?? {});
      }
    }

    // Calculate cost if using Claude API
    const costEstimate = tokenUsage ? estimateCost(tokenUsage.inputTokens, tokenUsage.outputTokens) : null;

    return NextResponse.json({
      conversationId,
      response,
      timestamp: Date.now(),
      isDiagnostic: isDiagnosticQuery,
      usedClaudeAPI: isClaudeAPIEnabled() && tokenUsage !== null,
      diagnosticData: diagnosticData ? {
        confidence: diagnosticData.confidence,
        matchedCodesCount: diagnosticData.matchedCodes.length,
        detectedSymptoms: diagnosticData.detectedSymptoms,
        detectedBrand: diagnosticData.detectedBrand,
        estimatedDifficulty: diagnosticData.estimatedDifficulty,
        estimatedTime: diagnosticData.estimatedTime
      } : null,
      ...(tokenUsage && {
        apiUsage: {
          inputTokens: tokenUsage.inputTokens,
          outputTokens: tokenUsage.outputTokens,
          estimatedCost: costEstimate?.totalCost.toFixed(4)
        }
      })
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

/**
 * Check if message is a diagnostic/troubleshooting query
 */
function checkDiagnosticQuery(message: string, context?: ChatContext): boolean {
  // Force diagnostic mode if context indicates
  if (context?.isDiagnostic) return true;
  if (context?.page?.includes('diagnostic')) return true;
  
  const lowerMessage = message.toLowerCase();
  
  // Check for error code patterns (e.g., "E1001", "SPN-524", "fault 111")
  const codePattern = /[A-Z]{1,3}[-_]?\d{2,5}|fault\s*\d+|code\s*\d+|spn[-\s]?\d+|fmi[-\s]?\d+/i;
  if (codePattern.test(message)) return true;
  
  // Check for diagnostic trigger keywords
  for (const trigger of DIAGNOSTIC_TRIGGERS) {
    if (lowerMessage.includes(trigger)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Format Claude-enhanced diagnostic response
 */
function formatClaudeDiagnosticResponse(
  query: string,
  diagnosticResult: DiagnosticResult,
  claudeAnalysis: string
): string {
  const brandInfo = diagnosticResult.detectedBrand ? ` (${diagnosticResult.detectedBrand})` : '';

  let response = `🤖 **AI-Enhanced Diagnostic Analysis**${brandInfo}\n\n`;

  // Add Claude's analysis
  response += claudeAnalysis;

  // Add matched codes from our database if available
  if (diagnosticResult.matchedCodes.length > 0) {
    response += `\n\n---\n\n### 📋 Matched Fault Codes from Our Database\n`;
    diagnosticResult.matchedCodes.slice(0, 3).forEach((code, i) => {
      response += `${i + 1}. \`${code.code}\` - ${code.title} (${code.confidence}% match)\n`;
    });
  }

  // Add footer
  response += `\n\n---\n📞 **Need Expert Help?** Call **+254768860665** for immediate assistance.`;

  return response;
}

/**
 * Format diagnostic results into readable response
 */
function formatDiagnosticResponse(query: string, result: DiagnosticResult): string {
  // Check for exact code lookup
  const codeMatch = query.match(/[A-Z]{1,3}[-_]?\d{2,5}/i);
  if (codeMatch) {
    const exactCode = getExactCode(codeMatch[0]);
    if (exactCode) {
      return formatExactCodeResponse(exactCode);
    }
  }
  
  // No matches found
  if (result.matchedCodes.length === 0) {
    return `🔍 **AI Diagnostic Analysis**

I analyzed your query but couldn't find specific fault codes matching your description. 

**Try these approaches:**
1. Enter the exact error code displayed (e.g., "E1001" or "SPN 111")
2. Describe symptoms in detail (e.g., "generator overheating and shutting down")
3. Mention the brand (e.g., "Cummins won't start")

**Common diagnostic queries:**
- "Black smoke from Cummins generator"
- "Caterpillar low oil pressure warning"
- "Generator won't start after sitting"
- "Voltage fluctuating on generator"

Or visit our **[Diagnostic Suite](/diagnostic-suite)** for interactive troubleshooting.

📞 Need immediate help? Call **+254768860665**`;
  }
  
  // Format matched results
  const topMatch = result.matchedCodes[0];
  const brandInfo = result.detectedBrand ? ` (${result.detectedBrand})` : '';
  
  let response = `🔧 **AI Diagnostic Analysis**${brandInfo}

**Confidence:** ${result.confidence}% | **Difficulty:** ${result.estimatedDifficulty} | **Est. Time:** ${result.estimatedTime}

---

${result.aiSummary}

`;

  // Top matched code details
  response += `### 🎯 Most Likely Issue: ${topMatch.title}
**Code:** \`${topMatch.code}\` | **Category:** ${topMatch.category} | **Severity:** ${topMatch.severity}

`;

  if (topMatch.description) {
    response += `**Description:** ${topMatch.description}\n\n`;
  }

  // Causes
  if (topMatch.causes && topMatch.causes.length > 0) {
    response += `**Possible Causes:**\n`;
    topMatch.causes.slice(0, 4).forEach((cause, i) => {
      response += `${i + 1}. ${cause}\n`;
    });
    response += '\n';
  }

  // Solution
  if (topMatch.solution) {
    response += `**Solution:** ${topMatch.solution}\n\n`;
  }

  // Recommended actions
  if (result.recommendedActions.length > 0) {
    response += `### ✅ Recommended Actions\n`;
    result.recommendedActions.slice(0, 5).forEach((action, i) => {
      response += `${i + 1}. ${action}\n`;
    });
    response += '\n';
  }

  // Safety warnings
  if (result.safetyWarnings.length > 0) {
    response += `### ⚠️ Safety Warnings\n`;
    result.safetyWarnings.slice(0, 4).forEach(warning => {
      response += `- ${warning}\n`;
    });
    response += '\n';
  }

  // Other possible codes
  if (result.matchedCodes.length > 1) {
    response += `### 📋 Other Possible Codes\n`;
    result.matchedCodes.slice(1, 5).forEach(code => {
      response += `- \`${code.code}\` - ${code.title} (${code.confidence}%)\n`;
    });
    response += '\n';
  }

  // Expert guidance
  response += `---\n📞 **When to Call Expert:** ${result.whenToCallExpert}`;

  return response;
}

/**
 * Format response for exact code lookup
 */
function formatExactCodeResponse(code: ReturnType<typeof getExactCode>): string {
  if (!code) return '';
  
  let response = `🔧 **Fault Code: ${code.code}**

**${code.title}**
**Brand:** ${code.brand} | **Category:** ${code.category} | **Severity:** ${code.severity}

---

`;

  if (code.description) {
    response += `**Description:** ${code.description}\n\n`;
  }

  if (code.causes && code.causes.length > 0) {
    response += `**Possible Causes:**\n`;
    code.causes.forEach((cause, i) => {
      response += `${i + 1}. ${cause}\n`;
    });
    response += '\n';
  }

  if (code.solution) {
    response += `**Solution:** ${code.solution}\n\n`;
  }

  response += `---\n📞 Need assistance? Contact EmersonEIMS at **+254768860665**`;

  return response;
}

/**
 * Standard AI response for non-diagnostic queries
 */
async function generateAIResponse(
  message: string,
  context: ChatContext
): Promise<string> {
  const lowerMessage = message.toLowerCase();
  const page = context.page || '';

  // Generator diagnostics nudge
  if (lowerMessage.includes('generator') && !context.isDiagnostic) {
    return `I'd be happy to help with generators! We provide diesel generators, maintenance services, and parts. 

🔧 **Need Diagnostic Help?** I can analyze generator fault codes and symptoms! Just describe the issue:
- "My Cummins generator won't start"
- "Black smoke from CAT generator"
- "Error code E1001"

Are you looking for a new installation, need service, or have a diagnostic question?`;
  }

  // Solar queries
  if (lowerMessage.includes('solar') || page.includes('solar')) {
    return `Great question about solar energy! At EmersonEIMS, we offer comprehensive solar solutions including installation, maintenance, and battery storage systems. What specific aspect of solar energy are you interested in?`;
  }

  // Pricing queries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return `Pricing depends on your specific needs. I'd recommend booking a free consultation so our experts can provide you with a customized quote. Would you like me to help you schedule that?`;
  }

  // Contact queries
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
    return `You can reach us at info@emersoneims.com or call **+254768860665**. Would you like me to help you get in touch with our team right now?`;
  }

  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! I'm the EmersonEIMS AI Assistant. I can help you with:

🔧 **Generator Diagnostics** - Describe symptoms or enter fault codes
☀️ **Solar Solutions** - Installation, maintenance, batteries
🔌 **UPS Systems** - Power backup solutions
📞 **Service Booking** - Schedule maintenance

How can I assist you today?`;
  }

  // Default response
  return `Thank you for your question! I'm the EmersonEIMS AI Assistant, here to help with:

🔧 **Generator Diagnostics** - I can analyze fault codes and symptoms
☀️ **Solar Systems** - Installations and maintenance
🔌 **UPS & Power** - Backup power solutions
🛠️ **Parts & Service** - Equipment and support

Try asking: "My generator won't start" or "What does error code E1001 mean?"`;
}


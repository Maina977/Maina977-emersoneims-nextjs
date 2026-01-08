# Claude Opus 4.5 Integration Guide

This guide explains how to set up and use Claude Opus 4.5 API in your EmersonEIMS application.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Usage](#usage)
- [Cost Management](#cost-management)
- [Troubleshooting](#troubleshooting)

---

## Overview

The EmersonEIMS application integrates Claude Opus 4.5 to provide:

- **Enhanced AI Chat**: Natural, context-aware conversations
- **Advanced Diagnostics**: Expert-level generator troubleshooting
- **Real-time Streaming**: Character-by-character response rendering
- **Smart Fallback**: Automatic fallback to rule-based system if API fails

### What's Integrated

1. **Chat API** ([/app/api/ai/chat/route.ts](../app/api/ai/chat/route.ts))
   - General customer inquiries
   - Product information
   - Context-aware responses

2. **Diagnostic API** ([/app/api/ai/diagnose/route.ts](../app/api/ai/diagnose/route.ts))
   - Symptom analysis
   - Fault code explanation
   - Troubleshooting recommendations

3. **Streaming API** ([/app/api/ai/chat/stream/route.ts](../app/api/ai/chat/stream/route.ts))
   - Real-time response streaming
   - Enhanced user experience

---

## Prerequisites

### 1. Claude Pro Subscription vs API Access

**Important:** These are separate services with different purposes:

| Feature | Claude Pro ($20/month) | API Access (Pay-as-you-go) |
|---------|------------------------|----------------------------|
| **What it's for** | Personal use, Claude Code CLI | Application integration |
| **Access to** | claude.ai, VSCode Claude Code | Your Next.js application |
| **Billing** | Fixed monthly fee | Per-token usage ($5/$25 per million) |
| **Your $23 payment** | ✅ This covers Claude Pro | ❌ Separate billing required |

### 2. VSCode Claude Code Setup

Your VSCode is already configured correctly:

**File:** [.vscode/settings.json](../.vscode/settings.json)
```json
{
  "claude.model": "claude-opus-4-5-20251101",
  "anthropic.claude-code.model": "opus"
}
```

This means **you're using Opus 4.5 right now** in this conversation!

---

## Setup Instructions

### Step 1: Get Your API Key

1. Visit [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Log in with your Anthropic account
3. Click **"Create Key"**
4. Copy your API key (starts with `sk-ant-api03-`)
5. Store it securely (you won't see it again!)

**Note:** This is separate from your Claude Pro subscription. API usage is billed separately based on token consumption.

### Step 2: Configure Environment Variables

1. Open [.env.local](../.env.local)
2. Uncomment and add your API key:

```env
# Claude AI API Configuration
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
CLAUDE_MODEL=claude-opus-4-5-20251101
USE_CLAUDE_API=true
```

3. **Never commit** `.env.local` to git (already in `.gitignore`)

### Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Verify Integration

Test the API endpoint:

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "My Cummins generator won'\''t start"}'
```

Look for `"usedClaudeAPI": true` in the response.

---

## Configuration

### Environment Variables

All Claude configuration is in your `.env.local` file:

```env
# Required: Your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# Optional: Model selection (default: claude-opus-4-5-20251101)
CLAUDE_MODEL=claude-opus-4-5-20251101

# Optional: Enable/disable Claude API (default: false)
USE_CLAUDE_API=true

# Optional: Max tokens per request (default: 4096)
CLAUDE_MAX_TOKENS=4096
```

### Feature Flags

The integration uses smart feature detection:

- **If `ANTHROPIC_API_KEY` is set** → Uses Claude API
- **If not set or API fails** → Falls back to rule-based system
- **No breaking changes** → Existing functionality preserved

---

## Usage

### 1. Chat Endpoint

**Endpoint:** `POST /api/ai/chat`

**Request:**
```json
{
  "message": "What generators do you sell?",
  "context": {
    "page": "/products/generators",
    "interests": ["diesel", "backup-power"]
  }
}
```

**Response:**
```json
{
  "conversationId": "abc123",
  "response": "EmersonEIMS offers a comprehensive range...",
  "usedClaudeAPI": true,
  "apiUsage": {
    "inputTokens": 234,
    "outputTokens": 567,
    "estimatedCost": "0.0156"
  }
}
```

### 2. Diagnostic Endpoint

**Endpoint:** `POST /api/ai/diagnose`

**Request:**
```json
{
  "query": "My generator is smoking black and losing power",
  "brand": "Cummins",
  "mode": "analyze"
}
```

**Response:**
```json
{
  "success": true,
  "found": true,
  "confidence": 87,
  "claudeAnalysis": "Based on the symptoms...",
  "results": [...],
  "usedClaudeAPI": true,
  "apiUsage": {
    "inputTokens": 456,
    "outputTokens": 892,
    "estimatedCost": "0.0245"
  }
}
```

### 3. Streaming Endpoint

**Endpoint:** `POST /api/ai/chat/stream`

**Request:**
```json
{
  "message": "Explain how diesel generators work",
  "context": {
    "page": "/learn"
  }
}
```

**Response:** Server-Sent Events (SSE)
```
data: {"content":"Diesel"}
data: {"content":" generators"}
data: {"content":" work by"}
...
data: [DONE]
```

**Frontend Example:**
```javascript
const eventSource = new EventSource('/api/ai/chat/stream');

eventSource.onmessage = (event) => {
  if (event.data === '[DONE]') {
    eventSource.close();
    return;
  }

  const { content } = JSON.parse(event.data);
  appendToChat(content);
};
```

---

## Cost Management

### Pricing

**Claude Opus 4.5:**
- **Input:** $5 per million tokens (~$0.005 per 1K tokens)
- **Output:** $25 per million tokens (~$0.025 per 1K tokens)

### Estimated Costs

| Use Case | Avg Tokens | Cost per Request | 100 Requests |
|----------|------------|------------------|--------------|
| Simple chat | 200 in + 300 out | $0.0085 | $0.85 |
| Diagnostic analysis | 500 in + 1000 out | $0.0275 | $2.75 |
| Complex query | 800 in + 1500 out | $0.0415 | $4.15 |

**Monthly Estimate:**
- 50 chats/day = $12.75/month
- 20 diagnostics/day = $16.50/month
- Total: ~$30/month for moderate usage

### Cost Optimization Tips

1. **Use Prompt Caching** (90% savings on repeated prompts)
   ```typescript
   // Coming soon in claudeService.ts
   ```

2. **Batch Non-Urgent Requests** (50% savings)
   ```typescript
   // For background processing
   ```

3. **Use Sonnet for Simple Queries** (5x cheaper)
   ```env
   CLAUDE_MODEL=claude-sonnet-4-5-20250929
   ```

4. **Implement Rate Limiting**
   - Limit requests per user
   - Set daily quotas
   - Use rule-based for simple queries

5. **Monitor Usage**
   - Check [Anthropic Console](https://console.anthropic.com/settings/usage)
   - Review daily/monthly usage
   - Set up billing alerts

### Monitoring API Usage

Every response includes usage metrics:

```json
{
  "apiUsage": {
    "inputTokens": 456,
    "outputTokens": 892,
    "estimatedCost": "0.0245"
  }
}
```

Log these to track spending:

```typescript
console.log(`API Cost: $${response.apiUsage.estimatedCost}`);
```

---

## Troubleshooting

### Issue: "Failed to get response from Claude API"

**Possible Causes:**
1. Invalid API key
2. API key not set in environment
3. Network issues
4. Rate limiting

**Solutions:**
```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Check logs for specific error
npm run dev
# Watch console for error messages

# Test API key directly
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-opus-4-5-20251101","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
```

### Issue: "Streaming requires Claude API to be enabled"

**Solution:**
```env
# In .env.local, set:
USE_CLAUDE_API=true
```

### Issue: High API Costs

**Solutions:**
1. Check usage in [Anthropic Console](https://console.anthropic.com/settings/usage)
2. Implement rate limiting
3. Use rule-based system for simple queries
4. Switch to Sonnet for non-critical requests

### Issue: API Responses Not Using Claude

**Checklist:**
- ✅ `ANTHROPIC_API_KEY` is set in `.env.local`
- ✅ `USE_CLAUDE_API=true` in `.env.local`
- ✅ Development server restarted after env changes
- ✅ Check response has `"usedClaudeAPI": true`

**Debug:**
```typescript
// In your code, check:
import { isClaudeAPIEnabled, getModelInfo } from '@/lib/ai/claudeService';

console.log('Claude enabled:', isClaudeAPIEnabled());
console.log('Model info:', getModelInfo());
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Reinstall dependencies
npm install

# Run type check
npm run typecheck
```

---

## Production Deployment

### Vercel Environment Variables

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `ANTHROPIC_API_KEY` = your-api-key
   - `CLAUDE_MODEL` = claude-opus-4-5-20251101
   - `USE_CLAUDE_API` = true
4. Redeploy

### Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for all secrets
3. **Rotate keys periodically**
4. **Set up billing alerts** in Anthropic Console
5. **Implement rate limiting** in production
6. **Monitor usage** regularly

---

## Support

### Getting Help

- **API Issues:** [Anthropic Support](https://support.anthropic.com)
- **Application Issues:** Check logs in `npm run dev`
- **Billing Questions:** [Anthropic Console](https://console.anthropic.com)

### Useful Links

- [Claude API Documentation](https://docs.anthropic.com)
- [Model Pricing](https://www.anthropic.com/pricing)
- [API Reference](https://docs.anthropic.com/en/api/messages)
- [Anthropic Console](https://console.anthropic.com)

---

## Summary

You now have:

✅ **VSCode Claude Code** configured with Opus 4.5
✅ **Anthropic SDK** installed in your application
✅ **Environment variables** configured
✅ **Claude API service** wrapper created
✅ **Chat API** enhanced with Claude integration
✅ **Diagnostic API** enhanced with Claude analysis
✅ **Streaming API** for real-time responses
✅ **Smart fallback** to rule-based system
✅ **Cost tracking** and monitoring
✅ **Comprehensive documentation**

**Next Steps:**
1. Get your API key from Anthropic Console
2. Add it to `.env.local`
3. Set `USE_CLAUDE_API=true`
4. Restart dev server
5. Test the integration
6. Monitor costs and usage

Happy coding with Claude Opus 4.5! 🚀

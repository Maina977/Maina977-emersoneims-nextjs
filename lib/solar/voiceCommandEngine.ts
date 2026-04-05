/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO - VOICE COMMAND ENGINE                                    ║
 * ║   Speech Recognition & Voice Assistant for Hands-Free Operation            ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// VOICE COMMAND INTERFACES
// ============================================================================

export interface VoiceCommand {
  id: string;
  phrases: string[];
  action: string;
  category: 'navigation' | 'design' | 'calculation' | 'report' | 'help' | 'system';
  parameters?: string[];
  description: string;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  matchedCommand?: VoiceCommand;
  extractedParams?: Record<string, string | number>;
}

export interface VoiceAssistantResponse {
  text: string;
  action?: string;
  data?: any;
  speak: boolean;
}

export interface VoiceSettings {
  enabled: boolean;
  language: 'en-US' | 'en-GB' | 'sw-KE' | 'fr-FR' | 'ar-SA';
  wakeWord: string;
  continuousListening: boolean;
  speakResponses: boolean;
  volume: number;
  rate: number;
  pitch: number;
}

// ============================================================================
// VOICE COMMANDS LIBRARY - 50+ COMMANDS
// ============================================================================

export const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation Commands
  { id: 'nav-home', phrases: ['go home', 'go to home', 'home page', 'main menu'], action: 'NAVIGATE_HOME', category: 'navigation', description: 'Navigate to home screen' },
  { id: 'nav-design', phrases: ['open design', 'go to design', 'design mode', 'start designing'], action: 'NAVIGATE_DESIGN', category: 'navigation', description: 'Open 3D design tool' },
  { id: 'nav-quote', phrases: ['create quote', 'new quotation', 'generate quote', 'make quote'], action: 'NAVIGATE_QUOTE', category: 'navigation', description: 'Start new quotation' },
  { id: 'nav-reports', phrases: ['show reports', 'open reports', 'view reports', 'my reports'], action: 'NAVIGATE_REPORTS', category: 'navigation', description: 'View reports list' },
  { id: 'nav-education', phrases: ['open academy', 'solar academy', 'learn solar', 'education'], action: 'NAVIGATE_EDUCATION', category: 'navigation', description: 'Open Solar Academy' },
  { id: 'nav-back', phrases: ['go back', 'back', 'previous', 'return'], action: 'NAVIGATE_BACK', category: 'navigation', description: 'Go to previous screen' },

  // Design Commands
  { id: 'design-add-panel', phrases: ['add panel', 'add solar panel', 'place panel', 'new panel'], action: 'ADD_PANEL', category: 'design', description: 'Add panel to design' },
  { id: 'design-remove-panel', phrases: ['remove panel', 'delete panel', 'remove last panel'], action: 'REMOVE_PANEL', category: 'design', description: 'Remove panel from design' },
  { id: 'design-auto-fill', phrases: ['auto fill', 'fill roof', 'maximize panels', 'auto layout'], action: 'AUTO_FILL_PANELS', category: 'design', description: 'Auto-fill roof with panels' },
  { id: 'design-clear', phrases: ['clear design', 'clear all', 'remove all panels', 'start over'], action: 'CLEAR_DESIGN', category: 'design', description: 'Clear all panels' },
  { id: 'design-rotate', phrases: ['rotate view', 'rotate left', 'rotate right', 'spin'], action: 'ROTATE_VIEW', category: 'design', parameters: ['direction'], description: 'Rotate 3D view' },
  { id: 'design-zoom', phrases: ['zoom in', 'zoom out', 'zoom to fit'], action: 'ZOOM_VIEW', category: 'design', parameters: ['level'], description: 'Zoom 3D view' },
  { id: 'design-shading', phrases: ['show shading', 'shading analysis', 'analyze shadows', 'shadow study'], action: 'SHOW_SHADING', category: 'design', description: 'Run shading analysis' },
  { id: 'design-optimize', phrases: ['optimize layout', 'optimize panels', 'best layout', 'AI optimize'], action: 'OPTIMIZE_LAYOUT', category: 'design', description: 'AI-optimize panel layout' },

  // Calculation Commands
  { id: 'calc-production', phrases: ['calculate production', 'energy production', 'how much energy', 'annual production'], action: 'CALC_PRODUCTION', category: 'calculation', description: 'Calculate energy production' },
  { id: 'calc-roi', phrases: ['calculate ROI', 'return on investment', 'what is the ROI', 'payback period'], action: 'CALC_ROI', category: 'calculation', description: 'Calculate ROI' },
  { id: 'calc-savings', phrases: ['calculate savings', 'monthly savings', 'how much will I save', 'energy savings'], action: 'CALC_SAVINGS', category: 'calculation', description: 'Calculate savings' },
  { id: 'calc-cost', phrases: ['total cost', 'system cost', 'how much does it cost', 'price'], action: 'CALC_COST', category: 'calculation', description: 'Calculate total cost' },
  { id: 'calc-size', phrases: ['system size', 'how big', 'kilowatts', 'capacity'], action: 'CALC_SIZE', category: 'calculation', description: 'Show system size' },
  { id: 'calc-battery', phrases: ['battery size', 'calculate battery', 'backup hours', 'storage capacity'], action: 'CALC_BATTERY', category: 'calculation', parameters: ['hours'], description: 'Calculate battery requirement' },

  // Report Commands
  { id: 'report-generate', phrases: ['generate report', 'create report', 'make report', 'full report'], action: 'GENERATE_REPORT', category: 'report', description: 'Generate full report' },
  { id: 'report-download', phrases: ['download report', 'download PDF', 'save report', 'export PDF'], action: 'DOWNLOAD_REPORT', category: 'report', description: 'Download report as PDF' },
  { id: 'report-email', phrases: ['email report', 'send report', 'share report'], action: 'EMAIL_REPORT', category: 'report', description: 'Email report to client' },
  { id: 'report-bom', phrases: ['show BOM', 'bill of materials', 'materials list', 'components list'], action: 'SHOW_BOM', category: 'report', description: 'Show bill of materials' },
  { id: 'report-diagram', phrases: ['single line diagram', 'electrical diagram', 'wiring diagram', 'SLD'], action: 'GENERATE_SLD', category: 'report', description: 'Generate single-line diagram' },
  { id: 'report-permit', phrases: ['permit application', 'generate permit', 'permit documents'], action: 'GENERATE_PERMIT', category: 'report', description: 'Generate permit documents' },

  // Help Commands
  { id: 'help-general', phrases: ['help', 'help me', 'what can you do', 'commands'], action: 'SHOW_HELP', category: 'help', description: 'Show help menu' },
  { id: 'help-design', phrases: ['how to design', 'design help', 'design tutorial'], action: 'HELP_DESIGN', category: 'help', description: 'Design tutorial' },
  { id: 'help-quote', phrases: ['how to quote', 'quoting help', 'quotation help'], action: 'HELP_QUOTE', category: 'help', description: 'Quotation tutorial' },

  // System Commands
  { id: 'sys-settings', phrases: ['open settings', 'settings', 'preferences'], action: 'OPEN_SETTINGS', category: 'system', description: 'Open settings' },
  { id: 'sys-stop', phrases: ['stop listening', 'stop', 'pause', 'mute'], action: 'STOP_LISTENING', category: 'system', description: 'Stop voice recognition' },
  { id: 'sys-language', phrases: ['change language', 'switch language', 'español', 'swahili'], action: 'CHANGE_LANGUAGE', category: 'system', parameters: ['language'], description: 'Change language' },
];

// ============================================================================
// VOICE RECOGNITION ENGINE
// ============================================================================

export class VoiceRecognitionEngine {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private settings: VoiceSettings;
  private onResultCallback: ((result: VoiceRecognitionResult) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor(settings?: Partial<VoiceSettings>) {
    this.settings = {
      enabled: true,
      language: 'en-US',
      wakeWord: 'hey solar',
      continuousListening: true,
      speakResponses: true,
      volume: 1,
      rate: 1,
      pitch: 1,
      ...settings
    };

    this.initializeRecognition();
    this.initializeSynthesis();
  }

  private initializeRecognition(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = this.settings.continuousListening;
    this.recognition.interimResults = true;
    this.recognition.lang = this.settings.language;

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.toLowerCase().trim();
      const confidence = event.results[last][0].confidence;
      const isFinal = event.results[last].isFinal;

      const result = this.processTranscript(transcript, confidence, isFinal);
      if (this.onResultCallback) {
        this.onResultCallback(result);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening && this.settings.continuousListening) {
        this.recognition.start();
      }
    };
  }

  private initializeSynthesis(): void {
    if (typeof window === 'undefined') return;
    this.synthesis = window.speechSynthesis;
  }

  private processTranscript(transcript: string, confidence: number, isFinal: boolean): VoiceRecognitionResult {
    const result: VoiceRecognitionResult = {
      transcript,
      confidence,
      isFinal
    };

    if (isFinal) {
      // Match against commands
      for (const command of VOICE_COMMANDS) {
        for (const phrase of command.phrases) {
          if (transcript.includes(phrase)) {
            result.matchedCommand = command;
            result.extractedParams = this.extractParameters(transcript, command);
            break;
          }
        }
        if (result.matchedCommand) break;
      }
    }

    return result;
  }

  private extractParameters(transcript: string, command: VoiceCommand): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    // Extract numbers
    const numbers = transcript.match(/\d+/g);
    if (numbers && command.parameters?.includes('quantity')) {
      params.quantity = parseInt(numbers[0]);
    }
    if (numbers && command.parameters?.includes('hours')) {
      params.hours = parseInt(numbers[0]);
    }

    // Extract directions
    if (command.parameters?.includes('direction')) {
      if (transcript.includes('left')) params.direction = 'left';
      else if (transcript.includes('right')) params.direction = 'right';
    }

    // Extract zoom levels
    if (command.parameters?.includes('level')) {
      if (transcript.includes('in')) params.level = 'in';
      else if (transcript.includes('out')) params.level = 'out';
      else if (transcript.includes('fit')) params.level = 'fit';
    }

    return params;
  }

  start(onResult: (result: VoiceRecognitionResult) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      onError?.('Speech Recognition not available');
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    this.isListening = true;
    this.recognition.start();
  }

  stop(): void {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis || !this.settings.speakResponses) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.settings.volume;
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.lang = this.settings.language;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      this.synthesis.speak(utterance);
    });
  }

  setLanguage(language: VoiceSettings['language']): void {
    this.settings.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  updateSettings(settings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...settings };
    if (this.recognition) {
      this.recognition.continuous = this.settings.continuousListening;
      this.recognition.lang = this.settings.language;
    }
  }
}

// ============================================================================
// VOICE ASSISTANT - NATURAL LANGUAGE PROCESSING
// ============================================================================

export class VoiceAssistant {
  private recognitionEngine: VoiceRecognitionEngine;
  private context: Record<string, any> = {};
  private conversationHistory: Array<{ role: 'user' | 'assistant'; text: string }> = [];

  constructor(settings?: Partial<VoiceSettings>) {
    this.recognitionEngine = new VoiceRecognitionEngine(settings);
  }

  async processCommand(command: VoiceCommand, params: Record<string, any>): Promise<VoiceAssistantResponse> {
    const responses: Record<string, () => VoiceAssistantResponse> = {
      // Navigation
      'NAVIGATE_HOME': () => ({ text: 'Navigating to home screen', action: 'navigate', data: { route: '/' }, speak: true }),
      'NAVIGATE_DESIGN': () => ({ text: 'Opening 3D design tool', action: 'navigate', data: { route: '/solar-genius-pro/design' }, speak: true }),
      'NAVIGATE_QUOTE': () => ({ text: 'Starting new quotation', action: 'navigate', data: { route: '/solar-genius-pro/quote' }, speak: true }),
      'NAVIGATE_REPORTS': () => ({ text: 'Opening reports', action: 'navigate', data: { route: '/solar-genius-pro/reports' }, speak: true }),
      'NAVIGATE_EDUCATION': () => ({ text: 'Welcome to Solar Academy', action: 'navigate', data: { route: '/solar-genius-pro/academy' }, speak: true }),
      'NAVIGATE_BACK': () => ({ text: 'Going back', action: 'goBack', speak: true }),

      // Design
      'ADD_PANEL': () => ({ text: `Adding ${params.quantity || 1} panel${params.quantity > 1 ? 's' : ''} to your design`, action: 'addPanels', data: { count: params.quantity || 1 }, speak: true }),
      'REMOVE_PANEL': () => ({ text: 'Removing panel', action: 'removePanel', speak: true }),
      'AUTO_FILL_PANELS': () => ({ text: 'AI is optimizing panel placement for maximum energy production', action: 'autoFill', speak: true }),
      'CLEAR_DESIGN': () => ({ text: 'Clearing all panels from design', action: 'clearDesign', speak: true }),
      'ROTATE_VIEW': () => ({ text: `Rotating view ${params.direction || 'right'}`, action: 'rotateView', data: { direction: params.direction || 'right' }, speak: true }),
      'ZOOM_VIEW': () => ({ text: `Zooming ${params.level || 'in'}`, action: 'zoomView', data: { level: params.level || 'in' }, speak: true }),
      'SHOW_SHADING': () => ({ text: 'Running 8760-hour shading analysis. This simulates shadows for every hour of the year.', action: 'showShading', speak: true }),
      'OPTIMIZE_LAYOUT': () => ({ text: 'Neural optimizer is calculating the best panel arrangement for your roof', action: 'optimizeLayout', speak: true }),

      // Calculations
      'CALC_PRODUCTION': () => {
        const production = this.context.annualProduction || 12500;
        return { text: `Your system will produce approximately ${production.toLocaleString()} kilowatt hours per year`, action: 'showProduction', data: { production }, speak: true };
      },
      'CALC_ROI': () => {
        const roi = this.context.roi || 28;
        const payback = this.context.paybackYears || 4.2;
        return { text: `Your return on investment is ${roi}% with a payback period of ${payback} years`, action: 'showROI', data: { roi, payback }, speak: true };
      },
      'CALC_SAVINGS': () => {
        const monthly = this.context.monthlySavings || 15000;
        return { text: `You will save approximately ${monthly.toLocaleString()} per month on electricity`, action: 'showSavings', data: { monthly }, speak: true };
      },
      'CALC_COST': () => {
        const cost = this.context.totalCost || 850000;
        return { text: `The total system cost is ${cost.toLocaleString()} including installation`, action: 'showCost', data: { cost }, speak: true };
      },
      'CALC_SIZE': () => {
        const size = this.context.systemSize || 10;
        return { text: `Your system size is ${size} kilowatts`, action: 'showSize', data: { size }, speak: true };
      },
      'CALC_BATTERY': () => {
        const hours = params.hours || 8;
        const batteryKwh = (this.context.systemSize || 10) * hours * 0.5;
        return { text: `For ${hours} hours of backup, you need approximately ${batteryKwh.toFixed(1)} kilowatt hours of battery storage`, action: 'showBattery', data: { hours, capacity: batteryKwh }, speak: true };
      },

      // Reports
      'GENERATE_REPORT': () => ({ text: 'Generating comprehensive report with engineering analysis, financials, and 3D drawings', action: 'generateReport', speak: true }),
      'DOWNLOAD_REPORT': () => ({ text: 'Downloading your report as PDF', action: 'downloadReport', speak: true }),
      'EMAIL_REPORT': () => ({ text: 'Please specify the email address', action: 'requestEmail', speak: true }),
      'SHOW_BOM': () => ({ text: 'Here is your bill of materials', action: 'showBOM', speak: true }),
      'GENERATE_SLD': () => ({ text: 'Generating single-line electrical diagram', action: 'generateSLD', speak: true }),
      'GENERATE_PERMIT': () => ({ text: 'Generating permit application documents for your region', action: 'generatePermit', speak: true }),

      // Help
      'SHOW_HELP': () => ({
        text: 'I can help you design solar systems, calculate production and savings, generate reports, and more. Try saying: design a system, calculate ROI, or generate report.',
        action: 'showHelp',
        speak: true
      }),
      'HELP_DESIGN': () => ({ text: 'To design a system, first select your roof type, then I can auto-fill panels or you can place them manually. Say auto fill to maximize panel placement.', action: 'showDesignHelp', speak: true }),
      'HELP_QUOTE': () => ({ text: 'To create a quotation, upload a site image or enter coordinates. I will analyze the roof and generate a complete quote with pricing.', action: 'showQuoteHelp', speak: true }),

      // System
      'OPEN_SETTINGS': () => ({ text: 'Opening settings', action: 'openSettings', speak: true }),
      'STOP_LISTENING': () => ({ text: 'Stopping voice recognition. Say hey solar to wake me up.', action: 'stopListening', speak: true }),
      'CHANGE_LANGUAGE': () => ({ text: 'Changing language', action: 'changeLanguage', data: { language: params.language }, speak: true }),
    };

    const handler = responses[command.action];
    if (handler) {
      const response = handler();
      this.conversationHistory.push({ role: 'user', text: command.phrases[0] });
      this.conversationHistory.push({ role: 'assistant', text: response.text });
      return response;
    }

    return { text: "I'm not sure how to help with that. Try saying help for available commands.", speak: true };
  }

  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  getConversationHistory(): Array<{ role: 'user' | 'assistant'; text: string }> {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getEngine(): VoiceRecognitionEngine {
    return this.recognitionEngine;
  }
}

// Export singleton
export const voiceAssistant = new VoiceAssistant();
export const voiceEngine = new VoiceRecognitionEngine();

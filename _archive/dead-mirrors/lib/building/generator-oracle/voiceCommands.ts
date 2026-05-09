/**
 * Generator Oracle Voice Commands System
 *
 * Multi-language voice control for hands-free operation
 * Supports English and Swahili with extensible language support
 */

// ═══════════════════════════════════════════════════════════════════════════════
// Web Speech API Type Declarations (not all browsers support this)
// ═══════════════════════════════════════════════════════════════════════════════
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly confidence: number;
  readonly transcript: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface VoiceCommand {
  id: string;
  phrases: {
    en: string[];
    sw: string[]; // Swahili
  };
  action: string;
  description: string;
  category: 'navigation' | 'diagnostic' | 'search' | 'control' | 'report';
}

export interface VoiceRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  language: 'en' | 'sw';
  lastTranscript: string;
  confidence: number;
  error: string | null;
}

// Wake words to activate voice commands
export const WAKE_WORDS = {
  en: ['hey oracle', 'ok oracle', 'oracle'],
  sw: ['oracle', 'msaada oracle', 'hey oracle'],
};

// Complete voice command library
export const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation Commands
  {
    id: 'go_home',
    phrases: {
      en: ['go home', 'go to home', 'open home', 'main screen'],
      sw: ['nenda nyumbani', 'onyesha home', 'fungua home'],
    },
    action: 'NAVIGATE_HOME',
    description: 'Navigate to home/dashboard',
    category: 'navigation',
  },
  {
    id: 'go_diagnostics',
    phrases: {
      en: ['open diagnostics', 'go to diagnostics', 'start diagnosis', 'diagnose'],
      sw: ['fungua uchunguzi', 'anza uchunguzi', 'chunguza'],
    },
    action: 'NAVIGATE_DIAGNOSTICS',
    description: 'Open diagnostics panel',
    category: 'navigation',
  },
  {
    id: 'go_fault_codes',
    phrases: {
      en: ['open fault codes', 'show fault codes', 'fault code lookup', 'error codes'],
      sw: ['onyesha makosa', 'fungua code za makosa', 'soma makosa'],
    },
    action: 'NAVIGATE_FAULT_CODES',
    description: 'Open fault code database',
    category: 'navigation',
  },
  {
    id: 'go_wiring',
    phrases: {
      en: ['show wiring diagram', 'open wiring', 'wiring diagrams', 'electrical diagram'],
      sw: ['onyesha wiring', 'fungua wiring', 'mchoro wa umeme'],
    },
    action: 'NAVIGATE_WIRING',
    description: 'Open wiring diagrams',
    category: 'navigation',
  },
  {
    id: 'go_history',
    phrases: {
      en: ['show history', 'open history', 'past diagnoses', 'previous repairs'],
      sw: ['onyesha historia', 'fungua historia', 'uchunguzi uliopita'],
    },
    action: 'NAVIGATE_HISTORY',
    description: 'View diagnostic history',
    category: 'navigation',
  },
  {
    id: 'go_settings',
    phrases: {
      en: ['open settings', 'go to settings', 'preferences'],
      sw: ['fungua settings', 'mipangilio'],
    },
    action: 'NAVIGATE_SETTINGS',
    description: 'Open settings panel',
    category: 'navigation',
  },
  {
    id: 'go_parts',
    phrases: {
      en: ['order parts', 'find parts', 'spare parts', 'parts catalog'],
      sw: ['agiza vipuri', 'tafuta vipuri', 'katalogi ya vipuri'],
    },
    action: 'NAVIGATE_PARTS',
    description: 'Open parts ordering',
    category: 'navigation',
  },
  {
    id: 'go_reports',
    phrases: {
      en: ['create report', 'new report', 'generate report', 'write report'],
      sw: ['tengeneza ripoti', 'ripoti mpya', 'andika ripoti'],
    },
    action: 'NAVIGATE_REPORTS',
    description: 'Create new report',
    category: 'navigation',
  },

  // Diagnostic Commands
  {
    id: 'read_fault_codes',
    phrases: {
      en: ['read fault codes', 'scan for faults', 'check errors', 'read errors'],
      sw: ['soma code za makosa', 'angalia makosa', 'soma makosa'],
    },
    action: 'READ_FAULT_CODES',
    description: 'Read active fault codes',
    category: 'diagnostic',
  },
  {
    id: 'clear_fault_codes',
    phrases: {
      en: ['clear fault codes', 'reset faults', 'clear errors', 'erase codes'],
      sw: ['futa makosa', 'ondoa makosa', 'safisha code'],
    },
    action: 'CLEAR_FAULT_CODES',
    description: 'Clear stored fault codes',
    category: 'diagnostic',
  },
  {
    id: 'start_ai_diagnosis',
    phrases: {
      en: ['start ai diagnosis', 'ai diagnose', 'smart diagnosis', 'analyze problem'],
      sw: ['anza ai uchunguzi', 'chunguza na ai', 'uchambuzi wa ai'],
    },
    action: 'START_AI_DIAGNOSIS',
    description: 'Start AI-powered diagnosis',
    category: 'diagnostic',
  },
  {
    id: 'check_engine',
    phrases: {
      en: ['check engine', 'engine status', 'engine health', 'engine parameters'],
      sw: ['angalia injini', 'hali ya injini', 'afya ya injini'],
    },
    action: 'CHECK_ENGINE',
    description: 'View engine parameters',
    category: 'diagnostic',
  },
  {
    id: 'check_electrical',
    phrases: {
      en: ['check electrical', 'electrical status', 'voltage status', 'power output'],
      sw: ['angalia umeme', 'hali ya umeme', 'voltage'],
    },
    action: 'CHECK_ELECTRICAL',
    description: 'View electrical parameters',
    category: 'diagnostic',
  },
  {
    id: 'check_coolant',
    phrases: {
      en: ['check coolant', 'coolant temperature', 'cooling system', 'temperature status'],
      sw: ['angalia coolant', 'joto la coolant', 'mfumo wa kupoeza'],
    },
    action: 'CHECK_COOLANT',
    description: 'Check cooling system',
    category: 'diagnostic',
  },
  {
    id: 'check_oil',
    phrases: {
      en: ['check oil pressure', 'oil status', 'lubrication', 'oil level'],
      sw: ['angalia mafuta', 'hali ya mafuta', 'shinikizo la mafuta'],
    },
    action: 'CHECK_OIL',
    description: 'Check oil system',
    category: 'diagnostic',
  },
  {
    id: 'check_fuel',
    phrases: {
      en: ['check fuel', 'fuel system', 'fuel pressure', 'fuel status'],
      sw: ['angalia mafuta', 'mfumo wa mafuta', 'hali ya mafuta'],
    },
    action: 'CHECK_FUEL',
    description: 'Check fuel system',
    category: 'diagnostic',
  },
  {
    id: 'run_full_scan',
    phrases: {
      en: ['run full scan', 'complete diagnosis', 'full system check', 'scan everything'],
      sw: ['fanya uchunguzi kamili', 'angalia kila kitu', 'scan yote'],
    },
    action: 'RUN_FULL_SCAN',
    description: 'Run comprehensive diagnostic scan',
    category: 'diagnostic',
  },

  // Search Commands
  {
    id: 'search_fault',
    phrases: {
      en: ['search fault', 'find fault code', 'lookup code', 'what is code'],
      sw: ['tafuta kosa', 'tafuta code', 'code ni nini'],
    },
    action: 'SEARCH_FAULT_CODE',
    description: 'Search for specific fault code',
    category: 'search',
  },
  {
    id: 'search_symptom',
    phrases: {
      en: ['search symptom', 'find problem', 'diagnose symptom', 'what causes'],
      sw: ['tafuta dalili', 'tafuta tatizo', 'nini kinasababisha'],
    },
    action: 'SEARCH_SYMPTOM',
    description: 'Search by symptom',
    category: 'search',
  },
  {
    id: 'search_part',
    phrases: {
      en: ['find part', 'search part', 'part number', 'where to buy'],
      sw: ['tafuta kipuri', 'nambari ya kipuri', 'nunua wapi'],
    },
    action: 'SEARCH_PART',
    description: 'Search for spare part',
    category: 'search',
  },

  // Control Commands
  {
    id: 'stop_listening',
    phrases: {
      en: ['stop listening', 'stop', 'cancel', 'never mind'],
      sw: ['acha kusikiliza', 'simama', 'ghairi'],
    },
    action: 'STOP_LISTENING',
    description: 'Stop voice recognition',
    category: 'control',
  },
  {
    id: 'go_back',
    phrases: {
      en: ['go back', 'back', 'previous', 'return'],
      sw: ['rudi nyuma', 'nyuma', 'rudi'],
    },
    action: 'GO_BACK',
    description: 'Go to previous screen',
    category: 'control',
  },
  {
    id: 'scroll_up',
    phrases: {
      en: ['scroll up', 'go up', 'page up'],
      sw: ['panda juu', 'juu'],
    },
    action: 'SCROLL_UP',
    description: 'Scroll page up',
    category: 'control',
  },
  {
    id: 'scroll_down',
    phrases: {
      en: ['scroll down', 'go down', 'page down'],
      sw: ['shuka chini', 'chini'],
    },
    action: 'SCROLL_DOWN',
    description: 'Scroll page down',
    category: 'control',
  },
  {
    id: 'help',
    phrases: {
      en: ['help', 'what can you do', 'show commands', 'voice commands'],
      sw: ['msaada', 'unaweza nini', 'onyesha amri'],
    },
    action: 'SHOW_HELP',
    description: 'Show available commands',
    category: 'control',
  },
  {
    id: 'change_language',
    phrases: {
      en: ['switch to swahili', 'speak swahili', 'swahili mode'],
      sw: ['badilisha lugha', 'ongea kiingereza', 'english mode'],
    },
    action: 'CHANGE_LANGUAGE',
    description: 'Switch voice language',
    category: 'control',
  },

  // Report Commands
  {
    id: 'save_report',
    phrases: {
      en: ['save report', 'save diagnosis', 'store report'],
      sw: ['hifadhi ripoti', 'hifadhi uchunguzi'],
    },
    action: 'SAVE_REPORT',
    description: 'Save current report',
    category: 'report',
  },
  {
    id: 'print_report',
    phrases: {
      en: ['print report', 'print diagnosis', 'generate pdf'],
      sw: ['chapisha ripoti', 'tengeneza pdf'],
    },
    action: 'PRINT_REPORT',
    description: 'Print/export report',
    category: 'report',
  },
  {
    id: 'share_report',
    phrases: {
      en: ['share report', 'send report', 'email report', 'whatsapp report'],
      sw: ['shiriki ripoti', 'tuma ripoti', 'whatsapp ripoti'],
    },
    action: 'SHARE_REPORT',
    description: 'Share report via messaging',
    category: 'report',
  },
  {
    id: 'add_photo',
    phrases: {
      en: ['add photo', 'take photo', 'capture image', 'add picture'],
      sw: ['weka picha', 'piga picha', 'ongeza picha'],
    },
    action: 'ADD_PHOTO',
    description: 'Add photo to report',
    category: 'report',
  },
  {
    id: 'add_signature',
    phrases: {
      en: ['add signature', 'sign report', 'customer signature'],
      sw: ['weka sahihi', 'sahihi ripoti', 'sahihi ya mteja'],
    },
    action: 'ADD_SIGNATURE',
    description: 'Add signature to report',
    category: 'report',
  },
];

/**
 * Voice Recognition Service
 * Uses Web Speech API with fallback support
 */
export class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private currentLanguage: 'en' | 'sw' = 'en';
  private onCommandCallback: ((command: VoiceCommand, transcript: string) => void) | null = null;
  private onStateChangeCallback: ((state: VoiceRecognitionState) => void) | null = null;
  private isListening: boolean = false;
  private wakeWordDetected: boolean = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        this.isSupported = true;
        this.recognition = new SpeechRecognitionAPI();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.toLowerCase().trim();
      const confidence = event.results[last][0].confidence;

      // Check for wake word first
      if (!this.wakeWordDetected) {
        const wakeWords = WAKE_WORDS[this.currentLanguage];
        if (wakeWords.some(w => transcript.includes(w))) {
          this.wakeWordDetected = true;
          this.speak(this.currentLanguage === 'en' ? 'Yes, I\'m listening' : 'Ndio, ninasikia');
          this.notifyStateChange({
            isListening: true,
            isSupported: true,
            language: this.currentLanguage,
            lastTranscript: transcript,
            confidence,
            error: null
          });
          return;
        }
      }

      // Process command if wake word was detected or always-on mode
      if (this.wakeWordDetected || this.isListening) {
        const command = this.matchCommand(transcript);
        if (command && event.results[last].isFinal) {
          this.onCommandCallback?.(command, transcript);
          // Reset wake word after command
          setTimeout(() => { this.wakeWordDetected = false; }, 3000);
        }

        this.notifyStateChange({
          isListening: this.isListening,
          isSupported: this.isSupported,
          language: this.currentLanguage,
          lastTranscript: transcript,
          confidence,
          error: null,
        });
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.notifyStateChange({
        isListening: false,
        isSupported: this.isSupported,
        language: this.currentLanguage,
        lastTranscript: '',
        confidence: 0,
        error: event.error,
      });
    };

    this.recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (this.isListening && this.recognition) {
        this.recognition.start();
      }
    };
  }

  private matchCommand(transcript: string): VoiceCommand | null {
    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const command of VOICE_COMMANDS) {
      const phrases = command.phrases[this.currentLanguage];
      for (const phrase of phrases) {
        if (normalizedTranscript.includes(phrase.toLowerCase())) {
          return command;
        }
      }
    }

    return null;
  }

  private notifyStateChange(state: VoiceRecognitionState): void {
    this.onStateChangeCallback?.(state);
  }

  public setLanguage(lang: 'en' | 'sw'): void {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'en' ? 'en-US' : 'sw-KE';
    }
  }

  public start(): void {
    if (!this.recognition || !this.isSupported) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.isListening = true;
    this.recognition.lang = this.currentLanguage === 'en' ? 'en-US' : 'sw-KE';

    try {
      this.recognition.start();
      this.notifyStateChange({
        isListening: true,
        isSupported: true,
        language: this.currentLanguage,
        lastTranscript: '',
        confidence: 0,
        error: null,
      });
    } catch (e) {
      // Already started
    }
  }

  public stop(): void {
    this.isListening = false;
    this.wakeWordDetected = false;
    this.recognition?.stop();
    this.notifyStateChange({
      isListening: false,
      isSupported: this.isSupported,
      language: this.currentLanguage,
      lastTranscript: '',
      confidence: 0,
      error: null,
    });
  }

  public onCommand(callback: (command: VoiceCommand, transcript: string) => void): void {
    this.onCommandCallback = callback;
  }

  public onStateChange(callback: (state: VoiceRecognitionState) => void): void {
    this.onStateChangeCallback = callback;
  }

  public speak(text: string): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.currentLanguage === 'en' ? 'en-US' : 'sw-KE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public getCommands(): VoiceCommand[] {
    return VOICE_COMMANDS;
  }

  public getCommandsByCategory(category: VoiceCommand['category']): VoiceCommand[] {
    return VOICE_COMMANDS.filter(c => c.category === category);
  }
}

// Singleton instance
let voiceServiceInstance: VoiceRecognitionService | null = null;

export function getVoiceService(): VoiceRecognitionService {
  if (!voiceServiceInstance) {
    voiceServiceInstance = new VoiceRecognitionService();
  }
  return voiceServiceInstance;
}

// Command action handlers
export type CommandHandler = (command: VoiceCommand, transcript: string) => void;

export interface VoiceCommandHandlers {
  onNavigate: (destination: string) => void;
  onDiagnostic: (action: string) => void;
  onSearch: (query: string, type: 'fault' | 'symptom' | 'part') => void;
  onControl: (action: string) => void;
  onReport: (action: string) => void;
}

export function createCommandRouter(handlers: VoiceCommandHandlers): CommandHandler {
  return (command: VoiceCommand, transcript: string) => {
    switch (command.category) {
      case 'navigation':
        handlers.onNavigate(command.action);
        break;
      case 'diagnostic':
        handlers.onDiagnostic(command.action);
        break;
      case 'search':
        // Extract search query from transcript
        const query = extractSearchQuery(transcript, command);
        handlers.onSearch(query, getSearchType(command.action));
        break;
      case 'control':
        handlers.onControl(command.action);
        break;
      case 'report':
        handlers.onReport(command.action);
        break;
    }
  };
}

function extractSearchQuery(transcript: string, command: VoiceCommand): string {
  // Remove the command phrase to get the query
  const phrases = [...command.phrases.en, ...command.phrases.sw];
  let query = transcript.toLowerCase();

  for (const phrase of phrases) {
    query = query.replace(phrase.toLowerCase(), '').trim();
  }

  return query;
}

function getSearchType(action: string): 'fault' | 'symptom' | 'part' {
  switch (action) {
    case 'SEARCH_FAULT_CODE': return 'fault';
    case 'SEARCH_SYMPTOM': return 'symptom';
    case 'SEARCH_PART': return 'part';
    default: return 'fault';
  }
}

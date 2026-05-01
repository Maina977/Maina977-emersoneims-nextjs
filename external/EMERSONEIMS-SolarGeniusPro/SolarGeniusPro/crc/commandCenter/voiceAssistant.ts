// VOICE ASSISTANT
// Voice command recognition and processing

export interface VoiceCommand {
  command: string;
  intent: string;
  entities: Record<string, any>;
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  action?: string;
  data?: any;
  confidence: number;
}

class VoiceAssistant {
  private recognition: any = null;
  private isListening: boolean = false;
  private commandHandlers: Map<string, (entities: Record<string, any>) => Promise<VoiceResponse>> = new Map();
  private wakeWord: string = "hey solar";
  
  constructor() {
    this.initSpeechRecognition();
  }
  
  private initSpeechRecognition(): void {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        this.processTranscript(transcript);
      };
      
      this.registerDefaultCommands();
    }
  }
  
  private registerDefaultCommands(): void {
    // Design commands
    this.registerCommand('design', 'create design', async (entities) => {
      return {
        text: `Creating new solar design${entities.systemSize ? ` for ${entities.systemSize}kW system` : ''}`,
        action: 'create_design',
        data: { systemSize: entities.systemSize || 6 },
        confidence: 0.9
      };
    });
    
    this.registerCommand('add panel', 'add panel', async (entities) => {
      return {
        text: `Adding ${entities.count || 1} panel(s) to design`,
        action: 'add_panel',
        data: { count: entities.count || 1 },
        confidence: 0.85
      };
    });
    
    this.registerCommand('calculate', 'calculate savings', async (entities) => {
      return {
        text: `Calculating savings for your system`,
        action: 'calculate_savings',
        data: { location: entities.location },
        confidence: 0.9
      };
    });
    
    this.registerCommand('what is', 'what is error', async (entities) => {
      return {
        text: `Looking up error code ${entities.errorCode}`,
        action: 'lookup_error',
        data: { errorCode: entities.errorCode },
        confidence: 0.88
      };
    });
    
    this.registerCommand('show', 'show reports', async (entities) => {
      return {
        text: `Showing ${entities.reportType || 'all'} reports`,
        action: 'show_reports',
        data: { type: entities.reportType },
        confidence: 0.92
      };
    });
  }
  
  registerCommand(command: string, intent: string, handler: (entities: Record<string, any>) => Promise<VoiceResponse>): void {
    this.commandHandlers.set(intent, handler);
  }
  
  async startListening(): Promise<void> {
    if (!this.recognition) {
      console.warn('Speech recognition not supported');
      return;
    }
    
    this.isListening = true;
    this.recognition.start();
  }
  
  async stopListening(): Promise<void> {
    if (!this.recognition) return;
    
    this.isListening = false;
    this.recognition.stop();
  }
  
  private async processTranscript(transcript: string): Promise<void> {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check for wake word
    if (!lowerTranscript.includes(this.wakeWord) && !this.isListening) {
      return;
    }
    
    // Extract command
    const command = this.extractCommand(lowerTranscript);
    if (!command) return;
    
    // Find matching handler
    for (const [intent, handler] of this.commandHandlers) {
      if (command.command.includes(intent)) {
        const response = await handler(command.entities);
        this.speakResponse(response);
        this.triggerAction(response);
        break;
      }
    }
  }
  
  private extractCommand(transcript: string): VoiceCommand | null {
    // Extract numbers
    const numbers = transcript.match(/\d+(?:\.\d+)?/g) || [];
    
    // Extract error codes
    const errorCodeMatch = transcript.match(/[FEW][0-9]{2}/i);
    
    return {
      command: transcript,
      intent: this.determineIntent(transcript),
      entities: {
        count: numbers.length > 0 ? parseInt(numbers[0]) : undefined,
        systemSize: numbers.length > 0 ? parseFloat(numbers[0]) : undefined,
        errorCode: errorCodeMatch ? errorCodeMatch[0].toUpperCase() : undefined,
        location: this.extractLocation(transcript)
      },
      confidence: 0.85
    };
  }
  
  private determineIntent(transcript: string): string {
    if (transcript.includes('design') || transcript.includes('create')) return 'design';
    if (transcript.includes('add')) return 'add_panel';
    if (transcript.includes('save') || transcript.includes('calculate')) return 'calculate_savings';
    if (transcript.includes('error')) return 'what_is_error';
    if (transcript.includes('show') || transcript.includes('view')) return 'show_reports';
    return 'unknown';
  }
  
  private extractLocation(transcript: string): string | undefined {
    const locationKeywords = ['in', 'at', 'for'];
    for (const keyword of locationKeywords) {
      const index = transcript.indexOf(keyword);
      if (index !== -1) {
        return transcript.substring(index + keyword.length).trim();
      }
    }
    return undefined;
  }
  
  private speakResponse(response: VoiceResponse): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response.text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
  
  private triggerAction(response: VoiceResponse): void {
    if (response.action) {
      window.dispatchEvent(new CustomEvent('voice-command', {
        detail: { action: response.action, data: response.data }
      }));
    }
  }
  
  isSupported(): boolean {
    return this.recognition !== null;
  }
}

export const voiceAssistant = new VoiceAssistant();
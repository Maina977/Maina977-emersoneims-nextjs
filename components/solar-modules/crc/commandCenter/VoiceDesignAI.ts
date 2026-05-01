// MODULE 9: VOICE DESIGN AI
// Voice commands for system design with GPT-4o natural language processing
// Tech: Web Speech API + OpenAI GPT-4o

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export interface VoiceCommand {
  transcript: string;
  confidence: number;
  action: 'add_panels' | 'remove_panels' | 'rotate_view' | 'change_orientation' | 'add_battery' | 'analyze_shading' | null;
  parameters: Record<string, any>;
}

interface Panel {
  id: string;
  count: number;
  x: number;
  y: number;
  orientation: string;
}

class VoiceDesignEngine {
  private recognitionInstance: any;
  private isListening: boolean = false;
  private transcript: string = '';

  constructor() {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognitionInstance = new SpeechRecognition();
      this.recognitionInstance.continuous = false;
      this.recognitionInstance.interimResults = true;
      this.recognitionInstance.lang = 'en-US';
    }
  }

  /**
   * Start listening to voice input
   */
  async startListening(onResult: (command: VoiceCommand) => void): Promise<void> {
    if (!this.recognitionInstance) {
      console.error('Speech Recognition not supported');
      return;
    }

    this.isListening = true;
    this.transcript = '';

    this.recognitionInstance.onstart = () => {
      console.log('🎤 Listening...');
    };

    this.recognitionInstance.onresult = async (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;

        this.transcript = transcript;

        if (isFinal) {
          console.log('✓ Final transcript:', transcript);
          const command = await this.parseCommand(transcript);
          if (command) {
            onResult(command);
          }
        }
      }
    };

    this.recognitionInstance.onerror = (error: any) => {
      console.error('Speech Recognition error:', error);
    };

    this.recognitionInstance.onend = () => {
      this.isListening = false;
      console.log('🎤 Listening stopped');
    };

    this.recognitionInstance.start();
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    if (this.recognitionInstance && this.isListening) {
      this.recognitionInstance.stop();
    }
  }

  /**
   * Parse voice command using GPT-4o
   * In production, this calls OpenAI API; for now uses pattern matching
   */
  private async parseCommand(transcript: string): Promise<VoiceCommand | null> {
    try {
      // Pattern-based parsing (fast, works offline)
      const lowerTranscript = transcript.toLowerCase();

      // Add panels command
      if (lowerTranscript.includes('add') && lowerTranscript.includes('panel')) {
        const match = lowerTranscript.match(/(\d+)\s*(?:panel|panels|more)?/);
        const count = match ? parseInt(match[1]) : 1;
        return {
          transcript,
          confidence: 0.85,
          action: 'add_panels',
          parameters: { count }
        };
      }

      // Rotate view command
      if (lowerTranscript.includes('rotate') || lowerTranscript.includes('turn')) {
        const direction = lowerTranscript.includes('left') ? 'left' : lowerTranscript.includes('right') ? 'right' : 'auto';
        return {
          transcript,
          confidence: 0.9,
          action: 'rotate_view',
          parameters: { direction }
        };
      }

      // Change orientation command
      if (lowerTranscript.includes('facing') || lowerTranscript.includes('orientation')) {
        const validOrientations = ['north', 'south', 'east', 'west'];
        let orientation = 'south';
        for (const dir of validOrientations) {
          if (lowerTranscript.includes(dir)) {
            orientation = dir;
            break;
          }
        }
        return {
          transcript,
          confidence: 0.8,
          action: 'change_orientation',
          parameters: { orientation }
        };
      }

      // Add battery command
      if (lowerTranscript.includes('battery') && (lowerTranscript.includes('add') || lowerTranscript.includes('install'))) {
        const match = lowerTranscript.match(/(\d+)\s*(?:kwh|kWh|kilowatt)/);
        const capacity = match ? parseInt(match[1]) : 5;
        return {
          transcript,
          confidence: 0.8,
          action: 'add_battery',
          parameters: { capacity }
        };
      }

      // Shading analysis command
      if (lowerTranscript.includes('shading') || lowerTranscript.includes('shadow')) {
        return {
          transcript,
          confidence: 0.85,
          action: 'analyze_shading',
          parameters: {}
        };
      }

      // Try GPT-4o for complex commands (optional, requires API key)
      return await this.callGPT4o(transcript);
    } catch (error) {
      console.error('Command parsing error:', error);
      return null;
    }
  }

  /**
   * Call OpenAI GPT-4o for advanced NLP parsing
   * Requires OPENAI_API_KEY environment variable
   */
  private async callGPT4o(transcript: string): Promise<VoiceCommand | null> {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        console.warn('OpenAI API key not configured - using pattern matching only');
        return null;
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a solar panel design assistant. Parse user voice commands and extract action and parameters.
              
Respond with JSON: { "action": "add_panels|remove_panels|rotate_view|change_orientation|add_battery|analyze_shading", "parameters": {...} }

Examples:
"Add 4 more panels on the west side" -> { "action": "add_panels", "parameters": { "count": 4, "location": "west" } }
"Rotate the view left" -> { "action": "rotate_view", "parameters": { "direction": "left" } }
"Add a 10 kilowatt battery" -> { "action": "add_battery", "parameters": { "capacity": 10 } }`
            },
            {
              role: 'user',
              content: transcript
            }
          ],
          temperature: 0.3,
          max_tokens: 100
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        transcript,
        confidence: 0.95,
        action: parsed.action,
        parameters: parsed.parameters || {}
      };
    } catch (error) {
      console.error('GPT-4o API error:', error);
      return null;
    }
  }
}

// React Component
export const VoiceDesignAI: React.FC<{ onCommand: (command: VoiceCommand) => void }> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const voiceEngineRef = useRef<VoiceDesignEngine | null>(null);

  useEffect(() => {
    voiceEngineRef.current = new VoiceDesignEngine();
  }, []);

  const handleStartListening = async () => {
    if (!voiceEngineRef.current) return;

    setIsListening(true);
    setTranscript('');

    await voiceEngineRef.current.startListening((command) => {
      setTranscript(command.transcript);
      setLastCommand(command);
      onCommand(command);
    });
  };

  const handleStopListening = () => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.stopListening();
    }
    setIsListening(false);
  };

  return (
    <div className="voice-design-container">
      <div className="voice-header">
        <h2>🎤 Voice Design AI</h2>
        <p>Control your solar design with voice commands</p>
      </div>

      <div className="voice-controls">
        <button
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? handleStopListening : handleStartListening}
        >
          <span className="mic-icon">🎤</span>
          {isListening ? 'Listening...' : 'Start Listening'}
        </button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="transcript-box">
          <p className="transcript-label">You said:</p>
          <p className="transcript-text">"{transcript}"</p>
        </div>
      )}

      {/* Last Command Display */}
      {lastCommand && (
        <div className="command-box">
          <h3>✓ Command Recognized</h3>
          <p><strong>Action:</strong> {lastCommand.action}</p>
          <p><strong>Confidence:</strong> {(lastCommand.confidence * 100).toFixed(0)}%</p>
          <pre className="parameters">{JSON.stringify(lastCommand.parameters, null, 2)}</pre>
        </div>
      )}

      {/* Command Examples */}
      <div className="command-examples">
        <h3>📝 Voice Command Examples</h3>
        <div className="examples-grid">
          <div className="example">
            <span className="example-input">🎤 "Add 4 more panels"</span>
            <span className="example-output">➜ Adds 4 panels to the array</span>
          </div>
          <div className="example">
            <span className="example-input">🎤 "Rotate view left"</span>
            <span className="example-output">➜ Rotates 3D model 90° counterclockwise</span>
          </div>
          <div className="example">
            <span className="example-input">🎤 "Panels facing south"</span>
            <span className="example-output">➜ Changes orientation to south</span>
          </div>
          <div className="example">
            <span className="example-input">🎤 "Add 10 kilowatt battery"</span>
            <span className="example-output">➜ Configures 10 kWh battery system</span>
          </div>
          <div className="example">
            <span className="example-input">🎤 "Check shading"</span>
            <span className="example-output">➜ Runs shading analysis</span>
          </div>
          <div className="example">
            <span className="example-input">🎤 "Remove 2 panels"</span>
            <span className="example-output">➜ Removes 2 panels from layout</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="voice-tips">
        <h3>💡 Tips for Best Results</h3>
        <ul>
          <li>Speak clearly and at normal volume</li>
          <li>Use specific numbers when mentioning quantities</li>
          <li>Mention directions (north, south, east, west) for orientation</li>
          <li>Allow 1-2 seconds between commands</li>
          <li>Work in a relatively quiet environment</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceDesignAI;
export { VoiceDesignEngine };

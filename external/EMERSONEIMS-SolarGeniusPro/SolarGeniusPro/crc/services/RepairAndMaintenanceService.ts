// MODULE 12 & 15: REPAIR GUIDES AI + MAINTENANCE AI
// Generates illustrated repair procedures and schedules maintenance via cron jobs

import React, { useState, useEffect } from 'react';
import nodeCron from 'node-cron';
import nodemailer from 'nodemailer';

export interface RepairGuide {
  id: string;
  faultCode: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number; // minutes
  tools: string[];
  parts: string[];
  steps: Step[];
  safetyWarnings: string[];
  diagrams: string[]; // URLs or base64
  relatedGuides: string[];
  videoUrl?: string;
}

export interface Step {
  number: number;
  description: string;
  image?: string;
  warning?: string;
  tools?: string[];
}

export interface MaintenanceSchedule {
  id: string;
  systemId: string;
  task: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  cronExpression: string;
  notificationChannels: ('email' | 'sms' | 'push')[];
  lastCompleted?: Date;
  nextDue: Date;
  duration: number; // minutes
}

// Repair Guide Database
const repairGuideDatabase: RepairGuide[] = [
  {
    id: 'guide-f01',
    faultCode: 'F01',
    title: 'DC Bus Overvoltage - Solution',
    severity: 'critical',
    estimatedTime: 30,
    tools: ['Multimeter', 'Screwdriver Set', 'Insulated Gloves'],
    parts: ['Voltage Suppressor Capacitor', 'Surge Protector Module'],
    steps: [
      {
        number: 1,
        description: 'Turn OFF the inverter immediately and wait 5 minutes for discharge',
        warning: '⚠️ High voltage present - ensure system is fully powered down'
      },
      {
        number: 2,
        description: 'Check PV array voltage using multimeter at DC input terminals',
        image: '/images/step2-dc-check.png'
      },
      {
        number: 3,
        description: 'Inspect DC breaker for loose connections - tighten if needed',
        tools: ['Screwdriver Set']
      },
      {
        number: 4,
        description: 'If voltage still high, replace voltage suppressor capacitor',
        parts: ['Voltage Suppressor']
      }
    ],
    safetyWarnings: [
      'DC circuit can remain charged for up to 10 minutes after shutdown',
      'Do NOT touch any exposed conductors',
      'Wear insulated gloves and safety glasses',
      'If unfamiliar, contact a licensed electrician'
    ],
    diagrams: ['/diagrams/f01-overvoltage.svg'],
    relatedGuides: ['guide-f02', 'guide-f03'],
    videoUrl: 'https://youtube.com/watch?v=example'
  },
  {
    id: 'guide-f02',
    faultCode: 'F02',
    title: 'Grid Connection Loss - Troubleshooting',
    severity: 'high',
    estimatedTime: 20,
    tools: ['Multimeter', 'Network Cable Tester'],
    parts: [],
    steps: [
      {
        number: 1,
        description: 'Check grid voltage at AC output terminals (should be 230V AC)',
      },
      {
        number: 2,
        description: 'Verify WiFi/Ethernet connection to monitoring system'
      },
      {
        number: 3,
        description: 'Power cycle the inverter (OFF for 30 seconds, then ON)'
      }
    ],
    safetyWarnings: [
      'AC side voltages are LETHAL - use caution',
      'Wear rubber-soled shoes and avoid wet conditions'
    ],
    diagrams: [],
    relatedGuides: []
  }
];

// Maintenance Schedule Generator
export class MaintenanceScheduler {
  private schedules: MaintenanceSchedule[] = [];
  private emailTransporter: any;

  constructor(emailConfig?: { user: string; pass: string }) {
    if (emailConfig) {
      this.emailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: emailConfig
      });
    }
  }

  /**
   * Create default maintenance schedule for solar system
   */
  createDefaultSchedule(systemId: string): MaintenanceSchedule[] {
    const now = new Date();

    const schedules: MaintenanceSchedule[] = [
      {
        id: `maint-${systemId}-daily`,
        systemId,
        task: '📊 Check system production metrics',
        frequency: 'daily',
        cronExpression: '0 8 * * *', // 8 AM daily
        notificationChannels: ['email', 'push'],
        nextDue: this.nextOccurrence('0 8 * * *'),
        duration: 5
      },
      {
        id: `maint-${systemId}-weekly`,
        systemId,
        task: '🧹 Clean PV panels (if dry)',
        frequency: 'weekly',
        cronExpression: '0 9 ? * SUN', // Sunday 9 AM
        notificationChannels: ['email'],
        nextDue: this.nextOccurrence('0 9 ? * SUN'),
        duration: 30
      },
      {
        id: `maint-${systemId}-monthly`,
        systemId,
        task: '🔍 Inspect wiring and connections',
        frequency: 'monthly',
        cronExpression: '0 10 1 * *', // 1st of month
        notificationChannels: ['email', 'sms'],
        nextDue: this.nextOccurrence('0 10 1 * *'),
        duration: 60
      },
      {
        id: `maint-${systemId}-quarterly`,
        systemId,
        task: '⚙️ Inverter performance review',
        frequency: 'quarterly',
        cronExpression: '0 10 1 */3 *', // Every 3 months
        notificationChannels: ['email'],
        nextDue: this.nextOccurrence('0 10 1 */3 *'),
        duration: 45
      },
      {
        id: `maint-${systemId}-yearly`,
        systemId,
        task: '🏥 Annual system health check by technician',
        frequency: 'yearly',
        cronExpression: '0 10 1 1 *', // January 1st
        notificationChannels: ['email', 'sms'],
        nextDue: this.nextOccurrence('0 10 1 1 *'),
        duration: 120
      }
    ];

    this.schedules = schedules;
    return schedules;
  }

  /**
   * Calculate next occurrence of cron expression
   */
  private nextOccurrence(cronExpr: string): Date {
    try {
      const task = nodeCron.schedule(cronExpr, () => {}, { scheduled: false });
      // Get next scheduled time
      const nextDate = new Date();
      nextDate.setHours(nextDate.getHours() + 1);
      return nextDate;
    } catch (error) {
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Send maintenance reminder notification
   */
  async sendReminder(schedule: MaintenanceSchedule, userEmail: string) {
    if (schedule.notificationChannels.includes('email')) {
      await this.sendEmail(userEmail, schedule);
    }
    if (schedule.notificationChannels.includes('sms')) {
      await this.sendSMS(userEmail, schedule);
    }
  }

  private async sendEmail(email: string, schedule: MaintenanceSchedule) {
    if (!this.emailTransporter) return;

    const mailOptions = {
      from: 'sally@emersoneims.com',
      to: email,
      subject: `🔔 Maintenance Reminder: ${schedule.task}`,
      html: `
        <h2>${schedule.task}</h2>
        <p>It's time for your ${schedule.frequency} solar system maintenance.</p>
        <p><strong>Estimated Duration:</strong> ${schedule.duration} minutes</p>
        <p><strong>Due Date:</strong> ${schedule.nextDue.toLocaleDateString()}</p>
        <a href="https://solargenius.emerson.co.ke/maintenance" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Guide</a>
      `
    };

    try {
      await this.emailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email send failed:', error);
    }
  }

  private async sendSMS(phone: string, schedule: MaintenanceSchedule) {
    // Integrate with Twilio or similar SMS service
    console.log(`SMS to ${phone}: ${schedule.task} due on ${schedule.nextDue.toLocaleDateString()}`);
  }

  /**
   * Get all schedules for a system
   */
  getSchedules(systemId: string): MaintenanceSchedule[] {
    return this.schedules.filter(s => s.systemId === systemId);
  }

  /**
   * Mark task as completed
   */
  markTaskCompleted(scheduleId: string): MaintenanceSchedule | null {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.lastCompleted = new Date();
      schedule.nextDue = this.nextOccurrence(schedule.cronExpression);
      return schedule;
    }
    return null;
  }
}

// React Component for Repair Guides
export const RepairGuidesUI: React.FC<{ systemId: string }> = ({ systemId }) => {
  const [selectedGuide, setSelectedGuide] = useState<RepairGuide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = repairGuideDatabase.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.faultCode.includes(searchQuery)
  );

  return (
    <div className="repair-guides-container">
      <div className="guides-header">
        <h2>🔧 Repair Guides</h2>
        <p>Step-by-step troubleshooting for common issues</p>
      </div>

      <div className="guides-search">
        <input
          type="text"
          placeholder="Search by fault code or issue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="guides-layout">
        <div className="guides-list">
          {filteredGuides.map(guide => (
            <div
              key={guide.id}
              className={`guide-item ${selectedGuide?.id === guide.id ? 'active' : ''}`}
              onClick={() => setSelectedGuide(guide)}
            >
              <div className="guide-code">{guide.faultCode}</div>
              <div className="guide-title">{guide.title}</div>
              <div className={`guide-severity ${guide.severity}`}>{guide.severity}</div>
            </div>
          ))}
        </div>

        {selectedGuide && (
          <div className="guide-detail">
            <h2>{selectedGuide.title}</h2>
            <p className="guide-meta">
              Estimated time: {selectedGuide.estimatedTime} min | Severity: <span className={selectedGuide.severity}>{selectedGuide.severity}</span>
            </p>

            {selectedGuide.safetyWarnings.length > 0 && (
              <div className="safety-warnings">
                <h3>⚠️ Safety Warnings</h3>
                <ul>
                  {selectedGuide.safetyWarnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="guide-steps">
              <h3>📋 Steps to Follow</h3>
              {selectedGuide.steps.map(step => (
                <div key={step.number} className="step">
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <p>{step.description}</p>
                    {step.warning && <div className="step-warning">{step.warning}</div>}
                    {step.image && <img src={step.image} alt="Step" />}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-print">🖨️ Print Guide</button>
            <button className="btn-download">📥 Download PDF</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairGuidesUI;

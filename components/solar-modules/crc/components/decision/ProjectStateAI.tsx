// MODULE 6: 8-STEP PROJECT AI
// Guided workflow state machine: Load → Roof → Panels → Inverter → Battery → Safety → Permits → Handover
// Tech: XState-inspired state machine

import React, { useReducer, useState, useCallback } from 'react';

export type ProjectStage = 
  | 'site_survey'
  | 'roof_analysis'
  | 'panel_selection'
  | 'inverter_config'
  | 'battery_setup'
  | 'safety_review'
  | 'permits'
  | 'handover';

export interface ProjectData {
  id: string;
  stage: ProjectStage;
  address: string;
  systemSize: number;
  roofPitch?: number;
  panelCount?: number;
  panelModel?: string;
  inverterModel?: string;
  inverterSize?: number;
  batteryCapacity?: number;
  warrantyYears?: number;
  permitsSubmitted?: boolean;
  safetyChecklist?: Record<string, boolean>;
  completionDate?: Date;
  status: 'in_progress' | 'completed' | 'on_hold' | 'failed';
}

interface ProjectAction {
  type: 'advance' | 'revert' | 'update_data' | 'complete' | 'hold';
  payload?: any;
}

const stageSequence: ProjectStage[] = [
  'site_survey',
  'roof_analysis',
  'panel_selection',
  'inverter_config',
  'battery_setup',
  'safety_review',
  'permits',
  'handover'
];

const stageMetadata = {
  site_survey: {
    title: '1. Site Survey',
    description: 'Collect location, roof type, and usage data',
    icon: '📍',
    requiredFields: ['address', 'systemSize'],
    duration: '1-2 days'
  },
  roof_analysis: {
    title: '2. Roof Analysis',
    description: 'Analyze roof pitch, orientation, and shading',
    icon: '🏠',
    requiredFields: ['roofPitch'],
    duration: '2-3 days'
  },
  panel_selection: {
    title: '3. Panel Selection',
    description: 'Choose solar panels and calculate array configuration',
    icon: '☀️',
    requiredFields: ['panelCount', 'panelModel'],
    duration: '1-2 days'
  },
  inverter_config: {
    title: '4. Inverter Configuration',
    description: 'Select and configure power inverter',
    icon: '⚙️',
    requiredFields: ['inverterModel', 'inverterSize'],
    duration: '1 day'
  },
  battery_setup: {
    title: '5. Battery Setup',
    description: 'Configure energy storage (optional)',
    icon: '🔋',
    requiredFields: ['batteryCapacity'],
    duration: '2 days'
  },
  safety_review: {
    title: '6. Safety Review',
    description: 'Complete electrical safety checklist',
    icon: '🛡️',
    requiredFields: ['safetyChecklist'],
    duration: '1 day'
  },
  permits: {
    title: '7. Permits & Documentation',
    description: 'Submit regulatory permits and approvals',
    icon: '📋',
    requiredFields: ['permitsSubmitted'],
    duration: '3-7 days'
  },
  handover: {
    title: '8. Installation & Handover',
    description: 'Final installation and system handover to customer',
    icon: '✅',
    requiredFields: [],
    duration: '3-5 days'
  }
};

function projectReducer(state: ProjectData, action: ProjectAction): ProjectData {
  switch (action.type) {
    case 'advance': {
      const currentIndex = stageSequence.indexOf(state.stage);
      if (currentIndex < stageSequence.length - 1) {
        return {
          ...state,
          stage: stageSequence[currentIndex + 1],
          status: 'in_progress'
        };
      }
      return { ...state, status: 'completed', completionDate: new Date() };
    }

    case 'revert': {
      const currentIndex = stageSequence.indexOf(state.stage);
      if (currentIndex > 0) {
        return {
          ...state,
          stage: stageSequence[currentIndex - 1],
          status: 'in_progress'
        };
      }
      return state;
    }

    case 'update_data': {
      return {
        ...state,
        ...action.payload
      };
    }

    case 'complete': {
      return {
        ...state,
        status: 'completed',
        completionDate: new Date()
      };
    }

    case 'hold': {
      return {
        ...state,
        status: 'on_hold'
      };
    }

    default:
      return state;
  }
}

export const ProjectStateAI: React.FC<{ projectId: string }> = ({ projectId }) => {
  const initialState: ProjectData = {
    id: projectId,
    stage: 'site_survey',
    address: '',
    systemSize: 0,
    status: 'in_progress'
  };

  const [project, dispatch] = useReducer(projectReducer, initialState);
  const [showDetails, setShowDetails] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const currentStageIndex = stageSequence.indexOf(project.stage);
  const currentMetadata = stageMetadata[project.stage];
  const progressPercent = ((currentStageIndex + 1) / stageSequence.length) * 100;

  // Validate stage completion
  const canAdvance = useCallback(() => {
    const requiredFields = currentMetadata.requiredFields;
    return requiredFields.every(field => {
      const value = (project as any)[field];
      return value !== undefined && value !== null && value !== '';
    });
  }, [project, currentMetadata.requiredFields]);

  // Handle stage advance
  const handleAdvance = useCallback(() => {
    if (canAdvance()) {
      dispatch({ type: 'advance' });
    }
  }, [canAdvance]);

  return (
    <div className="project-state-container">
      <div className="project-header">
        <h2>🎯 Project Workflow</h2>
        <p className="project-id">Project {project.id}</p>
      </div>

      {/* Progress Timeline */}
      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="progress-text">{progressPercent.toFixed(0)}% Complete</p>

        {/* Stage Timeline */}
        <div className="stage-timeline">
          {stageSequence.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = stage === project.stage;
            const metadata = stageMetadata[stage];

            return (
              <div
                key={stage}
                className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className={`timeline-dot ${isCompleted ? 'done' : ''}`}>
                  {isCompleted ? '✓' : metadata.icon}
                </div>
                <div className="timeline-label">
                  <div className="stage-name">{metadata.title.split('.')[0]}</div>
                  <div className="stage-duration">{metadata.duration}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Stage Details */}
      <div className="stage-details">
        <div className="stage-header">
          <h3>{currentMetadata.title}</h3>
          <p>{currentMetadata.description}</p>
        </div>

        {/* Stage-specific forms */}
        <div className="stage-content">
          {project.stage === 'site_survey' && (
            <div className="form-group">
              <label>Project Address *</label>
              <input
                type="text"
                value={project.address}
                onChange={(e) => dispatch({ type: 'update_data', payload: { address: e.target.value } })}
                placeholder="Enter site address"
              />
              <label>System Size (kWp) *</label>
              <input
                type="number"
                value={project.systemSize}
                onChange={(e) => dispatch({ type: 'update_data', payload: { systemSize: parseFloat(e.target.value) } })}
                placeholder="e.g., 5.6"
              />
            </div>
          )}

          {project.stage === 'roof_analysis' && (
            <div className="form-group">
              <label>Roof Pitch (degrees) *</label>
              <input
                type="number"
                value={project.roofPitch || ''}
                onChange={(e) => dispatch({ type: 'update_data', payload: { roofPitch: parseFloat(e.target.value) } })}
                placeholder="e.g., 25"
              />
              <p className="hint">Typical range: 15-35°</p>
            </div>
          )}

          {project.stage === 'panel_selection' && (
            <div className="form-group">
              <label>Number of Panels *</label>
              <input
                type="number"
                value={project.panelCount || ''}
                onChange={(e) => dispatch({ type: 'update_data', payload: { panelCount: parseInt(e.target.value) } })}
              />
              <label>Panel Model *</label>
              <select
                value={project.panelModel || ''}
                onChange={(e) => dispatch({ type: 'update_data', payload: { panelModel: e.target.value } })}
              >
                <option>Select panel...</option>
                <option>JA Solar 550W</option>
                <option>Longi 450W</option>
                <option>Trina 520W</option>
              </select>
            </div>
          )}

          {project.stage === 'safety_review' && (
            <div className="checklist">
              <label>
                <input
                  type="checkbox"
                  checked={checklist['wiring'] || false}
                  onChange={(e) => setChecklist({ ...checklist, wiring: e.target.checked })}
                />
                <span>✓ Electrical wiring verified by licensed electrician</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={checklist['grounding'] || false}
                  onChange={(e) => setChecklist({ ...checklist, grounding: e.target.checked })}
                />
                <span>✓ Grounding and bonding complete</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={checklist['breakers'] || false}
                  onChange={(e) => setChecklist({ ...checklist, breakers: e.target.checked })}
                />
                <span>✓ All breakers and disconnects tested</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={checklist['documentation'] || false}
                  onChange={(e) => setChecklist({ ...checklist, documentation: e.target.checked })}
                />
                <span>✓ Documentation and manuals provided</span>
              </label>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="stage-actions">
          <button
            className="btn-secondary"
            onClick={() => dispatch({ type: 'revert' })}
            disabled={currentStageIndex === 0}
          >
            ← Previous Stage
          </button>

          <button
            className="btn-primary"
            onClick={handleAdvance}
            disabled={!canAdvance()}
          >
            Next Stage →
          </button>

          {currentStageIndex === stageSequence.length - 1 && (
            <button
              className="btn-success"
              onClick={() => dispatch({ type: 'complete' })}
            >
              ✓ Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="status-indicator">
        <span className={`status-badge ${project.status}`}>
          {project.status === 'completed' && '✓ Project Completed'}
          {project.status === 'in_progress' && '⏱️ In Progress'}
          {project.status === 'on_hold' && '⏸️ On Hold'}
        </span>
      </div>
    </div>
  );
};

export default ProjectStateAI;

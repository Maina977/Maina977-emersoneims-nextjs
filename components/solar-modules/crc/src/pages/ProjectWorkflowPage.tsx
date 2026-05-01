import React, { useState } from 'react';
import { ProjectStateAI } from '../../components/decision/ProjectStateAI';

const ProjectWorkflowPage: React.FC = () => {
  const [projectId] = useState(() => `proj_${Date.now()}`);
  return (
    <div style={{ padding: '1rem' }}>
      <ProjectStateAI projectId={projectId} />
    </div>
  );
};

export default ProjectWorkflowPage;

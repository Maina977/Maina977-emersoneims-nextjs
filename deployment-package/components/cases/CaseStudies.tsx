'use client';

interface Project {
  id: string;
  title: string;
  description?: string;
  image?: string;
  [key: string]: any;
}

interface CaseStudiesProps {
  onProjectSelect?: (project: Project) => void;
}

export default function CaseStudies({ onProjectSelect }: CaseStudiesProps) {
  // Placeholder case studies data
  const caseStudies: Project[] = [
    {
      id: '1',
      title: 'Premium Power Solution',
      description: 'Advanced generator installation and maintenance',
    },
    {
      id: '2',
      title: 'Solar Energy Integration',
      description: 'Renewable energy system implementation',
    },
    {
      id: '3',
      title: 'Industrial UPS System',
      description: 'Uninterruptible power supply for critical infrastructure',
    },
  ];

  const handleProjectClick = (project: Project) => {
    if (onProjectSelect) {
      onProjectSelect(project);
    }
  };

  return (
    <section className="case-studies-section py-20 px-5vw">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          Award-Winning Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((project) => (
            <div
              key={project.id}
              className="case-study-card bg-gray-900 border-2 border-gray-700 rounded-lg p-6 cursor-pointer hover:border-amber-500 transition-colors"
              onClick={() => handleProjectClick(project)}
            >
              <h3 className="text-2xl font-bold text-amber-500 mb-3">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-gray-300 mb-4">{project.description}</p>
              )}
              <button className="text-amber-400 hover:text-amber-300 font-semibold">
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


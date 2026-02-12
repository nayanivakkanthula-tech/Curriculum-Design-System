
import React, { useRef, useState, useEffect } from 'react';
import { CurriculumData, Module, IntelligenceScores, CapstoneProject, SkillGap } from '../types';

interface CurriculumDisplayProps {
  data: CurriculumData;
  onSave: (updated: CurriculumData) => void;
  onExport: (element: HTMLElement) => void;
  onRegenerate: (feedback: string) => void;
  isLoading: boolean;
}

const ModernScoreBar: React.FC<{ label: string, score: number, colorStart: string, colorEnd: string, icon: string }> = ({ label, score, colorStart, colorEnd, icon }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      setDisplayScore(Math.floor(easeOut * score));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [score]);

  return (
    <div
      className="group relative space-y-3 cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorStart} ${colorEnd} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
            <i className={`fas ${icon} text-xs`}></i>
          </div>
          <span className="text-xs font-bold text-slate-700 tracking-wide font-heading">{label}</span>
        </div>
        <span className="text-sm font-extrabold text-slate-900">{displayScore}%</span>
      </div>

      <div className="h-3 w-full bg-slate-100/80 rounded-full overflow-hidden shadow-inner relative ring-1 ring-slate-200/50">
        <div
          className={`h-full bg-gradient-to-r ${colorStart} ${colorEnd} relative`}
          style={{ width: `${score}%`, transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
        </div>
      </div>

      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur text-white text-xs py-1.5 px-3 rounded-lg shadow-xl pointer-events-none transition-all duration-300 ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <span className="font-medium text-slate-300">{label}:</span> <span className="font-bold text-white">{score}/100</span>
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/90"></div>
      </div>
    </div>
  );
};

const HorizontalBarChart: React.FC<{ data: { label: string, value: number, fullValue: number }[] }> = ({ data }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 py-6">
      {data.map((d, i) => (
        <div key={i} className="group">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{d.label}</span>
            <span className="text-sm font-black text-slate-900">{d.value.toFixed(0)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-slate-800 rounded-full group-hover:bg-orange-600 transition-colors duration-300"
              style={{ width: `${d.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CurriculumDisplay: React.FC<CurriculumDisplayProps> = ({ data, onSave, onExport, onRegenerate, isLoading }) => {
  const [editableData, setEditableData] = useState<CurriculumData>(data);
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  const handleEdit = (field: keyof CurriculumData, value: any) => {
    const updated = { ...editableData, [field]: value };
    setEditableData(updated);
    onSave(updated);
  };

  const handleModuleEdit = (index: number, key: keyof Module, value: any) => {
    const mods = [...editableData.modules];
    mods[index] = { ...mods[index], [key]: value };
    handleEdit('modules', mods);
  };

  const handleExportClick = async (type: 'pdf' | 'print') => {
    setIsExporting(true);
    setShowExportMenu(false);

    if (type === 'print') {
      window.print();
      setIsExporting(false);
    } else {
      // Small delay to allow UI to update
      setTimeout(async () => {
        await onExport(displayRef.current!);
        setIsExporting(false);
      }, 100);
    }
  };

  const { intelligenceScores, capstoneProjects, skillGaps, jobRoles, learningOutcomes } = editableData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-home' },
    { id: 'syllabus', label: 'Weekly Syllabus', icon: 'fa-calendar-week' },
    { id: 'blooms', label: "Bloom's Taxonomy", icon: 'fa-brain' },
    { id: 'skills', label: 'Skill Gaps', icon: 'fa-shield-halved' },
    { id: 'projects', label: 'Projects', icon: 'fa-rocket' },
    { id: 'jobs', label: 'Job Roles', icon: 'fa-id-badge' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Feedback & Actions */}
        <aside className="lg:w-80 space-y-6">
          <div className="glass-card p-6 rounded-2xl sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/50 p-2 rounded-lg shadow-sm border border-orange-100">
                <i className="fas fa-wand-magic-sparkles text-sm text-orange-600"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-800 font-heading">AI Feedback Assistant</h2>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Describe specific improvements: e.g. "Add more Python labs", "Focus on cloud architecture", or "Simplify the math".
            </p>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[120px] mb-4 focus:ring-2 focus:ring-slate-900 outline-none transition-smooth"
              placeholder="Tell the AI what to change..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button
              onClick={() => onRegenerate(feedback)}
              disabled={isLoading || !feedback}
              className="btn btn-primary w-full"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sync"></i>}
              {isLoading ? 'Processing...' : 'Regenerate Content'}
            </button>

            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Intelligence</h3>
              <div className="space-y-4">
                <ModernScoreBar label="Innovation" score={intelligenceScores.innovationScore} colorStart="from-orange-600" colorEnd="to-red-600" icon="fa-lightbulb" />
                <ModernScoreBar label="Relevance" score={intelligenceScores.industryRelevance} colorStart="from-emerald-500" colorEnd="to-teal-500" icon="fa-industry" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Document Display */}
        <div className="flex-1 space-y-8">
          <div ref={displayRef} className="glass-card rounded-[2.5rem] shadow-2xl p-8 md:p-16 space-y-16 overflow-hidden">
            {/* Document Header */}
            <header className="border-b border-slate-100 pb-12">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-900 text-white p-2 rounded-lg">
                    <i className="fas fa-robot text-xl"></i>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">CurricuForge Report v2.1</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{editableData.mode} Mode</span>
                  <span className="text-xs text-slate-400">{new Date(editableData.timestamp || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
              <input
                className="block w-full text-4xl font-black text-slate-900 mb-6 bg-transparent border-none focus:ring-0 p-0"
                value={editableData.courseName}
                onChange={(e) => handleEdit('courseName', e.target.value)}
              />
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest">Category</p>
                  <p className="font-bold text-slate-700">{editableData.subjectArea}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest">Target Level</p>
                  <p className="font-bold text-slate-700">{editableData.academicLevel}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest">Load</p>
                  <p className="font-bold text-slate-700">{editableData.creditHours} Credits</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest">Methodology</p>
                  <p className="font-bold text-slate-700">{editableData.teachingType}</p>
                </div>
              </div>
            </header>

            {/* Tab Navigation */}
            <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all flex items-center gap-2 group ${activeTab === tab.id
                    ? 'bg-white text-orange-600 border-t-2 border-orange-500 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]'
                    : 'bg-slate-100 text-slate-500 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                >
                  <i className={`fas ${tab.icon} transition-transform duration-300 group-hover:scale-110`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <section className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-3xl p-8 border border-slate-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2 font-heading">
                  <i className="fas fa-chart-line text-orange-600"></i> Curriculum Audit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  <ModernScoreBar label="Depth" score={intelligenceScores.academicDepth} colorStart="from-blue-500" colorEnd="to-cyan-500" icon="fa-book" />
                  <ModernScoreBar label="Industry" score={intelligenceScores.industryRelevance} colorStart="from-emerald-500" colorEnd="to-teal-500" icon="fa-industry" />
                  <ModernScoreBar label="Bloom's" score={intelligenceScores.bloomsCoverage} colorStart="from-purple-500" colorEnd="to-violet-500" icon="fa-brain" />
                  <ModernScoreBar label="Practical" score={intelligenceScores.practicalBalance} colorStart="from-orange-500" colorEnd="to-amber-500" icon="fa-hammer" />
                  <ModernScoreBar label="Innovation" score={intelligenceScores.innovationScore} colorStart="from-orange-600" colorEnd="to-red-600" icon="fa-sparkles" />
                </div>
              </section>
            )}

            {activeTab === 'syllabus' && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-black text-slate-900 mb-10 border-l-8 border-orange-600 pl-6">Strategic Week-by-Week</h2>
                <div className="space-y-4">
                  {editableData.modules.map((mod, idx) => (
                    <div key={idx} className="glass-card border border-slate-200 rounded-3xl p-6 card-interactive group">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-md">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Week</span>
                          <span className="text-3xl font-black">{mod.week}</span>
                        </div>
                        <div className="flex-grow">
                          <input
                            className="block w-full text-lg font-bold text-slate-900 mb-1 bg-transparent border-none p-0 focus:ring-0"
                            value={mod.topic}
                            onChange={(e) => handleModuleEdit(idx, 'topic', e.target.value)}
                          />
                          <textarea
                            className="block w-full text-sm text-slate-500 bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden"
                            value={mod.content}
                            onChange={(e) => handleModuleEdit(idx, 'content', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'blooms' && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-black text-slate-900 mb-8 border-l-8 border-orange-500 pl-6">Bloom's Taxonomy Coverage</h2>

                {/* Visual Distribution Graph */}
                <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-widest">
                    <i className="fas fa-chart-bar text-orange-600"></i>
                    Learning Outcome Distribution
                  </h3>
                  <div className="flex justify-center">
                    <HorizontalBarChart
                      data={['Knowledge', 'Comprehension', 'Application', 'Analysis', 'Synthesis', 'Evaluation'].map(level => {
                        const count = learningOutcomes.filter(o => o.level === level).length;
                        const percentage = learningOutcomes.length > 0 ? (count / learningOutcomes.length) * 100 : 0;
                        return { label: level, value: percentage || 10, fullValue: count };
                      })}
                    />
                  </div>
                </div>

                {/* Detailed Outcomes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningOutcomes.map((outcome, idx) => {
                    const levelColors: Record<string, string> = {
                      'Knowledge': 'bg-purple-100 text-purple-700 border-purple-200',
                      'Comprehension': 'bg-purple-100 text-purple-800 border-purple-300',
                      'Application': 'bg-orange-100 text-orange-700 border-orange-200',
                      'Analysis': 'bg-blue-100 text-blue-700 border-blue-200',
                      'Synthesis': 'bg-violet-100 text-violet-700 border-violet-200',
                      'Evaluation': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'
                    };
                    const colorClass = levelColors[outcome.level] || 'bg-purple-100 text-purple-700 border-purple-200';

                    return (
                      <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <span className={`inline-block px-3 py-1 rounded-lg ${colorClass} text-[9px] font-black uppercase tracking-widest mb-3 border`}>
                          {outcome.level}
                        </span>
                        <p className="text-sm text-slate-600 leading-relaxed italic group-hover:text-slate-900">"{outcome.outcome}"</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === 'skills' && (
              <section className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-10 border border-amber-100 animate-fade-in">
                <h2 className="text-xl font-black text-amber-900 mb-8 flex items-center gap-2">
                  <i className="fas fa-shield-halved"></i> Skill Gap Analysis & Fixing
                </h2>
                <div className="space-y-6">
                  {skillGaps.map((gap, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 font-bold text-sm">
                        !
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900 mb-1">{gap.area}</h3>
                        <p className="text-sm text-amber-800/80 mb-2 leading-relaxed">{gap.gapDescription}</p>
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                          <i className="fas fa-check-double"></i> AI Fix: {gap.mitigationStrategy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'jobs' && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-black text-slate-900 mb-8 border-l-8 border-orange-500 pl-6">Target Professional Roles</h2>
                <div className="flex flex-wrap gap-4">
                  {jobRoles.map((role, i) => (
                    <div key={i} className="px-6 py-4 bg-orange-50 text-orange-800 rounded-2xl border border-orange-100 flex items-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <i className="fas fa-id-badge text-orange-400"></i>
                      <span className="font-bold">{role}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'projects' && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-black text-slate-900 mb-8 border-l-8 border-orange-600 pl-6">Real-World Capstone Projects</h2>
                <div className="space-y-8">
                  {capstoneProjects.map((project, i) => (
                    <div key={i} className="glass-card border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <i className="fas fa-cube text-xl"></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{project.title}</h3>
                          <p className="text-slate-600 leading-relaxed mb-6">{project.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tech Stack</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 transition-colors">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Deliverables</h4>
                              <ul className="space-y-2">
                                {project.deliverables.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                    <i className="fas fa-check text-orange-500 text-xs"></i>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>


          <div className="flex justify-center gap-4 py-8 relative">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className={`bg-white text-slate-900 border border-slate-900 px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-50 shadow-lg active:scale-95 transition-smooth ${isExporting ? 'opacity-75 cursor-wait' : ''
                  }`}
              >
                {isExporting ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin text-orange-600"></i>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-export text-orange-600"></i>
                    Export Intelligence Report
                    <i className={`fas fa-chevron-down ml-2 transition-transform ${showExportMenu ? 'rotate-180' : ''}`}></i>
                  </>
                )}
              </button>

              {showExportMenu && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 glass-card rounded-xl shadow-2xl border border-white/30 overflow-hidden animate-scale-in origin-bottom">
                  <button
                    onClick={() => handleExportClick('pdf')}
                    className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 border-b border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 text-sm">Download PDF</span>
                      <span className="block text-xs text-slate-500">High Resolution</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExportClick('print')}
                    className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <i className="fas fa-print"></i>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 text-sm">Print View</span>
                      <span className="block text-xs text-slate-500">Browser Native</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDisplay;

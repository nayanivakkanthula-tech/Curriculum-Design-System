
import React, { useState, useEffect } from 'react';
import { FormInputs, IndustryMode } from '../types';
import { ACADEMIC_LEVELS, TEACHING_TYPES, INDUSTRY_MODES, COURSE_TITLES, SUBJECT_AREAS, INDUSTRY_FOCUS_OPTIONS } from '../constants';

interface CurriculumFormProps {
  onGenerate: (inputs: FormInputs) => void;
  isLoading: boolean;
}

const CurriculumForm: React.FC<CurriculumFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<FormInputs>({
    courseName: COURSE_TITLES[0],
    subjectArea: SUBJECT_AREAS[0],
    academicLevel: ACADEMIC_LEVELS[0],
    durationWeeks: '12',
    creditHours: '4',
    industryFocus: INDUSTRY_FOCUS_OPTIONS[0],
    teachingType: TEACHING_TYPES[0],
    mode: 'Corporate'
  });

  const [creditAlert, setCreditAlert] = useState<{ message: string, type: 'warning' | 'info' } | null>(null);

  useEffect(() => {
    const weeks = parseInt(formData.durationWeeks) || 0;
    const credits = parseInt(formData.creditHours) || 0;

    if (weeks > 0 && credits > 0) {
      const ratio = credits / weeks;
      if (ratio > 1.5) {
        setCreditAlert({
          message: `Intensity Alert: ${credits} credits in ${weeks} weeks is extremely dense. Consider increasing duration or reducing credits for better student outcomes.`,
          type: 'warning'
        });
      } else if (ratio < 0.2) {
        setCreditAlert({
          message: "Structure Note: Low credit-to-duration ratio. Ensure the curriculum has sufficient depth to maintain student engagement.",
          type: 'info'
        });
      } else {
        setCreditAlert(null);
      }
    }
  }, [formData.durationWeeks, formData.creditHours]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-white/30">
        <div className="bg-gradient-primary px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Curriculum Intelligence Config</h2>
            <p className="opacity-90 mt-1 text-sm">Set the parameters for your industry-ready course.</p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Credit Optimizer</span>
            <div className="flex items-center gap-2 justify-end">
              <i className={`fas fa-circle text-[8px] ${creditAlert?.type === 'warning' ? 'text-amber-300' : 'text-emerald-300'} animate-pulse`}></i>
              <span className="text-sm font-semibold">Live Analysis</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Course Title</label>
              <select
                name="courseName"
                required
                value={formData.courseName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              >
                {COURSE_TITLES.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Subject Area</label>
              <select
                name="subjectArea"
                required
                value={formData.subjectArea}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              >
                {SUBJECT_AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Academic Level</label>
              <select
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              >
                {ACADEMIC_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Industry Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              >
                {INDUSTRY_MODES.map(mode => (
                  <option key={mode.id} value={mode.id}>{mode.id} - {mode.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Duration (Weeks)</label>
              <input
                type="number"
                name="durationWeeks"
                required
                min="1"
                max="52"
                value={formData.durationWeeks}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Credit Hours</label>
              <input
                type="number"
                name="creditHours"
                required
                min="1"
                max="20"
                value={formData.creditHours}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Teaching Type</label>
              <select
                name="teachingType"
                value={formData.teachingType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                {TEACHING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Specific Industry Focus</label>
              <select
                name="industryFocus"
                required
                value={formData.industryFocus}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              >
                {INDUSTRY_FOCUS_OPTIONS.map(focus => (
                  <option key={focus} value={focus}>{focus}</option>
                ))}
              </select>
            </div>

            {creditAlert && (
              <div className={`col-span-1 md:col-span-2 p-4 rounded-xl flex gap-3 items-center glass-card ${creditAlert.type === 'warning' ? 'border-l-4 border-amber-500' : 'border-l-4 border-blue-500'
                }`}>
                <i className={`fas ${creditAlert.type === 'warning' ? 'fa-exclamation-triangle text-amber-600' : 'fa-info-circle text-blue-600'}`}></i>
                <p className={`text-xs font-medium ${creditAlert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>{creditAlert.message}</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn btn-primary py-3 text-base shadow-xl ${isLoading ? 'opacity-70 cursor-wait' : 'hover-lift'}`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-atom fa-spin"></i>
                  Synthesizing Curriculum...
                </>
              ) : (
                <>
                  <i className="fas fa-sparkles"></i>
                  Generate Curriculum
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurriculumForm;

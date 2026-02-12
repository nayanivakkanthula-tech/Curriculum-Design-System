

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CurriculumForm from './components/CurriculumForm';
import CurriculumDisplay from './components/CurriculumDisplay';
import AuthModal from './components/AuthModal';
import { CurriculumData, FormInputs } from './types';
import { generateCurriculum } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [generatedData, setGeneratedData] = useState<CurriculumData | null>(null);
  const [currentInputs, setCurrentInputs] = useState<FormInputs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedCurricula, setSavedCurricula] = useState<CurriculumData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);



  useEffect(() => {
    // Check for stored authentication on mount
    const authData = localStorage.getItem('edudesigner_auth');
    if (authData) {
      const { user } = JSON.parse(authData);
      setCurrentUser(user);
      setIsAuthenticated(true);

      // Load user-specific data
      const userKey = `curricula_v2_${user.email}`;
      const saved = localStorage.getItem(userKey);
      if (saved) setSavedCurricula(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simple authentication - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('edudesigner_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const authData = { user: { name: user.name, email: user.email } };
      localStorage.setItem('edudesigner_auth', JSON.stringify(authData));
      setCurrentUser({ name: user.name, email: user.email });
      setIsAuthenticated(true);
      setShowAuthModal(false);

      // Load user-specific data on login
      const userKey = `curricula_v2_${user.email}`;
      const saved = localStorage.getItem(userKey);
      setSavedCurricula(saved ? JSON.parse(saved) : []);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // Simple signup - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('edudesigner_users') || '[]');

    if (users.find((u: any) => u.email === email)) {
      alert('Email already exists');
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('edudesigner_users', JSON.stringify(users));

    // Auto login after signup
    handleLogin(email, password);
  };

  const handleLogout = () => {
    localStorage.removeItem('edudesigner_auth');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSavedCurricula([]); // Clear data on logout
    setCurrentPage('home');
  };



  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentPage('form');
    } else {
      setShowAuthModal(true);
    }
  };


  const handleGenerate = async (inputs: FormInputs) => {
    setIsLoading(true);
    setError(null);
    setCurrentInputs(inputs);
    try {
      const data = await generateCurriculum(inputs);
      setGeneratedData(data);
      saveToHistory(data);
      setCurrentPage('output');
    } catch (err: any) {
      console.error(err);
      setError(`Generation Failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (feedback: string) => {
    if (!currentInputs || !generatedData) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateCurriculum(currentInputs, feedback, generatedData);
      setGeneratedData(data);
      saveToHistory(data);
    } catch (err: any) {
      console.error(err);
      setError("Refinement failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = (data: CurriculumData) => {
    setSavedCurricula(prev => {
      const filtered = prev.filter(item => item.id !== data.id);
      const updated = [data, ...filtered];

      // Save to user-specific storage
      if (currentUser?.email) {
        localStorage.setItem(`curricula_v2_${currentUser.email}`, JSON.stringify(updated.slice(0, 20)));
      }
      return updated;
    });
  };

  const handleDeleteCurriculum = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this curriculum? This action cannot be undone.')) {
      const updated = savedCurricula.filter(item => item.id !== id);
      setSavedCurricula(updated);

      // Update user-specific storage
      if (currentUser?.email) {
        localStorage.setItem(`curricula_v2_${currentUser.email}`, JSON.stringify(updated));
      }
    }
  };

  const exportPDF = async (element: HTMLElement) => {
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${generatedData?.courseName || 'Curriculum'}.pdf`);
  };

  const renderContent = () => {
    if (currentPage === 'home') {
      return (
        <div className="animate-fade-in relative">
          {/* Unified Page Content */}
          <section className="pt-24 pb-20 px-4 relative z-10">
            <header className="max-w-6xl mx-auto text-center mb-24 relative">

              {/* Abstract Curriculum Illustration (CSS Composition) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-10 pointer-events-none z-[-1]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
              </div>

              <div className="mb-12 inline-block relative group cursor-default">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-rose-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-6 py-2 bg-white ring-1 ring-gray-900/5 rounded-full leading-none flex items-top justify-start space-x-6">
                  <span className="text-orange-600 font-bold tracking-wider text-xs uppercase">v2.1 Now Live</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 font-heading leading-tight">
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-600">Curriculum Design System</span>
              </h1>
              <p className="text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                Bridging the gap between academic rigor and industry demand with real-time intelligence mapping.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <button
                  onClick={handleGetStarted}
                  className="btn btn-primary text-base px-8 py-3 shadow-xl hover:shadow-orange-500/20"
                >
                  <i className="fas fa-sparkles mr-2"></i>
                  {isAuthenticated ? 'Create New Design' : 'Get Started Free'}
                </button>
              </div>

              {/* 3D Glass Composition Representation */}
              {/* Professional System Architecture (Classic & Simple) */}
              <div className="relative max-w-4xl mx-auto py-12 hidden md:block">
                {/* Connecting Lines (Behind) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 border-t-2 border-dashed border-slate-200 -z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-40 border-l-2 border-dashed border-slate-200 -z-10"></div>

                <div className="flex justify-center items-center gap-12 relative">
                  {/* Left Node: Input */}
                  <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center w-48 relative group hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 mx-auto bg-slate-50 text-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 font-heading">Academic Standards</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Input Source</p>
                    {/* Dot */}
                    <div className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-300 rounded-full translate-x-1/2"></div>
                  </div>

                  {/* Center Node: Core Engine */}
                  <div className="bg-white border-2 border-slate-900 p-8 rounded-2xl shadow-xl text-center w-64 z-10 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-oragne-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-slate-900">
                      Core Engine
                    </div>
                    <div className="w-16 h-16 mx-auto bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 border border-orange-100">
                      <i className="fas fa-microchip text-3xl"></i>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1 font-heading">Smart Analysis</h3>
                    <p className="text-xs text-slate-500 font-medium">Processing & Alignment</p>
                  </div>

                  {/* Right Node: Output */}
                  <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center w-48 relative group hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 mx-auto bg-slate-50 text-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 font-heading">Optimized Curriculum</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Final Output</p>
                    {/* Dot */}
                    <div className="absolute top-1/2 -left-1 w-2 h-2 bg-slate-300 rounded-full -translate-x-1/2"></div>
                  </div>
                </div>
              </div>

            </header>

            {/* Features (Unified) */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                  { icon: 'fa-brain', title: 'AI-Powered', desc: 'Generates full curriculums in seconds using advanced LLMs.' },
                  { icon: 'fa-chart-pie', title: 'Data-Driven', desc: 'Visualizes Bloom’s Taxonomy & skill gaps instantly.' },
                  { icon: 'fa-briefcase', title: 'Industry-Ready', desc: 'Aligns academic content with real-world job roles.' },
                  { icon: 'fa-file-export', title: 'Exportable', desc: 'Download comprehensive PDF reports for accreditation.' }
                ].map((feature, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all duration-300 group hover:-translate-y-2">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                      <i className={`fas ${feature.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (currentPage === 'form') {
      return (
        <div className="py-20 px-4">
          <CurriculumForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
      );
    }

    if (currentPage === 'output' && generatedData) {
      return (
        <div className="py-20 px-4">
          <CurriculumDisplay
            data={generatedData}
            onSave={saveToHistory}
            onExport={exportPDF}
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
          />
        </div>
      );
    }

    if (currentPage === 'history') {
      return (
        <div className="max-w-5xl mx-auto py-20 px-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2 font-heading">
            <i className="fas fa-layer-group text-orange-600"></i>
            My Curricula

          </h2>
          {savedCurricula.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl">
              <i className="fas fa-inbox text-6xl text-slate-300 mb-4"></i>
              <p className="text-slate-500">Your design history is empty.</p>
            </div>
          ) : (

            // ... (inside renderContent)

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedCurricula.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-6 rounded-xl card-interactive cursor-pointer group relative"
                  onClick={() => {
                    setGeneratedData(item);
                    setCurrentInputs({
                      courseName: item.courseName,
                      subjectArea: item.subjectArea,
                      academicLevel: item.academicLevel,
                      durationWeeks: item.durationWeeks.toString(),
                      creditHours: item.creditHours.toString(),
                      industryFocus: item.industryFocus,
                      teachingType: item.teachingType,
                      mode: item.mode
                    });
                    setCurrentPage('output');
                  }}
                >
                  <button
                    onClick={(e) => handleDeleteCurriculum(e, item.id!)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Delete Curriculum"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>

                  <div className="flex justify-between mb-4 pr-8">
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full uppercase tracking-widest">{item.mode}</span>
                    <span className="text-[10px] text-slate-400">{new Date(item.timestamp!).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-smooth pr-6">{item.courseName}</h3>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-medium">
                      <i className="fas fa-clock mr-1"></i>{item.durationWeeks}W
                    </span>
                    <span className="text-[10px] px-3 py-1 bg-orange-50 rounded-full text-orange-600 font-medium">
                      <i className="fas fa-lightbulb mr-1"></i>{item.intelligenceScores.innovationScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 glass text-slate-600 w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover-lift active:scale-95 z-40 transition-smooth"
      >
        <i className="fas fa-chevron-up text-lg"></i>
      </button>
    </div>
  );
};

export default App;

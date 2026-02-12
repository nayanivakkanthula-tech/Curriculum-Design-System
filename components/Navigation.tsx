
import React from 'react';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isAuthenticated: boolean;
  currentUser: { name: string; email: string } | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onNavigate,
  currentPage,
  isAuthenticated,
  currentUser,
  onAuthClick,
  onLogout
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-xl text-orange-600 shadow-lg border border-orange-100 animate-float group-hover:rotate-12 transition-transform duration-300">
              <i className="fas fa-graduation-cap text-2xl bg-gradient-to-br from-orange-500 to-red-600 bg-clip-text text-transparent"></i>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight font-heading">CurricuForge</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`${currentPage === 'home' ? 'text-orange-600 font-semibold' : 'text-slate-600'} hover:text-orange-600 transition-smooth relative group`}
            >
              Home
              {currentPage === 'home' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-primary rounded-full"></span>
              )}
            </button>

            {isAuthenticated && (
              <button
                onClick={() => onNavigate('history')}
                className={`${currentPage === 'history' ? 'text-orange-600 font-semibold' : 'text-slate-600'} hover:text-orange-600 transition-smooth relative group text-sm`}
              >
                My Curricula
                {currentPage === 'history' && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-primary rounded-full"></span>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 glass px-4 py-2 rounded-full hover:shadow-md transition-smooth"
                >
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-orange-600 font-extrabold text-sm border-2 border-orange-100 shadow-sm group-hover:border-orange-300 transition-colors">
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-700 hidden sm:block">{currentUser?.name}</span>
                  <i className={`fas fa-chevron-down text-xs text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl border border-white/30 overflow-hidden animate-scale-in">
                    <div className="p-4 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{currentUser?.name}</p>
                      <p className="text-xs text-slate-500">{currentUser?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-rose-600 hover:bg-rose-50 transition-smooth flex items-center gap-2 font-medium"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="btn btn-primary px-6 py-2 text-sm shadow-lg hover:shadow-orange-500/20 hidden md:flex"
              >
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-orange-600 transition-colors p-2"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/20 animate-fade-in absolute w-full left-0 top-16 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-3 rounded-xl font-bold ${currentPage === 'home' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Home
            </button>
            {isAuthenticated && (
              <button
                onClick={() => { onNavigate('history'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl font-bold ${currentPage === 'history' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                My Curricula
              </button>
            )}
            <div className="border-t border-slate-100 my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-bold text-slate-900">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 rounded-xl font-bold text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onAuthClick(); setIsMobileMenuOpen(false); }}
                  className="btn btn-primary w-full justify-center mt-2"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

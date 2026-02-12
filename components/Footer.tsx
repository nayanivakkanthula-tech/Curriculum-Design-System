
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-16 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <div className="bg-gradient-primary p-1.5 rounded text-white shadow-md">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span className="font-bold text-lg font-heading text-slate-200">CurricuForge</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs mx-auto md:mx-0">
              Empowering educators to bridge the gap between academia and industry through intelligent curriculum design.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-200">Quick Links</h4>
            <ul className="text-slate-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-orange-400 transition-smooth">Home</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-smooth">Designer Tool</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-smooth">Documentation</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-smooth">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-200">Legal</h4>
            <ul className="text-slate-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-orange-400 transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-smooth">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
          <p>&copy; {new Date().getFullYear()} CurricuForge System. All rights reserved.</p>
          <div className="flex gap-4">
            <i className="fab fa-twitter hover:text-white cursor-pointer text-lg transition-smooth hover-scale"></i>
            <i className="fab fa-linkedin hover:text-white cursor-pointer text-lg transition-smooth hover-scale"></i>
            <i className="fab fa-github hover:text-white cursor-pointer text-lg transition-smooth hover-scale"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

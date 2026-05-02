import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Shield, LogIn, LogOut, Menu, X, BarChart3, History, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#E4E3E0]/80 backdrop-blur-md border-b border-[#141414]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#141414]" />
            <span className="font-sans font-bold text-xl tracking-tight text-[#141414]">VERITAS AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#analyzer" className="text-sm font-medium text-[#141414]/60 hover:text-[#141414] transition-colors">Analyzer</a>
            <a href="#discovery" className="text-sm font-medium text-[#141414]/60 hover:text-[#141414] transition-colors">Discovery</a>
            {user && (
              <>
                <a href="#history" className="text-sm font-medium text-[#141414]/60 hover:text-[#141414] transition-colors">History</a>
                <a href="#analytics" className="text-sm font-medium text-[#141414]/60 hover:text-[#141414] transition-colors">Stats</a>
              </>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-[#141414]/20" />
                <button 
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#141414] hover:opacity-70 transition-opacity"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#141414]/90 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Login with Google
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#141414]">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#E4E3E0] border-b border-[#141414]/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <a onClick={() => setIsOpen(false)} href="#analyzer" className="block text-lg font-medium text-[#141414]">Analyzer</a>
              <a onClick={() => setIsOpen(false)} href="#discovery" className="block text-lg font-medium text-[#141414]">Discovery</a>
              {user && (
                <>
                  <a onClick={() => setIsOpen(false)} href="#history" className="block text-lg font-medium text-[#141414]">History</a>
                  <a onClick={() => setIsOpen(false)} href="#analytics" className="block text-lg font-medium text-[#141414]">Analytics</a>
                </>
              )}
              {user ? (
                <button 
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="flex items-center gap-2 text-[#141414] font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={() => { signInWithGoogle(); setIsOpen(false); }}
                  className="w-full flex justify-center items-center gap-2 bg-[#141414] text-[#E4E3E0] py-3 rounded-xl font-bold"
                >
                  <LogIn className="w-5 h-5" />
                  Login with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

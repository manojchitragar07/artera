import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, LogOut, LayoutDashboard, Shield, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getDashboardLink = () => {
    if (role === 'ADMIN') return { path: '/admin/overview', label: 'Curation Portal', icon: Shield };
    if (role === 'ARTIST') return { path: '/artist/overview', label: 'Artist Studio', icon: Palette };
    return { path: '/visitor/overview', label: 'Personal Salon', icon: LayoutDashboard };
  };

  const navLinks = [
    { label: 'Explore Gallery', path: '/explore' },
    { label: 'Master Artists', path: '/artists' },
    { label: 'Exhibitions', path: '/exhibitions' },
    { label: 'The Manifesto', path: '/about' },
  ];

  const dashboardInfo = getDashboardLink();
  const DashboardIcon = dashboardInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#E2D9CB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-[#252321] group-hover:text-[#B49A65] transition-colors">
              ARTÉRA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A65] mb-2" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors relative py-1 ${
                    isActive ? 'text-[#B49A65]' : 'text-[#47382F] hover:text-[#252321]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B49A65]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {role === 'VISITOR' && (
                  <Link
                    to="/visitor/saved"
                    className="p-2 text-[#47382F] hover:text-[#B49A65] transition-colors relative"
                    title="Saved Artworks"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                )}

                <Link
                  to={dashboardInfo.path}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#B49A65] text-[#252321] hover:bg-[#B49A65] hover:text-[#FAF7F2] text-xs uppercase tracking-widest transition-all font-medium"
                >
                  <DashboardIcon className="w-3.5 h-3.5" />
                  {dashboardInfo.label}
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-[#858078] hover:text-[#252321] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-widest text-[#47382F] hover:text-[#252321] font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
                >
                  Join Sanctuary
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#252321]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF7F2] border-b border-[#E2D9CB] px-4 pt-2 pb-6 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm uppercase tracking-wider text-[#252321] font-medium"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#E2D9CB] flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    to={dashboardInfo.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-widest"
                  >
                    <DashboardIcon className="w-4 h-4 text-[#B49A65]" />
                    {dashboardInfo.label}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-xs uppercase tracking-widest text-[#858078] hover:text-[#252321]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs uppercase tracking-widest text-[#252321] border border-[#252321]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs uppercase tracking-widest bg-[#252321] text-[#FAF7F2]"
                  >
                    Join Sanctuary
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


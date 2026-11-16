import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, KeyRound, AlertCircle, Shield, Palette, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      // Route to destination
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[#FAF7F2] border border-[#E2D9CB] shadow-gallery p-8 sm:p-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="font-serif text-3xl tracking-widest text-[#252321] inline-block">
            ARTÉRA
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
            Authentication Gate
          </p>
          <h2 className="font-serif text-2xl text-[#252321]">Enter the Sanctuary</h2>
        </div>

        {/* Demo Fast-Login Selector Badges */}
        <div className="bg-[#F5F0E8] border border-[#D8CEBF] p-3 text-xs space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block">
            One-Click Evaluation Credentials:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@artera.art', 'Admin@123456')}
              className="px-2 py-1.5 bg-[#FAF7F2] border border-[#D8CEBF] hover:border-[#B49A65] text-[#252321] rounded text-[11px] font-medium flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3 text-[#B49A65]" /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('artist@artera.art', 'Artist@123456')}
              className="px-2 py-1.5 bg-[#FAF7F2] border border-[#D8CEBF] hover:border-[#B49A65] text-[#252321] rounded text-[11px] font-medium flex items-center justify-center gap-1"
            >
              <Palette className="w-3 h-3 text-[#B49A65]" /> Artist
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('visitor@artera.art', 'Visitor@123456')}
              className="px-2 py-1.5 bg-[#FAF7F2] border border-[#D8CEBF] hover:border-[#B49A65] text-[#252321] rounded text-[11px] font-medium flex items-center justify-center gap-1"
            >
              <User className="w-3 h-3 text-[#B49A65]" /> Visitor
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. collector@artera.art"
              className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#858078] hover:text-[#B49A65] transition-colors"
              >
                Reset Password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md disabled:opacity-50"
          >
            <LogIn className="w-4 h-4 text-[#B49A65]" />
            {isSubmitting ? 'Verifying Identity...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-[#E2D9CB]">
          <p className="text-xs text-[#858078]">
            Do not have an account yet?{' '}
            <Link to="/register" className="text-[#B49A65] hover:text-[#252321] font-medium">
              Join Sanctuary
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};


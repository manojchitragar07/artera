import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#FAF7F2] border border-[#E2D9CB] shadow-gallery p-8 sm:p-10 space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#858078] hover:text-[#252321]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-[#252321]">Account Recovery</h2>
          <p className="text-xs text-[#858078] leading-relaxed">
            Enter the email address associated with your sanctuary portfolio. We will dispatch instructions to securely reset your credentials.
          </p>
        </div>

        {sent ? (
          <div className="py-6 text-center space-y-3 bg-[#F5F0E8] border border-[#D8CEBF] p-4">
            <CheckCircle2 className="w-10 h-10 text-[#B49A65] mx-auto" />
            <h3 className="font-serif text-lg text-[#252321]">Recovery Dispatch Sent</h3>
            <p className="text-xs text-[#858078]">
              If an account exists for <strong className="text-[#252321]">{email}</strong>, you will receive a reset link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@domain.com"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md"
            >
              <KeyRound className="w-4 h-4 text-[#B49A65]" />
              Dispatch Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


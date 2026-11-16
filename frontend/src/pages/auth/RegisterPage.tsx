import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Palette, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole: Role = searchParams.get('role') === 'artist' ? 'ARTIST' : 'VISITOR';
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await register({
        name,
        email,
        password,
        role: selectedRole,
        speciality: selectedRole === 'ARTIST' ? speciality : undefined,
        location: location || undefined,
        bio: bio || undefined,
      });

      setIsSuccess(true);
      setTimeout(() => {
        if (selectedRole === 'ARTIST') {
          navigate('/artist/overview');
        } else {
          navigate('/explore');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-[#FAF7F2] border border-[#E2D9CB] shadow-gallery p-8 sm:p-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="font-serif text-3xl tracking-widest text-[#252321] inline-block">
            ARTÉRA
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
            Registration & Curation Induction
          </p>
          <h2 className="font-serif text-2xl text-[#252321]">Join the Physical Sanctuary</h2>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-[#F5F0E8] border border-[#D8CEBF]">
          <button
            type="button"
            onClick={() => setSelectedRole('VISITOR')}
            className={`py-2.5 px-3 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'VISITOR'
                ? 'bg-[#FAF7F2] text-[#252321] shadow-sm border border-[#B49A65]/40 font-semibold'
                : 'text-[#858078] hover:text-[#252321]'
            }`}
          >
            <User className="w-4 h-4 text-[#B49A65]" />
            Art Collector / Visitor
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ARTIST')}
            className={`py-2.5 px-3 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'ARTIST'
                ? 'bg-[#FAF7F2] text-[#252321] shadow-sm border border-[#B49A65]/40 font-semibold'
                : 'text-[#858078] hover:text-[#252321]'
            }`}
          >
            <Palette className="w-4 h-4 text-[#B49A65]" />
            Traditional Artist
          </button>
        </div>

        {selectedRole === 'ARTIST' && (
          <div className="p-3 bg-[#EAE2D5]/70 border border-[#D8CEBF] text-xs text-[#47382F] leading-relaxed">
            <strong>Artist Verification Notice:</strong> New traditional artist accounts receive a verified pending approval status so curators can review your physical craft portfolio before public exhibition.
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#B49A65] mx-auto" />
            <h3 className="font-serif text-2xl text-[#252321]">Welcome to ARTÉRA</h3>
            <p className="text-xs text-[#858078]">
              Your account has been registered. Entering sanctuary...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Full Name / Studio Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Lorenzo"
                  className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@atelier.art"
                  className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Studio Location (City, Country)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Florence, Italy"
                  className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                />
              </div>

              {selectedRole === 'ARTIST' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                    Primary Artistic Speciality *
                  </label>
                  <input
                    type="text"
                    required
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    placeholder="e.g. Oil on Canvas & Chiaroscuro"
                    className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                {selectedRole === 'ARTIST' ? 'Artist Statement / Background' : 'Collector Bio (Optional)'}
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={
                  selectedRole === 'ARTIST'
                    ? 'Briefly describe your training, manual techniques, and artistic lineage...'
                    : 'Tell us about the styles and mediums you appreciate or collect...'
                }
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4 text-[#B49A65]" />
              {isSubmitting
                ? 'Creating Sanctuary Account...'
                : selectedRole === 'ARTIST'
                ? 'Submit Artist Application'
                : 'Complete Collector Registration'}
            </button>
          </form>
        )}

        <div className="pt-4 text-center border-t border-[#E2D9CB]">
          <p className="text-xs text-[#858078]">
            Already an inducted member?{' '}
            <Link to="/login" className="text-[#B49A65] hover:text-[#252321] font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};


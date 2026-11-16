import React, { useEffect, useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { visitorService } from '../../services/visitor.service';
import { useAuth } from '../../context/AuthContext';

export const VisitorSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.visitorProfile) {
      setName(user.visitorProfile.name || '');
      setLocation(user.visitorProfile.location || '');
      setBio(user.visitorProfile.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await visitorService.updateProfile({ name, location, bio });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Collector Settings"
      subtitle="Manage your art enthusiast profile, location, and salon collection preferences."
    >
      <div className="max-w-2xl bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-10 shadow-sm space-y-6">
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Collector profile updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
              Full Collector Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
              Residence / Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London, United Kingdom"
              className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
              Collector Bio & Aesthetic Interests
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your passion for traditional physical art lineages, preferred mediums, or private collections..."
              className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] resize-none"
            />
          </div>

          <div className="pt-4 border-t border-[#E2D9CB] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#B49A65]" />
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};


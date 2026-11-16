import React, { useEffect, useState } from 'react';
import { Save, UserCheck, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { artistService } from '../../services/artist.service';
import { uploadService } from '../../services/upload.service';
import { useAuth } from '../../context/AuthContext';

export const ArtistProfileEdit: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [disciplines, setDisciplines] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [bio, setBio] = useState('');
  const [statement, setStatement] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.artistProfile) {
      const p = user.artistProfile;
      setName(p.name || '');
      setSpeciality(p.speciality || '');
      setDisciplines(p.disciplines || '');
      setLocation(p.location || '');
      setYearsOfExperience(p.yearsOfExperience ?? '');
      setWebsite(p.website || '');
      setInstagram(p.instagram || '');
      setBio(p.bio || '');
      setStatement(p.statement || '');
      setProfileImage(p.profileImage || '');
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await uploadService.uploadSingle(e.target.files[0]);
        if (res.success) {
          setProfileImage(res.data.url);
        }
      } catch (err) {
        console.error('Failed to upload profile portrait:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await artistService.updateProfile({
        name,
        speciality,
        disciplines: disciplines || null,
        location: location || null,
        yearsOfExperience: yearsOfExperience !== '' ? Number(yearsOfExperience) : null,
        website: website || null,
        instagram: instagram || null,
        bio: bio || null,
        statement: statement || null,
        profileImage: profileImage || null,
      });

      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Edit Studio Profile"
      subtitle="Refine your public atelier profile, artistic statement, and representation credentials."
    >
      <div className="max-w-3xl bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-10 shadow-sm space-y-6">
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Profile and artist statement updated successfully.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Portrait Photo */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[#EAE2D5] border-2 border-[#B49A65] shrink-0">
              <img
                src={profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-semibold mb-1">
                Studio Portrait Photograph
              </label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider cursor-pointer hover:bg-[#3A3633]">
                <Upload className="w-3.5 h-3.5 text-[#B49A65]" />
                Change Portrait
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Artist / Studio Name *
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
                Primary Speciality *
              </label>
              <input
                type="text"
                required
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                placeholder="e.g. Classical Oil Painting & Chiaroscuro"
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Studio Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Florence, Italy"
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Years of Lineage / Experience
              </label>
              <input
                type="number"
                min="0"
                max="80"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value ? parseInt(e.target.value, 10) : '')}
                placeholder="e.g. 18"
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Physical Disciplines
              </label>
              <input
                type="text"
                value={disciplines}
                onChange={(e) => setDisciplines(e.target.value)}
                placeholder="e.g. Oil on Canvas, Linen, Glazes"
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Website / Archive URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://studio.art"
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@artist_atelier"
                className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
              Artist Statement & Manifesto
            </label>
            <textarea
              rows={3}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Your guiding philosophy regarding manual craft, physical medium, and human memory..."
              className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] italic"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
              Studio Biography
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Art historical training, academies attended, historical techniques practiced..."
              className="w-full px-3.5 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
            />
          </div>

          <div className="pt-4 border-t border-[#E2D9CB] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#B49A65]" />
              {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};


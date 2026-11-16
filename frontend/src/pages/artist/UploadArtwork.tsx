import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { categoryService } from '../../services/category.service';
import { artworkService } from '../../services/artwork.service';
import { uploadService } from '../../services/upload.service';
import { Category, Medium, ArtworkStatus } from '../../types';

export const UploadArtwork: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mediums, setMediums] = useState<Medium[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mediumId, setMediumId] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [creationYear, setCreationYear] = useState<number>(new Date().getFullYear());
  const [price, setPrice] = useState<string>('');
  const [isEnquiryOnly, setIsEnquiryOnly] = useState(false);
  const [frameStyle, setFrameStyle] = useState('natural-oak');
  const [tags, setTags] = useState('');

  // Image Upload State
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string>('');
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, medRes] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getMediums(),
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (medRes.success) setMediums(medRes.data);
        if (catRes.data && catRes.data.length > 0) {
          setCategoryId(catRes.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories/mediums:', err);
      }
    };
    fetchMetadata();
  }, []);

  const handlePrimaryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrimaryFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAdditionalFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
      setAdditionalPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (submitStatus: ArtworkStatus) => {
    if (!title || !description || !categoryId || !dimensions) {
      setError('Please complete all required fields.');
      return;
    }

    if (!primaryFile) {
      setError('Please upload at least one primary artwork image.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload primary image
      setUploadProgress('Uploading primary photograph...');
      const primaryUploadRes = await uploadService.uploadSingle(primaryFile);

      // 2. Upload additional images if any
      let additionalImages: Array<{ url: string; publicId?: string }> = [];
      if (additionalFiles.length > 0) {
        setUploadProgress(`Uploading ${additionalFiles.length} additional photographs...`);
        const addUploadRes = await uploadService.uploadMultiple(additionalFiles);
        additionalImages = addUploadRes.data.map((item) => ({
          url: item.url,
          publicId: item.publicId,
        }));
      }

      // 3. Create artwork record in database
      setUploadProgress('Archiving masterpiece metadata...');
      await artworkService.createArtwork({
        title,
        description,
        categoryId,
        mediumId: mediumId || null,
        dimensions,
        creationYear,
        price: isEnquiryOnly ? null : price ? parseFloat(price) : null,
        isForSale: !isEnquiryOnly,
        isEnquiryOnly,
        status: submitStatus,
        frameStyle,
        tags: tags || null,
        primaryImageUrl: primaryUploadRes.data.url,
        primaryImagePublicId: primaryUploadRes.data.publicId,
        additionalImages,
      });

      navigate('/artist/artwork');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Artwork upload failed');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <DashboardLayout
      title="Upload Masterpiece"
      subtitle="Register an authentic traditional artwork into the ARTÉRA curatorial archive."
    >
      <div className="max-w-4xl bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-10 shadow-sm space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {uploadProgress && (
          <div className="p-4 bg-[#EAE2D5] border border-[#B49A65] text-[#252321] text-xs flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-[#B49A65] border-t-transparent rounded-full animate-spin" />
            <span>{uploadProgress}</span>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Primary Artwork Image Section */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#252321] font-semibold">
              Primary Artwork Photograph *
            </label>
            <p className="text-xs text-[#858078]">
              Upload a high-fidelity image representing the full face of the artwork. Aspect ratio will be strictly preserved.
            </p>

            {primaryPreview ? (
              <div className="relative inline-block border-2 border-[#B49A65] p-1 bg-[#FAF7F2] shadow-sm">
                <img src={primaryPreview} alt="Preview" className="h-64 object-contain" />
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryFile(null);
                    setPrimaryPreview('');
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-[#141312]/80 hover:bg-black text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#D8CEBF] hover:border-[#B49A65] p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F5F0E8]">
                <Upload className="w-10 h-10 text-[#B49A65] mb-2" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#252321]">
                  Click or drag primary artwork image
                </span>
                <span className="text-[11px] text-[#858078] mt-1">JPEG, PNG, WEBP, or AVIF (Up to 15MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handlePrimaryFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Additional Detail Photographs */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#252321] font-semibold">
              Additional Texture & Angle Photographs (Optional)
            </label>
            <p className="text-xs text-[#858078]">
              Macro brushstroke details, wood grain, impasto relief, or foundry stamp views.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              {additionalPreviews.map((prev, idx) => (
                <div key={idx} className="relative w-24 h-24 border border-[#D8CEBF] bg-[#FAF7F2] p-1">
                  <img src={prev} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalFile(idx)}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <label className="w-24 h-24 border-2 border-dashed border-[#D8CEBF] hover:border-[#B49A65] flex flex-col items-center justify-center cursor-pointer bg-[#F5F0E8]">
                <ImageIcon className="w-5 h-5 text-[#858078]" />
                <span className="text-[10px] text-[#858078] mt-1">+ Add View</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleAdditionalFilesSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Core Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Artwork Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Twilight on the Tuscan Ridge"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Art Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Artistic Medium *
              </label>
              <select
                value={mediumId}
                onChange={(e) => setMediumId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              >
                <option value="">Select Medium</option>
                {mediums.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Dimensions *
              </label>
              <input
                type="text"
                required
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 90 x 120 cm (35 x 47 in)"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Creation Year *
              </label>
              <input
                type="number"
                required
                value={creationYear}
                onChange={(e) => setCreationYear(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>
          </div>

          {/* Pricing & Acquisition Status */}
          <div className="p-5 bg-[#F5F0E8] border border-[#D8CEBF] space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isEnquiryOnly"
                checked={isEnquiryOnly}
                onChange={(e) => setIsEnquiryOnly(e.target.checked)}
                className="w-4 h-4 accent-[#B49A65]"
              />
              <label htmlFor="isEnquiryOnly" className="text-xs uppercase tracking-wider font-semibold text-[#252321] cursor-pointer">
                Private Acquisition / Direct Enquiry Only (No fixed price displayed)
              </label>
            </div>

            {!isEnquiryOnly && (
              <div className="max-w-xs">
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Listed Price ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 4800"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                />
              </div>
            )}
          </div>

          {/* Frame Style & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Museum Frame Presentation Style
              </label>
              <select
                value={frameStyle}
                onChange={(e) => setFrameStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              >
                <option value="natural-oak">Natural Blond Oak Moulding</option>
                <option value="frame-walnut">Deep Bevelled Walnut Wood Frame</option>
                <option value="frame-gold">24K Ornate Gold Leaf Border</option>
                <option value="minimal-linen">Museum Linen Matting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. oil, portrait, chiaroscuro, venice"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
              Artwork Description & Provenance Notes *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the conceptual background, technical pigments, preparation of ground/canvas, or historical dialogue of the piece..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
            />
          </div>

          {/* Submission Buttons */}
          <div className="pt-4 border-t border-[#E2D9CB] flex flex-wrap items-center justify-end gap-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('DRAFT')}
              className="px-6 py-3 border border-[#47382F] text-[#47382F] hover:bg-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('PENDING_APPROVAL')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-[#B49A65]" />
              {isSubmitting ? 'Processing Upload...' : 'Submit for Curatorial Approval'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};


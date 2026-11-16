import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enquiryService } from '../../services/enquiry.service';
import { Artwork } from '../../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork?: Artwork;
  artistId: string;
  artistName: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  artwork,
  artistId,
  artistName,
}) => {
  const { user } = useAuth();
  const [senderName, setSenderName] = useState(user?.visitorProfile?.name || '');
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [senderPhone, setSenderPhone] = useState('');
  const [subject, setSubject] = useState(
    artwork ? `Acquisition Enquiry: ${artwork.title}` : `Studio & Commission Enquiry for ${artistName}`
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await enquiryService.createEnquiry({
        artistId,
        artworkId: artwork?.id,
        senderName,
        senderEmail,
        senderPhone: senderPhone || undefined,
        subject,
        message,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2400);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141312]/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#FAF7F2] border border-[#B49A65]/40 shadow-2xl p-6 sm:p-8"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#858078] hover:text-[#252321] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-14 h-14 text-[#B49A65] mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-[#252321]">Enquiry Transmitted</h3>
              <p className="text-sm text-[#858078] mt-2">
                Your message has been delivered directly to {artistName}’s studio archive. You will receive a copy via email.
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-[#E2D9CB] pb-4 mb-6">
                <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
                  Private Studio Communication
                </span>
                <h3 className="font-serif text-2xl text-[#252321] mt-1">
                  Enquire with {artistName}
                </h3>
                {artwork && (
                  <p className="text-xs text-[#858078] mt-1">
                    Regarding: <span className="italic font-medium text-[#252321]">{artwork.title}</span> ({artwork.dimensions})
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Lord Harrington"
                      className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="collector@domain.com"
                      className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                      Telephone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                    Your Message / Specific Request *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about pricing, private viewing, provenance, shipping crate specifications, or bespoke commission..."
                    className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs uppercase tracking-widest text-[#858078] hover:text-[#252321] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest transition-all shadow-md disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B49A65]" />
                    {isSubmitting ? 'Sending...' : 'Transmit Enquiry'}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, CheckCircle, Clock, User, Phone, Mail } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { enquiryService } from '../../services/enquiry.service';
import { Enquiry } from '../../types';

export const ArtistEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await enquiryService.getEnquiries();
      if (res.success) {
        setEnquiries(res.data);
        if (res.data.length > 0 && !selectedEnquiry) {
          setSelectedEnquiry(res.data[0]);
          setResponseText(res.data[0].artistResponse || '');
        }
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSelect = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setResponseText(enq.artistResponse || '');
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !responseText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await enquiryService.updateStatus(selectedEnquiry.id, {
        artistResponse: responseText,
        status: 'RESOLVED',
      });

      if (res.success) {
        setSelectedEnquiry(res.data);
        setEnquiries((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)));
      }
    } catch (err) {
      console.error('Failed to update enquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Studio Acquisition Enquiries"
      subtitle="Direct correspondence with art collectors, museum curators, and prospective patrons."
    >
      {loading ? (
        <div className="h-72 bg-[#EAE2D5] animate-pulse" />
      ) : enquiries.length === 0 ? (
        <div className="py-24 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
          <MessageSquare className="w-12 h-12 text-[#858078] mx-auto mb-2" />
          <h3 className="font-serif text-2xl text-[#252321]">Studio Inbox Clear</h3>
          <p className="text-xs text-[#858078] mt-1">
            When art enthusiasts submit questions or acquisition requests, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inbox List */}
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E2D9CB] divide-y divide-[#E2D9CB] overflow-hidden shadow-sm max-h-[700px] overflow-y-auto">
            {enquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => handleSelect(enq)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#EAE2D5]' : 'hover:bg-[#F5F0E8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#252321]">{enq.senderName}</span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 ${
                        enq.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm text-[#252321] font-medium truncate">{enq.subject}</h4>
                  <p className="text-xs text-[#858078] line-clamp-1 mt-0.5">{enq.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#858078] mt-2">
                    <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    {enq.artwork && <span className="italic truncate max-w-[150px]">Re: {enq.artwork.title}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed View & Response Composer */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-8 space-y-6 shadow-sm">
            {selectedEnquiry ? (
              <>
                <div className="border-b border-[#E2D9CB] pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
                      Enquiry #{selectedEnquiry.id.slice(-6)}
                    </span>
                    <span className="text-xs text-[#858078]">
                      Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#252321]">{selectedEnquiry.subject}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#47382F] pt-2">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-[#B49A65]" /> {selectedEnquiry.senderName}
                    </span>
                    <a
                      href={`mailto:${selectedEnquiry.senderEmail}`}
                      className="flex items-center gap-1 text-[#858078] hover:text-[#252321]"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#B49A65]" /> {selectedEnquiry.senderEmail}
                    </a>
                    {selectedEnquiry.senderPhone && (
                      <span className="flex items-center gap-1 text-[#858078]">
                        <Phone className="w-3.5 h-3.5 text-[#B49A65]" /> {selectedEnquiry.senderPhone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Target Artwork Card if applicable */}
                {selectedEnquiry.artwork && (
                  <div className="p-3 bg-[#F5F0E8] border border-[#D8CEBF] flex items-center gap-3">
                    <img
                      src={selectedEnquiry.artwork.primaryImageUrl}
                      alt=""
                      className="w-14 h-14 object-cover border border-[#D8CEBF]"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#858078] block">Inquired Masterpiece</span>
                      <h4 className="font-serif text-sm font-semibold text-[#252321]">
                        {selectedEnquiry.artwork.title}
                      </h4>
                      <p className="text-xs text-[#47382F]">
                        {selectedEnquiry.artwork.price ? `$${selectedEnquiry.artwork.price.toLocaleString()}` : 'Enquiry Only'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Patron Message */}
                <div className="p-4 bg-[#F5F0E8] border border-[#E2D9CB] rounded-none">
                  <span className="text-[10px] uppercase tracking-wider text-[#858078] block mb-1">
                    Patron Message:
                  </span>
                  <p className="text-xs sm:text-sm text-[#252321] whitespace-pre-line leading-relaxed font-light">
                    {selectedEnquiry.message}
                  </p>
                </div>

                {/* Response Composer */}
                <form onSubmit={handleSendResponse} className="space-y-4 pt-4 border-t border-[#E2D9CB]">
                  <label className="block text-xs uppercase tracking-wider text-[#252321] font-semibold">
                    Studio Response & Provenance Dispatch
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Compose your reply regarding packaging, private studio inspection, certificates of authenticity, or pricing..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] resize-none"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 text-[#B49A65]" />
                      {isSubmitting ? 'Transmitting Reply...' : 'Transmit Response'}
                    </button>
                  </div>
                </form>
              </>
            ) : null}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};


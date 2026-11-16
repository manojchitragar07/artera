import React, { useEffect, useState } from 'react';
import { MessageSquare, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { enquiryService } from '../../services/enquiry.service';
import { Enquiry } from '../../types';

export const VisitorEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await enquiryService.getEnquiries();
        if (res.success) setEnquiries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  return (
    <DashboardLayout
      title="My Studio Enquiries"
      subtitle="Track acquisition correspondence and bespoke commission dialogues directly with artists."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-[#EAE2D5] animate-pulse" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-24 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
            <MessageSquare className="w-12 h-12 text-[#858078] mx-auto mb-2" />
            <h3 className="font-serif text-2xl text-[#252321]">No Active Enquiries</h3>
            <p className="text-xs text-[#858078] mt-1">
              When viewing an artwork or visiting an artist profile, click "Inquire with Artist" to begin a dialogue.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-8 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D9CB] pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#B49A65] font-semibold block">
                      Enquiry to {enq.artist?.name}
                    </span>
                    <h3 className="font-serif text-xl text-[#252321] font-semibold mt-0.5">{enq.subject}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#858078]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] uppercase font-semibold ${
                        enq.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                </div>

                {/* Associated artwork preview if any */}
                {enq.artwork && (
                  <div className="flex items-center gap-3 p-3 bg-[#F5F0E8] border border-[#D8CEBF]">
                    <img
                      src={enq.artwork.primaryImageUrl}
                      alt=""
                      className="w-12 h-12 object-cover border border-[#D8CEBF]"
                    />
                    <div className="text-xs">
                      <span className="text-[#858078] block">Associated Piece:</span>
                      <strong className="text-[#252321] font-serif">{enq.artwork.title}</strong>
                    </div>
                  </div>
                )}

                {/* Sent Message */}
                <div className="text-xs text-[#47382F] font-light leading-relaxed">
                  <strong className="text-[#252321] block font-medium mb-1">Your Enquiry:</strong>
                  {enq.message}
                </div>

                {/* Artist Response if present */}
                {enq.artistResponse ? (
                  <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200 text-xs text-[#252321] space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold uppercase tracking-wider text-[10px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Studio Response from {enq.artist?.name}
                    </div>
                    <p className="whitespace-pre-line leading-relaxed italic text-emerald-950">
                      "{enq.artistResponse}"
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-700 italic pt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Awaiting reply from artist's studio archive.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};


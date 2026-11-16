import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141312]/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#FAF7F2] border border-[#B49A65]/40 shadow-2xl p-6 sm:p-7"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#858078] hover:text-[#252321]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-full bg-[#EAE2D5] text-[#B49A65]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#252321]">Share Artwork</h3>
              <p className="text-xs text-[#858078]">{title}</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
              Direct Exhibition Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full px-3 py-2 text-xs bg-[#F5F0E8] border border-[#D8CEBF] text-[#47382F] select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#252321] text-[#FAF7F2] hover:bg-[#3A3633] text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#B49A65]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


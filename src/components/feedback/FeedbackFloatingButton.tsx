import React, { useState } from 'react';
import { MessageSquarePlus, Star } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

export const FeedbackFloatingButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2.5 shadow-lg hover:shadow-xl transition-all border border-emerald-700/50 hover:scale-105 active:scale-95 group"
          title="Share Feedback, Review & Feature Suggestions"
          aria-label="Feedback & Feature Request"
        >
          <div className="relative">
            <MessageSquarePlus className="h-4 w-4" />
            <Star className="absolute -top-1 -right-1 h-2.5 w-2.5 text-amber-300 fill-amber-300" />
          </div>
          <span className="hidden sm:inline font-semibold text-xs tracking-wide">
            Feedback & Ideas
          </span>
          <span className="sm:hidden font-semibold text-xs">
            Review
          </span>
        </button>
      </div>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

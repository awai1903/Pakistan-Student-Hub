import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  Lightbulb, 
  GraduationCap, 
  Award, 
  MessageSquare, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { feedbackStore, FeedbackType } from '../../lib/feedbackStore';
import { auth } from '../../lib/firebase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: FeedbackType;
  onSuccess?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'feature_request',
  onSuccess
}) => {
  const [type, setType] = useState<FeedbackType>(defaultType);
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetEntity, setTargetEntity] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill with Firebase auth user if available
  useEffect(() => {
    if (auth.currentUser) {
      if (auth.currentUser.displayName) {
        setAuthorName(auth.currentUser.displayName);
      }
      if (auth.currentUser.email) {
        setAuthorEmail(auth.currentUser.email);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultType) {
      setType(defaultType);
    }
  }, [defaultType]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please enter both a title and description for your submission.');
      return;
    }
    if (!authorName.trim()) {
      setErrorMsg('Please provide your name or student handle.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await feedbackStore.submitFeedback({
        author_name: authorName,
        author_email: authorEmail,
        type,
        title,
        content,
        rating: type === 'general_review' ? rating : (rating || undefined),
        target_entity: targetEntity
      });

      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSubmitted(false);
        setTitle('');
        setContent('');
        setTargetEntity('');
        onClose();
      }, 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Error sending feedback. Please try again.');
    }
  };

  const typeOptions: { id: FeedbackType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'feature_request',
      label: 'Feature Request',
      icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      desc: 'Suggest a new tool, calculator, or feature'
    },
    {
      id: 'general_review',
      label: 'Student Review',
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      desc: 'Rate your experience with Pakistan Student Hub'
    },
    {
      id: 'university_suggestion',
      label: 'Suggest University',
      icon: <GraduationCap className="h-4 w-4 text-emerald-700" />,
      desc: 'Add a missing campus, college or program'
    },
    {
      id: 'scholarship_request',
      label: 'Request Scholarship',
      icon: <Award className="h-4 w-4 text-blue-600" />,
      desc: 'Request a specific grant or financial aid info'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-linear-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs text-white">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Submit Review & Feature Request
              </h2>
              <p className="text-xs text-emerald-100/90">
                Help us build what you need next for Pakistani students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-5">
          {submitted ? (
            <div className="py-12 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your suggestion has been logged and published. The portal team reviews all student requests regularly to implement top-voted features.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Selection of Feedback Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What would you like to share?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map((opt) => {
                    const isSelected = type === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setType(opt.id)}
                        className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-700/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{opt.icon}</div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                            {opt.label}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-tight truncate">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating (Show for reviews or general feedback) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Platform Rating ({rating} of 5 Stars)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus:outline-hidden"
                      aria-label={`${star} Stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-medium text-slate-500">
                    {rating === 5 && '🌟 Excellent / سب سے بہترین'}
                    {rating === 4 && '👍 Very Good / بہت اچھا'}
                    {rating === 3 && '🙂 Good / تسلی بخش'}
                    {rating === 2 && '⚠️ Needs Improvement'}
                    {rating === 1 && '👎 Poor'}
                  </span>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="fb-title" className="block text-xs font-bold text-slate-700 mb-1">
                  Title / Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  id="fb-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === 'feature_request'
                      ? 'e.g. Add Past Papers with solutions for NET & MDCAT'
                      : type === 'university_suggestion'
                      ? 'e.g. Add GIK Institute sub-campus or fees update'
                      : type === 'scholarship_request'
                      ? 'e.g. Add Turkish Burslari scholarship guidance'
                      : 'e.g. Best verified student platform in Pakistan'
                  }
                  maxLength={200}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="fb-desc" className="block text-xs font-bold text-slate-700 mb-1">
                  Details / What should we add? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="fb-desc"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Explain your idea, what specific features would help you, or any links/references..."
                  maxLength={2000}
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Helpful details: university names, cities, links, or specific exam years.</span>
                  <span>{content.length}/2000</span>
                </div>
              </div>

              {/* Target Entity / City / Subject (Optional) */}
              <div>
                <label htmlFor="fb-target" className="block text-xs font-bold text-slate-700 mb-1">
                  Relevant University / City / Category (Optional)
                </label>
                <input
                  id="fb-target"
                  type="text"
                  value={targetEntity}
                  onChange={(e) => setTargetEntity(e.target.value)}
                  placeholder="e.g. NUST / Islamabad, Medical Colleges, Engineering, etc."
                  maxLength={100}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor="fb-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name / Handle <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Awais / Student"
                    maxLength={100}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label htmlFor="fb-email" className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    id="fb-email"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="For status updates when feature is live"
                    maxLength={150}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Post Feedback & Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

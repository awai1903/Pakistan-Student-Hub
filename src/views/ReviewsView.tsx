import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Lightbulb, 
  GraduationCap, 
  Award, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  PlusCircle, 
  Sparkles,
  ShieldCheck,
  Send,
  Trash2
} from 'lucide-react';
import { feedbackStore, FeedbackItem, FeedbackType, FeedbackStatus } from '../lib/feedbackStore';
import { FeedbackModal } from '../components/feedback/FeedbackModal';
import { auth } from '../lib/firebase';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ReviewsView: React.FC = () => {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'newest' | 'rating'>('upvotes');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalDefaultType, setModalDefaultType] = useState<FeedbackType>('feature_request');
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const isAdmin = auth.currentUser?.email === 'awais01sultan@gmail.com' || auth.currentUser?.email === 'awais02sultan@gmail.com';

  useEffect(() => {
    setItems(feedbackStore.getItems());
    const unsub = feedbackStore.subscribe(() => {
      setItems(feedbackStore.getItems());
    });
    return () => unsub();
  }, []);

  const handleUpvote = (id: string) => {
    feedbackStore.upvoteFeedback(id);
  };

  const handleOpenModal = (type: FeedbackType = 'feature_request') => {
    setModalDefaultType(type);
    setModalOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: FeedbackStatus) => {
    feedbackStore.updateStatus(id, newStatus);
  };

  const handleReplySubmit = (id: string) => {
    if (!replyText.trim()) return;
    feedbackStore.updateStatus(id, 'In Progress', replyText.trim());
    setReplyText('');
    setReplyInputId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this feedback item?')) {
      feedbackStore.deleteFeedback(id);
    }
  };

  // Filtered and sorted items
  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchContent = item.content.toLowerCase().includes(q);
      const matchAuthor = item.author_name.toLowerCase().includes(q);
      const matchEntity = item.target_entity?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor && !matchEntity) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Calculate statistics
  const totalReviews = items.filter(i => i.rating !== undefined);
  const avgRating = totalReviews.length > 0 
    ? (totalReviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalReviews.length).toFixed(1)
    : '4.9';
  const completedCount = items.filter(i => i.status === 'Completed').length;
  const plannedCount = items.filter(i => i.status === 'Planned' || i.status === 'In Progress').length;

  const getTypeBadge = (type: FeedbackType) => {
    switch (type) {
      case 'feature_request':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
            <Lightbulb className="h-3 w-3" />
            <span>Feature Request</span>
          </span>
        );
      case 'university_suggestion':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            <GraduationCap className="h-3 w-3" />
            <span>University Suggestion</span>
          </span>
        );
      case 'scholarship_request':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 border border-blue-200">
            <Award className="h-3 w-3" />
            <span>Scholarship Request</span>
          </span>
        );
      case 'general_review':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 border border-purple-200">
            <Star className="h-3 w-3 fill-purple-600 text-purple-600" />
            <span>Student Review</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
            <MessageSquare className="h-3 w-3" />
            <span>Suggestion</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Implemented</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
            <Sparkles className="h-3 w-3 text-indigo-600" />
            <span>In Progress</span>
          </span>
        );
      case 'Planned':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3 text-blue-600" />
            <span>Planned</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Reviews & Feature Requests' }]} />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 px-6 py-8 sm:px-10 sm:py-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-md border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Community Driven Platform & Roadmap</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            Reviews & Feature Suggestions
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            Have an idea for a new feature? Need past papers, hostel guides, merit calculators, or a missing university listed? Share your voice so we can build it for you!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenModal('feature_request')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 hover:bg-emerald-50 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span>Request New Feature</span>
            </button>
            <button
              onClick={() => handleOpenModal('general_review')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overall Rating</span>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgRating}</span>
            <span className="text-xs text-slate-500">/ 5.0</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">
            Based on student community feedback
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Submissions</span>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{items.length}</span>
            <span className="text-xs text-slate-500">ideas & reviews</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Actively tracked by platform admin
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Features Planned</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{plannedCount}</span>
            <span className="text-xs text-slate-500">in development</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-700 font-medium">
            Prioritized by student votes
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Implemented</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{completedCount}</span>
            <span className="text-xs text-slate-500">live features</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">
            Suggested by users, delivered live
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Dynamic Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feature ideas, university suggestions, reviews..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 transition-colors"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-700 focus:border-emerald-700 focus:outline-hidden"
            >
              <option value="upvotes">🔥 Most Upvoted</option>
              <option value="newest">⏱️ Newest First</option>
              <option value="rating">⭐ Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Category:</span>
          </span>
          {[
            { id: 'all', label: 'All Submissions' },
            { id: 'feature_request', label: '💡 Feature Requests' },
            { id: 'general_review', label: '⭐ Student Reviews' },
            { id: 'university_suggestion', label: '🏛️ University Suggestions' },
            { id: 'scholarship_request', label: '🎓 Scholarship Requests' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                filterType === tab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'Under Review', label: 'Under Review' },
            { id: 'Planned', label: 'Planned' },
            { id: 'In Progress', label: 'In Progress' },
            { id: 'Completed', label: 'Implemented' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`rounded-lg px-2.5 py-0.5 text-xs font-medium transition-colors ${
                statusFilter === st.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback & Review Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-base font-bold text-slate-900">No Submissions Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              No reviews or feature requests match your current filters. Be the first to suggest this idea!
            </p>
            <button
              onClick={() => handleOpenModal('feature_request')}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post New Feature Request</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const hasVoted = feedbackStore.hasUpvoted(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-sm transition-shadow space-y-3"
              >
                {/* Header row: Type badge, status badge, date */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(item.type)}
                    {getStatusBadge(item.status)}
                    {item.target_entity && (
                      <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {item.target_entity}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.created_at).toLocaleDateString('en-PK', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Rating if present */}
                {item.rating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= item.rating!
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {item.rating}.0
                    </span>
                  </div>
                )}

                {/* Title and Content */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>

                {/* Official Admin Response Box if available */}
                {item.admin_response && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        <span>Pakistan Student Hub Team Response</span>
                      </span>
                      {item.admin_response_date && (
                        <span className="text-[10px] text-emerald-700/80">
                          {item.admin_response_date}
                        </span>
                      )}
                    </div>
                    <p className="text-emerald-900 leading-relaxed">
                      {item.admin_response}
                    </p>
                  </div>
                )}

                {/* Footer row: Author info, Upvote Button, Admin controls */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {item.author_name[0]?.toUpperCase() || 'S'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {item.author_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Upvote Button */}
                    <button
                      onClick={() => handleUpvote(item.id)}
                      disabled={hasVoted}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        hasVoted
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95'
                      }`}
                      title={hasVoted ? 'You upvoted this' : 'Upvote this idea to help prioritize it'}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? 'fill-emerald-800' : ''}`} />
                      <span>{hasVoted ? 'Upvoted' : 'I want this'}</span>
                      <span className="rounded-full bg-white px-1.5 py-0.2 text-[10px] tabular-nums font-extrabold shadow-2xs">
                        {item.upvotes}
                      </span>
                    </button>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as FeedbackStatus)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => setReplyInputId(replyInputId === item.id ? null : item.id)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete submission"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Quick Reply Box */}
                {isAdmin && replyInputId === item.id && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write official response to student..."
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-700"
                    />
                    <button
                      onClick={() => handleReplySubmit(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900"
                    >
                      <Send className="h-3 w-3" />
                      <span>Send</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating CTA Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Have a unique feature or Pakistani academic dataset in mind?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
            We are dedicated to building free, high-utility tools for every matric, intermediate, and university student in Pakistan. Your feedback directly shapes our releases!
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('feature_request')}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-900 transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Your Request</span>
        </button>
      </div>

      {/* Modal */}
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalDefaultType}
      />
    </div>
  );
};

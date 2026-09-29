import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Bell, 
  Trash2, 
  Sparkles, 
  Plus, 
  LogIn, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { auth, loginWithGoogle, logoutUser, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface StudentDashboardViewProps {
  onNavigateTab: (tab: string, slug?: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigateTab }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const savedItems = dataStore.getSavedItems();
  const reminders = dataStore.getReminders();

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState<'Admission' | 'Scholarship' | 'Entry Test' | 'Job'>('Admission');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCustomReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const reminder = dataStore.addReminder({
      title: newTitle,
      deadline_date: newDate,
      category: newCategory,
      link_url: '#',
      notes: 'Custom student reminder'
    });

    // If signed into Firebase, also sync to Firestore
    if (firebaseUser) {
      const docPath = `users/${firebaseUser.uid}/deadline_reminders/${reminder.id}`;
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'deadline_reminders', reminder.id), {
          id: reminder.id,
          user_id: firebaseUser.uid,
          title: reminder.title,
          deadline_date: reminder.deadline_date,
          category: reminder.category,
          link_url: reminder.link_url,
          notes: reminder.notes || ''
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }

    setNewTitle('');
    setNewDate('');
    setShowAddForm(false);
  };

  const handleRemoveReminder = async (id: string) => {
    dataStore.removeReminder(id);
    if (firebaseUser) {
      const docPath = `users/${firebaseUser.uid}/deadline_reminders/${id}`;
      try {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'deadline_reminders', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  };

  const calculateDays = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Student Profile & Dashboard' }]} />

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {firebaseUser?.photoURL ? (
              <img
                src={firebaseUser.photoURL}
                alt={firebaseUser.displayName || 'User'}
                className="h-12 w-12 rounded-full object-cover border border-emerald-300"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg">
                {(firebaseUser?.displayName || firebaseUser?.email || 'Student')[0].toUpperCase()}
              </span>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  {firebaseUser ? firebaseUser.displayName || 'Pakistani Scholar' : 'Guest Student Profile'}
                </h1>
                {firebaseUser && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-100">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Firebase Verified</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>{firebaseUser ? firebaseUser.email : 'Local Session · Sign in with Google to sync across devices'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth & Stats Action */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 text-xs text-slate-600">
          <div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">{savedItems.length}</div>
            <div className="text-slate-400">Saved Items</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-800 tabular-nums">{reminders.length}</div>
            <div className="text-slate-400">Active Alerts</div>
          </div>
          <div className="shrink-0">
            {firebaseUser ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition-colors shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs disabled:opacity-50"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {authError && (
        <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
          {authError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Saved Opportunities */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-emerald-800" />
              <span>Saved Universities & Opportunities ({savedItems.length})</span>
            </h2>
          </div>

          {savedItems.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <Bookmark className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-sm font-semibold text-slate-800">No saved items yet</h3>
              <p className="mt-1 text-xs text-slate-500">
                Click the bookmark icon on any university, admission, or scholarship card to keep it handy here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.item_type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                    {item.deadline && (
                      <div className="text-xs text-slate-400 tabular-nums">
                        Deadline: {item.deadline}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (item.item_type === 'university') onNavigateTab('university-detail', item.item_id.replace('u-', ''));
                        else if (item.item_type === 'scholarship') onNavigateTab('scholarship-detail', item.item_id.replace('sch-', ''));
                        else onNavigateTab(item.item_type === 'admission' ? 'admissions' : 'internships');
                      }}
                      className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => dataStore.toggleSaveItem(item)}
                      className="rounded-md p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommended Opportunities */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span>Recommended Based on Academic Profile</span>
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Based on active admission cycles in Engineering & Computing, here are verified opportunities closing in October 2026:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="rounded-lg bg-white p-3 border border-emerald-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900">NUST Undergraduate Admission NET Series</strong>
                  <div className="text-slate-500">Closing October 25 · Full HEC & Need-Based Support</div>
                </div>
                <button
                  onClick={() => onNavigateTab('admissions')}
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Explore →
                </button>
              </div>
              <div className="rounded-lg bg-white p-3 border border-emerald-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900">Scottish Government Women STEM Scholarship</strong>
                  <div className="text-slate-500">Closing October 15 · 100% Tuition & Hostel Coverage</div>
                </div>
                <button
                  onClick={() => onNavigateTab('scholarships')}
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Explore →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Custom Deadlines & Reminders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600" />
              <span>My Deadline Reminders ({reminders.length})</span>
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Add Custom'}</span>
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddCustomReminder}
              className="rounded-xl border border-emerald-200 bg-white p-4 shadow-xs space-y-3 animate-in fade-in"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                New Deadline Alert
              </h3>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NUST Challan Fee Submission"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="Admission">Admission</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Entry Test">Entry Test</option>
                    <option value="Job">Job / Internship</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-800 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors"
              >
                Save Reminder
              </button>
            </form>
          )}

          {reminders.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
              No active deadline alerts. Add deadlines from the Deadlines page or create a custom one above.
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((rem) => {
                const days = calculateDays(rem.deadline_date);
                return (
                  <div
                    key={rem.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                        {rem.category}
                      </span>
                      <button
                        onClick={() => handleRemoveReminder(rem.id)}
                        className="text-slate-400 hover:text-rose-600"
                        title="Remove alert"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{rem.title}</h4>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500 tabular-nums">Due: {rem.deadline_date}</span>
                      <span className="font-bold tabular-nums text-amber-800">
                        {days <= 0 ? 'Due Today / Passed' : `${days} days left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

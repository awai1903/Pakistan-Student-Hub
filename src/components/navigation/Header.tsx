import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bookmark, 
  Bell, 
  Menu, 
  X, 
  GraduationCap,
  LogIn,
  User as UserIcon
} from 'lucide-react';
import { dataStore } from '../../lib/dataStore';
import { auth, loginWithGoogle, logoutUser } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSearchModal: () => void;
  savedCount: number;
  upcomingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openSearchModal,
  savedCount,
  upcomingCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const siteSettings = dataStore.getSiteSettings();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const primaryNavItems = [
    { id: 'universities', label: 'Universities' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'entry-tests', label: 'Entry Tests' },
    { id: 'compare', label: 'Compare' },
    { id: 'deadlines', label: 'Deadlines' }
  ];

  const secondaryNavItems = [
    { id: 'resources', label: 'Past Papers' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'internships', label: 'Internships' },
    { id: 'courses', label: 'Courses' },
    { id: 'news', label: 'News' }
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Optional Top Announcement Bar */}
      {siteSettings.announcement_bar?.enabled && (
        <div className="bg-emerald-950 px-4 py-1.5 text-center text-xs font-normal text-emerald-200">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
            <span>{siteSettings.announcement_bar.text}</span>
            {siteSettings.announcement_bar.link_url && (
              <button
                onClick={() => handleNavClick('deadlines')}
                className="font-medium text-emerald-400 hover:text-white underline underline-offset-2"
              >
                View verified calendar →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Top Bar strictly obeying 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-center gap-2"
              aria-label="Pakistan Student Hub Home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-lg shadow-xs group-hover:bg-emerald-700 transition-colors">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors">
                Pakistan Student Hub
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`whitespace-nowrap transition-colors py-1 ${
                    isActive
                      ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Secondary navigation dropdown */}
            <div className="relative group py-1">
              <button className="flex items-center gap-1 hover:text-slate-900 text-slate-600 font-medium whitespace-nowrap">
                <span>More</span>
                <span className="text-xs">▾</span>
              </button>
              <div className="absolute left-0 top-full hidden w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:block z-50">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-50 text-emerald-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Zone 3: Primary actions (Search, Saved, Deadlines) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              onClick={openSearchModal}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-colors"
              aria-label="Open search dialog"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200">
                ⌘K
              </kbd>
            </button>

            {/* Saved Items Button */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900' : ''
              }`}
              title="Saved Opportunities"
              aria-label="Saved Opportunities"
            >
              <Bookmark className="h-4 w-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white tabular-nums">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Deadlines shortcut */}
            <button
              onClick={() => handleNavClick('deadlines')}
              className={`relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                activeTab === 'deadlines' ? 'bg-slate-100 text-slate-900' : ''
              }`}
              title="Closing Deadlines"
              aria-label="Closing Deadlines"
            >
              <Bell className="h-4 w-4" />
              {upcomingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white tabular-nums">
                  {upcomingCount}
                </span>
              )}
            </button>

            {/* Firebase Google Auth / Circle DP Button */}
            {firebaseUser ? (
              <div className="flex items-center">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="relative flex items-center justify-center h-8 w-8 sm:h-8 sm:w-auto sm:px-2.5 sm:py-1 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-all shadow-2xs group"
                  title={`Account: ${firebaseUser.displayName || firebaseUser.email || 'Student Profile'}`}
                  aria-label="Open Student Account"
                >
                  {firebaseUser.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={firebaseUser.displayName || 'Profile'}
                      className="h-7 w-7 sm:h-6 sm:w-6 rounded-full object-cover ring-1 ring-emerald-500/40"
                    />
                  ) : (
                    <span className="flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-linear-to-tr from-emerald-800 to-teal-600 text-xs font-bold text-white shadow-xs">
                      {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                    </span>
                  )}
                  <span className="hidden sm:inline-block font-semibold text-xs text-emerald-950 max-w-[85px] truncate ml-1.5">
                    {firebaseUser.displayName?.split(' ')[0] || 'Profile'}
                  </span>
                  {/* Active online green dot for circle DP */}
                  <span className="absolute -bottom-0.5 -right-0.5 sm:hidden h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="flex items-center justify-center h-8 w-8 sm:h-auto sm:w-auto sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-lg border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-500 text-slate-700 hover:text-emerald-800 transition-all shadow-2xs group"
                title="Sign in with Google / Student Account"
                aria-label="Sign in with Google / Student Account"
              >
                {/* Mobile: Email-style Circle DP avatar */}
                <span className="flex sm:hidden h-7 w-7 items-center justify-center rounded-full bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 border border-slate-200 transition-colors">
                  <UserIcon className="h-4 w-4" />
                </span>

                {/* Desktop: Sign in label */}
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold">
                  <LogIn className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Sign in</span>
                </span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
            {/* Account Bar inside Mobile Drawer */}
            {firebaseUser ? (
              <div className="mb-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {firebaseUser.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={firebaseUser.displayName || 'Profile'}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-600/40"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-emerald-800 to-teal-600 text-sm font-bold text-white shadow-xs">
                      {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {firebaseUser.displayName || 'Student Account'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {firebaseUser.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick('dashboard');
                    }}
                    className="rounded-lg bg-emerald-800 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-900 transition-colors"
                  >
                    Saved
                  </button>
                  <button
                    onClick={() => logoutUser()}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Sign out"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-3 p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-600 shadow-2xs">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Student Account</p>
                    <p className="text-[11px] text-slate-500">Sync & save opportunities</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    loginWithGoogle();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign in</span>
                </button>
              </div>
            )}

            <div className="mb-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSearchModal();
                }}
                className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <span>Search universities, scholarships, tests...</span>
                </span>
                <span className="text-xs text-slate-400">Open</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              {allNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

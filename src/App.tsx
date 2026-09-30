/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/navigation/Header';
import { Footer } from './components/navigation/Footer';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { HomeView } from './views/HomeView';
import { UniversitiesView } from './views/UniversitiesView';
import { UniversityDetailView } from './views/UniversityDetailView';
import { AdmissionsView } from './views/AdmissionsView';
import { ScholarshipsView } from './views/ScholarshipsView';
import { ScholarshipDetailView } from './views/ScholarshipDetailView';
import { EntryTestsView } from './views/EntryTestsView';
import { CompareView } from './views/CompareView';
import { DeadlinesView } from './views/DeadlinesView';
import { JobsAndInternshipsView } from './views/JobsAndInternshipsView';
import { CoursesView } from './views/CoursesView';
import { ResourcesView } from './views/ResourcesView';
import { NewsView } from './views/NewsView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { ReviewsView } from './views/ReviewsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsView } from './views/TermsView';
import { DisclaimerView } from './views/DisclaimerView';
import { FeedbackFloatingButton } from './components/feedback/FeedbackFloatingButton';
import { AdsterraSmartlink } from './components/ads/AdsterraSmartlink';
import { AdsterraResponsiveBanner } from './components/ads/AdsterraResponsiveBanner';
import { dataStore } from './lib/dataStore';
import { aiSyncEngine } from './lib/aiSyncEngine';
import { router, RouteState } from './lib/router';
import { updatePageSeo } from './lib/seo';

export default function App() {
  const [routeState, setRouteState] = useState<RouteState>(() => router.getState());
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [, setTick] = useState(0);

  // Subscribe to reactive store changes and autonomous background AI sync
  useEffect(() => {
    const unsubData = dataStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    const unsubAi = aiSyncEngine.subscribe(() => {
      setTick((t) => t + 1);
    });
    const unsubRouter = router.subscribe((state) => {
      setRouteState(state);
    });

    return () => {
      unsubData();
      unsubAi();
      unsubRouter();
    };
  }, []);

  // Update SEO Title, Canonical, & Meta based on active route
  useEffect(() => {
    const siteSettings = dataStore.getSiteSettings();
    const route = routeState.route;

    if (route === 'home') {
      updatePageSeo({
        title: 'Pakistan Student Hub - Admissions, Scholarships & Universities',
        description: siteSettings.description,
        canonicalPath: '/'
      });
    } else if (route === 'universities') {
      updatePageSeo({
        title: 'HEC Recognized Universities in Pakistan - Pakistan Student Hub',
        description: 'Complete roster of verified public and private universities across Punjab, Sindh, KPK, Islamabad, and Balochistan.',
        canonicalPath: '/universities'
      });
    } else if (route === 'admissions') {
      updatePageSeo({
        title: 'Latest University Admissions in Pakistan - Pakistan Student Hub',
        description: 'Verified intake schedules, eligibility criteria, entry test requirements, and direct application links.',
        canonicalPath: '/admissions'
      });
    } else if (route === 'scholarships') {
      updatePageSeo({
        title: 'Scholarships for Pakistani Students - Pakistan Student Hub',
        description: 'HEC need-based, Ehsaas, British Council Scottish scholarships for women, and bilateral foreign awards.',
        canonicalPath: '/scholarships'
      });
    } else if (route === 'entry-tests') {
      updatePageSeo({
        title: 'MDCAT, ECAT, NET & NAT Entry Tests - Pakistan Student Hub',
        description: 'Standardized entrance examination syllabus, pattern, registration deadlines, and testing venues.',
        canonicalPath: routeState.slug ? `/entry-tests/${routeState.slug}` : '/entry-tests'
      });
    } else if (route === 'deadlines') {
      updatePageSeo({
        title: 'University Admissions & Scholarship Deadlines - Pakistan Student Hub',
        description: 'Chronological deadline calendar for closing admissions, scholarships, and registration forms.',
        canonicalPath: '/deadlines'
      });
    } else if (route === 'jobs') {
      updatePageSeo({
        title: 'Student Jobs in Pakistan - Pakistan Student Hub',
        description: 'Explore entry-level jobs, graduate trainee programs, and part-time positions for students in Pakistan.',
        canonicalPath: '/jobs'
      });
    } else if (route === 'internships') {
      updatePageSeo({
        title: 'Internships for Students in Pakistan - Pakistan Student Hub',
        description: 'Paid summer internships, corporate internships, and tech traineeships across Pakistan.',
        canonicalPath: '/internships'
      });
    } else if (route === 'courses') {
      updatePageSeo({
        title: 'University Courses & Degree Programs in Pakistan - Pakistan Student Hub',
        description: 'Higher education degree programs, accredited faculties, course outlines, and certifications across Pakistan.',
        canonicalPath: '/courses'
      });
    } else if (route === 'resources') {
      updatePageSeo({
        title: 'Past Papers & Student Resources - Pakistan Student Hub',
        description: 'Download past papers, entry test preparation material, syllabi, and academic study notes.',
        canonicalPath: '/resources'
      });
    } else if (route === 'news') {
      updatePageSeo({
        title: 'Education News & Updates in Pakistan - Pakistan Student Hub',
        description: 'Latest educational circulars, HEC updates, admission notifications, and policy announcements.',
        canonicalPath: '/news'
      });
    } else if (route === 'news-detail' && routeState.slug) {
      const article = dataStore.getNewsBySlug(routeState.slug);
      updatePageSeo({
        title: article ? `${article.title} - Pakistan Student Hub` : 'Education News & Updates - Pakistan Student Hub',
        description: article ? article.summary : 'Latest educational circulars and notifications across Pakistan.',
        canonicalPath: `/news/${routeState.slug}`
      });
    } else if (route === 'compare') {
      updatePageSeo({
        title: 'Compare Pakistani Universities Side-by-Side - Pakistan Student Hub',
        description: 'Objective factual comparison of fee structures, entry requirements, programs, and hostel facilities.',
        canonicalPath: routeState.slug ? `/compare/${routeState.slug}` : '/compare'
      });
    } else if (route === 'reviews') {
      updatePageSeo({
        title: 'Student Reviews - Pakistan Student Hub',
        description: 'Submit your reviews, suggest missing universities and scholarships, and vote on upcoming platform features.',
        canonicalPath: '/reviews'
      });
    } else if (route === 'dashboard') {
      updatePageSeo({
        title: 'Student Saved Items & Reminders - Pakistan Student Hub',
        description: 'Your personalized student dashboard tracking saved admissions, scholarships, and deadline reminders.',
        canonicalPath: '/dashboard'
      });
    }
  }, [routeState]);

  const handleNavigate = (tab: string, slug?: string) => {
    router.navigateTab(tab, slug);
  };

  const handleSelectFromSearch = (type: string, idOrSlug: string) => {
    if (type === 'university') {
      router.navigate(`/universities/${idOrSlug}`);
    } else if (type === 'scholarship') {
      router.navigate(`/scholarships/${idOrSlug}`);
    } else if (type === 'admission') {
      router.navigate('/admissions');
    } else if (type === 'entry-test') {
      router.navigate(`/entry-tests/${idOrSlug}`);
    } else if (type === 'job') {
      router.navigate('/jobs');
    } else if (type === 'internship') {
      router.navigate('/internships');
    } else if (type === 'course') {
      router.navigate('/courses');
    } else if (type === 'news') {
      router.navigate(`/news/${idOrSlug}`);
    }
  };

  const savedCount = dataStore.getSavedItems().length;
  const upcomingDeadlines = dataStore.getUpcomingDeadlines();
  const criticalCount = upcomingDeadlines.filter((d) => d.daysRemaining <= 7).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Adsterra Smartlink Top Notification Bar */}
      <AdsterraSmartlink variant="top-banner" />

      {/* Top Navigation Bar */}
      <Header
        activeTab={routeState.route}
        setActiveTab={(t) => handleNavigate(t)}
        openSearchModal={() => setSearchModalOpen(true)}
        savedCount={savedCount}
        upcomingCount={criticalCount}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {routeState.route === 'home' && (
          <HomeView
            onNavigate={(tab, slug) => handleNavigate(tab, slug)}
            openSearchModal={() => setSearchModalOpen(true)}
          />
        )}

        {routeState.route === 'universities' && (
          <UniversitiesView
            onSelectUniversity={(slug) => handleNavigate('university-detail', slug)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {routeState.route === 'university-detail' && routeState.slug && (
          <UniversityDetailView
            slug={routeState.slug}
            onBack={() => handleNavigate('universities')}
            onNavigateCompare={(slug) => handleNavigate('compare', slug)}
          />
        )}

        {routeState.route === 'admissions' && (
          <AdmissionsView
            onNavigateHome={() => handleNavigate('home')}
            onSelectUniversity={(slug) => handleNavigate('university-detail', slug)}
          />
        )}

        {routeState.route === 'scholarships' && (
          <ScholarshipsView
            onSelectScholarship={(slug) => handleNavigate('scholarship-detail', slug)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {routeState.route === 'scholarship-detail' && routeState.slug && (
          <ScholarshipDetailView
            slug={routeState.slug}
            onBack={() => handleNavigate('scholarships')}
          />
        )}

        {routeState.route === 'entry-tests' && (
          <EntryTestsView
            onNavigateHome={() => handleNavigate('home')}
            selectedSlug={routeState.slug}
          />
        )}

        {routeState.route === 'compare' && (
          <CompareView
            initialSlug={routeState.slug}
            onNavigateUniversity={(slug) => handleNavigate('university-detail', slug)}
          />
        )}

        {routeState.route === 'deadlines' && (
          <DeadlinesView onNavigateHome={() => handleNavigate('home')} />
        )}

        {routeState.route === 'jobs' && (
          <JobsAndInternshipsView initialType="jobs" />
        )}

        {routeState.route === 'internships' && (
          <JobsAndInternshipsView initialType="internships" />
        )}

        {routeState.route === 'courses' && (
          <CoursesView />
        )}

        {routeState.route === 'resources' && (
          <ResourcesView />
        )}

        {routeState.route === 'news' && (
          <NewsView selectedSlug={undefined} />
        )}

        {routeState.route === 'news-detail' && routeState.slug && (
          <NewsView selectedSlug={routeState.slug} />
        )}

        {routeState.route === 'dashboard' && (
          <StudentDashboardView onNavigateTab={(tab, slug) => handleNavigate(tab, slug)} />
        )}

        {routeState.route === 'reviews' && (
          <ReviewsView />
        )}

        {routeState.route === 'about' && (
          <AboutView onNavigateTab={(tab, slug) => handleNavigate(tab, slug)} />
        )}

        {routeState.route === 'contact' && (
          <ContactView onNavigateHome={() => handleNavigate('home')} />
        )}

        {routeState.route === 'privacy-policy' && (
          <PrivacyPolicyView />
        )}

        {routeState.route === 'terms' && (
          <TermsView />
        )}

        {routeState.route === 'disclaimer' && (
          <DisclaimerView />
        )}

        {routeState.route === 'not-found' && (
          <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
            <h1 className="font-display text-4xl font-extrabold text-slate-900">404</h1>
            <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              The requested academic page does not exist or has been relocated. You can browse universities, verified scholarships, or return home.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => handleNavigate('home')}
                className="rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
              >
                Return Home
              </button>
              <button
                onClick={() => setSearchModalOpen(true)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Search Hub
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Search Modal with Live Results */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectEntity={handleSelectFromSearch}
      />

      {/* Floating Feedback & Feature Request Button */}
      <FeedbackFloatingButton />

      {/* Adsterra Responsive Leaderboard Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 w-full">
        <AdsterraResponsiveBanner label="Sponsored Educational Offers" />
      </div>

      {/* Trust & Integrity Footer */}
      <Footer onNavigateTab={(tab, slug) => handleNavigate(tab, slug)} />
    </div>
  );
}

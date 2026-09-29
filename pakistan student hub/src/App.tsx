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
import { AdsterraSmartlink } from './components/ads/AdsterraSmartlink';
import { AdsterraResponsiveBanner } from './components/ads/AdsterraResponsiveBanner';
import { dataStore } from './lib/dataStore';
import { updatePageSeo } from './lib/seo';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [, setTick] = useState(0);

  // Subscribe to reactive store changes (saves, reminders, admin actions)
  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Sync hash routing if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const [tab, slug] = hash.split('/');
        if (tab) {
          setActiveTab(tab);
          setSelectedSlug(slug);
        }
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update SEO Title & Meta based on active tab
  useEffect(() => {
    const siteSettings = dataStore.getSiteSettings();
    if (activeTab === 'home') {
      updatePageSeo({
        title: 'Pakistan Student Hub - Admissions, Scholarships & Universities',
        description: siteSettings.description
      });
    } else if (activeTab === 'universities') {
      updatePageSeo({
        title: 'HEC Recognized Universities Directory in Pakistan',
        description: 'Complete roster of verified public and private universities across Punjab, Sindh, KPK, Islamabad, and Balochistan.'
      });
    } else if (activeTab === 'admissions') {
      updatePageSeo({
        title: 'Latest University Admissions Fall 2026 / Spring 2027 in Pakistan',
        description: 'Verified intake schedules, eligibility criteria, entry test requirements, and direct application links.'
      });
    } else if (activeTab === 'scholarships') {
      updatePageSeo({
        title: 'Scholarships for Pakistani Students - Need-Based & Fully Funded',
        description: 'HEC need-based, Ehsaas, British Council Scottish scholarships for women, and bilateral foreign awards.'
      });
    } else if (activeTab === 'entry-tests') {
      updatePageSeo({
        title: 'MDCAT, ECAT, NET & NAT Entry Tests Schedules in Pakistan',
        description: 'Standardized entrance examination syllabus, pattern, registration deadlines, and testing venues.'
      });
    } else if (activeTab === 'deadlines') {
      updatePageSeo({
        title: 'Verified Pakistani Educational Deadlines & Closing Dates',
        description: 'Chronological deadline calendar for closing admissions, scholarships, and registration forms.'
      });
    } else if (activeTab === 'compare') {
      updatePageSeo({
        title: 'Compare Pakistani Universities Side-by-Side',
        description: 'Objective factual comparison of fee structures, entry requirements, programs, and hostel facilities.'
      });
    }
  }, [activeTab]);

  const handleNavigate = (tab: string, slug?: string) => {
    setActiveTab(tab);
    setSelectedSlug(slug);
    if (slug) {
      window.location.hash = `#${tab}/${slug}`;
    } else {
      window.location.hash = `#${tab}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromSearch = (type: string, idOrSlug: string) => {
    if (type === 'university') {
      handleNavigate('university-detail', idOrSlug);
    } else if (type === 'scholarship') {
      handleNavigate('scholarship-detail', idOrSlug);
    } else if (type === 'admission') {
      handleNavigate('admissions');
    } else if (type === 'entry-test') {
      handleNavigate('entry-tests', idOrSlug);
    } else if (type === 'job') {
      handleNavigate('jobs');
    } else if (type === 'internship') {
      handleNavigate('internships');
    } else if (type === 'course') {
      handleNavigate('courses');
    } else if (type === 'news') {
      handleNavigate('news', idOrSlug);
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
        activeTab={activeTab}
        setActiveTab={(t) => handleNavigate(t)}
        openSearchModal={() => setSearchModalOpen(true)}
        savedCount={savedCount}
        upcomingCount={criticalCount}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab, slug) => handleNavigate(tab, slug)}
            openSearchModal={() => setSearchModalOpen(true)}
          />
        )}
        {activeTab === 'universities' && (
          <UniversitiesView
            onSelectUniversity={(slug) => handleNavigate('university-detail', slug)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
        {activeTab === 'university-detail' && selectedSlug && (
          <UniversityDetailView
            slug={selectedSlug}
            onBack={() => handleNavigate('universities')}
            onNavigateCompare={(slug) => handleNavigate('compare', slug)}
          />
        )}
        {activeTab === 'admissions' && (
          <AdmissionsView
            onNavigateHome={() => handleNavigate('home')}
            onSelectUniversity={(slug) => handleNavigate('university-detail', slug)}
          />
        )}
        {activeTab === 'scholarships' && (
          <ScholarshipsView
            onSelectScholarship={(slug) => handleNavigate('scholarship-detail', slug)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
        {activeTab === 'scholarship-detail' && selectedSlug && (
          <ScholarshipDetailView
            slug={selectedSlug}
            onBack={() => handleNavigate('scholarships')}
          />
        )}
        {activeTab === 'entry-tests' && (
          <EntryTestsView
            onNavigateHome={() => handleNavigate('home')}
            selectedSlug={selectedSlug}
          />
        )}
        {activeTab === 'compare' && (
          <CompareView
            initialSlug={selectedSlug}
            onNavigateUniversity={(slug) => handleNavigate('university-detail', slug)}
          />
        )}
        {activeTab === 'deadlines' && (
          <DeadlinesView onNavigateHome={() => handleNavigate('home')} />
        )}
        {activeTab === 'jobs' && (
          <JobsAndInternshipsView initialType="jobs" />
        )}
        {activeTab === 'internships' && (
          <JobsAndInternshipsView initialType="internships" />
        )}
        {activeTab === 'courses' && (
          <CoursesView />
        )}
        {activeTab === 'resources' && (
          <ResourcesView />
        )}
        {activeTab === 'news' && (
          <NewsView selectedSlug={selectedSlug} />
        )}
        {activeTab === 'news-detail' && selectedSlug && (
          <NewsView selectedSlug={selectedSlug} />
        )}
        {activeTab === 'dashboard' && (
          <StudentDashboardView onNavigateTab={(tab, slug) => handleNavigate(tab, slug)} />
        )}
      </main>

      {/* Global Search Modal with Live Results */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectEntity={handleSelectFromSearch}
      />

      {/* Adsterra Responsive Leaderboard Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 w-full">
        <AdsterraResponsiveBanner label="Sponsored Educational Offers" />
      </div>

      {/* Trust & Integrity Footer */}
      <Footer onNavigateTab={(tab, slug) => handleNavigate(tab, slug)} />
    </div>
  );
}

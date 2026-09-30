/**
 * SEO-Friendly Browser URL Routing Engine for Pakistan Student Hub
 * Uses HTML5 History API (pushState / popstate) with zero hash or query navigation.
 */

export type RouteType =
  | 'home'
  | 'universities'
  | 'university-detail'
  | 'admissions'
  | 'scholarships'
  | 'scholarship-detail'
  | 'entry-tests'
  | 'compare'
  | 'deadlines'
  | 'jobs'
  | 'internships'
  | 'courses'
  | 'resources'
  | 'news'
  | 'news-detail'
  | 'dashboard'
  | 'reviews'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms'
  | 'disclaimer'
  | 'not-found';

export interface RouteState {
  route: RouteType;
  slug?: string;
  pathname: string;
}

type RouteListener = (state: RouteState) => void;

class Router {
  private listeners: Set<RouteListener> = new Set();
  private currentState: RouteState;

  constructor() {
    this.currentState = this.resolveCurrentLocation();

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.currentState = this.resolveCurrentLocation();
        this.notify();
      });

      // Handle legacy hash URLs (e.g. #universities/nust or #admissions) and query tabs (?tab=universities)
      this.handleLegacyUrlMigration();
    }
  }

  private handleLegacyUrlMigration() {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.replace(/^#\/?/, '');
    const searchParams = new URLSearchParams(window.location.search);
    const queryTab = searchParams.get('tab');

    let migratedPath: string | null = null;

    if (hash) {
      const parts = hash.split('/');
      const tab = parts[0];
      const slug = parts[1];

      if (tab === 'home' || !tab) {
        migratedPath = '/';
      } else if (tab === 'universities' || tab === 'university-detail') {
        migratedPath = slug ? `/universities/${slug}` : '/universities';
      } else if (tab === 'scholarships' || tab === 'scholarship-detail') {
        migratedPath = slug ? `/scholarships/${slug}` : '/scholarships';
      } else if (tab === 'news' || tab === 'news-detail') {
        migratedPath = slug ? `/news/${slug}` : '/news';
      } else if (tab === 'entry-tests') {
        migratedPath = slug ? `/entry-tests/${slug}` : '/entry-tests';
      } else if (tab === 'compare') {
        migratedPath = slug ? `/compare/${slug}` : '/compare';
      } else if (
        [
          'admissions',
          'deadlines',
          'jobs',
          'internships',
          'courses',
          'resources',
          'dashboard',
          'reviews',
          'about',
          'contact',
          'privacy-policy',
          'terms',
          'disclaimer'
        ].includes(tab)
      ) {
        migratedPath = `/${tab}`;
      }
    } else if (queryTab) {
      if (queryTab === 'home') {
        migratedPath = '/';
      } else {
        migratedPath = `/${queryTab}`;
      }
    }

    if (migratedPath) {
      window.history.replaceState(null, '', migratedPath);
      this.currentState = this.resolveCurrentLocation();
      this.notify();
    }
  }

  public resolveCurrentLocation(): RouteState {
    if (typeof window === 'undefined') {
      return { route: 'home', pathname: '/' };
    }

    let pathname = window.location.pathname || '/';

    // Normalize multiple slashes and trailing slash (except root '/')
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      return { route: 'home', pathname: '/' };
    }

    const first = segments[0].toLowerCase();
    const second = segments[1];

    if (first === 'universities') {
      if (second) {
        return { route: 'university-detail', slug: second, pathname };
      }
      return { route: 'universities', pathname };
    }

    if (first === 'scholarships') {
      if (second) {
        return { route: 'scholarship-detail', slug: second, pathname };
      }
      return { route: 'scholarships', pathname };
    }

    if (first === 'news') {
      if (second) {
        return { route: 'news-detail', slug: second, pathname };
      }
      return { route: 'news', pathname };
    }

    if (first === 'entry-tests') {
      return { route: 'entry-tests', slug: second, pathname };
    }

    if (first === 'compare') {
      return { route: 'compare', slug: second, pathname };
    }

    if (first === 'admissions') return { route: 'admissions', pathname };
    if (first === 'deadlines') return { route: 'deadlines', pathname };
    if (first === 'jobs') return { route: 'jobs', pathname };
    if (first === 'internships') return { route: 'internships', pathname };
    if (first === 'courses') return { route: 'courses', pathname };
    if (first === 'resources') return { route: 'resources', pathname };
    if (first === 'dashboard') return { route: 'dashboard', pathname };
    if (first === 'reviews') return { route: 'reviews', pathname };
    if (first === 'about') return { route: 'about', pathname };
    if (first === 'contact') return { route: 'contact', pathname };
    if (first === 'privacy-policy') return { route: 'privacy-policy', pathname };
    if (first === 'terms') return { route: 'terms', pathname };
    if (first === 'disclaimer') return { route: 'disclaimer', pathname };

    // Fallback for unknown routes
    return { route: 'not-found', pathname };
  }

  public getState(): RouteState {
    return this.currentState;
  }

  public navigate(path: string, options?: { replace?: boolean; scroll?: boolean }) {
    if (typeof window === 'undefined') return;

    if (options?.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }

    this.currentState = this.resolveCurrentLocation();
    this.notify();

    if (options?.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Helper mapping traditional tab name & slug into a canonical URL path.
   */
  public navigateTab(tab: string, slug?: string) {
    let targetPath = '/';

    if (tab === 'home') {
      targetPath = '/';
    } else if (tab === 'universities') {
      targetPath = '/universities';
    } else if (tab === 'university-detail' && slug) {
      targetPath = `/universities/${slug}`;
    } else if (tab === 'scholarships') {
      targetPath = '/scholarships';
    } else if (tab === 'scholarship-detail' && slug) {
      targetPath = `/scholarships/${slug}`;
    } else if (tab === 'news') {
      targetPath = slug ? `/news/${slug}` : '/news';
    } else if (tab === 'news-detail' && slug) {
      targetPath = `/news/${slug}`;
    } else if (tab === 'entry-tests') {
      targetPath = slug ? `/entry-tests/${slug}` : '/entry-tests';
    } else if (tab === 'compare') {
      targetPath = slug ? `/compare/${slug}` : '/compare';
    } else if (tab === 'jobs') {
      targetPath = '/jobs';
    } else if (tab === 'internships') {
      targetPath = '/internships';
    } else {
      targetPath = `/${tab}`;
    }

    this.navigate(targetPath);
  }

  public subscribe(listener: RouteListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentState));
  }
}

export const router = new Router();

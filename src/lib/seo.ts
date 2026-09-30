/**
 * SEO & Schema.org Structured Data Engine for Pakistan Student Hub
 */

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  structuredData?: Record<string, any>;
}

export function updatePageSeo(config: SeoConfig) {
  if (typeof document === 'undefined') return;

  const siteName = 'Pakistan Student Hub';
  const fullTitle = config.title.includes(siteName)
    ? config.title
    : `${config.title} | ${siteName}`;

  document.title = fullTitle;

  // Resolve canonical path & absolute URL
  const canonicalPath = config.canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const baseDomain = 'https://pakistanstudenthub.netlify.app';
  const fullCanonicalUrl = `${baseDomain}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullCanonicalUrl);

  // OG Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', fullTitle);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', config.description);

  // OG URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', fullCanonicalUrl);

  // OG Type
  let ogType = document.querySelector('meta[property="og:type"]');
  if (ogType && config.ogType) {
    ogType.setAttribute('content', config.ogType);
  }

  // Twitter Tags
  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', fullTitle);
  }

  let twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) {
    twitterDesc.setAttribute('content', config.description);
  }

  let twitterUrl = document.querySelector('meta[name="twitter:url"]');
  if (twitterUrl) {
    twitterUrl.setAttribute('content', fullCanonicalUrl);
  }

  // Structured Data (JSON-LD)
  let scriptTag = document.getElementById('psh-json-ld');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'psh-json-ld';
    scriptTag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptTag);
  }

  if (config.structuredData) {
    scriptTag.textContent = JSON.stringify(config.structuredData);
  }
}

export function generateUniversitySchema(uni: {
  name: string;
  description: string;
  city: string;
  province: string;
  website: string;
  phone?: string;
  address?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: uni.name,
    description: uni.description,
    url: uni.website,
    telephone: uni.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: uni.city,
      addressRegion: uni.province,
      addressCountry: 'PK'
    }
  };
}

export function generateCourseSchema(course: {
  course_name: string;
  description: string;
  provider: string;
  official_url: string;
  is_free: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.course_name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
      sameAs: course.official_url
    },
    isAccessibleForFree: course.is_free
  };
}

export function generateJobPostingSchema(job: {
  job_title: string;
  company: string;
  description: string;
  location: string;
  posted_date: string;
  closing_date: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.job_title,
    description: job.description,
    datePosted: job.posted_date,
    validThrough: job.closing_date,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'PK'
      }
    }
  };
}

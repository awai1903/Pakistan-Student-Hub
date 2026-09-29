/**
 * SEO & Schema.org Structured Data Engine for Pakistan Student Hub
 * Complies with Google AI Studio Applet SEO specifications
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

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', config.description);
  }

  // OG Title & Description
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', fullTitle);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', config.description);
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

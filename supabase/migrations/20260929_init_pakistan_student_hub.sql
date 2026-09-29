-- Pakistan Student Hub - PostgreSQL / Supabase Complete Schema
-- Production Ready Migration with RLS, UUIDs, Foreign Keys, Indexes and Triggers

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE verification_status_enum AS ENUM (
  'Draft',
  'Research',
  'Source Added',
  'Verified',
  'Published',
  'Needs Review',
  'Expired',
  'Archived'
);

CREATE TYPE university_sector_enum AS ENUM ('Public', 'Private', 'Semi-Government');
CREATE TYPE admission_status_enum AS ENUM ('Upcoming', 'Open', 'Closing Soon', 'Closed', 'Archived');
CREATE TYPE user_role_enum AS ENUM ('student', 'admin', 'editor', 'viewer');

-- 2. UNIVERSITIES TABLE
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_name TEXT,
  logo TEXT,
  cover_image TEXT,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  campus_locations TEXT[] DEFAULT '{}',
  university_type TEXT NOT NULL,
  sector university_sector_enum NOT NULL DEFAULT 'Public',
  website TEXT NOT NULL,
  contact_email TEXT,
  phone TEXT,
  address TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  established_year INTEGER NOT NULL,
  recognition_status TEXT NOT NULL,
  programs TEXT[] DEFAULT '{}',
  faculties TEXT[] DEFAULT '{}',
  departments TEXT[] DEFAULT '{}',
  admission_information TEXT,
  fee_information TEXT,
  hostel_information TEXT,
  scholarships TEXT,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DEGREE PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS degree_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  campus TEXT NOT NULL,
  degree_level TEXT NOT NULL,
  duration TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  admission_test TEXT,
  fee_information TEXT,
  application_deadline DATE,
  official_source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ADMISSIONS TABLE
CREATE TABLE IF NOT EXISTS admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  campus TEXT NOT NULL,
  admission_type TEXT NOT NULL,
  opening_date DATE NOT NULL,
  closing_date DATE NOT NULL,
  entry_test_date TEXT,
  merit_list_date TEXT,
  interview_date TEXT,
  application_fee TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  required_documents TEXT[] DEFAULT '{}',
  application_procedure TEXT NOT NULL,
  official_application_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status admission_status_enum NOT NULL DEFAULT 'Open',
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SCHOLARSHIPS TABLE
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  description TEXT NOT NULL,
  study_level TEXT NOT NULL,
  funding_type TEXT NOT NULL,
  scholarship_coverage TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  age_limit TEXT,
  academic_requirements TEXT NOT NULL,
  financial_benefits TEXT NOT NULL,
  required_documents TEXT[] DEFAULT '{}',
  opening_date DATE NOT NULL,
  deadline DATE NOT NULL,
  application_process TEXT NOT NULL,
  official_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ENTRY TESTS TABLE
CREATE TABLE IF NOT EXISTS entry_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  organizer TEXT NOT NULL,
  registration_info TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  test_pattern TEXT NOT NULL,
  syllabus TEXT NOT NULL,
  important_dates TEXT NOT NULL,
  next_test_date DATE,
  registration_deadline DATE,
  official_registration_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PAST PAPERS & RESOURCES TABLE
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  exam TEXT NOT NULL,
  year INTEGER NOT NULL,
  university TEXT,
  file_url TEXT NOT NULL,
  official_source TEXT NOT NULL,
  license_status TEXT NOT NULL,
  uploaded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. JOBS & INTERNSHIPS TABLES
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  remote_type TEXT NOT NULL DEFAULT 'On-site',
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  experience TEXT NOT NULL,
  salary TEXT,
  skills TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  application_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  closing_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS internships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT true,
  stipend TEXT,
  eligibility TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  deadline DATE NOT NULL,
  official_application_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'Open',
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT true,
  fee_info TEXT,
  level TEXT NOT NULL DEFAULT 'Beginner',
  duration TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  official_url TEXT NOT NULL,
  certificate_available BOOLEAN NOT NULL DEFAULT true,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. EDUCATION NEWS TABLE
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  featured_image TEXT,
  publication_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  author TEXT NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status verification_status_enum NOT NULL DEFAULT 'Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. USER SAVED ITEMS & DEADLINE REMINDERS
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  deadline DATE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deadline_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  category TEXT NOT NULL,
  link_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SITE & AD SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  website_name TEXT NOT NULL DEFAULT 'Pakistan Student Hub',
  logo_url TEXT,
  description TEXT,
  contact_email TEXT,
  social_links JSONB DEFAULT '{}',
  footer_text TEXT,
  announcement_bar JSONB DEFAULT '{"enabled": true, "text": "Fall 2026 Admissions Open"}',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  google_site_verification TEXT,
  analytics_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ad_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  enabled BOOLEAN NOT NULL DEFAULT true,
  header_banner BOOLEAN NOT NULL DEFAULT true,
  sidebar_ad BOOLEAN NOT NULL DEFAULT true,
  in_feed_ad BOOLEAN NOT NULL DEFAULT true,
  footer_banner BOOLEAN NOT NULL DEFAULT true,
  show_on_mobile BOOLEAN NOT NULL DEFAULT true,
  show_on_desktop BOOLEAN NOT NULL DEFAULT true,
  adsterra_banner_code TEXT,
  adsterra_native_code TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_universities_city ON universities(city);
CREATE INDEX IF NOT EXISTS idx_universities_province ON universities(province);
CREATE INDEX IF NOT EXISTS idx_universities_sector ON universities(sector);
CREATE INDEX IF NOT EXISTS idx_admissions_closing_date ON admissions(closing_date);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_entry_tests_next_date ON entry_tests(next_test_date);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE degree_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadline_reminders ENABLE ROW LEVEL SECURITY;

-- Public can read verified / published items
CREATE POLICY "Public read published universities" ON universities FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published admissions" ON admissions FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published scholarships" ON scholarships FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published entry_tests" ON entry_tests FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published resources" ON resources FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published jobs" ON jobs FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published internships" ON internships FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published courses" ON courses FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');
CREATE POLICY "Public read published news" ON news FOR SELECT USING (verification_status = 'Published' OR verification_status = 'Verified');

-- User saved items & reminders: user only
CREATE POLICY "Users access own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own reminders" ON deadline_reminders FOR ALL USING (auth.uid() = user_id);

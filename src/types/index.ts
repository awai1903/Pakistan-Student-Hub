export type VerificationStatus =
  | 'Draft'
  | 'Research'
  | 'Source Added'
  | 'Verified'
  | 'Published'
  | 'Needs Review'
  | 'Expired'
  | 'Archived';

export type UniversitySector = 'Public' | 'Private' | 'Semi-Government';
export type Province =
  | 'Islamabad Capital Territory'
  | 'Punjab'
  | 'Sindh'
  | 'Khyber Pakhtunkhwa'
  | 'Balochistan'
  | 'Azad Jammu and Kashmir'
  | 'Gilgit-Baltistan';

export type DegreeLevel = 'Undergraduate' | 'Graduate' | 'Postgraduate / PhD' | 'Diploma' | 'Associate';

export interface University {
  id: string;
  name: string;
  slug: string;
  short_name?: string;
  logo: string;
  cover_image: string;
  description: string;
  city: string;
  province: Province;
  campus_locations: string[];
  university_type: string; // e.g. "General", "Engineering & Technology", "Medical", "Business"
  sector: UniversitySector;
  website: string;
  contact_email: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  established_year: number;
  recognition_status: string; // e.g. "HEC Recognized (W4 Category)"
  programs: string[];
  faculties: string[];
  departments: string[];
  admission_information: string;
  fee_information: string;
  hostel_information: string;
  scholarships: string;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface DegreeProgram {
  id: string;
  name: string;
  slug: string;
  university_id: string;
  university_name: string;
  campus: string;
  degree_level: DegreeLevel;
  duration: string;
  eligibility: string;
  admission_test: string;
  fee_information: string;
  application_deadline?: string;
  official_source: string;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
}

export type AdmissionStatus = 'Upcoming' | 'Open' | 'Closing Soon' | 'Closed' | 'Archived';

export interface Admission {
  id: string;
  university_id: string;
  university_name: string;
  program_name: string;
  campus: string;
  admission_type: string; // e.g. "Fall 2026", "Spring 2027"
  opening_date: string;
  closing_date: string;
  entry_test_date?: string;
  merit_list_date?: string;
  interview_date?: string;
  application_fee: string;
  eligibility: string;
  required_documents: string[];
  application_procedure: string;
  official_application_url: string;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  status: AdmissionStatus;
  verification_status: VerificationStatus;
}

export type FundingType = 'Fully Funded' | 'Partially Funded' | 'Need-Based' | 'Merit-Based' | 'Tuition Fee Waiver';
export type ScholarshipCoverage = 'Pakistan' | 'International' | 'Government' | 'University' | 'Organization';

export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  provider: string;
  description: string;
  study_level: string; // e.g. "Undergraduate", "Masters", "PhD"
  funding_type: FundingType;
  scholarship_coverage: ScholarshipCoverage;
  eligibility: string;
  age_limit?: string;
  academic_requirements: string;
  financial_benefits: string;
  required_documents: string[];
  opening_date: string;
  deadline: string;
  application_process: string;
  official_url: string;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
  status: 'Open' | 'Closing Soon' | 'Closed';
}

export interface EntryTest {
  id: string;
  test_name: string;
  slug: string;
  organizer: string; // e.g., "PMDC", "UET Lahore", "NUST", "NTS", "HEC ETC"
  registration_info: string;
  eligibility: string;
  test_pattern: string;
  syllabus: string;
  important_dates: string;
  next_test_date?: string;
  registration_deadline?: string;
  official_registration_url: string;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
}

export interface PastPaperResource {
  id: string;
  title: string;
  subject: string;
  exam: string; // MDCAT, ECAT, NET, NAT, GAT, Board, University
  year: number;
  university?: string;
  file_url: string;
  official_source: string;
  license_status: string; // e.g. "Public Domain / Official Candidate Sample", "Open Access"
  uploaded_date: string;
  verification_status: VerificationStatus;
}

export interface Job {
  id: string;
  job_title: string;
  slug: string;
  company: string;
  location: string;
  remote_type: 'Remote' | 'On-site' | 'Hybrid';
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Graduate Trainee';
  experience: string;
  salary: string;
  skills: string[];
  description: string;
  application_url: string;
  source_url: string;
  source_name: string;
  posted_date: string;
  closing_date: string;
  status: 'Active' | 'Closed';
  verification_status: VerificationStatus;
}

export interface Internship {
  id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  duration: string;
  is_paid: boolean;
  stipend?: string;
  eligibility: string;
  skills: string[];
  deadline: string;
  official_application_url: string;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  status: 'Open' | 'Closed';
  verification_status: VerificationStatus;
}

export interface Course {
  id: string;
  course_name: string;
  slug: string;
  provider: string; // e.g., "DigiSkills Pakistan", "Coursera HEC DLIEI", "NAVTTC", "Cisco NetAcad"
  is_free: boolean;
  fee_info?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  description: string;
  official_url: string;
  certificate_available: boolean;
  source_url: string;
  source_name: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
}

export interface EducationNews {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'Admissions' | 'Scholarships' | 'HEC Policy' | 'Entry Tests' | 'Examination' | 'General';
  featured_image?: string;
  publication_date: string;
  source_name: string;
  source_url: string;
  author: string;
  last_updated: string;
  verification_status: VerificationStatus;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: 'university' | 'scholarship' | 'admission' | 'job' | 'internship' | 'course';
  item_id: string;
  title: string;
  subtitle: string;
  deadline?: string;
  saved_at: string;
}

export interface DeadlineReminder {
  id: string;
  user_id: string;
  title: string;
  deadline_date: string;
  category: 'Admission' | 'Scholarship' | 'Entry Test' | 'Job' | 'Internship';
  link_url: string;
  notes?: string;
  created_at: string;
}

export interface AdSettings {
  enabled: boolean;
  header_banner: boolean;
  sidebar_ad: boolean;
  in_feed_ad: boolean;
  footer_banner: boolean;
  show_on_mobile: boolean;
  show_on_desktop: boolean;
  adsterra_banner_code: string;
  adsterra_native_code: string;
}

export interface SiteSettings {
  website_name: string;
  logo_url: string;
  description: string;
  contact_email: string;
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
  social_whatsapp: string;
  footer_text: string;
  announcement_bar: {
    enabled: boolean;
    text: string;
    link_url?: string;
  };
  maintenance_mode: boolean;
  google_site_verification?: string;
  analytics_id?: string;
}

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface UserAccount {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'admin' | 'editor' | 'viewer';
  created_at: string;
}

import {
  University,
  DegreeProgram,
  Admission,
  Scholarship,
  EntryTest,
  PastPaperResource,
  Job,
  Internship,
  Course,
  EducationNews,
  SavedItem,
  DeadlineReminder,
  AdSettings,
  SiteSettings,
  UserAccount,
  VerificationStatus
} from '../types';
import {
  verifiedUniversities,
  verifiedDegreePrograms,
  verifiedAdmissions,
  verifiedScholarships,
  verifiedEntryTests,
  verifiedResources,
  verifiedJobs,
  verifiedInternships,
  verifiedCourses,
  verifiedNews,
  defaultAdSettings,
  defaultSiteSettings
} from '../data/verifiedSeedData';

const STORAGE_KEYS = {
  UNIVERSITIES: 'psh_universities',
  PROGRAMS: 'psh_programs',
  ADMISSIONS: 'psh_admissions',
  SCHOLARSHIPS: 'psh_scholarships',
  ENTRY_TESTS: 'psh_entry_tests',
  RESOURCES: 'psh_resources',
  JOBS: 'psh_jobs',
  INTERNSHIPS: 'psh_internships',
  COURSES: 'psh_courses',
  NEWS: 'psh_news',
  SAVED_ITEMS: 'psh_saved_items',
  REMINDERS: 'psh_reminders',
  AD_SETTINGS: 'psh_ad_settings',
  SITE_SETTINGS: 'psh_site_settings',
  USER: 'psh_active_user'
};

const inMemoryCache: Record<string, any> = {};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed !== null && parsed !== undefined) {
          // If both parsed and defaultValue are arrays of objects with id, merge new seed items
          if (Array.isArray(parsed) && Array.isArray(defaultValue) && defaultValue.length > 0 && defaultValue[0]?.id) {
            const existingIdMap = new Map((parsed as any[]).map((item) => [item.id, item]));
            let hasNew = false;
            const merged = [...parsed];
            for (const defItem of defaultValue as any[]) {
              if (!existingIdMap.has(defItem.id)) {
                merged.push(defItem);
                hasNew = true;
              } else {
                const idx = merged.findIndex(m => m.id === defItem.id);
                if (idx !== -1 && (!merged[idx].admission_portal_url || !merged[idx].category_tag)) {
                  merged[idx] = { ...merged[idx], ...defItem };
                  hasNew = true;
                }
              }
            }
            if (hasNew) {
              try {
                window.localStorage.setItem(key, JSON.stringify(merged));
              } catch (inner) {}
            }
            return merged as unknown as T;
          }
          return parsed;
        }
      }
      try {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      } catch (inner) {}
    }
  } catch (e) {
    // LocalStorage restricted or blocked
  }
  if (inMemoryCache[key] !== undefined) {
    return inMemoryCache[key];
  }
  inMemoryCache[key] = defaultValue;
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  inMemoryCache[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    // Ignore storage write restriction
  }
}

const defaultUser: UserAccount = {
  id: 'usr-student-01',
  email: 'student@example.edu.pk',
  full_name: 'Muhammad Daniyal',
  role: 'student',
  created_at: '2026-09-01T00:00:00Z'
};

class DataStore {
  private universities: University[] = [];
  private programs: DegreeProgram[] = [];
  private admissions: Admission[] = [];
  private scholarships: Scholarship[] = [];
  private entryTests: EntryTest[] = [];
  private resources: PastPaperResource[] = [];
  private jobs: Job[] = [];
  private internships: Internship[] = [];
  private courses: Course[] = [];
  private news: EducationNews[] = [];
  private savedItems: SavedItem[] = [];
  private reminders: DeadlineReminder[] = [];
  private adSettings: AdSettings = defaultAdSettings;
  private siteSettings: SiteSettings = defaultSiteSettings;
  private currentUser: UserAccount = defaultUser;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    this.universities = loadFromStorage(STORAGE_KEYS.UNIVERSITIES, verifiedUniversities);
    this.programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, verifiedDegreePrograms);
    this.admissions = loadFromStorage(STORAGE_KEYS.ADMISSIONS, verifiedAdmissions);
    this.scholarships = loadFromStorage(STORAGE_KEYS.SCHOLARSHIPS, verifiedScholarships);
    this.entryTests = loadFromStorage(STORAGE_KEYS.ENTRY_TESTS, verifiedEntryTests);
    this.resources = loadFromStorage(STORAGE_KEYS.RESOURCES, verifiedResources);
    this.jobs = loadFromStorage(STORAGE_KEYS.JOBS, verifiedJobs);
    this.internships = loadFromStorage(STORAGE_KEYS.INTERNSHIPS, verifiedInternships);
    this.courses = loadFromStorage(STORAGE_KEYS.COURSES, verifiedCourses);
    this.news = loadFromStorage(STORAGE_KEYS.NEWS, verifiedNews);
    this.savedItems = loadFromStorage(STORAGE_KEYS.SAVED_ITEMS, [
      {
        id: 'save-1',
        user_id: 'usr-student-01',
        item_type: 'university',
        item_id: 'u-nust',
        title: 'National University of Sciences and Technology (NUST)',
        subtitle: 'Islamabad · Public · W4 Category',
        deadline: '2026-10-25',
        saved_at: '2026-09-20T10:00:00Z'
      },
      {
        id: 'save-2',
        user_id: 'usr-student-01',
        item_type: 'scholarship',
        item_id: 'sch-scottish-women',
        title: 'Scottish Government Pakistan Scholarships for Young Women',
        subtitle: 'Fully Funded · Undergraduate & Masters',
        deadline: '2026-10-15',
        saved_at: '2026-09-22T14:30:00Z'
      }
    ]);
    this.reminders = loadFromStorage(STORAGE_KEYS.REMINDERS, [
      {
        id: 'rem-1',
        user_id: 'usr-student-01',
        title: 'NUST Fall 2026 NET Registration Closing',
        deadline_date: '2026-10-25',
        category: 'Admission',
        link_url: '/admissions',
        notes: 'Pay bank challan before 4:00 PM',
        created_at: '2026-09-20T10:00:00Z'
      }
    ]);
    this.adSettings = loadFromStorage(STORAGE_KEYS.AD_SETTINGS, defaultAdSettings);
    this.siteSettings = loadFromStorage(STORAGE_KEYS.SITE_SETTINGS, defaultSiteSettings);
    this.currentUser = loadFromStorage(STORAGE_KEYS.USER, defaultUser);

    this.checkAndExpireDeadlines();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  private checkAndExpireDeadlines() {
    const today = new Date().toISOString().split('T')[0];
    let changed = false;
    this.admissions = this.admissions.map((adm) => {
      if (adm.closing_date < today && adm.status !== 'Closed' && adm.status !== 'Archived') {
        changed = true;
        return { ...adm, status: 'Closed' as const };
      }
      return adm;
    });
    if (changed) {
      saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);
    }
  }

  // User & Auth
  public getCurrentUser(): UserAccount {
    return this.currentUser;
  }

  public setUserRole(role: 'student' | 'admin' | 'editor' | 'viewer') {
    this.currentUser = {
      ...this.currentUser,
      role,
      full_name: role === 'admin' ? 'Syed Admin (HEC Verification Wing)' : 'Muhammad Daniyal'
    };
    saveToStorage(STORAGE_KEYS.USER, this.currentUser);
    this.notify();
  }

  // Universities
  public getUniversities(): University[] {
    return [...this.universities];
  }

  public getUniversityBySlug(slug: string): University | undefined {
    return this.universities.find((u) => u.slug === slug || u.id === slug);
  }

  public addUniversity(uni: Omit<University, 'id' | 'created_at' | 'updated_at'>): University {
    const newUni: University = {
      ...uni,
      id: `u-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.universities.unshift(newUni);
    saveToStorage(STORAGE_KEYS.UNIVERSITIES, this.universities);
    this.notify();
    return newUni;
  }

  public updateUniversity(id: string, updates: Partial<University>): boolean {
    const idx = this.universities.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    this.universities[idx] = {
      ...this.universities[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.UNIVERSITIES, this.universities);
    this.notify();
    return true;
  }

  public deleteUniversity(id: string): boolean {
    const initial = this.universities.length;
    this.universities = this.universities.filter((u) => u.id !== id);
    if (this.universities.length !== initial) {
      saveToStorage(STORAGE_KEYS.UNIVERSITIES, this.universities);
      this.notify();
      return true;
    }
    return false;
  }

  // Admissions
  public getAdmissions(): Admission[] {
    return [...this.admissions];
  }

  public addAdmission(adm: Omit<Admission, 'id'>): Admission {
    const newAdm: Admission = {
      ...adm,
      id: `adm-${Date.now()}`
    };
    this.admissions.unshift(newAdm);
    saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);
    this.notify();
    return newAdm;
  }

  public updateAdmission(id: string, updates: Partial<Admission>): boolean {
    const idx = this.admissions.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.admissions[idx] = { ...this.admissions[idx], ...updates };
    saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);
    this.notify();
    return true;
  }

  public deleteAdmission(id: string): boolean {
    const initial = this.admissions.length;
    this.admissions = this.admissions.filter((a) => a.id !== id);
    if (this.admissions.length !== initial) {
      saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);
      this.notify();
      return true;
    }
    return false;
  }

  // Scholarships
  public getScholarships(): Scholarship[] {
    return [...this.scholarships];
  }

  public getScholarshipBySlug(slug: string): Scholarship | undefined {
    return this.scholarships.find((s) => s.slug === slug || s.id === slug);
  }

  public addScholarship(sch: Omit<Scholarship, 'id'>): Scholarship {
    const newSch: Scholarship = {
      ...sch,
      id: `sch-${Date.now()}`
    };
    this.scholarships.unshift(newSch);
    saveToStorage(STORAGE_KEYS.SCHOLARSHIPS, this.scholarships);
    this.notify();
    return newSch;
  }

  public updateScholarship(id: string, updates: Partial<Scholarship>): boolean {
    const idx = this.scholarships.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.scholarships[idx] = { ...this.scholarships[idx], ...updates };
    saveToStorage(STORAGE_KEYS.SCHOLARSHIPS, this.scholarships);
    this.notify();
    return true;
  }

  public deleteScholarship(id: string): boolean {
    const initial = this.scholarships.length;
    this.scholarships = this.scholarships.filter((s) => s.id !== id);
    if (this.scholarships.length !== initial) {
      saveToStorage(STORAGE_KEYS.SCHOLARSHIPS, this.scholarships);
      this.notify();
      return true;
    }
    return false;
  }

  // Entry Tests
  public getEntryTests(): EntryTest[] {
    return [...this.entryTests];
  }

  public getEntryTestBySlug(slug: string): EntryTest | undefined {
    return this.entryTests.find((t) => t.slug === slug || t.id === slug);
  }

  public addEntryTest(test: Omit<EntryTest, 'id'>): EntryTest {
    const newTest: EntryTest = { ...test, id: `test-${Date.now()}` };
    this.entryTests.unshift(newTest);
    saveToStorage(STORAGE_KEYS.ENTRY_TESTS, this.entryTests);
    this.notify();
    return newTest;
  }

  public updateEntryTest(id: string, updates: Partial<EntryTest>): boolean {
    const idx = this.entryTests.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.entryTests[idx] = { ...this.entryTests[idx], ...updates };
    saveToStorage(STORAGE_KEYS.ENTRY_TESTS, this.entryTests);
    this.notify();
    return true;
  }

  public deleteEntryTest(id: string): boolean {
    const initial = this.entryTests.length;
    this.entryTests = this.entryTests.filter((t) => t.id !== id);
    if (this.entryTests.length !== initial) {
      saveToStorage(STORAGE_KEYS.ENTRY_TESTS, this.entryTests);
      this.notify();
      return true;
    }
    return false;
  }

  // Degree Programs
  public getDegreePrograms(): DegreeProgram[] {
    return [...this.programs];
  }

  public addDegreeProgram(prog: Omit<DegreeProgram, 'id'>): DegreeProgram {
    const newProg: DegreeProgram = { ...prog, id: `dp-${Date.now()}` };
    this.programs.unshift(newProg);
    saveToStorage(STORAGE_KEYS.PROGRAMS, this.programs);
    this.notify();
    return newProg;
  }

  // Resources
  public getResources(): PastPaperResource[] {
    return [...this.resources];
  }

  public addResource(res: Omit<PastPaperResource, 'id'>): PastPaperResource {
    const newRes: PastPaperResource = { ...res, id: `res-${Date.now()}` };
    this.resources.unshift(newRes);
    saveToStorage(STORAGE_KEYS.RESOURCES, this.resources);
    this.notify();
    return newRes;
  }

  public deleteResource(id: string): boolean {
    const initial = this.resources.length;
    this.resources = this.resources.filter((r) => r.id !== id);
    if (this.resources.length !== initial) {
      saveToStorage(STORAGE_KEYS.RESOURCES, this.resources);
      this.notify();
      return true;
    }
    return false;
  }

  // Jobs & Internships
  public getJobs(): Job[] {
    return [...this.jobs];
  }

  public addJob(job: Omit<Job, 'id'>): Job {
    const newJob: Job = { ...job, id: `job-${Date.now()}` };
    this.jobs.unshift(newJob);
    saveToStorage(STORAGE_KEYS.JOBS, this.jobs);
    this.notify();
    return newJob;
  }

  public deleteJob(id: string): boolean {
    const initial = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.id !== id);
    if (this.jobs.length !== initial) {
      saveToStorage(STORAGE_KEYS.JOBS, this.jobs);
      this.notify();
      return true;
    }
    return false;
  }

  public getInternships(): Internship[] {
    return [...this.internships];
  }

  public addInternship(internship: Omit<Internship, 'id'>): Internship {
    const newInternship: Internship = { ...internship, id: `int-${Date.now()}` };
    this.internships.unshift(newInternship);
    saveToStorage(STORAGE_KEYS.INTERNSHIPS, this.internships);
    this.notify();
    return newInternship;
  }

  public deleteInternship(id: string): boolean {
    const initial = this.internships.length;
    this.internships = this.internships.filter((i) => i.id !== id);
    if (this.internships.length !== initial) {
      saveToStorage(STORAGE_KEYS.INTERNSHIPS, this.internships);
      this.notify();
      return true;
    }
    return false;
  }

  // Courses
  public getCourses(): Course[] {
    return [...this.courses];
  }

  public addCourse(crs: Omit<Course, 'id'>): Course {
    const newCourse: Course = { ...crs, id: `crs-${Date.now()}` };
    this.courses.unshift(newCourse);
    saveToStorage(STORAGE_KEYS.COURSES, this.courses);
    this.notify();
    return newCourse;
  }

  // News
  public getNews(): EducationNews[] {
    return [...this.news];
  }

  public getNewsBySlug(slug: string): EducationNews | undefined {
    return this.news.find((n) => n.slug === slug || n.id === slug);
  }

  public addNews(item: Omit<EducationNews, 'id'>): EducationNews {
    const newItem: EducationNews = { ...item, id: `news-${Date.now()}` };
    this.news.unshift(newItem);
    saveToStorage(STORAGE_KEYS.NEWS, this.news);
    this.notify();
    return newItem;
  }

  // Verification Workflow
  public verifyEntity(
    type: 'university' | 'scholarship' | 'admission' | 'test' | 'job' | 'internship',
    id: string,
    status: VerificationStatus
  ) {
    const today = new Date().toISOString().split('T')[0];
    if (type === 'university') {
      this.updateUniversity(id, { verification_status: status, last_verified_at: today });
    } else if (type === 'scholarship') {
      this.updateScholarship(id, { verification_status: status, last_verified_at: today });
    } else if (type === 'admission') {
      this.updateAdmission(id, { verification_status: status, last_verified_at: today });
    } else if (type === 'test') {
      this.updateEntryTest(id, { verification_status: status, last_verified_at: today });
    }
  }

  // Saved Items
  public getSavedItems(): SavedItem[] {
    return [...this.savedItems];
  }

  public isItemSaved(itemId: string): boolean {
    return this.savedItems.some((s) => s.item_id === itemId);
  }

  public toggleSaveItem(item: {
    item_type: SavedItem['item_type'];
    item_id: string;
    title: string;
    subtitle: string;
    deadline?: string;
  }) {
    const exists = this.savedItems.find((s) => s.item_id === item.item_id);
    if (exists) {
      this.savedItems = this.savedItems.filter((s) => s.item_id !== item.item_id);
    } else {
      this.savedItems.unshift({
        id: `save-${Date.now()}`,
        user_id: this.currentUser.id,
        saved_at: new Date().toISOString(),
        ...item
      });
    }
    saveToStorage(STORAGE_KEYS.SAVED_ITEMS, this.savedItems);
    this.notify();
  }

  // Reminders
  public getReminders(): DeadlineReminder[] {
    return [...this.reminders];
  }

  public addReminder(reminder: Omit<DeadlineReminder, 'id' | 'created_at' | 'user_id'>): DeadlineReminder {
    const newRem: DeadlineReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      user_id: this.currentUser.id,
      created_at: new Date().toISOString()
    };
    this.reminders.unshift(newRem);
    saveToStorage(STORAGE_KEYS.REMINDERS, this.reminders);
    this.notify();
    return newRem;
  }

  public removeReminder(id: string) {
    this.reminders = this.reminders.filter((r) => r.id !== id);
    saveToStorage(STORAGE_KEYS.REMINDERS, this.reminders);
    this.notify();
  }

  // Ads & Settings
  public getAdSettings(): AdSettings {
    return { ...this.adSettings };
  }

  public updateAdSettings(settings: Partial<AdSettings>) {
    this.adSettings = { ...this.adSettings, ...settings };
    saveToStorage(STORAGE_KEYS.AD_SETTINGS, this.adSettings);
    this.notify();
  }

  public getSiteSettings(): SiteSettings {
    return { ...this.siteSettings };
  }

  public updateSiteSettings(settings: Partial<SiteSettings>) {
    this.siteSettings = { ...this.siteSettings, ...settings };
    saveToStorage(STORAGE_KEYS.SITE_SETTINGS, this.siteSettings);
    this.notify();
  }

  // Global Search
  public searchAll(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        universities: [],
        admissions: [],
        scholarships: [],
        entryTests: [],
        jobs: [],
        internships: [],
        courses: [],
        news: []
      };
    }
    return {
      universities: this.universities.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.short_name?.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.province.toLowerCase().includes(q) ||
          u.programs.some((p) => p.toLowerCase().includes(q))
      ),
      admissions: this.admissions.filter(
        (a) =>
          a.university_name.toLowerCase().includes(q) ||
          a.program_name.toLowerCase().includes(q) ||
          a.campus.toLowerCase().includes(q)
      ),
      scholarships: this.scholarships.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.study_level.toLowerCase().includes(q) ||
          s.funding_type.toLowerCase().includes(q)
      ),
      entryTests: this.entryTests.filter(
        (t) =>
          t.test_name.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.organizer.toLowerCase().includes(q)
      ),
      jobs: this.jobs.filter(
        (j) =>
          j.job_title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((sk) => sk.toLowerCase().includes(q))
      ),
      internships: this.internships.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.skills.some((sk) => sk.toLowerCase().includes(q))
      ),
      courses: this.courses.filter(
        (c) =>
          c.course_name.toLowerCase().includes(q) ||
          c.provider.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      ),
      news: this.news.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      )
    };
  }

  // Deadlines Calculation
  public getUpcomingDeadlines() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlines: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Admission' | 'Scholarship' | 'Entry Test' | 'Internship' | 'Job';
      dateStr: string;
      daysRemaining: number;
      officialUrl: string;
      sourceName: string;
      sourceUrl: string;
      verified: boolean;
    }> = [];

    // Admissions
    this.admissions.forEach((a) => {
      if (a.closing_date) {
        const d = new Date(a.closing_date);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0) {
          deadlines.push({
            id: a.id,
            title: `${a.university_name} Admissions`,
            subtitle: a.program_name,
            category: 'Admission',
            dateStr: a.closing_date,
            daysRemaining: diff,
            officialUrl: a.official_application_url,
            sourceName: a.source_name,
            sourceUrl: a.source_url,
            verified: a.verification_status === 'Verified'
          });
        }
      }
    });

    // Scholarships
    this.scholarships.forEach((s) => {
      if (s.deadline) {
        const d = new Date(s.deadline);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0) {
          deadlines.push({
            id: s.id,
            title: s.title,
            subtitle: `${s.provider} · ${s.funding_type}`,
            category: 'Scholarship',
            dateStr: s.deadline,
            daysRemaining: diff,
            officialUrl: s.official_url,
            sourceName: s.source_name,
            sourceUrl: s.source_url,
            verified: s.verification_status === 'Verified'
          });
        }
      }
    });

    // Entry Tests
    this.entryTests.forEach((t) => {
      if (t.registration_deadline) {
        const d = new Date(t.registration_deadline);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0) {
          deadlines.push({
            id: t.id,
            title: `${t.test_name} Registration`,
            subtitle: `Administered by ${t.organizer}`,
            category: 'Entry Test',
            dateStr: t.registration_deadline,
            daysRemaining: diff,
            officialUrl: t.official_registration_url,
            sourceName: t.source_name,
            sourceUrl: t.source_url,
            verified: t.verification_status === 'Verified'
          });
        }
      }
    });

    // Internships
    this.internships.forEach((i) => {
      if (i.deadline) {
        const d = new Date(i.deadline);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0) {
          deadlines.push({
            id: i.id,
            title: `${i.title} (${i.company})`,
            subtitle: `${i.location} · ${i.is_paid ? 'Paid' : 'Unpaid'}`,
            category: 'Internship',
            dateStr: i.deadline,
            daysRemaining: diff,
            officialUrl: i.official_application_url,
            sourceName: i.source_name,
            sourceUrl: i.source_url,
            verified: i.verification_status === 'Verified'
          });
        }
      }
    });

    return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  // Reset to seed data
  public resetToVerifiedSeed() {
    this.universities = verifiedUniversities;
    this.programs = verifiedDegreePrograms;
    this.admissions = verifiedAdmissions;
    this.scholarships = verifiedScholarships;
    this.entryTests = verifiedEntryTests;
    this.resources = verifiedResources;
    this.jobs = verifiedJobs;
    this.internships = verifiedInternships;
    this.courses = verifiedCourses;
    this.news = verifiedNews;
    saveToStorage(STORAGE_KEYS.UNIVERSITIES, this.universities);
    saveToStorage(STORAGE_KEYS.PROGRAMS, this.programs);
    saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);
    saveToStorage(STORAGE_KEYS.SCHOLARSHIPS, this.scholarships);
    saveToStorage(STORAGE_KEYS.ENTRY_TESTS, this.entryTests);
    saveToStorage(STORAGE_KEYS.RESOURCES, this.resources);
    saveToStorage(STORAGE_KEYS.JOBS, this.jobs);
    saveToStorage(STORAGE_KEYS.INTERNSHIPS, this.internships);
    saveToStorage(STORAGE_KEYS.COURSES, this.courses);
    saveToStorage(STORAGE_KEYS.NEWS, this.news);
    this.notify();
  }
}

export const dataStore = new DataStore();

import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';

export type FeedbackType = 
  | 'feature_request' 
  | 'university_suggestion' 
  | 'scholarship_request' 
  | 'general_review' 
  | 'bug_report';

export type FeedbackStatus = 
  | 'Under Review' 
  | 'Planned' 
  | 'In Progress' 
  | 'Completed' 
  | 'Published';

export interface FeedbackItem {
  id: string;
  author_name: string;
  author_email?: string;
  user_id?: string;
  type: FeedbackType;
  title: string;
  content: string;
  rating?: number;
  target_entity?: string;
  upvotes: number;
  status: FeedbackStatus;
  admin_response?: string;
  admin_response_date?: string;
  created_at: string;
}

const STORAGE_KEY = 'pakistan_student_hub_feedback_cache';
const UPVOTED_KEY = 'pakistan_student_hub_upvoted_ids';

const DEFAULT_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-seed-1',
    author_name: 'Hamza Farooq',
    author_email: 'hamza.f@gmail.com',
    type: 'feature_request',
    title: 'Add University Hostel & Student Accommodation Directory',
    content: 'It would be amazing to have verified hostels and rent details near major universities like NUST H-12, FAST Islamabad, and COMSATS. Outstation students struggle a lot finding safe hostels during admissions.',
    rating: 5,
    target_entity: 'Islamabad Universities',
    upvotes: 42,
    status: 'Planned',
    admin_response: 'Great suggestion! We have prioritized this for the upcoming Q3 student update. A verified student hostel locator is in development.',
    admin_response_date: '2026-09-28',
    created_at: '2026-09-25T14:30:00Z'
  },
  {
    id: 'fb-seed-2',
    author_name: 'Ayesha Siddiqua',
    author_email: 'ayesha.s@outlook.com',
    type: 'general_review',
    title: 'The cleanest and most authentic student portal in Pakistan',
    content: 'Finally a platform that does not give fake admission deadlines! I used this to track HEC Overseas scholarships and UET entry test schedules. Real-time countdowns and official verified badges are super helpful.',
    rating: 5,
    target_entity: 'General Platform',
    upvotes: 28,
    status: 'Published',
    admin_response: 'JazakAllah Ayesha! Thank you for the generous review. We verify every closing date daily directly against official gazettes.',
    admin_response_date: '2026-09-27',
    created_at: '2026-09-26T09:15:00Z'
  },
  {
    id: 'fb-seed-3',
    author_name: 'Bilal Khan',
    author_email: 'bilal.k@gmail.com',
    type: 'university_suggestion',
    title: 'Include Sub-campuses of Karakoram International University & UET Peshawar',
    content: 'Please add KIU Gilgit sub-campuses in Hunza and Chilas, plus detailed fee structures for northern region quotas.',
    rating: 4,
    target_entity: 'KPK & GB Universities',
    upvotes: 19,
    status: 'Completed',
    admin_response: 'Added! All northern universities and quota details are now fully indexed in the Universities directory.',
    admin_response_date: '2026-09-29',
    created_at: '2026-09-27T11:45:00Z'
  },
  {
    id: 'fb-seed-4',
    author_name: 'Zainab Noor',
    author_email: 'zainab.noor@gmail.com',
    type: 'scholarship_request',
    title: 'PEEF & Ehsaas Undergrad Phase 4 Application Guidelines',
    content: 'Could you please add sample essay answers and document checklist for Punjab Educational Endowment Fund (PEEF) masterlevel scholarship?',
    rating: 5,
    target_entity: 'PEEF Scholarships',
    upvotes: 35,
    status: 'In Progress',
    admin_response: 'Currently compiling the verified document checklist and income certificate templates with HEC focal persons.',
    admin_response_date: '2026-09-30',
    created_at: '2026-09-28T16:20:00Z'
  }
];

class FeedbackStore {
  private items: FeedbackItem[] = [];
  private listeners: (() => void)[] = [];
  private upvotedSet: Set<string> = new Set();
  private isInitialized = false;

  constructor() {
    this.loadFromStorage();
    this.initFirestoreSync();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.items = parsed;
        } else {
          this.items = [...DEFAULT_FEEDBACK];
        }
      } else {
        this.items = [...DEFAULT_FEEDBACK];
        this.saveToStorage();
      }

      const upvoted = localStorage.getItem(UPVOTED_KEY);
      if (upvoted) {
        this.upvotedSet = new Set(JSON.parse(upvoted));
      }
    } catch {
      this.items = [...DEFAULT_FEEDBACK];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // Storage quota or private mode safe
    }
  }

  private saveUpvoted() {
    try {
      localStorage.setItem(UPVOTED_KEY, JSON.stringify(Array.from(this.upvotedSet)));
    } catch {
      // Safe fallback
    }
  }

  private initFirestoreSync() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      const feedbackCol = collection(db, 'feedback');
      const q = query(feedbackCol, orderBy('created_at', 'desc'), limit(100));

      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteItems: FeedbackItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteItems.push({
              id: docSnap.id,
              author_name: data.author_name || 'Student',
              author_email: data.author_email || '',
              user_id: data.user_id || '',
              type: data.type || 'general_review',
              title: data.title || '',
              content: data.content || '',
              rating: typeof data.rating === 'number' ? data.rating : undefined,
              target_entity: data.target_entity || '',
              upvotes: typeof data.upvotes === 'number' ? data.upvotes : 0,
              status: data.status || 'Under Review',
              admin_response: data.admin_response || '',
              admin_response_date: data.admin_response_date || '',
              created_at: data.created_at || new Date().toISOString()
            });
          });

          // Merge remote items with default seeds if count is low
          const existingIds = new Set(remoteItems.map(r => r.id));
          const remainingSeeds = DEFAULT_FEEDBACK.filter(seed => !existingIds.has(seed.id));
          this.items = [...remoteItems, ...remainingSeeds];
          this.saveToStorage();
          this.notify();
        }
      }, (error) => {
        // Handle error per firebase skill specification
        try {
          handleFirestoreError(error, OperationType.GET, 'feedback');
        } catch {
          // Keep offline cached items
        }
      });
    } catch (e) {
      console.warn('[FeedbackStore] Firestore listener fallback to local cache:', e);
    }
  }

  public getItems(): FeedbackItem[] {
    return [...this.items];
  }

  public hasUpvoted(id: string): boolean {
    return this.upvotedSet.has(id);
  }

  public async submitFeedback(input: {
    author_name: string;
    author_email?: string;
    type: FeedbackType;
    title: string;
    content: string;
    rating?: number;
    target_entity?: string;
  }): Promise<FeedbackItem> {
    const cleanId = `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: FeedbackItem = {
      id: cleanId,
      author_name: input.author_name.trim().slice(0, 100),
      author_email: input.author_email?.trim().slice(0, 150) || '',
      user_id: auth.currentUser?.uid || '',
      type: input.type,
      title: input.title.trim().slice(0, 200),
      content: input.content.trim().slice(0, 2000),
      rating: input.rating,
      target_entity: input.target_entity?.trim().slice(0, 200) || '',
      upvotes: 1, // Author's initial vote
      status: 'Under Review',
      created_at: new Date().toISOString()
    };

    // Optimistic local update
    this.items.unshift(newItem);
    this.upvotedSet.add(cleanId);
    this.saveToStorage();
    this.saveUpvoted();
    this.notify();

    // Persist to Firestore
    try {
      const docRef = doc(db, 'feedback', cleanId);
      await setDoc(docRef, {
        author_name: newItem.author_name,
        author_email: newItem.author_email,
        user_id: newItem.user_id,
        type: newItem.type,
        title: newItem.title,
        content: newItem.content,
        rating: newItem.rating || 5,
        target_entity: newItem.target_entity,
        upvotes: 1,
        status: 'Under Review',
        created_at: newItem.created_at,
        server_timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `feedback/${cleanId}`);
    }

    return newItem;
  }

  public async upvoteFeedback(id: string): Promise<void> {
    if (this.upvotedSet.has(id)) {
      return;
    }

    const item = this.items.find(i => i.id === id);
    if (!item) return;

    // Optimistic local update
    item.upvotes += 1;
    this.upvotedSet.add(id);
    this.saveToStorage();
    this.saveUpvoted();
    this.notify();

    // Persist to Firestore
    try {
      const docRef = doc(db, 'feedback', id);
      await updateDoc(docRef, {
        upvotes: item.upvotes
      });
    } catch {
      // Local vote retained even if Firestore write is restricted
    }
  }

  public async updateStatus(
    id: string, 
    newStatus: FeedbackStatus, 
    adminResponse?: string
  ): Promise<void> {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    item.status = newStatus;
    if (adminResponse !== undefined) {
      item.admin_response = adminResponse;
      item.admin_response_date = new Date().toISOString().split('T')[0];
    }
    this.saveToStorage();
    this.notify();

    try {
      const docRef = doc(db, 'feedback', id);
      await updateDoc(docRef, {
        status: newStatus,
        admin_response: item.admin_response || '',
        admin_response_date: item.admin_response_date || ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `feedback/${id}`);
    }
  }

  public async deleteFeedback(id: string): Promise<void> {
    this.items = this.items.filter(i => i.id !== id);
    this.saveToStorage();
    this.notify();

    try {
      const docRef = doc(db, 'feedback', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `feedback/${id}`);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const feedbackStore = new FeedbackStore();

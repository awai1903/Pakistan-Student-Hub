export interface StudentHostel {
  id: string;
  name: string;
  slug: string;
  gender: 'Boys' | 'Girls';
  target_universities: string[];
  city: 'Islamabad' | 'Rawalpindi' | 'Lahore' | 'Karachi' | 'Peshawar' | 'Faisalabad';
  area: string;
  distance_to_campus: string;
  monthly_rent_min: number; // PKR
  monthly_rent_max: number; // PKR
  security_deposit: number; // PKR
  room_types: ('Single Room' | '2-Seater' | '3-Seater' | '4-Seater' | 'Dormitory')[];
  mess_included: boolean;
  amenities: string[];
  phone: string;
  whatsapp: string;
  rating: number;
  reviews_count: number;
  is_verified: boolean;
  curfew_time?: string;
  overview: string;
}

export const verifiedStudentHostels: StudentHostel[] = [
  {
    id: 'hostel-isb-01',
    name: 'Al-Haram Executive Boys Hostel',
    slug: 'al-haram-executive-boys-hostel-nust',
    gender: 'Boys',
    target_universities: ['NUST Islamabad', 'FAST-NUCES Islamabad'],
    city: 'Islamabad',
    area: 'Sector H-13, Street 4 (Opposite NUST Gate 4)',
    distance_to_campus: '350 meters from NUST Gate 4',
    monthly_rent_min: 16000,
    monthly_rent_max: 28000,
    security_deposit: 10000,
    room_types: ['Single Room', '2-Seater', '3-Seater'],
    mess_included: true,
    amenities: [
      '3-Time Hygienic Mess',
      'High-Speed Optical Fiber WiFi',
      '24/7 Generator & UPS Backup',
      'CCTV Surveillance & Guard',
      'Free Laundry Service (2x weekly)',
      'Attached Washrooms with Geyser',
      'RO Clean Drinking Water'
    ],
    phone: '+92 300 5512349',
    whatsapp: '923005512349',
    rating: 4.8,
    reviews_count: 56,
    is_verified: true,
    curfew_time: '10:30 PM',
    overview: 'Premier executive accommodation catering primarily to NUST and FAST engineering and computing students. Offers spacious ventilated rooms with dedicated study tables and silent study environment.'
  },
  {
    id: 'hostel-isb-02',
    name: 'Fatima Jinnah Luxury Girls Hostel',
    slug: 'fatima-jinnah-girls-hostel-nust-islamabad',
    gender: 'Girls',
    target_universities: ['NUST Islamabad', 'FAST-NUCES Islamabad', 'COMSATS Islamabad'],
    city: 'Islamabad',
    area: 'Sector G-13/2, Near Kashmir Highway Metro Station',
    distance_to_campus: '8 minutes via NUST shuttle/van',
    monthly_rent_min: 18000,
    monthly_rent_max: 32000,
    security_deposit: 15000,
    room_types: ['Single Room', '2-Seater', '3-Seater'],
    mess_included: true,
    amenities: [
      'Strict Biometric & Female Warden Security',
      '3-Time Fresh Home-Cooked Meals',
      'Commercial Solar + Generator Backup',
      'Complimentary University Van Service',
      'Fully Furnished with Box Beds & Wardrobes',
      'Central Heating & Instant Water Geysers',
      'Air Conditioned / Air Cooled Options'
    ],
    phone: '+92 312 9845120',
    whatsapp: '923129845120',
    rating: 4.9,
    reviews_count: 74,
    is_verified: true,
    curfew_time: '08:30 PM (Strict Entry Record)',
    overview: 'High-security, fully monitored residence designed specifically for outstation female scholars attending NUST, National Defence University, and FAST. Supervised by resident female wardens with biometric tracking.'
  },
  {
    id: 'hostel-isb-03',
    name: 'Scholars Inn Boys Hostel COMSATS',
    slug: 'scholars-inn-boys-hostel-comsats',
    gender: 'Boys',
    target_universities: ['COMSATS Islamabad', 'PIEAS Islamabad'],
    city: 'Islamabad',
    area: 'Park Road, Chatha Bakhtawar, Near COMSATS University',
    distance_to_campus: '600 meters from COMSATS Main Gate',
    monthly_rent_min: 14000,
    monthly_rent_max: 24000,
    security_deposit: 8000,
    room_types: ['2-Seater', '3-Seater', '4-Seater'],
    mess_included: true,
    amenities: [
      'Mess (Breakfast & Dinner Mon-Sat, 3-Time Sunday)',
      '100 Mbps Dual Fiber WiFi',
      'UPS Backed Fans & Lights',
      'Automated Laundry Machines',
      'Quiet Study Hall for Exam Prep',
      'Motorcycle Parking with CCTV'
    ],
    phone: '+92 333 5148902',
    whatsapp: '923335148902',
    rating: 4.6,
    reviews_count: 42,
    is_verified: true,
    curfew_time: '11:00 PM',
    overview: 'Walking distance to COMSATS Islamabad main campus. Affordable shared living favored by computer science and engineering students, equipped with high-speed internet and uninterrupted power for late-night coding.'
  },
  {
    id: 'hostel-lhr-01',
    name: 'TechGate Executive Boys Hostel Lahore',
    slug: 'techgate-boys-hostel-fast-lahore',
    gender: 'Boys',
    target_universities: ['FAST-NUCES Lahore', 'University of the Punjab', 'FC College'],
    city: 'Lahore',
    area: 'Faisal Town, Block B (Near FAST-NUCES Campus)',
    distance_to_campus: '400 meters walking distance to FAST Lahore',
    monthly_rent_min: 17000,
    monthly_rent_max: 30000,
    security_deposit: 10000,
    room_types: ['Single Room', '2-Seater', '3-Seater'],
    mess_included: true,
    amenities: [
      'Hygienic 3-Time Food (Special Menu on Weekends)',
      'Heavy Generator Backup (Runs AC/Coolers & Laptops)',
      'Fiber Optic Internet (Low Latency for CS Projects)',
      'Daily Room Cleaning & Maintenance',
      'Attached Tiled Washrooms with Solar Geyser',
      'Filtered UV Drinking Water'
    ],
    phone: '+92 321 4459821',
    whatsapp: '923214459821',
    rating: 4.8,
    reviews_count: 88,
    is_verified: true,
    curfew_time: '11:00 PM',
    overview: 'Located in the heart of Faisal Town, Lahore. Catering predominantly to FAST-NUCES and Punjab University students. Known for excellent food quality and zero downtime power backup during Lahore summers.'
  },
  {
    id: 'hostel-lhr-02',
    name: 'Al-Madina Girls Hostel UET & KEMU',
    slug: 'al-madina-girls-hostel-uet-lahore',
    gender: 'Girls',
    target_universities: ['UET Lahore', 'King Edward Medical University', 'Lahore College for Women University'],
    city: 'Lahore',
    area: 'Begum Pura / GT Road, Near UET Gate 3',
    distance_to_campus: '5 minutes walk from UET Gate 3',
    monthly_rent_min: 15000,
    monthly_rent_max: 26000,
    security_deposit: 10000,
    room_types: ['Single Room', '2-Seater', '3-Seater'],
    mess_included: true,
    amenities: [
      'Female Security Guards & Resident Matron',
      'Nutritious 3-Time Meals with Fruit & Milk Option',
      'UPS & Generator Electrical Backup',
      'Air Coolers and Geysers in every room',
      'Study Hall with Wi-Fi & Printing Facility',
      'Safe Dedicated Transport for Hospital Shifts (KEMU)'
    ],
    phone: '+92 301 8847291',
    whatsapp: '923018847291',
    rating: 4.7,
    reviews_count: 65,
    is_verified: true,
    curfew_time: '08:00 PM',
    overview: 'Trusted safe haven for female engineering and medical students studying at UET and King Edward. Family-managed atmosphere with high nutritional standards and round-the-clock emergency support.'
  },
  {
    id: 'hostel-khi-01',
    name: 'NED & KU Scholars Residency Karachi',
    slug: 'ned-ku-scholars-residency-karachi',
    gender: 'Boys',
    target_universities: ['NED University of Engineering & Technology', 'University of Karachi (KU)'],
    city: 'Karachi',
    area: 'Gulshan-e-Iqbal, Block 1, University Road',
    distance_to_campus: '700 meters from NED Main University Gate',
    monthly_rent_min: 13000,
    monthly_rent_max: 22000,
    security_deposit: 8000,
    room_types: ['2-Seater', '3-Seater', '4-Seater'],
    mess_included: true,
    amenities: [
      'Standard 3-Time Karachi-Style Mess',
      'Sweet Drinking Water Tankers + Reverse Osmosis',
      'Solar Powered Fans & Study Lights',
      'High-Speed Wi-Fi',
      'Secure Motorcycle & Bicycle Basement',
      'CCTV Monitoring on all floors'
    ],
    phone: '+92 334 3219087',
    whatsapp: '923343219087',
    rating: 4.5,
    reviews_count: 49,
    is_verified: true,
    curfew_time: '11:30 PM',
    overview: 'Solves the primary challenges in Karachi student housing: guaranteed sweet water availability, reliable solar power during load shedding, and walking distance to NED University and Karachi University.'
  },
  {
    id: 'hostel-psh-01',
    name: 'Peshawar University Town Elite Boys Hostel',
    slug: 'university-town-boys-hostel-peshawar',
    gender: 'Boys',
    target_universities: ['UET Peshawar', 'University of Peshawar', 'Khyber Medical College (KMC)'],
    city: 'Peshawar',
    area: 'University Town, Circular Road, Peshawar',
    distance_to_campus: '1.2 km (Direct BRT / Shuttle Connectivity)',
    monthly_rent_min: 12000,
    monthly_rent_max: 21000,
    security_deposit: 6000,
    room_types: ['2-Seater', '3-Seater', '4-Seater'],
    mess_included: true,
    amenities: [
      'Traditional Pashtun & Pakistani Mess (3 times daily)',
      'Solar Electricity Backup (24 Hours Active)',
      'Fast Broadband Wi-Fi',
      'Lush Green Lawn & Study Verandah',
      'Laundry Service & Ironing',
      'Security Guards & CCTV'
    ],
    phone: '+92 345 9012384',
    whatsapp: '923459012384',
    rating: 4.7,
    reviews_count: 38,
    is_verified: true,
    curfew_time: '10:30 PM',
    overview: 'Located in the prime and secure University Town sector. Highly recommended for students arriving from FATA, Swat, Mardan, and Balochistan attending UET Peshawar or KMC.'
  },
  {
    id: 'hostel-isb-04',
    name: 'QAU Pine Residency Boys Hostel',
    slug: 'qau-pine-residency-boys-hostel-islamabad',
    gender: 'Boys',
    target_universities: ['Quaid-i-Azam University (QAU)', 'PIEAS Islamabad'],
    city: 'Islamabad',
    area: 'Bari Imam, Near QAU Admin Gate',
    distance_to_campus: '800 meters from QAU Gate 1',
    monthly_rent_min: 13500,
    monthly_rent_max: 23000,
    security_deposit: 7000,
    room_types: ['2-Seater', '3-Seater', '4-Seater'],
    mess_included: true,
    amenities: [
      'Mess (Daily Fresh Roti & Balanced Diet)',
      'Quiet Margalla Foothills Environment',
      'Solar Backup System',
      'WiFi throughout hostel corridors',
      'Hot Water Boilers in Winter',
      'CCTV Camera Security'
    ],
    phone: '+92 313 5678129',
    whatsapp: '923135678129',
    rating: 4.6,
    reviews_count: 31,
    is_verified: true,
    curfew_time: '10:00 PM',
    overview: 'Peaceful, scenic accommodation situated near the Margalla foothills near Quaid-i-Azam University. Ideal for research scholars, MPhil, and undergraduate students.'
  }
];

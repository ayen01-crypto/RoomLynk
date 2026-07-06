import { HostelListing, Booking, ChatThread, Message, User, Review } from './types';

// Standard room images that load quickly and look spectacular
export const INITIAL_LISTINGS: HostelListing[] = [
  {
    id: 'listing_1',
    title: 'Bright Future Hostel',
    area: 'Kikungiri',
    locationDetail: 'Kikungiri, Near Main Gate',
    pricePerSemester: 400000,
    rating: 4.6,
    reviewsCount: 23,
    roomType: 'Single',
    isSelfContained: true,
    features: ['Single Room', 'Self Contained', '24/7 Water', 'Study Desk', 'Wardrobe', 'Security Guard'],
    description: 'Spacious self-contained single room with modern wardrobe, study table, and 24/7 water. Situated inside a secure fence, only a 3-minute walk from the Kabale University Main Gate. Quiet environment perfect for studying.',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'VACANT',
    landlordId: 'landlord_john',
    landlordName: 'Mr. John Magezi',
    landlordPhone: '+256 771 234 567'
  },
  {
    id: 'listing_2',
    title: 'Peace Point Hostel',
    area: 'Nyabikoni',
    locationDetail: 'Nyabikoni, Near Lower Campus',
    pricePerSemester: 350000,
    rating: 4.2,
    reviewsCount: 14,
    roomType: 'Single',
    isSelfContained: false,
    features: ['Single Room', 'Shared', '24/7 Water', 'Solar Power', 'Wardrobe', 'Balcony'],
    description: 'Cozy single room with standard shared facilities. Backed up with heavy-duty solar power so you never have to worry about power blackouts during exam weeks. Very close to the lower campus laboratories.',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'VACANT',
    landlordId: 'landlord_mary',
    landlordName: 'Mrs. Mary Kansiime',
    landlordPhone: '+256 782 987 654'
  },
  {
    id: 'listing_3',
    title: 'Skyview Heights Residence',
    area: 'Town',
    locationDetail: 'Kabale Town, High Street',
    pricePerSemester: 550000,
    rating: 4.8,
    reviewsCount: 9,
    roomType: 'Double',
    isSelfContained: true,
    features: ['Double Room', 'Self Contained', '24/7 Water', 'Solar Power', 'Balcony', 'DSTV', 'Security Guard'],
    description: 'Premium double room designed for two students to share or one student desiring extra space. Features private balcony with breathtaking view of Kabale hills, modern fittings, private prepaid electricity meter, and DSTV package.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'VACANT',
    landlordId: 'landlord_john',
    landlordName: 'Mr. John Magezi',
    landlordPhone: '+256 771 234 567'
  },
  {
    id: 'listing_4',
    title: 'Rutooma Study Haven',
    area: 'Rutooma',
    locationDetail: 'Rutooma Road, near Medical School',
    pricePerSemester: 380000,
    rating: 4.5,
    reviewsCount: 18,
    roomType: 'Single',
    isSelfContained: true,
    features: ['Single Room', 'Self Contained', 'Study Desk', '24/7 Water', 'Security Guard'],
    description: 'Perfect spot for medical and science students requiring quick access to classes in Rutooma. Peaceful atmosphere, high-security fence, in-house warden, and spacious parking.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'VACANT',
    landlordId: 'landlord_robert',
    landlordName: 'Mr. Robert Tumwesigye',
    landlordPhone: '+256 701 555 111'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    listingId: 'listing_1',
    studentName: 'Aryatuha Kenneth',
    rating: 5,
    comment: 'The location is excellent, just behind the university main gate. The water flow is very reliable and landlord John is quick to solve any plumbing issues.',
    date: '25 May 2026'
  },
  {
    id: 'rev_2',
    listingId: 'listing_1',
    studentName: 'Agaba Proscovia',
    rating: 4,
    comment: 'Very quiet environment which has helped me focus. Highly recommended for final-year students!',
    date: '10 April 2026'
  },
  {
    id: 'rev_3',
    listingId: 'listing_2',
    studentName: 'Mukasa Brian',
    rating: 4,
    comment: 'Good price. The solar backup is a lifesaver during outages. Landlord Mary is friendly.',
    date: '12 May 2026'
  }
];

// Helper to load/save state
export const StorageManager = {
  getUser: (): User | null => {
    const data = localStorage.getItem('roomlynk_user');
    return data ? JSON.parse(data) : null;
  },
  saveUser: (user: User) => {
    localStorage.setItem('roomlynk_user', JSON.stringify(user));
  },
  clearUser: () => {
    localStorage.removeItem('roomlynk_user');
  },
  getListings: (): HostelListing[] => {
    const data = localStorage.getItem('roomlynk_listings');
    if (!data) {
      localStorage.setItem('roomlynk_listings', JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS;
    }
    return JSON.parse(data);
  },
  saveListings: (listings: HostelListing[]) => {
    localStorage.setItem('roomlynk_listings', JSON.stringify(listings));
  },
  getSavedListings: (): string[] => {
    const data = localStorage.getItem('roomlynk_saved_listings');
    return data ? JSON.parse(data) : [];
  },
  saveSavedListings: (savedIds: string[]) => {
    localStorage.setItem('roomlynk_saved_listings', JSON.stringify(savedIds));
  },
  getBookings: (): Booking[] => {
    const data = localStorage.getItem('roomlynk_bookings');
    return data ? JSON.parse(data) : [];
  },
  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem('roomlynk_bookings', JSON.stringify(bookings));
  },
  getMessages: (): Message[] => {
    const data = localStorage.getItem('roomlynk_messages');
    return data ? JSON.parse(data) : [];
  },
  saveMessages: (messages: Message[]) => {
    localStorage.setItem('roomlynk_messages', JSON.stringify(messages));
  },
  getChats: (): ChatThread[] => {
    const data = localStorage.getItem('roomlynk_chats');
    return data ? JSON.parse(data) : [];
  },
  saveChats: (chats: ChatThread[]) => {
    localStorage.setItem('roomlynk_chats', JSON.stringify(chats));
  },
  getReviews: (): Review[] => {
    const data = localStorage.getItem('roomlynk_reviews');
    if (!data) {
      localStorage.setItem('roomlynk_reviews', JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  },
  saveReviews: (reviews: Review[]) => {
    localStorage.setItem('roomlynk_reviews', JSON.stringify(reviews));
  },
  getLandlordSubscription: (landlordId: string) => {
    const key = `roomlynk_sub_${landlordId}`;
    const data = localStorage.getItem(key);
    if (!data) {
      const defaultSub = {
        active: true,
        daysLeft: 92,
        expiryDate: '25 Sep 2026',
        planName: 'Basic'
      };
      localStorage.setItem(key, JSON.stringify(defaultSub));
      return defaultSub;
    }
    return JSON.parse(data);
  },
  saveLandlordSubscription: (landlordId: string, sub: any) => {
    localStorage.setItem(`roomlynk_sub_${landlordId}`, JSON.stringify(sub));
  }
};

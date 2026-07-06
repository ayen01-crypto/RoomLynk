export type UserRole = 'student' | 'landlord';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
  avatarUrl: string;
  email?: string;
  verified: boolean;
  trustedContact?: string;
}

export interface HostelListing {
  id: string;
  title: string;
  area: 'Kikungiri' | 'Nyabikoni' | 'Town' | 'Rutooma';
  locationDetail: string;
  pricePerSemester: number;
  rating: number;
  reviewsCount: number;
  roomType: 'Single' | 'Double';
  isSelfContained: boolean;
  features: string[];
  description: string;
  imageUrl: string;
  images: string[];
  status: 'VACANT' | 'BOOKED' | 'OCCUPIED';
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
}

export interface Booking {
  id: string;
  listingId: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  hostelTitle: string;
  roomType: string;
  price: number;
  moveInDate: string;
  bookingDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatThread {
  id: string;
  studentId: string;
  studentName: string;
  landlordId: string;
  landlordName: string;
  listingId: string;
  listingTitle: string;
  lastMessageText: string;
  lastMessageTime: string;
}

export interface Subscription {
  active: boolean;
  daysLeft: number;
  expiryDate: string;
  planName: 'Basic' | 'Premium';
}

export interface Review {
  id: string;
  listingId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

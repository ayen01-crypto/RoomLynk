import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User, HostelListing, Booking, UserRole } from './types';
import { StorageManager } from './data';
import WelcomeScreen from './components/WelcomeScreen';
import PhoneAuth from './components/PhoneAuth';
import StudentDashboard from './components/StudentDashboard';
import LandlordDashboard from './components/LandlordDashboard';
import ListingDetail from './components/ListingDetail';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import BookingRecordView from './components/BookingRecordView';
import ChatInterface from './components/ChatInterface';
import ShareMyVisit from './components/ShareMyVisit';
import OfflineIndicator from './components/OfflineIndicator';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authRole, setAuthRole] = useState<UserRole | null>(null);
  const [authStep, setAuthStep] = useState<'welcome' | 'phone_auth'>('welcome');

  // Navigation states
  const [activeListing, setActiveListing] = useState<HostelListing | null>(null);
  const [activeBookingListing, setActiveBookingListing] = useState<HostelListing | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [viewingRecord, setViewingRecord] = useState<Booking | null>(null);
  const [activeChatListing, setActiveChatListing] = useState<HostelListing | null>(null);
  const [activeChatRecipient, setActiveChatRecipient] = useState<string>('');
  const [activeSafetyListing, setActiveSafetyListing] = useState<HostelListing | null>(null);

  // Initialize and load persistent user
  useEffect(() => {
    const user = StorageManager.getUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleOnboardingNext = (role: UserRole) => {
    setAuthRole(role);
    setAuthStep('phone_auth');
  };

  const handleLoginClick = () => {
    setAuthRole('student'); // Default to student on login simulation
    setAuthStep('phone_auth');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    StorageManager.saveUser(user);
    
    // Clear navigation states
    setActiveListing(null);
    setActiveBookingListing(null);
    setConfirmedBooking(null);
    setViewingRecord(null);
    setActiveChatListing(null);
    setActiveSafetyListing(null);
  };

  const handleLogout = () => {
    StorageManager.clearUser();
    setCurrentUser(null);
    setAuthStep('welcome');
    setAuthRole(null);
  };

  // Student books a room
  const handleBookingSubmit = (moveInDate: string, notes: string) => {
    if (!currentUser || !activeBookingListing) return;

    const newBooking: Booking = {
      id: `RLK-${new Date().getFullYear()}-000${Math.floor(100 + Math.random() * 900)}`,
      listingId: activeBookingListing.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentPhone: currentUser.phone,
      hostelTitle: activeBookingListing.title,
      roomType: activeBookingListing.roomType,
      price: activeBookingListing.pricePerSemester,
      moveInDate: moveInDate,
      bookingDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + `, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'CONFIRMED', // Automatically confirm in simulation mode
    };

    const currentBookings = StorageManager.getBookings();
    StorageManager.saveBookings([...currentBookings, newBooking]);

    // Update listing status as booked
    const allListings = StorageManager.getListings();
    const updatedListings = allListings.map((l) => {
      if (l.id === activeBookingListing.id) {
        return { ...l, status: 'BOOKED' as const };
      }
      return l;
    });
    StorageManager.saveListings(updatedListings);

    // Save initial system notification message in chat
    const chatId = `chat_${currentUser.id}_${activeBookingListing.landlordId}_${activeBookingListing.id}`;
    const allMsgs = StorageManager.getMessages();
    const notificationMsg = {
      id: `msg_sys_${Date.now()}`,
      chatId: chatId,
      senderId: 'system',
      recipientId: currentUser.id,
      text: `📢 Booking Request Submitted: You requested to book ${activeBookingListing.title} on move-in date ${moveInDate}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    StorageManager.saveMessages([...allMsgs, notificationMsg]);

    setActiveBookingListing(null);
    setActiveListing(null);
    setConfirmedBooking(newBooking);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center">
      {/* PWA Phone Wrapper - Elegant, modern device layout */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] bg-slate-50 shadow-2xl relative sm:rounded-3xl sm:border sm:border-slate-200 overflow-hidden flex flex-col">
        
        {/* Offline Status indicator */}
        <OfflineIndicator />

        {/* Dynamic Route Orchestrator */}
        <AnimatePresence mode="wait">
          {!currentUser ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {authStep === 'welcome' ? (
                <WelcomeScreen
                  onNext={handleOnboardingNext}
                  onLoginClick={handleLoginClick}
                />
              ) : (
                <PhoneAuth
                  role={authRole || 'student'}
                  onBack={() => setAuthStep('welcome')}
                  onSuccess={handleAuthSuccess}
                />
              )}
            </motion.div>
          ) : activeSafetyListing ? (
            <motion.div
              key="safety"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="flex-1 flex flex-col"
            >
              <ShareMyVisit
                listing={activeSafetyListing}
                onBack={() => setActiveSafetyListing(null)}
              />
            </motion.div>
          ) : activeChatListing ? (
            <motion.div
              key="chat"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="flex-1 flex flex-col"
            >
              <ChatInterface
                listing={activeChatListing}
                currentUser={currentUser}
                recipientName={activeChatRecipient}
                onBack={() => {
                  setActiveChatListing(null);
                  setActiveChatRecipient('');
                }}
              />
            </motion.div>
          ) : activeBookingListing ? (
            <motion.div
              key="booking_form"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="flex-1 flex flex-col"
            >
              <BookingForm
                listing={activeBookingListing}
                onBack={() => setActiveBookingListing(null)}
                onSubmit={handleBookingSubmit}
              />
            </motion.div>
          ) : confirmedBooking ? (
            <motion.div
              key="confirmed"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="flex-1 flex flex-col"
            >
              <BookingConfirmation
                booking={confirmedBooking}
                onViewRecord={() => {
                  setViewingRecord(confirmedBooking);
                  setConfirmedBooking(null);
                }}
                onGoHome={() => setConfirmedBooking(null)}
              />
            </motion.div>
          ) : viewingRecord ? (
            <motion.div
              key="receipt"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="flex-1 flex flex-col"
            >
              <BookingRecordView
                booking={viewingRecord}
                onBack={() => setViewingRecord(null)}
              />
            </motion.div>
          ) : activeListing ? (
            <motion.div
              key="detail"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="flex-1 flex flex-col"
            >
              <ListingDetail
                listing={activeListing}
                currentUser={currentUser}
                onBack={() => setActiveListing(null)}
                onStartChat={() => {
                  setActiveChatListing(activeListing);
                  setActiveChatRecipient(activeListing.landlordName);
                }}
                onBookRoom={() => setActiveBookingListing(activeListing)}
                onOpenSafety={() => setActiveSafetyListing(activeListing)}
              />
            </motion.div>
          ) : currentUser.role === 'student' ? (
            <motion.div
              key="student_dash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              <StudentDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
                onViewListing={(listing) => setActiveListing(listing)}
                onOpenChat={(listing) => {
                  setActiveChatListing(listing);
                  setActiveChatRecipient(listing.landlordName);
                }}
                onViewBookingRecord={(booking) => setViewingRecord(booking)}
                onOpenSafetyAlert={(listing) => setActiveSafetyListing(listing)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="landlord_dash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              <LandlordDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
                onViewBookingRecord={(booking) => setViewingRecord(booking)}
                onOpenChat={(listing, studentName) => {
                  setActiveChatListing(listing);
                  setActiveChatRecipient(studentName);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

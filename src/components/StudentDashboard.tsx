import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Home as HomeIcon,
  Heart,
  MessageSquare,
  CalendarCheck,
  User as UserIcon,
  Star,
  MapPin,
  ChevronRight,
  Shield,
  LogOut,
} from 'lucide-react';
import { HostelListing, Booking, ChatThread, User } from '../types';
import { StorageManager } from '../data';
import FilterModal from './FilterModal';

interface StudentDashboardProps {
  currentUser: User;
  onLogout: () => void;
  onViewListing: (listing: HostelListing) => void;
  onOpenChat: (listing: HostelListing) => void;
  onViewBookingRecord: (booking: Booking) => void;
  onOpenSafetyAlert: (listing: HostelListing) => void;
}

export default function StudentDashboard({
  currentUser,
  onLogout,
  onViewListing,
  onOpenChat,
  onViewBookingRecord,
  onOpenSafetyAlert,
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'saved' | 'messages' | 'bookings' | 'profile'>('home');
  const [listings, setListings] = useState<HostelListing[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [priceRange, setPriceRange] = useState(600000);
  const [roomType, setRoomType] = useState<'All' | 'Single' | 'Double'>('All');
  const [selfContainedOnly, setSelfContainedOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [trustedContact, setTrustedContact] = useState(currentUser.trustedContact || '');

  useEffect(() => {
    setListings(StorageManager.getListings());
    setSavedIds(StorageManager.getSavedListings());
    setBookings(StorageManager.getBookings().filter((b) => b.studentId === currentUser.id));

    // Compile chat threads based on actual messages
    const allMessages = StorageManager.getMessages();
    const studentMessages = allMessages.filter(
      (m) => m.senderId === currentUser.id || m.recipientId === currentUser.id
    );

    // Group messages by chat threads
    const threadMap: { [key: string]: ChatThread } = {};
    const loadedListings = StorageManager.getListings();

    studentMessages.forEach((msg) => {
      const parts = msg.chatId.split('_');
      // format: chat_studentId_landlordId_listingId
      if (parts.length >= 4) {
        const listingId = parts[3];
        const listing = loadedListings.find((l) => l.id === listingId);
        if (listing) {
          const threadKey = msg.chatId;
          if (!threadMap[threadKey] || new Date(msg.timestamp) > new Date(threadMap[threadKey].lastMessageTime)) {
            threadMap[threadKey] = {
              id: threadKey,
              studentId: currentUser.id,
              studentName: currentUser.name,
              landlordId: listing.landlordId,
              landlordName: listing.landlordName,
              listingId: listing.id,
              listingTitle: listing.title,
              lastMessageText: msg.text,
              lastMessageTime: msg.timestamp,
            };
          }
        }
      }
    });

    setChats(Object.values(threadMap));
  }, [activeTab]);

  const toggleSave = (listingId: string, e: MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (savedIds.includes(listingId)) {
      updated = savedIds.filter((id) => id !== listingId);
    } else {
      updated = [...savedIds, listingId];
    }
    setSavedIds(updated);
    StorageManager.saveSavedListings(updated);
  };

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name: profileName,
      trustedContact: trustedContact,
    };
    StorageManager.saveUser(updatedUser);
    alert('Profile information updated successfully!');
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationDetail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'All Areas' || item.area === selectedArea;
    const matchesPrice = item.pricePerSemester <= priceRange;
    const matchesType = roomType === 'All' || item.roomType === roomType;
    const matchesSC = !selfContainedOnly || item.isSelfContained;

    return matchesSearch && matchesArea && matchesPrice && matchesType && matchesSC;
  });

  const areas = ['All Areas', 'Kikungiri', 'Nyabikoni', 'Town', 'Rutooma'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Search Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        roomType={roomType}
        setRoomType={setRoomType}
        selfContainedOnly={selfContainedOnly}
        setSelfContainedOnly={setSelfContainedOnly}
        onApply={() => setIsFilterOpen(false)}
      />

      {/* Main Tab Render Block */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <div className="p-6 space-y-6">
            {/* Header / Greetings */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">
                  Hello, {currentUser.name.split(' ')[0]} 👋
                </h1>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Find your perfect home</p>
              </div>
              <img
                src={currentUser.avatarUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-slate-200"
              />
            </div>

            {/* Search Input and Filter trigger */}
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type="text"
                  placeholder="Search by area or hostel name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs pl-10 pr-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(true)}
                className="p-3.5 bg-white border border-slate-100 text-slate-600 hover:text-blue-600 rounded-xl shadow-sm cursor-pointer"
              >
                <SlidersHorizontal className="w-4.5 h-4.5" />
              </motion.button>
            </div>

            {/* Area slide selector */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Areas</h3>
              <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-none">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                      selectedArea === area
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15'
                        : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Nearby Listings</h3>
                <span className="text-[10px] font-bold text-blue-600 font-mono">
                  {filteredListings.length} found
                </span>
              </div>

              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredListings.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -2 }}
                      onClick={() => onViewListing(item)}
                      className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden cursor-pointer flex flex-col"
                    >
                      {/* Image section with relative components */}
                      <div className="relative h-44 bg-slate-200">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {/* Rating block */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-extrabold text-slate-800">{item.rating}</span>
                        </div>

                        {/* Save block */}
                        <button
                          onClick={(e) => toggleSave(item.id, e)}
                          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-xs rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              savedIds.includes(item.id) ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>

                        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wide uppercase">
                          {item.roomType} • {item.isSelfContained ? 'Self Contained' : 'Shared'}
                        </div>
                      </div>

                      {/* Info section */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-400 font-semibold flex items-center mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-blue-500 mr-1" />
                              {item.locationDetail}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-blue-600 font-mono">
                              UGX {item.pricePerSemester.toLocaleString()}
                            </p>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              per semester
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-400 font-medium">No hostels match your filter choices.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saved Items Tab */}
        {activeTab === 'saved' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Saved Hostels</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Bookmarks of your favorite hostels</p>
            </div>

            {listings.filter((item) => savedIds.includes(item.id)).length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {listings
                  .filter((item) => savedIds.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onViewListing(item)}
                      className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer shadow-xs"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-800 truncate">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-medium truncate">{item.locationDetail}</p>
                        <p className="text-xs font-bold text-blue-600 mt-1 font-mono">
                          UGX {item.pricePerSemester.toLocaleString()} / sem
                        </p>
                      </div>
                      <button
                        onClick={(e) => toggleSave(item.id, e)}
                        className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors shrink-0"
                      >
                        <Heart className="w-4 h-4 fill-red-500" />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-semibold">Your saved list is empty.</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Tap the heart icon on any hostel listing to bookmarks.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Chat Thread Tab */}
        {activeTab === 'messages' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">In-App Messaging</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Chat with hostel landlords directly</p>
            </div>

            {chats.length > 0 ? (
              <div className="space-y-3">
                {chats.map((chat) => {
                  const listing = listings.find((l) => l.id === chat.listingId);
                  return (
                    <div
                      key={chat.id}
                      onClick={() => listing && onOpenChat(listing)}
                      className="bg-white border border-slate-100 p-4.5 rounded-2xl flex items-center space-x-3.5 cursor-pointer shadow-xs hover:border-blue-100"
                    >
                      <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black shrink-0 text-sm">
                        {chat.landlordName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="text-xs font-black text-slate-800">{chat.landlordName}</h4>
                          <span className="text-[9px] text-slate-400 font-bold">{chat.lastMessageTime}</span>
                        </div>
                        <p className="text-[10px] font-black tracking-wide text-blue-500 uppercase">
                          {chat.listingTitle}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">{chat.lastMessageText}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-semibold">No active messages yet.</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Start an accommodation inquiry by tapping "Message" on any listing page.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Queue Tab */}
        {activeTab === 'bookings' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">My Bookings</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Track and manage your room bookings</p>
            </div>

            {bookings.length > 0 ? (
              <div className="space-y-3.5">
                {bookings.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Booking ID: {book.id}
                        </p>
                        <h4 className="text-sm font-extrabold text-slate-800 mt-1">{book.hostelTitle}</h4>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide uppercase ${
                          book.status === 'CONFIRMED'
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : book.status === 'REJECTED'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}
                      >
                        {book.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Room Type</p>
                        <p className="text-slate-800 font-bold mt-0.5">{book.roomType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Move-In Date</p>
                        <p className="text-slate-800 font-bold mt-0.5">{book.moveInDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cost</p>
                        <p className="text-blue-600 font-mono font-bold mt-0.5">
                          UGX {book.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase font-bold">Booking Date</p>
                        <p className="text-slate-500 font-bold mt-0.5">{book.bookingDate}</p>
                      </div>
                    </div>

                    {book.status === 'CONFIRMED' && (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onViewBookingRecord(book)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer shadow"
                      >
                        <span>View Booking Record Receipt</span>
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-semibold">No booking request records.</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                  Tap 'Book This Room' on any hostel specs card to submit a request.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Student Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">My Profile</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Manage your user details and settings</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs flex items-center space-x-4">
                <img
                  src={currentUser.avatarUrl}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">{currentUser.name}</h3>
                  <p className="text-xs text-slate-400 font-medium font-mono">{currentUser.phone}</p>
                  <p className="text-[10px] bg-green-50 border border-green-100 text-green-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider inline-block mt-1">
                    Verified Student
                  </p>
                </div>
              </div>

              {/* Form entries */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-white text-slate-800 text-xs px-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 outline-none transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Trusted Contact (Safety Alerts)
                </label>
                <input
                  type="text"
                  required
                  value={trustedContact}
                  onChange={(e) => setTrustedContact(e.target.value)}
                  className="w-full bg-white text-slate-800 text-xs px-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 outline-none transition-all font-mono font-semibold"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs cursor-pointer shadow-md shadow-blue-500/10"
              >
                Save Changes
              </motion.button>
            </form>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer mt-4"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log Out</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* App Bar Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-150 p-2.5 flex items-center justify-around z-30 max-w-md mx-auto shadow-2xl">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center px-3 py-1 cursor-pointer transition-colors ${
            activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <HomeIcon className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center px-3 py-1 cursor-pointer transition-colors ${
            activeTab === 'saved' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <Heart className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold mt-1">Saved</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center justify-center px-3 py-1 cursor-pointer transition-colors ${
            activeTab === 'messages' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 stroke-[2]" />
            {chats.length > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {chats.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">Messages</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center justify-center px-3 py-1 cursor-pointer transition-colors ${
            activeTab === 'bookings' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <CalendarCheck className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold mt-1">Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center px-3 py-1 cursor-pointer transition-colors ${
            activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <UserIcon className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}

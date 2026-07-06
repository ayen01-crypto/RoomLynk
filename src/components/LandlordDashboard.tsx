import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Plus,
  ShieldCheck,
  Check,
  X,
  PlusCircle,
  Smartphone,
  CreditCard,
  MessageSquare,
  Sparkles,
  ClipboardList,
  User,
  Trash2,
} from 'lucide-react';
import { HostelListing, Booking, ChatThread, User as UserType } from '../types';
import { StorageManager } from '../data';

interface LandlordDashboardProps {
  currentUser: UserType;
  onLogout: () => void;
  onViewBookingRecord: (booking: Booking) => void;
  onOpenChat: (listing: HostelListing, studentName: string) => void;
}

export default function LandlordDashboard({
  currentUser,
  onLogout,
  onViewBookingRecord,
  onOpenChat,
}: LandlordDashboardProps) {
  const [listings, setListings] = useState<HostelListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [sub, setSub] = useState({ active: true, daysLeft: 92, expiryDate: '25 Sep 2026', planName: 'Basic' });

  // Add listing state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArea, setNewArea] = useState<'Kikungiri' | 'Nyabikoni' | 'Town' | 'Rutooma'>('Kikungiri');
  const [newPrice, setNewPrice] = useState(400000);
  const [newRoomType, setNewRoomType] = useState<'Single' | 'Double'>('Single');
  const [newSelfContained, setNewSelfContained] = useState(true);
  const [newDesc, setNewDesc] = useState('');

  // Mobile Money subscription state
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [momoProvider, setMomoProvider] = useState<'MTN' | 'Airtel'>('MTN');
  const [momoPhone, setMomoPhone] = useState('');
  const [momoAmount, setMomoAmount] = useState(20000); // UGX 20,000 for 1 month
  const [momoStep, setMomoStep] = useState<'plan' | 'phone' | 'pin' | 'success'>('plan');
  const [momoPin, setMomoPin] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Load Landlord context
  const loadLandlordData = () => {
    const allListings = StorageManager.getListings();
    const landlordListings = allListings.filter((l) => l.landlordId === currentUser.id);
    setListings(landlordListings);

    const allBookings = StorageManager.getBookings();
    // Bookings related to landlord's listings
    const landlordListingIds = landlordListings.map((l) => l.id);
    const relevantBookings = allBookings.filter((b) => landlordListingIds.includes(b.listingId));
    setBookings(relevantBookings);

    setSub(StorageManager.getLandlordSubscription(currentUser.id));

    // Compile chats for landlord
    const allMessages = StorageManager.getMessages();
    const landlordMessages = allMessages.filter(
      (m) => m.senderId === currentUser.id || m.recipientId === currentUser.id
    );

    const threadMap: { [key: string]: ChatThread } = {};
    landlordMessages.forEach((msg) => {
      const parts = msg.chatId.split('_');
      if (parts.length >= 4) {
        const studentId = parts[1];
        const studentName = 'Kenneth Aryatuha'; // Simulated student name
        const listingId = parts[3];
        const listing = landlordListings.find((l) => l.id === listingId);
        if (listing) {
          const threadKey = msg.chatId;
          if (!threadMap[threadKey] || new Date(msg.timestamp) > new Date(threadMap[threadKey].lastMessageTime)) {
            threadMap[threadKey] = {
              id: threadKey,
              studentId: studentId,
              studentName: studentName,
              landlordId: currentUser.id,
              landlordName: currentUser.name,
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
  };

  useEffect(() => {
    loadLandlordData();
  }, [currentUser]);

  // Toggle listing status
  const toggleStatus = (listingId: string) => {
    const allListings = StorageManager.getListings();
    const updated = allListings.map((l) => {
      if (l.id === listingId) {
        const nextStatus: 'VACANT' | 'BOOKED' = l.status === 'VACANT' ? 'BOOKED' : 'VACANT';
        return { ...l, status: nextStatus };
      }
      return l;
    });
    StorageManager.saveListings(updated);
    loadLandlordData();
  };

  // Delete listing
  const handleDeleteListing = (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const allListings = StorageManager.getListings();
      const updated = allListings.filter((l) => l.id !== listingId);
      StorageManager.saveListings(updated);
      loadLandlordData();
    }
  };

  // Submit new Listing
  const handleAddListing = (e: FormEvent) => {
    e.preventDefault();

    const mockImages = [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    ];

    const newListing: HostelListing = {
      id: `listing_landlord_${Date.now()}`,
      title: newTitle,
      area: newArea,
      locationDetail: `${newArea}, near Campus`,
      pricePerSemester: newPrice,
      rating: 5.0,
      reviewsCount: 0,
      roomType: newRoomType,
      isSelfContained: newSelfContained,
      features: [
        `${newRoomType} Room`,
        newSelfContained ? 'Self Contained' : 'Shared',
        '24/7 Water',
        'Security Guard',
      ],
      description: newDesc,
      imageUrl: mockImages[Math.floor(Math.random() * mockImages.length)],
      images: [mockImages[0], mockImages[1]],
      status: 'VACANT',
      landlordId: currentUser.id,
      landlordName: currentUser.name,
      landlordPhone: currentUser.phone,
    };

    const allListings = StorageManager.getListings();
    StorageManager.saveListings([...allListings, newListing]);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setIsAddOpen(false);
    loadLandlordData();
    alert('Hostel listing added successfully!');
  };

  // Accept/Reject Booking
  const handleBookingAction = (bookingId: string, action: 'CONFIRMED' | 'REJECTED') => {
    const allBookings = StorageManager.getBookings();
    const updated = allBookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: action };
      }
      return b;
    });

    StorageManager.saveBookings(updated);

    // If booking was confirmed, automatically set the listing status to BOOKED
    if (action === 'CONFIRMED') {
      const targetBooking = allBookings.find((b) => b.id === bookingId);
      if (targetBooking) {
        const allListings = StorageManager.getListings();
        const updatedListings = allListings.map((l) => {
          if (l.id === targetBooking.listingId) {
            return { ...l, status: 'BOOKED' as const };
          }
          return l;
        });
        StorageManager.saveListings(updatedListings);
      }
    }

    loadLandlordData();
    alert(`Booking request was successfully ${action.toLowerCase()}!`);
  };

  // Handle mobile money payment simulation
  const handleMoMoPayment = (e: FormEvent) => {
    e.preventDefault();
    if (momoStep === 'phone') {
      if (!momoPhone || momoPhone.length < 9) {
        alert('Please enter a valid phone number');
        return;
      }
      setMomoStep('pin');
    } else if (momoStep === 'pin') {
      if (momoPin.length < 4) {
        alert('Please enter a valid 4-digit PIN');
        return;
      }
      setIsPaying(true);

      setTimeout(() => {
        setIsPaying(false);
        setMomoStep('success');

        // Update landlord subscription in storage
        const addedDays = momoAmount === 20000 ? 30 : 120;
        const totalDays = sub.daysLeft + addedDays;
        const currentExp = new Date();
        currentExp.setDate(currentExp.getDate() + totalDays);

        const updatedSub = {
          active: true,
          daysLeft: totalDays,
          expiryDate: currentExp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          planName: momoAmount === 20000 ? 'Basic' : 'Premium',
        };

        StorageManager.saveLandlordSubscription(currentUser.id, updatedSub);
        setSub(updatedSub);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 p-6 space-y-6 pb-24 max-w-md mx-auto w-full">
      {/* Landlord Top header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] bg-blue-100 border border-blue-200 text-blue-600 px-2.5 py-1 rounded-lg font-black tracking-wider uppercase">
            Landlord Hub
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-2 leading-tight">
            Welcome, Mr. Magezi
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-full border border-slate-100 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Subscription Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-full translate-x-4 -translate-y-4"></div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
            MTN / Airtel active subscription
          </h3>
        </div>

        <div className="flex justify-between items-end pt-1">
          <div>
            <p className="text-2xl font-black text-slate-900">{sub.daysLeft} days left</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Expires on {sub.expiryDate}</p>
          </div>
          <button
            onClick={() => {
              setMomoStep('plan');
              setIsSubOpen(true);
            }}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider shadow cursor-pointer"
          >
            Renew Plan
          </button>
        </div>
      </div>

      {/* Booking Requests review list */}
      <div className="space-y-3">
        <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">
          Incoming Booking Requests ({bookings.filter((b) => b.status === 'PENDING').length})
        </h3>

        {bookings.filter((b) => b.status === 'PENDING').length > 0 ? (
          <div className="space-y-3">
            {bookings
              .filter((b) => b.status === 'PENDING')
              .map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{b.studentName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{b.studentPhone}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">
                      PENDING
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Hostel:</span>
                      <span className="font-bold text-slate-800">{b.hostelTitle}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Room:</span>
                      <span className="font-bold text-slate-800">{b.roomType}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Move-In:</span>
                      <span className="font-bold text-slate-800">{b.moveInDate}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBookingAction(b.id, 'REJECTED')}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => handleBookingAction(b.id, 'CONFIRMED')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer shadow"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white border border-slate-100 rounded-2xl text-slate-400 text-xs font-semibold">
            No pending booking requests.
          </div>
        )}
      </div>

      {/* Listings Manager */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">My Listings</h3>
          <button
            onClick={() => setIsAddOpen(true)}
            className="text-xs font-bold text-blue-600 flex items-center space-x-1 hover:underline cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New</span>
          </button>
        </div>

        {listings.length > 0 ? (
          <div className="space-y-3">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{item.area}</p>
                  
                  {/* Status Toggle buttons */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wide uppercase border transition-colors ${
                        item.status === 'VACANT'
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {item.status}
                    </button>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-1 text-slate-300 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white border border-slate-100 rounded-2xl text-slate-400 text-xs font-semibold">
            No properties added yet. Tap 'Add New' to begin.
          </div>
        )}
      </div>

      {/* Active Chats lists for landlords */}
      <div className="space-y-3">
        <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">
          Inquiries / Messages ({chats.length})
        </h3>

        {chats.length > 0 ? (
          <div className="space-y-2.5">
            {chats.map((chat) => {
              const listing = listings.find((l) => l.id === chat.listingId);
              return (
                <div
                  key={chat.id}
                  onClick={() => listing && onOpenChat(listing, chat.studentName)}
                  className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between cursor-pointer shadow-xs hover:border-blue-100"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-extrabold shrink-0 text-xs">
                      {chat.studentName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-800 truncate">{chat.studentName}</h4>
                      <p className="text-[9px] font-black tracking-wider text-blue-500 uppercase">{chat.listingTitle}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{chat.lastMessageText}</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-white border border-slate-100 rounded-2xl text-slate-400 text-xs font-semibold">
            No active student messages.
          </div>
        )}
      </div>

      {/* Slide open Form to Add New Listing */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center">
            <div className="absolute inset-0" onClick={() => setIsAddOpen(false)}></div>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl relative z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Add New Property</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 bg-slate-100 rounded-full text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddListing} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Hostel Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bright Future Hostel"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 shadow-sm font-semibold"
                  />
                </div>

                {/* Area & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Area</label>
                    <select
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value as any)}
                      className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 shadow-sm font-semibold"
                    >
                      <option value="Kikungiri">Kikungiri</option>
                      <option value="Nyabikoni">Nyabikoni</option>
                      <option value="Town">Town</option>
                      <option value="Rutooma">Rutooma</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Rent (UGX / Sem)</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 shadow-sm font-mono font-semibold"
                    />
                  </div>
                </div>

                {/* Layout details */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <label className="flex items-center space-x-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoomType === 'Double'}
                      onChange={(e) => setNewRoomType(e.target.checked ? 'Double' : 'Single')}
                      className="w-4.5 h-4.5 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-700">Double Room Layout</span>
                  </label>

                  <label className="flex items-center space-x-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSelfContained}
                      onChange={(e) => setNewSelfContained(e.target.checked)}
                      className="w-4.5 h-4.5 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-700">Self Contained Toilet</span>
                  </label>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description</label>
                  <textarea
                    required
                    placeholder="Enter specs, water reliability, power backup, security protocols..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 shadow-sm font-semibold resize-none"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer uppercase tracking-wider"
                >
                  Create Listing
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subscription Pay Mobile Money Drawer */}
      <AnimatePresence>
        {isSubOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center">
            <div className="absolute inset-0" onClick={() => setIsSubOpen(false)}></div>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl relative z-10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">Mobile Money Gateway</h3>
                </div>
                <button
                  onClick={() => setIsSubOpen(false)}
                  className="p-1.5 bg-slate-100 rounded-full text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {momoStep === 'plan' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-400 leading-relaxed font-semibold">
                    Renew your landlord marketplace access to keep managing bookings and listing rooms.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Basic 1 month */}
                    <div
                      onClick={() => {
                        setMomoAmount(20000);
                        setMomoStep('phone');
                      }}
                      className="border border-slate-100 p-4 rounded-2xl hover:border-blue-500 cursor-pointer bg-slate-50/50 space-y-2 text-center"
                    >
                      <h4 className="text-xs font-black text-slate-700">1 Month Package</h4>
                      <p className="text-lg font-black text-slate-950">UGX 20,000</p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Save Listings Access</span>
                    </div>

                    {/* Premium 4 months */}
                    <div
                      onClick={() => {
                        setMomoAmount(60000);
                        setMomoStep('phone');
                      }}
                      className="border border-slate-100 p-4 rounded-2xl hover:border-blue-500 cursor-pointer bg-blue-50/20 border-blue-100 relative text-center space-y-2"
                    >
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase">
                        Best Value
                      </div>
                      <h4 className="text-xs font-black text-blue-700 mt-1">4 Months Package</h4>
                      <p className="text-lg font-black text-blue-950">UGX 60,000</p>
                      <span className="text-[9px] font-bold text-blue-400 uppercase">A full semester</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enter Momopay phone */}
              {(momoStep === 'phone' || momoStep === 'pin') && (
                <form onSubmit={handleMoMoPayment} className="space-y-4 text-xs">
                  <div className="flex items-center justify-around bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMomoProvider('MTN')}
                      className={`flex-1 py-2 text-center rounded-lg font-black uppercase tracking-wider ${
                        momoProvider === 'MTN'
                          ? 'bg-amber-400 text-slate-900 border border-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      MTN MoMo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMomoProvider('Airtel')}
                      className={`flex-1 py-2 text-center rounded-lg font-black uppercase tracking-wider ${
                        momoProvider === 'Airtel'
                          ? 'bg-red-600 text-white border border-red-500'
                          : 'text-slate-400'
                      }`}
                    >
                      Airtel Money
                    </button>
                  </div>

                  {momoStep === 'phone' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Enter Mobile Number</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                          🇺🇬 +256
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="771 234 567"
                          value={momoPhone}
                          onChange={(e) => setMomoPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white text-slate-800 text-sm pl-20 pr-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 shadow-sm font-mono font-semibold"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-center font-semibold">
                        <p className="text-slate-400">Total Charged</p>
                        <p className="text-base font-black text-slate-900 font-mono">
                          UGX {momoAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Enter Mobile Money PIN</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="••••"
                          value={momoPin}
                          onChange={(e) => setMomoPin(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white text-slate-800 text-center tracking-[1.5em] text-lg py-3 rounded-xl border border-slate-100 outline-none focus:border-blue-500 shadow-sm font-mono font-bold"
                        />
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={isPaying}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    {isPaying ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>{momoStep === 'phone' ? 'Verify Number' : 'Pay via Mobile Money'}</span>
                    )}
                  </motion.button>
                </form>
              )}

              {momoStep === 'success' && (
                <div className="text-center py-6 space-y-4 text-xs">
                  <div className="w-12 h-12 bg-green-50 text-green-600 border border-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">Subscription Renewed!</h3>
                    <p className="text-slate-400 leading-relaxed font-semibold">
                      Your platform listing fee was successfully received. Your quota has been extended. Thank you for listing with RoomLynk.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubOpen(false)}
                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider mt-4"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Helper
function ChevronRightIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, MapPin, ShieldAlert, MessageCircle, CreditCard, ChevronRight, Check } from 'lucide-react';
import { HostelListing, Review, User } from '../types';
import { StorageManager } from '../data';

interface ListingDetailProps {
  listing: HostelListing;
  currentUser: User;
  onBack: () => void;
  onStartChat: () => void;
  onBookRoom: () => void;
  onOpenSafety: () => void;
}

export default function ListingDetail({
  listing,
  currentUser,
  onBack,
  onStartChat,
  onBookRoom,
  onOpenSafety,
}: ListingDetailProps) {
  const [activeImage, setActiveImage] = useState(listing.imageUrl);
  const reviews = StorageManager.getReviews().filter((r) => r.listingId === listing.id);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Absolute Hero Header */}
      <div className="relative h-72 w-full bg-slate-200">
        <img
          src={activeImage}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent"></div>

        {/* Floating back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-xs rounded-full border border-white/20 text-slate-800 hover:bg-white shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Image gallery thumbnails */}
      <div className="flex space-x-2 px-6 -mt-8 z-10 overflow-x-auto py-1">
        {listing.images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
              activeImage === img ? 'border-blue-600 shadow-md' : 'border-white'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Details Container */}
      <div className="px-6 mt-6 space-y-6">
        {/* Title Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {listing.area}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{listing.rating}</span>
              <span className="text-slate-400 font-medium">({listing.reviewsCount} reviews)</span>
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 leading-tight">{listing.title}</h1>
          <div className="flex items-center text-slate-500 text-xs font-medium space-x-1">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{listing.locationDetail}</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Price per semester</p>
            <p className="text-lg font-black text-slate-900 mt-1">
              UGX {listing.pricePerSemester.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-green-500 tracking-wider">Availability</p>
            <p className="text-sm font-bold text-slate-700 mt-1 flex items-center justify-end">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              {listing.status}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Description</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {listing.description}
          </p>
        </div>

        {/* Features / Amenities */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Amenities</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {listing.features.map((feat) => (
              <div key={feat} className="flex items-center space-x-2 bg-white border border-slate-100 p-3 rounded-xl shadow-xs">
                <div className="p-1 bg-blue-50 text-blue-600 rounded-md shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-slate-700">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share Visit Safe Alert Panel */}
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start space-x-3 shadow-xs">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Share-My-Visit Service</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              We highly recommend sharing your visiting schedule with a trusted contact before checking out any rooms in person.
            </p>
            <button
              onClick={onOpenSafety}
              className="text-xs text-red-600 font-extrabold hover:underline inline-flex items-center pt-1"
            >
              Set Up Visit Alert <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Simulated Map View of Kabale University Area */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Location Map</h3>
          <div className="h-44 w-full bg-blue-50 border border-blue-100 rounded-2xl overflow-hidden relative shadow-inner">
            {/* Elegant topographical simulation as vector lines */}
            <svg className="absolute inset-0 w-full h-full text-blue-100/40" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,20 Q30,50 100,20" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0,50 Q40,80 100,40" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0,80 Q50,110 100,70" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            
            {/* Campus indicator */}
            <div className="absolute top-1/3 left-1/4 bg-white/95 px-2 py-1 rounded-lg shadow-sm border border-slate-100 text-[9px] font-bold text-slate-600 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              <span>Kabale University</span>
            </div>

            {/* Hostel Location marker */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            >
              <div className="bg-blue-600 text-white px-2.5 py-1 rounded-xl shadow-md border border-white text-[9px] font-black tracking-wide whitespace-nowrap">
                {listing.title}
              </div>
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white shadow-sm mt-0.5"></div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-3.5 pb-8">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Student Reviews</h3>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-extrabold text-slate-800">{rev.studentName}</p>
                    <span className="text-[10px] text-slate-400 font-bold">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-[1.5]" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No reviews yet for this hostel.</p>
          )}
        </div>
      </div>

      {/* Floating Action Buttons Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-between space-x-3 z-30 max-w-md mx-auto shadow-xl">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStartChat}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer text-xs"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          <span>Message</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onBookRoom}
          className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer text-xs shadow-md shadow-blue-500/10"
        >
          <CreditCard className="w-4.5 h-4.5" />
          <span>Book This Room</span>
        </motion.button>
      </div>
    </div>
  );
}

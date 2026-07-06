import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, FileText, ChevronRight } from 'lucide-react';
import { HostelListing, Booking } from '../types';

interface BookingFormProps {
  listing: HostelListing;
  onBack: () => void;
  onSubmit: (moveInDate: string, notes: string) => void;
}

export default function BookingForm({ listing, onBack, onSubmit }: BookingFormProps) {
  const [moveInDate, setMoveInDate] = useState('2026-08-01');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('You must agree to the booking and hostel conditions.');
      return;
    }
    onSubmit(moveInDate, notes);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 bg-white rounded-full border border-slate-100 shadow-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-3 text-sm font-bold text-slate-600">Modify Choice</span>
      </div>

      <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full pb-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Book This Room</h2>
            <p className="text-xs text-slate-400 mt-1">
              Submit an official booking request. Landlord will verify and confirm within 24 hours.
            </p>
          </div>

          {/* Mini listing summary */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex items-center space-x-3.5">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div>
              <h3 className="text-xs font-black text-slate-900">{listing.title}</h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">{listing.locationDetail}</p>
              <p className="text-xs font-black text-blue-600 font-mono mt-1">
                UGX {listing.pricePerSemester.toLocaleString()} / semester
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Move-In Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="date"
                  required
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full bg-white text-slate-800 text-xs pl-11 pr-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 outline-none transition-all font-semibold"
                />
              </div>
            </div>

            {/* Message to Landlord */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Message to Landlord (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 text-slate-400 w-5 h-5" />
                <textarea
                  placeholder="e.g. I am a Kabale University student. I would like to book this room. Please confirm."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-white text-slate-800 text-xs pl-11 pr-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 outline-none transition-all font-semibold resize-none"
                />
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wide">Costs Breakdown</h4>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Room rent (Semester 1)</span>
                <span>UGX {listing.pricePerSemester.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Platform Booking fee</span>
                <span className="text-green-500 font-bold uppercase text-[10px]">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Due</span>
                <span className="text-blue-600 font-mono">
                  UGX {listing.pricePerSemester.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Terms and conditions checking */}
            <label className="flex items-start space-x-3 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4.5 h-4.5 text-blue-600 border-slate-200 rounded-lg focus:ring-blue-500 mt-0.5"
              />
              <span className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                I verify that the move-in schedule is correct and I agree to RoomLynk's landlord interaction protocols and booking terms.
              </span>
            </label>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-1.5 cursor-pointer text-xs uppercase tracking-wider"
            >
              <span>Send Booking Request</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

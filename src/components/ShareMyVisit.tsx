import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ArrowLeft, Send, CheckCircle2, PhoneCall, Calendar } from 'lucide-react';
import { HostelListing } from '../types';

interface ShareMyVisitProps {
  listing: HostelListing;
  onBack: () => void;
}

export default function ShareMyVisit({ listing, onBack }: ShareMyVisitProps) {
  const [contactPhone, setContactPhone] = useState('+256 701 123 456');
  const [visitDate, setVisitDate] = useState('2026-07-06');
  const [visitTime, setVisitTime] = useState('14:30');
  const [isSent, setIsSent] = useState(false);
  const [smsGatewayNotice, setSmsGatewayNotice] = useState<string | null>(null);

  const handleSendAlert = (e: FormEvent) => {
    e.preventDefault();

    const smsMessage = `[Emergency Alert System] RoomLynk Safety: I am visiting "${listing.title}" in ${listing.area} on ${visitDate} at ${visitTime}. Landlord: ${listing.landlordName} (${listing.landlordPhone}). Track me if I don't check back in.`;

    setIsSent(true);

    // Trigger SMS Gateway Simulation Toast
    setTimeout(() => {
      setSmsGatewayNotice(`SMS delivered to Trusted Contact (${contactPhone}): "${smsMessage}"`);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 p-6 relative">
      {/* SMS Gateway Notice Banner */}
      <AnimatePresence>
        {smsGatewayNotice && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-4 left-4 right-4 z-50 bg-slate-900 border border-slate-800 text-white p-4.5 rounded-2xl shadow-2xl flex flex-col space-y-2.5"
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-red-500 rounded-lg shrink-0">
                <ShieldAlert className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-xs font-black tracking-wider uppercase text-red-400">SMS Safety Gateway</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{smsGatewayNotice}</p>
            <button
              onClick={() => setSmsGatewayNotice(null)}
              className="text-right text-[10px] font-bold text-red-400 uppercase tracking-wider hover:underline"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 bg-white rounded-full border border-slate-100 shadow-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-3 text-sm font-bold text-slate-600">Cancel & Go Back</span>
      </div>

      <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Share-My-Visit Safety Service</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Going to visit a property? Keep your loved ones informed. We will send an SMS with the exact room details and landlord contact information.
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSendAlert} className="space-y-4">
              {/* Host details card */}
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-2.5">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Property</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{listing.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{listing.locationDetail}</p>
                  </div>
                </div>
              </div>

              {/* Input for Trusted contact */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trusted Contact Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-1 font-semibold text-slate-500 border-r border-slate-100 pr-2.5">
                    🇺🇬 +256
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="701 123 456"
                    value={contactPhone.replace('+256 ', '')}
                    onChange={(e) => setContactPhone(`+256 ${e.target.value}`)}
                    className="w-full bg-white text-slate-800 text-sm pl-24 pr-4 py-3.5 rounded-xl border border-slate-100 shadow-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono font-medium"
                  />
                </div>
              </div>

              {/* Date & Time fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visit Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-100 shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visit Time</label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="time"
                      required
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-100 shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-red-500/10 flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Send Safety Alert SMS</span>
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-center space-y-4"
            >
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-800">Safety Alert Sent!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We have verified that your trusted contact ({contactPhone}) received the SMS dispatch details with coordinates and landlord contact number.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-left space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Dispatched Record</p>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">
                  "Emergency Alert: I am visiting {listing.title} on {visitDate} at {visitTime}. Contact: {listing.landlordName}."
                </p>
              </div>

              <button
                onClick={onBack}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs"
              >
                Done
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

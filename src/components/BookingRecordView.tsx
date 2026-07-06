import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, Check, Home, GraduationCap, Link2, Printer } from 'lucide-react';
import { Booking } from '../types';

interface BookingRecordViewProps {
  booking: Booking;
  onBack: () => void;
}

export default function BookingRecordView({ booking, onBack }: BookingRecordViewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800 p-6 relative">
      {/* Toast Feedback for Print/Download */}
      <AnimatePresence>
        {downloadSuccess && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-4 right-4 bg-slate-900 border border-slate-800 text-white p-3.5 rounded-xl shadow-xl z-50 flex items-center space-x-2.5"
          >
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-xs font-bold">Booking Receipt Saved to Device Storage!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <div className="flex items-center mb-8 justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-full border border-slate-100 shadow-xs text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black tracking-wider uppercase text-slate-400">Official Record</span>
      </div>

      <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full pb-8">
        {/* Printable/Drawn Receipt Card */}
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden">
          {/* Subtle graphic styling */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-full translate-x-8 -translate-y-8"></div>

          {/* Core Logo header inside receipt */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
            <div className="relative flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-md mb-2">
              <Home className="text-white w-6 h-6" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 p-1 rounded-lg border-2 border-white shadow">
                <GraduationCap className="text-white w-3 h-3" />
              </div>
            </div>
            <h3 className="text-sm font-black text-slate-900 leading-none">RoomLynk Kabale</h3>
            <span className="text-[10px] text-slate-400 font-bold mt-1">Direct Student-Landlord Housing Receipt</span>
          </div>

          {/* Record barcode mockup */}
          <div className="flex flex-col items-center space-y-1.5 pb-4 border-b border-slate-100">
            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Booking Receipt Reference</p>
            <h4 className="text-base font-black text-slate-900 font-mono tracking-wide">{booking.id}</h4>
            
            {/* Simulated Barcode */}
            <div className="h-8 flex items-center justify-center space-x-0.5 mt-2 overflow-hidden opacity-80 select-none">
              <div className="w-1.5 h-8 bg-slate-900"></div>
              <div className="w-0.5 h-8 bg-slate-900"></div>
              <div className="w-1 h-8 bg-slate-900"></div>
              <div className="w-0.5 h-8 bg-slate-900"></div>
              <div className="w-2 h-8 bg-slate-900"></div>
              <div className="w-1 h-8 bg-slate-900"></div>
              <div className="w-0.5 h-8 bg-slate-900"></div>
              <div className="w-1.5 h-8 bg-slate-900"></div>
              <div className="w-0.5 h-8 bg-slate-900"></div>
              <div className="w-1 h-8 bg-slate-900"></div>
              <div className="w-1.5 h-8 bg-slate-900"></div>
              <div className="w-0.5 h-8 bg-slate-900"></div>
              <div className="w-2 h-8 bg-slate-900"></div>
            </div>
          </div>

          {/* Specific Record Fields Grid */}
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Student Tenant</span>
              <span className="font-extrabold text-slate-800 text-right">{booking.studentName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Student Contact</span>
              <span className="font-mono font-bold text-slate-700 text-right">{booking.studentPhone}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Hostel Name</span>
              <span className="font-extrabold text-slate-800 text-right">{booking.hostelTitle}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Accommodation Unit</span>
              <span className="font-extrabold text-slate-800 text-right">{booking.roomType}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Rent Price Rate</span>
              <span className="font-extrabold text-slate-900 font-mono text-right">
                UGX {booking.price.toLocaleString()} / sem
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Check-In Move-In Date</span>
              <span className="font-extrabold text-slate-800 text-right">{booking.moveInDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Booking Timestamp</span>
              <span className="font-bold text-slate-500 text-right">{booking.bookingDate}</span>
            </div>
          </div>

          {/* Footer safety message */}
          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold max-w-[240px] mx-auto">
              Please present this official booking receipt record to the landlord upon check-in. Keep this record in case of any tenancy disputes.
            </p>
          </div>
        </div>

        {/* Action button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer mt-6 shadow-md"
        >
          {isDownloading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Download className="w-4.5 h-4.5" />
              <span>Download Digital Receipt PDF</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

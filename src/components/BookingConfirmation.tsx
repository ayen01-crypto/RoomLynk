import { motion } from 'motion/react';
import { Check, ClipboardList, Home } from 'lucide-react';
import { Booking } from '../types';

interface BookingConfirmationProps {
  booking: Booking;
  onViewRecord: () => void;
  onGoHome: () => void;
}

export default function BookingConfirmation({ booking, onViewRecord, onGoHome }: BookingConfirmationProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto w-full space-y-6">
        {/* Confirmed Celebration Badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/20 border-4 border-white"
        >
          <Check className="w-10 h-10 stroke-[3]" />
        </motion.div>

        {/* Success Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Booking Confirmed!</h2>
          <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">
            Your booking request has been confirmed by the landlord. Secure your record details below.
          </p>
        </div>

        {/* Booking Brief Information */}
        <div className="w-full bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-3.5 text-left">
          <p className="text-[10px] font-black tracking-wider uppercase text-slate-400">Booking Details</p>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span className="text-slate-400">Hostel</span>
              <span className="font-extrabold text-slate-800">{booking.hostelTitle}</span>
            </div>

            <div className="flex justify-between font-semibold text-slate-700">
              <span className="text-slate-400">Room Type</span>
              <span className="font-extrabold text-slate-800">{booking.roomType}</span>
            </div>

            <div className="flex justify-between font-semibold text-slate-700">
              <span className="text-slate-400">Move-In Date</span>
              <span className="font-extrabold text-slate-800">{booking.moveInDate}</span>
            </div>

            <div className="flex justify-between font-semibold text-slate-700">
              <span className="text-slate-400">Price</span>
              <span className="font-extrabold text-blue-600 font-mono">UGX {booking.price.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-semibold text-slate-700 pt-2.5 border-t border-slate-100">
              <span className="text-slate-400">Booking ID</span>
              <span className="font-black text-slate-800 font-mono">{booking.id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onViewRecord}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-blue-500/10"
          >
            <ClipboardList className="w-4.5 h-4.5" />
            <span>View Booking Record</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onGoHome}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Home className="w-4.5 h-4.5" />
            <span>Return to Home</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

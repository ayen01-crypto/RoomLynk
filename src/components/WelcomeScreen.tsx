import { motion } from 'motion/react';
import { Shield, Ban, DollarSign, MapPin, ArrowRight, Home, GraduationCap, Link2 } from 'lucide-react';
import { UserRole } from '../types';

interface WelcomeScreenProps {
  onNext: (role: UserRole) => void;
  onLoginClick: () => void;
}

export default function WelcomeScreen({ onNext, onLoginClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 justify-between p-6">
      {/* Upper Brand Section */}
      <div className="flex flex-col items-center text-center pt-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/10 mb-4"
        >
          <Home className="text-white w-12 h-12 stroke-[1.8]" />
          <div className="absolute -bottom-2 -right-2 bg-amber-500 p-1.5 rounded-xl border-4 border-slate-50 shadow">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Link2 className="text-blue-100/30 w-16 h-16 rotate-45 stroke-[1]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl font-extrabold tracking-tight text-slate-900"
        >
          RoomLynk <span className="text-blue-600">Kabale</span>
        </motion.h1>
        
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider"
        >
          Official Student Housing Portal of Kabale University
        </motion.p>
      </div>

      {/* Trust Badges - Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 gap-4 my-8"
      >
        <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">AGENTS</p>
            <p className="text-sm font-bold text-slate-800">No Brokers</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">COSTS</p>
            <p className="text-sm font-bold text-slate-800">No Hidden Fees</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">TRAVEL</p>
            <p className="text-sm font-bold text-slate-800">No Wasted Trips</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">SAFETY</p>
            <p className="text-sm font-bold text-slate-800">No Scams</p>
          </div>
        </div>
      </motion.div>

      {/* Account Type Selector and Actions */}
      <div className="flex flex-col space-y-6">
        <div className="space-y-3">
          <h3 className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
            Choose your account type
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Landlord selection */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onNext('landlord')}
              className="flex flex-col items-center text-center p-5 bg-white hover:border-blue-500 border border-slate-100 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <Home className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">I am a</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Landlord</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">List your rooms & find tenants</p>
            </motion.button>

            {/* Student selection */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onNext('student')}
              className="flex flex-col items-center text-center p-5 bg-white hover:border-amber-500 border border-slate-100 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">I am a</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Student</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Find your next perfect room</p>
            </motion.button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onLoginClick}
              className="font-bold text-blue-600 hover:underline inline-flex items-center"
            >
              Login <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

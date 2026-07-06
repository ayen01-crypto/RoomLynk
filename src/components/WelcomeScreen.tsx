import { motion } from 'motion/react';
import { Shield, Ban, DollarSign, MapPin, ArrowRight, Home, GraduationCap, Link2 } from 'lucide-react';
import { UserRole } from '../types';

interface WelcomeScreenProps {
  onNext: (role: UserRole) => void;
  onLoginClick: () => void;
}

export default function WelcomeScreen({ onNext, onLoginClick }: WelcomeScreenProps) {
  // Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 280, damping: 22 } 
    },
  };

  const logoVariants = {
    hidden: { scale: 0.3, opacity: 0, rotate: -25 },
    show: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        stiffness: 180, 
        damping: 14,
        duration: 0.7 
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0.85, opacity: 0, y: 15 },
    show: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 240, damping: 18 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col min-h-screen bg-slate-50 text-slate-800 justify-between p-6 relative overflow-hidden"
    >
      {/* Background Animated Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            x: [0, 20, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-16 -left-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.18, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Upper Brand Section */}
      <div className="flex flex-col items-center text-center pt-8 z-10">
        <motion.div
          variants={logoVariants}
          whileHover={{ scale: 1.05, rotate: 3 }}
          className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/15 mb-5 cursor-pointer"
        >
          <Home className="text-white w-12 h-12 stroke-[1.8]" />
          <div className="absolute -bottom-2 -right-2 bg-amber-500 p-1.5 rounded-2xl border-4 border-slate-50 shadow-md">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Link2 className="text-blue-100/25 w-16 h-16 rotate-45 stroke-[1]" />
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-extrabold tracking-tight text-slate-900"
        >
          RoomLynk <span className="text-blue-600">Kabale</span>
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-xs font-bold text-slate-400 mt-1.5 uppercase tracking-wider"
        >
          Official Student Housing Portal of Kabale University
        </motion.p>
      </div>

      {/* Trust Badges - Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-4 my-8 z-10"
      >
        <motion.div 
          variants={badgeVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-xs border border-slate-100"
        >
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider">AGENTS</p>
            <p className="text-sm font-black text-slate-800">No Brokers</p>
          </div>
        </motion.div>

        <motion.div 
          variants={badgeVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-xs border border-slate-100"
        >
          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider">COSTS</p>
            <p className="text-sm font-black text-slate-800">No Extra Fees</p>
          </div>
        </motion.div>

        <motion.div 
          variants={badgeVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-xs border border-slate-100"
        >
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider">TRAVEL</p>
            <p className="text-sm font-black text-slate-800">No Waste Trips</p>
          </div>
        </motion.div>

        <motion.div 
          variants={badgeVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-xs border border-slate-100"
        >
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 tracking-wider">SAFETY</p>
            <p className="text-sm font-black text-slate-800">No Scams</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Actions Section */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-4 z-10">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNext('student')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 cursor-pointer text-sm"
        >
          <span>Continue to Login</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <div className="text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Authorized secure authentication for Kabale University Student Housing.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

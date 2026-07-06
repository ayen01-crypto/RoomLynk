import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Database } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 bg-slate-900 border border-slate-800 text-white p-3 rounded-xl shadow-xl flex items-center justify-between"
        >
          <div className="flex items-center space-x-2.5">
            <WifiOff className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-100">Offline Mode Active</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Using local cached database for bookings and chats.</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800 rounded-lg text-amber-400 font-mono text-[9px] font-bold">
            <Database className="w-3 h-3" />
            <span>PWA LOCAL</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

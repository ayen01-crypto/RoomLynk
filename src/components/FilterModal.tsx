import { motion } from 'motion/react';
import { X, RefreshCw } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  priceRange: number;
  setPriceRange: (price: number) => void;
  roomType: 'All' | 'Single' | 'Double';
  setRoomType: (type: 'All' | 'Single' | 'Double') => void;
  selfContainedOnly: boolean;
  setSelfContainedOnly: (sc: boolean) => void;
  onApply: () => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  selectedArea,
  setSelectedArea,
  priceRange,
  setPriceRange,
  roomType,
  setRoomType,
  selfContainedOnly,
  setSelfContainedOnly,
  onApply,
}: FilterModalProps) {
  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedArea('All Areas');
    setPriceRange(600000);
    setRoomType('All');
    setSelfContainedOnly(false);
  };

  const areas = ['All Areas', 'Kikungiri', 'Nyabikoni', 'Town', 'Rutooma'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-up Container */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl flex flex-col space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-blue-600 flex items-center space-x-1.5 hover:text-blue-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <h3 className="text-base font-extrabold text-slate-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Area Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Area</h4>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    selectedArea === area
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Price Range (UGX per semester)</h4>
              <span className="text-xs font-mono font-bold text-blue-600">
                Up to {priceRange.toLocaleString()} UGX
              </span>
            </div>
            <input
              type="range"
              min={150000}
              max={600000}
              step={20000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
              <span>150,000</span>
              <span>350,000</span>
              <span>600,000+</span>
            </div>
          </div>

          {/* Room Type */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Room Type</h4>
            <div className="grid grid-cols-3 gap-2.5">
              {(['All', 'Single', 'Double'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setRoomType(type)}
                  className={`py-3 rounded-xl text-xs font-bold text-center transition-all duration-150 cursor-pointer ${
                    roomType === type
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type === 'All' ? 'All Types' : `${type} Room`}
                </button>
              ))}
            </div>
          </div>

          {/* Features Toggle */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Preferences</h4>
            <label className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-4 rounded-xl cursor-pointer hover:bg-slate-100 select-none">
              <input
                type="checkbox"
                checked={selfContainedOnly}
                onChange={(e) => setSelfContainedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-slate-200 rounded-sm focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-700">Self Contained Only</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-blue-500/15 cursor-pointer text-sm text-center"
        >
          Apply Filters
        </motion.button>
      </motion.div>
    </div>
  );
}

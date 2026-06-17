import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export default function InsightOverlay() {
  const { activeInsight } = useGameState();

  return (
    <div className="absolute right-6 top-36 sm:top-44 md:top-48 w-80 z-50 pointer-events-none h-sm:top-24 h-sm:right-4 h-sm:w-60 h-xs:top-20 h-xs:right-2 h-xs:w-52">
      <AnimatePresence>
        {activeInsight && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            className="bg-emerald-50 border-[3px] border-slate-800 p-4 rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] h-sm:p-3 h-sm:rounded-xl h-xs:p-2 h-xs:rounded-lg"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Star className="inline w-3 h-3 sm:w-4 sm:h-4 text-amber-400 mr-1" fill="currentColor" />
              <p className="text-xs font-black uppercase tracking-wider text-emerald-700 h-sm:text-[0.65rem] h-xs:text-[0.55rem]">
                Mascot Tip
              </p>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed h-sm:text-[0.75rem] h-sm:leading-tight h-xs:text-[0.65rem] h-xs:leading-[1.2]">
              {activeInsight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
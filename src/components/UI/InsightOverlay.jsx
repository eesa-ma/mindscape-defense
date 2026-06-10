import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export default function InsightOverlay() {
  const { activeInsight } = useGameState();

  return (
    <div className="insight-overlay absolute right-6 top-24 w-80 z-50 pointer-events-none">
      <style>{`
        @media (max-height: 640px) {
          .insight-overlay {
            top: 4rem !important;
            right: 0.5rem !important;
            width: 15rem !important;
          }
          .insight-overlay-card {
            padding: 0.75rem !important;
            border-radius: 1rem !important;
          }
          .insight-overlay-title {
            font-size: 0.65rem !important;
          }
          .insight-overlay-text {
            font-size: 0.75rem !important;
            line-height: 1.25 !important;
          }
        }
        @media (max-height: 480px) {
          .insight-overlay {
            top: 3.25rem !important;
            right: 0.375rem !important;
            width: 13rem !important;
          }
          .insight-overlay-card {
            padding: 0.5rem !important;
            border-radius: 0.75rem !important;
          }
          .insight-overlay-title {
            font-size: 0.55rem !important;
          }
          .insight-overlay-text {
            font-size: 0.65rem !important;
            line-height: 1.2 !important;
          }
        }
      `}</style>
      <AnimatePresence>
        {activeInsight && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            className="insight-overlay-card bg-emerald-50 border-[3px] border-slate-800 p-4 rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)]"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-sm">⭐</span>
              <p className="insight-overlay-title text-xs font-black uppercase tracking-wider text-emerald-700">
                Mascot Tip
              </p>
            </div>
            <p className="insight-overlay-text text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {activeInsight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
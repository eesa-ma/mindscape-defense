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
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="insight-overlay-card bg-white/90 backdrop-blur-md border border-emerald-300 p-4 rounded-2xl shadow-xl shadow-slate-200/20"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="insight-overlay-title text-xs font-bold uppercase tracking-wider text-emerald-700 font-sans">
                Mindscape Insight
              </p>
            </div>
            <p className="insight-overlay-text text-sm text-slate-700 leading-relaxed font-sans font-medium">
              {activeInsight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
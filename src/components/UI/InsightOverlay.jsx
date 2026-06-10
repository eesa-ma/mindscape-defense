import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';

export default function InsightOverlay() {
  const { activeInsight } = useGameState();

  return (
    <div className="absolute right-6 top-24 w-80 z-50 pointer-events-none">
      <AnimatePresence>
        {activeInsight && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="bg-white/10 backdrop-blur-md border border-emerald-500/30 p-4 rounded-xl shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Mindscape Insight
              </p>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {activeInsight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
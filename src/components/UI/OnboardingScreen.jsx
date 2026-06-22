import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { requestFullscreen } from '../../utils/fullscreen';
import { Heart, Cloud, Star } from 'lucide-react';

export default function OnboardingScreen() {
  const { gameStatus, completeOnboarding } = useGameState();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (gameStatus !== 'onboarding') return null;

  const slides = [
    {
      title: "The Mindscape",
      image: "/images/onboarding/slide_1.png",
      content: (
        <p className="text-slate-600 font-medium text-sm sm:text-base md:text-lg leading-relaxed text-center h-sm:text-xs">
          Welcome to your <span className="font-bold text-indigo-600">Mindscape</span> — a living reflection of your inner world. It is shaped by your memories, experiences, hopes, and connections. While it may seem peaceful, challenges can emerge from the fog and threaten the balance within.
        </p>
      )
    },
    {
      title: "Defend & Cope",
      image: "/images/onboarding/slide_2.png",
      content: (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-slate-600 font-medium text-sm sm:text-base md:text-lg leading-relaxed text-center h-sm:text-xs">
            Challenges such as <span className="font-bold text-rose-500">Negative Thoughts</span>, <span className="font-bold text-amber-500">Burnout</span>, <span className="font-bold text-slate-500">Isolation</span>, and <span className="font-bold text-purple-500">Social Rejection</span> will approach your Mindscape.
          </p>
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3 sm:p-4 w-full">
            <p className="text-slate-600 font-bold text-xs sm:text-sm text-center">
              Counter them by selecting the most effective coping strategy from the dock before they weaken your <span className="text-pink-500 font-black">Connection</span>.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Grow Stronger",
      image: "/images/onboarding/slide_3.png",
      content: (
        <div className="flex flex-col gap-3 h-sm:gap-2">
          <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed text-center h-sm:text-xs">
            Every challenge overcome strengthens your Mindscape. As you progress, you'll unlock new coping mechanisms and face more complex situations. Maintain your Connection Meter, push back the fog, and learn how small positive actions can make a meaningful difference.
          </p>
          
          <ul className="bg-indigo-50 border-2 border-indigo-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold text-indigo-900 flex flex-col gap-2 h-sm:text-[0.65rem] h-sm:p-2 h-xs:text-[0.6rem]">
            <li className="flex items-center"><Heart className="inline w-4 h-4 text-rose-500 mr-2" fill="currentColor" /> Keep your Connection Meter above zero</li>
            <li className="flex items-center"><Cloud className="inline w-4 h-4 text-slate-400 mr-2" /> Prevent loneliness from consuming the Mindscape</li>
            <li className="flex items-center"><Star className="inline w-4 h-4 text-amber-500 mr-2" fill="currentColor" /> Earn points by making healthy choices</li>
          </ul>

          <p className="text-center italic font-bold text-slate-500 mt-2 text-xs sm:text-sm h-sm:text-[0.65rem] h-sm:mt-0">
            "The strongest defenses are built one positive choice at a time."
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    requestFullscreen();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-[#ffe4e6] via-[#ffd3b6] to-[#dbeafe] select-none pointer-events-auto z-50 p-4">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-300/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-300/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-2xl bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_rgba(30,41,59,1)] flex flex-col items-center max-h-[95vh] h-sm:max-h-[92vh] h-sm:p-4 h-sm:w-[95%] h-xs:p-3 overflow-hidden">
        
        {/* Progress Dots */}
        <div className="flex gap-2 mb-6 h-sm:mb-3">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full border-2 border-slate-800 transition-all duration-300 h-sm:w-2.5 h-sm:h-2.5 ${i === currentSlide ? 'bg-indigo-500 scale-125' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        {/* Carousel Content */}
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full min-h-0"
            >
              <div className="w-full max-w-48 sm:max-w-64 mb-4 sm:mb-6 h-sm:max-w-32 h-sm:mb-3 h-xs:max-w-24 animate-cloud-bob relative shrink min-h-0 flex justify-center">
                <div className="absolute inset-4 bg-indigo-200/50 rounded-full filter blur-xl animate-pulse"></div>
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-contain max-h-[30vh] drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500 ease-out mix-blend-multiply rounded-3xl"
                  style={{ maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)' }}
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4 h-sm:text-lg h-sm:mb-2 text-center uppercase tracking-tight">
                {slides[currentSlide].title}
              </h1>
              
              <div className="w-full">
                {slides[currentSlide].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex gap-4 mt-8 h-sm:mt-4 h-xs:mt-3 shrink-0">
          {currentSlide > 0 ? (
            <button
              onClick={handleBack}
              className="flex-1 py-3 h-sm:py-2 bg-slate-200 hover:bg-slate-300 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer h-sm:text-xs h-sm:rounded-xl"
            >
              Back
            </button>
          ) : (
            <div className="flex-1" /> // Placeholder to keep Next button on the right
          )}
          
          <button
            onClick={handleNext}
            className="flex-1 py-3 h-sm:py-2 bg-indigo-400 hover:bg-indigo-500 border-[3px] border-slate-800 text-white font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer h-sm:text-xs h-sm:rounded-xl"
          >
            {currentSlide === slides.length - 1 ? 'Begin Journey' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

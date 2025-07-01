"use client"

import { UserPlus, Lightbulb, Search, FileText, Code, ChevronRight, ChevronLeft } from "lucide-react"
import React from "react"

const steps = [
  {
    icon: UserPlus,
    title: "1. Sign Up & Get Started",
    description:
      "Create an account in seconds and receive free credits to start your research journey.",
    colorName: "blue-500",
  },
  {
    icon: Lightbulb,
    title: "2. Generate Novel Ideas",
    description:
      "Leverage our powerful AI to generate unique research ideas across various domains.",
    colorName: "purple-500",
  },
  {
    icon: Search,
    title: "3. Explore and Refine",
    description:
      "Analyze your ideas, check novelty scores, and refine them with our interactive research assistant.",
    colorName: "green-500",
  },
  {
    icon: FileText,
    title: "4. Draft Research Papers",
    description:
      "Effortlessly generate well-structured research papers from your ideas, complete with citations.",
    colorName: "orange-500",
  },
  {
    icon: Code,
    title: "5. Implement and Experiment",
    description:
      "Generate code to implement your research concepts and run experiments to validate your findings.",
    colorName: "red-500",
  },
];

const HowItWorks = () => {
  const [current, setCurrent] = React.useState(1); // Start at the first "real" slide
  const [isTransitioning, setIsTransitioning] = React.useState(true);

  // Create a new array for infinite loop effect
  const displaySteps = React.useMemo(() => [steps[steps.length - 1], ...steps, steps[0]], []);

  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrent(prev => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrent(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (current <= 0) { // Was on cloned last
      setIsTransitioning(false);
      setCurrent(steps.length); // Jump to real last slide
    } else if (current >= displaySteps.length - 1) { // Was on cloned first
      setIsTransitioning(false);
      setCurrent(1); // Jump to real first slide
    }
  };

  // This effect re-enables transitions after a jump
  React.useEffect(() => {
    if (!isTransitioning) {
      // A microtask (Promise) or rAF is needed to allow React to re-render with the new `current`
      // before we re-enable transitions.
      Promise.resolve().then(() => setIsTransitioning(true));
    }
  }, [isTransitioning]);

  // Card color map for dark metallic backgrounds
  const cardBg = {
    'blue-500': 'from-[#2c3a57] via-[#394a6b] to-[#2c3a57]',
    'purple-500': 'from-[#3a2c57] via-[#4a396b] to-[#3a2c57]',
    'green-500': 'from-[#2c573a] via-[#396b4a] to-[#2c573a]',
    'orange-500': 'from-[#573a2c] via-[#6b4a39] to-[#573a2c]',
    'red-500': 'from-[#572c2c] via-[#6b3939] to-[#572c2c]',
  };

  // Fixed card size for all cards
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 520;
  const CARD_GAP = 32; // Corresponds to sm:gap-8 -> 2rem -> 32px

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 sm:py-32 bg-gray-950"
    >
      {/* Hero-style glowing background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'radial-gradient(circle at top center, rgba(124, 58, 237, 0.12) 0%, rgba(79, 70, 229, 0.06) 25%, rgba(59, 130, 246, 0.02) 50%, rgba(17, 24, 39, 0) 80%)',
        zIndex: 0,
      }}>
        {/* Top center main glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%', 
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, rgba(91, 33, 182, 0.1) 40%, rgba(17, 24, 39, 0) 80%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }} />
        
        {/* Accent color glows */}
        <div style={{
          position: 'absolute',
          top: '-5%',
          left: '60%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(219, 39, 119, 0.12) 0%, rgba(17, 24, 39, 0) 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '40%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(17, 24, 39, 0) 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }} />

        {/* Noise texture overlay for premium feel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          opacity: 0.03,
          mixBlendMode: 'overlay',
          zIndex: 1,
        }} />
      </div>

      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(to right, rgba(31, 41, 55, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(31, 41, 55, 0.5) 1px, transparent 1px)',
        backgroundSize: '6rem 4rem',
        zIndex: 0,
        opacity: 0.4,
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            A streamlined process to take your research from idea to execution.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center">
          {/* Left arrow */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-0 z-20 h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>

          <div className="w-full overflow-visible py-8">
            <div 
              className="flex items-center sm:gap-8"
              style={{
                  transform: `translateX(calc(50% - ${current * (CARD_WIDTH + CARD_GAP)}px - ${CARD_WIDTH / 2}px))`,
                  transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {displaySteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === current;
                // Dark metallic background and subtle glow
                const bgGradient = cardBg[step.colorName] || 'from-gray-800 via-gray-900 to-gray-950';
                return (
                  <div
                    key={index}
                    className={`group relative flex-shrink-0 transition-all duration-500 ease-in-out px-1 sm:px-0 ${isActive ? 'z-10' : 'z-0'}`}
                    style={{
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT,
                      maxWidth: '90vw',
                      opacity: isActive ? 1 : 0.6,
                      transform: isActive ? 'scale(1.05)' : 'scale(0.92)',
                      transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    <div
                      className={`relative flex w-full h-full flex-col overflow-hidden rounded-3xl ring-2 ring-white/20 bg-gradient-to-br ${bgGradient} backdrop-blur-xl p-8 sm:p-10 transition-all duration-500 min-h-[480px] min-w-0`}
                      style={{
                        boxShadow: isActive ? 
                          `0 0 30px 2px rgba(${step.colorName === 'blue-500' ? '59, 130, 246' : 
                            step.colorName === 'purple-500' ? '168, 85, 247' : 
                            step.colorName === 'green-500' ? '34, 197, 94' : 
                            step.colorName === 'orange-500' ? '251, 146, 60' : 
                            step.colorName === 'red-500' ? '239, 68, 68' : '255, 255, 255'}, 0.25)` : 
                          'none'
                      }}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-500 ${
                          isActive ? 'opacity-40' : 'opacity-20'
                        }`}
                      />
                      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-4 text-7xl font-bold text-white/50">
                          {step.title.split('.')[0]}
                        </div>
                        <h3 className="mb-2 text-2xl font-semibold text-white">
                          {step.title.split('. ')[1]}
                        </h3>
                        <p className="text-base text-slate-200">
                          {step.description}
                        </p>
                      </div>
                      {/* ghost icon */}
                      <div className="pointer-events-none absolute -bottom-12 -right-8 text-white/10 transition-opacity duration-300 group-hover:text-white/15">
                        <Icon className="h-40 w-40 sm:h-48 sm:w-48" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 z-20 h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
"use client"

import { useEffect, useRef, useCallback } from "react"
import { Star } from "lucide-react"
import "./testimonial-card.css"

const testimonials = [
  {
    name: "Dr. Evelyn Reed",
    title: "AI Researcher, Tech University",
    quote: "IdeaVerse has transformed my research process. The ability to rapidly generate and validate ideas has saved me countless hours. It's an indispensable tool for any serious researcher.",
  },
  {
    name: "Johnathan Chen",
    title: "PhD Candidate, Institute of Science",
    quote: "As a PhD student, the novelty assessment feature is a game-changer. It helps me ensure my work is original and impactful. I can't imagine writing a paper without it now.",
  },
  {
    name: "Maria Garcia",
    title: "Professor of Computer Science",
    quote: "I've introduced IdeaVerse to my entire lab. The collaborative features and streamlined workflow have significantly boosted our productivity and the quality of our research output.",
  },
]

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const TestimonialCard = ({ name, title, quote }) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  
  const updateCardTransform = useCallback((offsetX, offsetY, card, wrap) => {
    const width = card.clientWidth;
    const height = card.clientHeight;

    const percentX = clamp((100 / width) * offsetX);
    const percentY = clamp((100 / height) * offsetY);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
      "--pointer-x": `${percentX}%`,
      "--pointer-y": `${percentY}%`,
      "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      "--pointer-from-left": `${percentX / 100}`,
      "--pointer-from-top": `${percentY / 100}`,
      "--card-opacity": "1",
      "--rotate-x": `${round(-(centerX / 5))}deg`,
      "--rotate-y": `${round(centerY / 4)}deg`,
    };

    Object.entries(properties).forEach(([property, value]) => {
      wrap.style.setProperty(property, value);
    });
  }, []);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const rect = card.getBoundingClientRect();
    updateCardTransform(
      event.clientX - rect.left,
      event.clientY - rect.top,
      card,
      wrap
    );
  }, [updateCardTransform]);

  const handlePointerLeave = useCallback((event) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    // Reset transform
    wrap.style.setProperty("--card-opacity", "0");
    wrap.style.setProperty("--rotate-x", "0deg");
    wrap.style.setProperty("--rotate-y", "0deg");
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return (
    <div ref={wrapRef} className="card-wrapper">
      <div 
        ref={cardRef} 
        className="card-content bg-gradient-to-br from-purple-500/5 via-blue-400/10 to-cyan-300/5 rounded-2xl p-6 h-full relative overflow-hidden transition-all duration-300 backdrop-blur-sm border border-white/10 dark:border-white/5 shadow-xl"
        style={{
          transform: "translate3d(0, 0, 0.1px) rotateX(var(--rotate-y, 0deg)) rotateY(var(--rotate-x, 0deg))"
        }}
      >
        <div className="card-glow absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-400/5 to-cyan-300/10 opacity-0 transition-opacity duration-300" 
          style={{ opacity: "var(--card-opacity, 0)" }}/>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 blur-2xl rounded-full bg-blue-500/20 z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 blur-3xl rounded-full bg-purple-500/20 z-0"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200 via-transparent to-transparent dark:from-indigo-900/20 dark:via-transparent dark:to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h4 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-blue-400 mb-2">
                {name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{title}</p>
              <blockquote className="text-gray-700 dark:text-gray-200">
                <p>"{quote}"</p>
              </blockquote>
            </div>
            
            <div className="flex items-center mt-6 pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-950 relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-gray-950 dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_100%,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_100%,#0c2144,transparent)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Loved by Researchers Worldwide</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what leading academics and innovators are saying about IdeaVerse.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              name={testimonial.name}
              title={testimonial.title}
              quote={testimonial.quote}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials 
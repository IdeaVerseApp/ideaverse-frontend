"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Lightbulb, 
  SearchCode, 
  FileText, 
  BarChart4, 
  Brain, 
  Sparkles, 
  ArrowRight,
  Star,
  GitMerge,
  Scale,
  Check,
  Layers,
  BookOpen,
  BarChart3
} from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { useInView } from 'framer-motion';

// Custom animations
const customAnimations = `
@keyframes float-subtle {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 0.5rem rgba(59, 130, 246, 0.1)); }
  50% { filter: drop-shadow(0 0 2rem rgba(59, 130, 246, 0.3)); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes shimmer {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

.animate-float-subtle {
  animation: float-subtle 6s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

.animate-gradient-shift {
  animation: gradient-shift 8s ease infinite;
  background-size: 200% 200%;
}

.animate-spin-slow {
  animation: spin-slow 15s linear infinite;
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 2.5s infinite linear;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  background-size: 200% 100%;
}

.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  background-size: 200% auto;
  animation: gradient-shift 8s ease infinite;
}

.card-hover-effect {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.card-hover-effect:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.1), 0 5px 15px rgba(99, 102, 241, 0.05);
}

.glow-on-hover:hover {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}
`

// Annotation component with different sizes
interface AnnotationProps {
  text: string;
  className?: string;
  size?: 'sm' | 'base' | 'lg';
}

const Annotation: React.FC<AnnotationProps> = ({ text, className = '', size = 'base' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    base: 'text-xl',
    lg: 'text-2xl'
  };
  
  return (
    <div className={`absolute font-caveat ${sizeClasses[size]} text-black dark:text-white pointer-events-none drop-shadow-sm ${className}`}>
      <p className="leading-tight">{text}</p>
    </div>
  );
};

// Curved Arrow component
interface CurvedArrowProps {
  className?: string;
  type?: 'curved' | 'straight' | 'looped' | 'zigzag';
}

const CurvedArrow: React.FC<CurvedArrowProps> = ({ className = '', type = 'curved' }) => {
  // Different path types for variety
  const paths = {
    curved: "M10,90 Q50,10 90,50",
    straight: "M10,90 L90,10",
    looped: "M10,50 C30,10 70,10 90,50",
    zigzag: "M10,90 L30,50 L50,70 L70,30 L90,10"
  };
  
  return (
    <svg className={`absolute w-32 h-32 text-blue-500 dark:text-amber-300 pointer-events-none opacity-80 ${className}`} 
         viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={paths[type]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
            strokeDasharray="4 4" markerEnd="url(#arrowhead)" />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Custom hook for scroll animations
function useAnimateOnScroll() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return { ref, isInView };
}

// Section title component
interface SectionTitleProps {
  title: string;
  subtitle: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
  const { ref, isInView } = useAnimateOnScroll();
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{subtitle}</p>
    </motion.div>
  );
}

// Process step component
interface ProcessStepProps {
  number: string | number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  isLast?: boolean;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ number, title, description, icon: Icon, color, isLast = false }) => {
  const { ref, isInView } = useAnimateOnScroll();
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="flex"
    >
      <div className="flex flex-col items-center mr-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} text-white font-bold text-xl mb-2`}>
          {number}
        </div>
        {!isLast && <div className="w-0.5 grow bg-gray-200 dark:bg-gray-700"></div>}
      </div>
      <div className="pb-12">
        <div className="flex items-center mb-2">
          <Icon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      </div>
    </motion.div>
  );
}

// Card component for reflection method
interface ReflectionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  delay?: number;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({ title, description, icon: Icon, delay = 0 }) => {
  const { ref, isInView } = useAnimateOnScroll();
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ delay }}
      className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/80 dark:border-gray-700/50 rounded-xl"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100/70 dark:bg-blue-900/30 rounded-lg mr-3">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

// Score card component
interface ScoreCardProps {
  title: string;
  description: string;
  color: string;
  icon: React.ElementType;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, description, color, icon: Icon }) => {
  const { ref, isInView } = useAnimateOnScroll();
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className={`rounded-xl p-6 shadow-lg border-t-4 ${color} bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100/70 dark:bg-blue-900/30 rounded-lg mr-3">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

// Paper sources SVG diagram
const PaperSourcesDiagram = () => {
  const { ref, isInView } = useAnimateOnScroll();
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="flex justify-center my-12 relative"
    >
      <svg width="800" height="320" viewBox="0 0 800 320" className="max-w-full h-auto">
        {/* Center hub */}
        <circle cx="400" cy="160" r="60" fill="#3B82F6" className="dark:fill-blue-700" />
        <text x="400" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">IdeaVerse</text>
        
        {/* Connectors */}
        <path d="M 120 70 Q 250 110, 345 160" stroke="#D4A017" strokeWidth="4" fill="transparent" />
        <path d="M 120 160 Q 250 160, 340 160" stroke="#D4A017" strokeWidth="4" fill="transparent" />
        <path d="M 120 250 Q 250 210, 345 160" stroke="#D4A017" strokeWidth="4" fill="transparent" />
        <path d="M 675 160 L 460 160" stroke="#3B82F6" strokeWidth="4" fill="transparent" />
        <path d="M 120 120 Q 250 140, 345 160" stroke="#D4A017" strokeWidth="4" fill="transparent" />
        <path d="M 120 200 Q 250 180, 345 160" stroke="#D4A017" strokeWidth="4" fill="transparent" />
        
        {/* Source nodes */}
        <rect x="40" y="50" width="80" height="40" rx="8" fill="#1E293B" stroke="#D4A017" strokeWidth="2" />
        <text x="80" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12">ArXiv</text>
        
        <rect x="40" y="140" width="80" height="40" rx="8" fill="#1E293B" stroke="#D4A017" strokeWidth="2" />
        <text x="80" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="12">IEEE</text>
        
        <rect x="40" y="230" width="80" height="40" rx="8" fill="#1E293B" stroke="#D4A017" strokeWidth="2" />
        <text x="80" y="255" textAnchor="middle" fill="#FFFFFF" fontSize="12">Scopus</text>
        
        <rect x="40" y="100" width="80" height="40" rx="8" fill="#1E293B" stroke="#D4A017" strokeWidth="2" />
        <text x="80" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="12">Google Scholar</text>
        
        <rect x="40" y="180" width="80" height="40" rx="8" fill="#1E293B" stroke="#D4A017" strokeWidth="2" />
        <text x="80" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="12">Semantic Scholar</text>
        
        {/* Output node */}
        <rect x="675" y="140" width="80" height="40" rx="8" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" />
        <text x="715" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="12">Novel Ideas</text>
      </svg>
    </motion.div>
  );
}

// Workflow diagram
const WorkflowDiagram = () => {
  const { ref, isInView } = useAnimateOnScroll();
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="my-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Lightbulb className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-2" />
          <h3 className="text-lg font-bold text-center">Seeding</h3>
          <p className="text-sm text-center">User input & initial ideas</p>
        </div>
        
        <ArrowRight className="w-8 h-8 text-gray-400 dark:text-gray-600 transform rotate-90 md:rotate-0" />
        
        <div className="flex flex-col items-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <SearchCode className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-2" />
          <h3 className="text-lg font-bold text-center">Literature Context</h3>
          <p className="text-sm text-center">Semantic search of papers</p>
        </div>
        
        <ArrowRight className="w-8 h-8 text-gray-400 dark:text-gray-600 transform rotate-90 md:rotate-0" />
        
        <div className="flex flex-col items-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <GitMerge className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-2" />
          <h3 className="text-lg font-bold text-center">Reflection</h3>
          <p className="text-sm text-center">Critical review & refinement</p>
        </div>
        
        <ArrowRight className="w-8 h-8 text-gray-400 dark:text-gray-600 transform rotate-90 md:rotate-0" />
        
        <div className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <BarChart4 className="w-10 h-10 text-green-600 dark:text-green-400 mb-2" />
          <h3 className="text-lg font-bold text-center">Evaluation</h3>
          <p className="text-sm text-center">Multi-faceted scoring</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorksPage() {
  // Add the custom animations to the document
  React.useEffect(() => {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(customAnimations))
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <MainLayout initialSidebarOpen={false}>
      <div className="relative">
        {/* Background Elements with floating tablets */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20"></div>
          
          {/* Animated Orbs/Tablets */}
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-200 dark:bg-blue-900/40 rounded-2xl blur-3xl animate-pulse-glow opacity-30"></div>
          <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/40 rounded-2xl blur-3xl animate-float-subtle opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-900/40 rounded-2xl blur-3xl animate-spin-slow opacity-10"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Circular Pattern */}
          <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 dark:opacity-[0.02]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="400" cy="400" r="100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>
        
        {/* Full page background - original, keeping for backup */}
        <div className="fixed inset-0 -z-20 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-gray-950 dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#0c2144,transparent)]"></div>
        </div>
        
        {/* Hero section */}
        <div className="relative pt-24 pb-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            {/* Nest annotation + arrow relative to the heading for stable positioning */}
            <div className="mx-auto max-w-3xl text-center relative">
              {/* Annotation */}
              <Annotation 
                text="The magic unveiled!" 
                className="absolute -top-12 left-0 -rotate-6 sm:-top-14 md:-top-16 lg:-top-20" 
                size="lg" 
              />
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                The Genius Behind <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 animate-gradient-shift">
                  IdeaVerse
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                Unraveling our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-gradient-shift">sophisticated system</span> that transforms sparks of curiosity into 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 animate-gradient-shift"> groundbreaking research ideas</span>.
              </p>
            </div>
          </div>
        </div>
        
        {/* Core principles section */}
        <section className="relative py-16 bg-gray-50/70 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="relative">
              <SectionTitle 
                title="Core Principles" 
                subtitle="The foundation of our intellectual alchemy is built on two guiding philosophies." 
              />
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mt-16">
              <div className="relative">
                <motion.div 
                  variants={fadeIn}
                  className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 h-full"
                >
                  <div className="bg-blue-100/80 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4">
                    <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">AI-Human Synergy</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We use AI to augment human creativity, not replace it. The process starts with a 
                    human-provided "seed" concept and uses AI to explore, expand, and challenge that initial thought.
                  </p>
                </motion.div>
              </div>
              
              <div className="relative">
                <motion.div 
                  variants={fadeIn}
                  className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 h-full"
                >
                  <div className="bg-purple-100/80 dark:bg-purple-900/30 p-3 rounded-full w-fit mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Critical Self-Reflection</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    A good idea is rarely born fully formed. Our system mimics the scientific process of peer review 
                    and refinement by forcing ideas to undergo several rounds of critical self-reflection.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Workflow overview section */}
        <section className="relative py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionTitle 
              title="The Idea Generation Workflow" 
              subtitle="Our intellectual engine operates through three distinct phases: Ideation, Reflection, and Evaluation." 
            />
            
            <div className="relative">
              <WorkflowDiagram />
            </div>
            
            <div className="mt-20 relative">
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">The Scientific Journey</h3>
              
              <div className="max-w-3xl mx-auto relative">
                
                <ProcessStep 
                  number="1" 
                  title="Spark of Inspiration" 
                  description="From your seed idea, our AI artisans craft multiple diverse concepts, each structured as a detailed JSON object with titles, descriptions, targeted research questions, and relevant keywords."
                  icon={Lightbulb}
                  color="bg-blue-600"
                />
                
                <div className="relative">
                  
                  <ProcessStep 
                    number="2" 
                    title="Academic Contextualization" 
                    description="Our system conducts a sophisticated semantic search across vast academic landscapes to identify relevant existing research, providing crucial context for refinement."
                    icon={BookOpen}
                    color="bg-indigo-600"
                  />
                </div>
                
                <div className="relative">
                  <PaperSourcesDiagram />
                </div>
                
                <div className="relative">
                  
                  <ProcessStep 
                    number="3" 
                    title="Intellectual Crucible" 
                    description="Each idea undergoes rigorous examination where our AI assumes the role of a critical peer reviewer, identifying gaps and suggesting precision-targeted improvements."
                    icon={GitMerge}
                    color="bg-purple-600"
                  />
                </div>
                
                <div className="relative">
                  
                  <ProcessStep 
                    number="4" 
                    title="Multidimensional Analysis" 
                    description="The refined concepts undergo comprehensive evaluation across four key dimensions: Novelty, Feasibility, Impact, and Overall Academic Merit."
                    icon={BarChart4}
                    color="bg-green-600"
                    isLast={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Reflection method section */}
        <section className="relative py-20 bg-gray-50/70 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionTitle 
              title="The Reflection Method" 
              subtitle="Our proprietary refinement process combines critical scrutiny with creative enhancement." 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              <div className="relative">
                <ReflectionCard 
                  title="Critical Examination"
                  description="Our AI adopts the persona of an exacting academic reviewer, meticulously analyzing ideas against the backdrop of similar published works."
                  icon={Brain}
                  delay={0.1}
                />
              </div>
              
              <div className="relative">
                <ReflectionCard 
                  title="Precision Enhancement"
                  description="With surgical precision, the system identifies conceptual weaknesses, novelty gaps, and methodological limitations, then prescribes targeted improvements."
                  icon={GitMerge}
                  delay={0.2}
                />
              </div>
              
              <div className="relative">
                <ReflectionCard 
                  title="Evolutionary Refinement"
                  description="Each iteration builds upon its predecessor, allowing ideas to evolve through multiple cycles until they achieve optimal clarity, originality, and academic rigor."
                  icon={Layers}
                  delay={0.3}
                />
              </div>
            </div>
            
            <div className="mt-16 max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 relative">
              
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">The Crucible of Excellence</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Analysis:</strong> Each concept undergoes meticulous examination against relevant literature discovered in our academic exploration.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Critique:</strong> Conceptual vulnerabilities, redundancies, and practical constraints are precisely identified.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Refinement:</strong> Strategic enhancements are proposed to elevate novelty, strengthen methodology, and amplify potential impact.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Iteration:</strong> The refinement cycle continues until optimal quality is achieved, typically requiring 2-3 precision-focused iterations.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Scoring section */}
        <section className="relative py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionTitle 
              title="Rigorous Evaluation Framework" 
              subtitle="Each idea is subjected to a comprehensive assessment across four critical dimensions." 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="relative">
                <ScoreCard 
                  title="Novelty Quotient"
                  description="A sophisticated measurement of originality derived from semantic distance analysis and expert AI evaluation of the concept's uniqueness relative to existing literature."
                  color="border-blue-500"
                  icon={Sparkles}
                />
              </div>
              
              <div className="relative">
                <ScoreCard 
                  title="Implementation Viability"
                  description="A thorough assessment of practical feasibility considering methodological soundness, resource requirements, and technical constraints that might affect execution."
                  color="border-green-500"
                  icon={Scale}
                />
              </div>
              
              <div className="relative">
                <ScoreCard 
                  title="Impact Potential"
                  description="A calibrated estimation of how the research might advance its field, address significant challenges, or catalyze new research trajectories within the academic landscape."
                  color="border-purple-500"
                  icon={Star}
                />
              </div>
              
              <div className="relative">
                <ScoreCard 
                  title="Academic Reception Forecast"
                  description="A holistic evaluation simulating peer review outcomes by synthesizing novelty, feasibility, and impact metrics alongside contextual analysis of the research domain."
                  color="border-amber-500"
                  icon={BarChart3}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Final output section */}
        <section className="relative py-16 bg-gray-50/70 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionTitle 
              title="The Intellectual Harvest" 
              subtitle="The culmination of our sophisticated process" 
            />
            
            <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 relative">
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Our process culminates in a collection of meticulously refined research concepts, each accompanied by:
              </p>
              
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      A comprehensive analytical breakdown across all evaluation dimensions
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Detailed rationales behind each assigned metric, providing full intellectual transparency
                    </p>
                  </div>
                </li>
                <li className="flex relative">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      A curated bibliography of relevant academic works to serve as your foundational research scaffold
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Architecturally sound conceptual frameworks ready for expansion into full research programs
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

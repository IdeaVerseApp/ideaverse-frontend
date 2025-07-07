"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Linkedin, Github, Code, Server, Database, Award, ArrowRight, Star, Heart, Sparkles, Coffee, Lightbulb } from "lucide-react"
import { useInView } from "framer-motion"
import MainLayout from "@/components/layouts/MainLayout"

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

// Reusable animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
}

const fadeInRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

// Use this hook to track if element is in view
function useAnimateOnScroll() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  return { ref, isInView }
}

// Enhanced team member card with hover effects
const TeamMemberCard = ({ name, role, image, linkedin, isHighlighted = false, skills = [] }) => {
  const { ref, isInView } = useAnimateOnScroll()
  
  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="relative group"
    >
      <div className={`relative overflow-hidden rounded-xl ${isHighlighted ? 'bg-gradient-to-b from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40' : 'bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900'} p-6 transition-all duration-300 
                    hover:shadow-xl dark:hover:shadow-blue-900/10 transform hover:-translate-y-2 card-hover-effect ${isHighlighted ? 'border-2 border-blue-300 dark:border-blue-700' : ''}`}>
        {isHighlighted && (
          <div className="absolute -top-3 -right-3 rotate-12 bg-blue-600 text-white text-xs px-3 py-1 rounded-full z-20 shadow-lg">
            Lead Dev
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-600/10 dark:to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex flex-col items-center">
          <div className={`relative w-32 h-32 mb-4 overflow-hidden rounded-full ${isHighlighted ? 'border-4 border-blue-400 dark:border-blue-600' : 'border-2 border-blue-100 dark:border-blue-900'} group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-all duration-300`}>
            <Image 
              src={image} 
              alt={name} 
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isHighlighted ? 'animate-pulse-glow' : ''}`}
            />
          </div>
          
          <h3 className={`text-xl font-bold text-gray-800 dark:text-white mb-1 ${isHighlighted ? 'text-gradient text-2xl' : ''}`}>{name}</h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{role}</p>
          
          {skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs py-1 px-2 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          
          <Link 
            href={linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors glow-on-hover"
          >
            <Linkedin className="w-4 h-4" />
            <span className="text-sm">Connect</span>
          </Link>
        </div>
        
        <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  )
}

// Tech stack item with animation
const TechItem = ({ icon: Icon, name }) => {
  const { ref, isInView } = useAnimateOnScroll()
  
  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-blue-900/5 dark:hover:shadow-blue-900/10 transition-all duration-300 card-hover-effect"
    >
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-3 animate-bounce-subtle">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
    </motion.div>
  )
}

// Feature card component with animation
const FeatureCard = ({ title, icon: Icon, description, delay = 0 }) => {
  const { ref, isInView } = useAnimateOnScroll()
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md dark:shadow-blue-900/5 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 card-hover-effect"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  )
}

export default function AboutPage() {
  // Add the custom animations to the document
  useEffect(() => {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(customAnimations))
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  // Scroll progress state
  const [scrollProgress, setScrollProgress] = useState(0)

  // Update scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalScroll) * 100
      setScrollProgress(currentProgress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sections with animation tracking
  const heroSection = useAnimateOnScroll()
  const missionSection = useAnimateOnScroll()
  const teamSection = useAnimateOnScroll()
  const featureSection = useAnimateOnScroll()
  const leadDevSection = useAnimateOnScroll()
  const techSection = useAnimateOnScroll()
  const mentorSection = useAnimateOnScroll()
  const testimonialSection = useAnimateOnScroll()
  const ctaSection = useAnimateOnScroll()

  return (
    <MainLayout initialSidebarOpen={false}>
      <div className="relative min-h-screen">
        {/* Scroll Progress Indicator */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
          <div className="relative h-96 w-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Progress Bar */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-400 dark:to-blue-300 transition-all duration-300 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />
            {/* Progress Bubble */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white dark:bg-gray-100 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ bottom: `${scrollProgress}%` }}
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-pulse" />
              {/* Outer Ring */}
              <div className="absolute -inset-1 bg-blue-500/10 dark:bg-blue-400/10 rounded-full animate-ping" />
              {/* Center Dot */}
              <div className="absolute inset-1/4 bg-blue-500 dark:bg-blue-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20"></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-200 dark:bg-blue-900/40 rounded-full blur-3xl animate-pulse-glow opacity-30"></div>
          <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/40 rounded-full blur-3xl animate-float-subtle opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-900/40 rounded-full blur-3xl animate-spin-slow opacity-10"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Circular Pattern */}
          <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 dark:opacity-[0.02]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="400" cy="400" r="100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative py-12 overflow-hidden" ref={heroSection.ref}>
            <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10">
              <div className="absolute animate-pulse-glow opacity-30 top-20 -left-24 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl" />
              <div className="absolute animate-float-subtle opacity-20 bottom-20 -right-24 w-96 h-96 bg-indigo-200 dark:bg-indigo-900 rounded-full blur-3xl" />
              <div className="absolute animate-spin-slow opacity-10 top-40 left-1/2 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl" />
            </div>

            <motion.div 
              initial="hidden"
              animate={heroSection.isInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="container mx-auto px-4 relative z-10"
            >
              <div className="max-w-4xl mx-auto text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroSection.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                >
                  Where 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 animate-gradient-shift"> Ideas </span>
                  Take 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-gradient-shift"> Shape</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroSection.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                >
                  Built with Purpose, Powered by Vision.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={heroSection.isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex justify-center space-x-2 animate-float-subtle"
                >
                  <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                    <Sparkles className="w-4 h-4 mr-1" /> Innovative
                  </span>
                  <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    <Code className="w-4 h-4 mr-1" /> Powerful
                  </span>
                  <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300">
                    <Lightbulb className="w-4 h-4 mr-1" /> Creative
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Feature Section */}
          <section className="py-16" ref={featureSection.ref}>
            <div className="container mx-auto px-4">
              <motion.div 
                initial="hidden"
                animate={featureSection.isInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FeatureCard 
                    title="Intuitive Design" 
                    icon={Heart} 
                    description="Crafted with user experience in mind, our platform is easy to navigate and delightful to use."
                    delay={0.1}
                  />
                  <FeatureCard 
                    title="Powerful Tools" 
                    icon={Sparkles} 
                    description="Cutting-edge AI and research tools that help transform your concepts into concrete plans."
                    delay={0.2}
                  />
                  <FeatureCard 
                    title="Research Driven" 
                    icon={Coffee} 
                    description="Built on solid research principles to ensure your ideas are both innovative and feasible."
                    delay={0.3}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Our Mission Section */}
          <section className="py-16 bg-blue-50 dark:bg-gray-900/50" ref={missionSection.ref}>
            <div className="container mx-auto px-4">
              <motion.div 
                initial="hidden"
                animate={missionSection.isInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="max-w-4xl mx-auto"
              >
                <motion.h2 
                  variants={fadeInUp}
                  className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
                >
                  Our Mission
                </motion.h2>
                
                <motion.div 
                  variants={fadeInUp}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-blue-900/5 p-8 md:p-10 border border-gray-100 dark:border-gray-700 card-hover-effect"
                >
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      Born from the spark of innovation under the mentorship of Dhruv Kumar, Ideaverse is our way of shaping the future through code, creativity, and collaboration.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      We believe in the power of ideas to transform the world. Our platform is designed to make ideation, research, and implementation seamless and accessible to everyone, empowering the next generation of innovators.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900/30" ref={teamSection.ref}>
            <div className="container mx-auto px-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={teamSection.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
              >
                Our Team
              </motion.h2>
              
              <motion.div 
                initial="hidden"
                animate={teamSection.isInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto"
              >
                <TeamMemberCard 
                  name="Rohit Singhee" 
                  role="MS CS Student & GenAI Researcher" 
                  image="/Rohit Singhee.jpeg" 
                  linkedin="https://www.linkedin.com/in/rohit-singhee-114ba0205/"
                  skills={["AI Dev", "Microservice", "Backend", "Cloud Infrastructure"]}
                />
                
                <TeamMemberCard 
                  name="Dhruv Kumar" 
                  role="GenAI Scientist & Professor" 
                  image="/Dhruv Kumar.jpeg" 
                  linkedin="https://www.linkedin.com/in/dhruv-kumar-87082b335/"
                  skills={["GenAI Research", "Academic Leadership", "AI Consulting"]}
                />
              </motion.div>
            </div>
          </section>
          
          {/* Tech Stack Section */}
          <section className="py-16" ref={techSection.ref}>
            <div className="container mx-auto px-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={techSection.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
              >
                Our Tech Stack
              </motion.h2>
              
              <motion.div 
                initial="hidden"
                animate={techSection.isInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-4xl mx-auto"
              >
                <TechItem icon={Code} name="Next.js" />
                <TechItem icon={Server} name="Node.js" />
                <TechItem icon={Database} name="PostgreSQL" />
                <TechItem icon={Code} name="Python" />
                <TechItem icon={Server} name="Docker" />
                <TechItem icon={Sparkles} name="LangChain" />
                <TechItem icon={Server} name="Celery" />
                <TechItem icon={Code} name="TypeScript" />
              </motion.div>
            </div>
          </section>
          
          {/* Mentor Section */}
          <section id="dhruv" className="py-16 bg-blue-50 dark:bg-gray-900/50" ref={mentorSection.ref}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  initial="hidden"
                  animate={mentorSection.isInView ? "visible" : "hidden"}
                  variants={fadeInUp}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-blue-900/5 overflow-hidden card-hover-effect"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 z-10" />
                      <div className="relative h-full min-h-[300px]">
                        <Image 
                          src="/Dhruv Kumar.jpeg" 
                          alt="Dhruv Kumar" 
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="md:w-3/5 p-8 md:p-10">
                      <div className="flex items-center mb-4">
                        <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Mentor</h3>
                      </div>
                      
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dhruv Kumar</h4>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                        "Great ideas come from great guidance."
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        As a GenAI Scientist & Consultant and Professor at BITS Pilani, Dhruv brings extensive expertise in Generative AI research and development. His visionary guidance has been instrumental in shaping Ideaverse from a simple concept to a robust platform. His deep understanding of AI technologies and academic leadership continues to drive our innovation and direction.
                      </p>
                      
                      <Link 
                        href="https://www.linkedin.com/in/dhruv-kumar-87082b335/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors glow-on-hover"
                      >
                        Connect on LinkedIn <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Developer Section - Featuring Rohit Singhee */}
          <section id="rohit" className="py-16" ref={leadDevSection.ref}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  initial="hidden"
                  animate={leadDevSection.isInView ? "visible" : "hidden"}
                  variants={fadeInUp}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-blue-900/5 overflow-hidden card-hover-effect"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 z-10" />
                      <div className="relative h-full min-h-[300px]">
                        <Image 
                          src="/Rohit Singhee.jpeg" 
                          alt="Rohit Singhee" 
                          fill
                          className="object-cover animate-pulse-glow"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-blue-900/80 to-transparent z-20">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="bg-blue-200/20 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm">
                            AI Dev
                          </span>
                          <span className="bg-blue-200/20 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm">
                            Microservice
                          </span>
                          <span className="bg-blue-200/20 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm">
                            Backend
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-3/5 p-8 md:p-10">
                      <div className="flex items-center mb-4">
                        <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-400 mr-2 animate-bounce-subtle" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Developer</h3>
                      </div>
                      
                      <h4 className="text-3xl font-bold text-gradient mb-4">Rohit Singhee</h4>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                        "Building Ideaverse has been about creating a platform where creativity meets technology, and where possibilities are limited only by imagination."
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Currently pursuing his Master's in Computer Science at BITS Pilani, Rohit is also an active GenAI researcher. His academic background combined with practical experience in AI development brings a unique perspective to Ideaverse's technological foundation.
                      </p>
                      
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">Architected the full-stack application from concept to deployment</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">Implemented the AI-powered idea generation and research systems</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">Designed the intuitive user interface with modern animations and interactions</p>
                        </li>
                      </ul>
                      
                      <Link 
                        href="https://www.linkedin.com/in/rohit-singhee-114ba0205/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors glow-on-hover"
                      >
                        Connect on LinkedIn <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Testimonials/Vibes Section */}
          <section className="py-16" ref={testimonialSection.ref}>
            <div className="container mx-auto px-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialSection.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
              >
                Team Vibes
              </motion.h2>
              
              <motion.div 
                initial="hidden"
                animate={testimonialSection.isInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              >
                <motion.div 
                  variants={fadeInLeft}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-blue-900/5 card-hover-effect"
                >
                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                    "Ideaverse felt like building the future in real-time. Every line of code was an opportunity to shape how people interact with ideas."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">RS</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Rohit Singhee</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Lead Developer</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={fadeInRight}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-blue-900/5 card-hover-effect"
                >
                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                    "We're not just coding, we're crafting experiences that transform ideas into reality."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">DK</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dhruv Kumar</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Founder & Mentor</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-16" ref={ctaSection.ref}>
            <div className="container mx-auto px-4">
              <motion.div 
                initial="hidden"
                animate={ctaSection.isInView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl shadow-xl overflow-hidden animate-gradient-shift"
              >
                <div className="p-8 md:p-10">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Let's Collaborate</h2>
                    <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                      Have an innovative idea or want to join our journey? We're always open to new collaborations and opportunities.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                      <Link 
                        href="https://www.linkedin.com/in/rohit-singhee-114ba0205/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center transition-colors card-hover-effect"
                      >
                        <Linkedin className="w-5 h-5 mr-2" />
                        Connect with Rohit
                      </Link>
                      
                      <Link 
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium flex items-center transition-colors card-hover-effect"
                      >
                        <Github className="w-5 h-5 mr-2" />
                        Explore GitHub
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
} 
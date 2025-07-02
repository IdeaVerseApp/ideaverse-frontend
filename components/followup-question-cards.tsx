"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Send, Loader2 } from "lucide-react"
import { submitFollowUpAnswers } from "@/services/idea-service"

interface FollowUpQuestion {
  id: string
  question: string
  context?: string
}

interface FollowupQuestionCardsProps {
  taskId: string
  questions: FollowUpQuestion[]
  onComplete: () => void
}

export default function FollowupQuestionCards({ taskId, questions, onComplete }: FollowupQuestionCardsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }
  
  // No strict validation – user may skip
  const isCurrentQuestionAnswered = () => true
  
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else if (currentQuestionIndex === questions.length - 1) {
      handleSubmit()
    }
  }
  
  // Handle submit
  const handleSubmit = async () => {
    // We allow empty answers; just proceed
    setError("")
    setIsSubmitting(true)

    try {
      // Format answers for the API
      const answersArray = questions.map(q => ({
        question_id: q.id,
        answer: answers[q.id] || ""
      }))

      // Submit answers
      await submitFollowUpAnswers(taskId, answersArray)
      
      // Call onComplete callback to proceed to the next step
      onComplete()
      
    } catch (err) {
      console.error("Error submitting follow-up answers:", err)
      setError("An error occurred while submitting your answers. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Follow-up Questions</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Please answer these questions to help clarify your idea
        </p>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div 
              key={index}
              className={`h-2 w-16 rounded-full ${
                index === currentQuestionIndex 
                  ? 'bg-blue-600 dark:bg-blue-500' 
                  : index < currentQuestionIndex 
                    ? 'bg-green-500 dark:bg-green-400'
                    : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {questions[currentQuestionIndex]?.question}
            </h3>
            {questions[currentQuestionIndex]?.context && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {questions[currentQuestionIndex].context}
              </p>
            )}
          </div>
          
          <textarea
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-900 dark:text-gray-100 min-h-[150px]"
            placeholder="Your answer..."
            value={answers[questions[currentQuestionIndex]?.id] || ""}
            onChange={(e) => questions[currentQuestionIndex] && handleAnswerChange(questions[currentQuestionIndex].id, e.target.value)}
          />
          
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNextQuestion}
              disabled={isSubmitting}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : currentQuestionIndex < questions.length - 1 ? (
                <>
                  {(answers[questions[currentQuestionIndex]?.id]?.trim()) ? 'Next Question' : 'Skip Question'}
                  <ChevronRight className="ml-1 h-5 w-5" />
                </>
              ) : (
                <>
                  Submit Answers
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      <div className="flex justify-between mt-8 text-sm text-gray-500 dark:text-gray-400">
        <div>Question {currentQuestionIndex + 1} of {questions.length}</div>
        <div>{Math.round((currentQuestionIndex + 1) / questions.length * 100)}% complete</div>
      </div>
    </div>
  )
} 
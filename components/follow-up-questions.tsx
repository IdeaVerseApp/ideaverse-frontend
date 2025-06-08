"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { submitFollowUpAnswers } from "@/services/idea-service"

interface FollowUpQuestion {
  id: string
  question: string
  context?: string
}

interface FollowUpQuestionsProps {
  taskId: string
  questions: FollowUpQuestion[]
  onComplete: () => void
}

export default function FollowUpQuestions({ taskId, questions, onComplete }: FollowUpQuestionsProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const isCurrentQuestionAnswered = () => {
    if (showAllQuestions) return true
    if (!questions[currentQuestionIndex]) return true
    return !!answers[questions[currentQuestionIndex].id]?.trim()
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleToggleView = () => {
    setShowAllQuestions(prev => !prev)
  }

  const handleSubmit = async () => {
    // Check if all questions have answers
    const unansweredQuestions = questions.filter(q => !answers[q.id]?.trim())
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions before submitting. ${unansweredQuestions.length} questions unanswered.`)
      return
    }

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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-2">
          Follow-up Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please answer these questions to help clarify your idea before we generate suggestions.
        </p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleToggleView}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showAllQuestions ? "Show one question at a time" : "Show all questions"}
        </button>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {showAllQuestions ? `${questions.length} questions` : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
        </div>
      </div>

      {showAllQuestions ? (
        // Show all questions at once
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="mb-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {index + 1}. {question.question}
                </h3>
                {question.context && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {question.context}
                  </p>
                )}
              </div>
              <textarea
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 min-h-[100px]"
                placeholder="Your answer..."
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>
      ) : (
        // Show one question at a time
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          {questions[currentQuestionIndex] && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {questions[currentQuestionIndex].question}
                </h3>
                {questions[currentQuestionIndex].context && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {questions[currentQuestionIndex].context}
                  </p>
                )}
              </div>
              <textarea
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 min-h-[150px]"
                placeholder="Your answer..."
                value={answers[questions[currentQuestionIndex].id] || ""}
                onChange={(e) => handleAnswerChange(questions[currentQuestionIndex].id, e.target.value)}
                disabled={isSubmitting}
              />
            </>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isSubmitting}
              className={`px-4 py-2 rounded-md ${
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered() || isSubmitting}
                className={`px-4 py-2 rounded-md ${
                  !isCurrentQuestionAnswered()
                    ? "bg-blue-300 text-white dark:bg-blue-800"
                    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentQuestionAnswered() || isSubmitting}
                className={`px-4 py-2 rounded-md ${
                  !isCurrentQuestionAnswered()
                    ? "bg-blue-300 text-white dark:bg-blue-800"
                    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit All Answers"
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {showAllQuestions && (
        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit All Answers"
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
} 
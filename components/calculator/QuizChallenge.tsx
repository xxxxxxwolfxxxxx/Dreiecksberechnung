'use client'

import { useState } from 'react'
import { getQuizForTriangle } from '@/utils/quizQuestions'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
}

export function QuizChallenge({ solution }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  // Quiz laden
  const triangleType = solution.values.typ as string
  const quiz = getQuizForTriangle(triangleType, solution.values as Record<string, number>)

  const isCorrect = selectedAnswer ? quiz.isCorrect(selectedAnswer) : false

  const handleAnswerClick = (option: string) => {
    setSelectedAnswer(option)
    setRevealed(true)
  }

  return (
    <div className="rounded-2xl bg-blue-50 border-2 border-blue-300 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🎓</span>
        <h3 className="font-bold text-blue-900">Schnelltest – Hast du verstanden?</h3>
      </div>

      {/* Frage */}
      <div className="mb-6">
        <p className="text-gray-700 font-medium">{quiz.question}</p>
      </div>

      {/* Antwort-Optionen */}
      <div className="flex flex-col gap-3 mb-6">
        {quiz.options.map((option) => {
          const isSelected = selectedAnswer === option
          const isOptionCorrect = quiz.isCorrect(option)

          let buttonClasses =
            'flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left'

          if (revealed && isSelected) {
            // Gewählte Antwort - Styling basierend auf richtig/falsch
            if (isOptionCorrect) {
              buttonClasses += ' border-green-500 bg-green-50'
            } else {
              buttonClasses += ' border-red-500 bg-red-50'
            }
          } else if (!revealed) {
            // Noch nicht beantwortet
            buttonClasses += ' border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
          } else {
            // Revealed, aber nicht diese Option gewählt
            buttonClasses += ' border-gray-300'
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              disabled={revealed}
              className={buttonClasses}
            >
              {/* Radio-Button-Kreis */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  revealed && isSelected
                    ? isOptionCorrect
                      ? 'border-green-500 bg-green-500'
                      : 'border-red-500 bg-red-500'
                    : 'border-gray-400'
                }`}
              >
                {revealed && isSelected && (
                  <span className={isOptionCorrect ? 'text-white text-sm' : 'text-white text-sm'}>
                    {isOptionCorrect ? '✓' : ''}
                  </span>
                )}
              </div>

              {/* Option-Text */}
              <span className="text-gray-700 font-medium">{option}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback nach Antwort */}
      {revealed && selectedAnswer && (
        <div
          className={`rounded-lg p-4 ${
            isCorrect ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'
          }`}
        >
          <div className="mb-2">
            {isCorrect ? (
              <span className="font-bold text-green-700">✅ Richtig!</span>
            ) : (
              <span className="font-bold text-yellow-700">❌ Nicht ganz.</span>
            )}
          </div>

          <p className="text-sm text-gray-700 mb-3">{quiz.explanation}</p>

          {!isCorrect && (
            <p className="text-sm font-semibold text-gray-800">
              Richtige Antwort: <span className="text-green-700">{quiz.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

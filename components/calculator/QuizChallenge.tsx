'use client'

import { useMemo, useState } from 'react'
import { getQuizForTriangle } from '@/utils/quizQuestions'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
}

export function QuizChallenge({ solution }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const revealed = selectedAnswer !== null

  // Quiz einmal pro Lösung laden (sonst würfelt die Reihenfolge bei jedem Render neu)
  const triangleType = solution.values.typ as string
  const quiz = useMemo(
    () => getQuizForTriangle(triangleType, solution.values as Record<string, number>),
    [triangleType, solution.values]
  )

  const isCorrect = selectedAnswer ? quiz.isCorrect(selectedAnswer) : false

  return (
    <section className="flex flex-col gap-3.5 rounded-[22px] border border-line bg-white px-5 sm:px-7 py-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11.5px] tracking-[0.06em] text-brand-600">SCHNELLTEST</span>
        <h3 className="text-xl font-bold tracking-tight">Hast du’s verstanden?</h3>
      </div>

      <p className="text-base font-medium text-ink">{quiz.question}</p>

      <div className="flex flex-col gap-2">
        {quiz.options.map((option) => {
          const isOptionCorrect = quiz.isCorrect(option)
          const zeigeRichtig = revealed && isOptionCorrect
          const zeigeFalsch = revealed && selectedAnswer === option && !isOptionCorrect
          return (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              disabled={revealed}
              className={`flex items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-3 text-left text-[15px] font-medium text-ink transition-colors ${
                zeigeRichtig
                  ? 'border-[#4cbf85] bg-[#f0faf4]'
                  : zeigeFalsch
                    ? 'border-[#e58b8b] bg-[#fdf2f2]'
                    : revealed
                      ? 'border-line bg-white'
                      : 'border-line bg-white hover:border-brand-600'
              }`}
            >
              <span className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs text-white ${
                zeigeRichtig ? 'border-[#12915a] bg-[#12915a]' : zeigeFalsch ? 'border-[#d13c3c] bg-[#d13c3c]' : 'border-[#c3c8d1]'
              }`}>
                {zeigeRichtig ? '✓' : zeigeFalsch ? '×' : ''}
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className={`flex flex-col gap-1 rounded-xl px-4 py-3 ${isCorrect ? 'bg-[#ecf8f1]' : 'bg-[#fff6e5]'}`}>
          <strong className={`text-[15px] ${isCorrect ? 'text-[#0f7a4b]' : 'text-[#8a5200]'}`}>
            {isCorrect ? 'Richtig!' : 'Nicht ganz.'}
          </strong>
          <p className="text-sm text-ink-2">{quiz.explanation}</p>
          {!isCorrect && (
            <p className="text-sm text-ink-2">
              Richtige Antwort: <span className="font-semibold text-[#0f7a4b]">{quiz.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </section>
  )
}

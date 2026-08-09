import { getQuizForTriangle, QuizQuestion } from '../../utils/quizQuestions'

describe('quizQuestions', () => {
  describe('getQuizForTriangle', () => {
    it('should return a QuizQuestion object for equilateral triangle', () => {
      const quiz = getQuizForTriangle('gleichseitig', { seite: 5 })

      expect(quiz).toHaveProperty('question')
      expect(quiz).toHaveProperty('options')
      expect(quiz).toHaveProperty('correctAnswer')
      expect(quiz).toHaveProperty('explanation')
      expect(quiz).toHaveProperty('isCorrect')
    })

    it('should return correct question text for equilateral triangle', () => {
      const quiz = getQuizForTriangle('gleichseitig', { seite: 5 })

      expect(quiz.question).toContain('Seitenlänge verdoppelt')
      expect(quiz.question).toContain('Fläche')
    })

    it('should have correct answer "4x so groß" for equilateral triangle', () => {
      const quiz = getQuizForTriangle('gleichseitig', { seite: 5 })

      expect(quiz.correctAnswer).toBe('4x so groß')
      expect(quiz.options).toContain('4x so groß')
    })

    it('should return a QuizQuestion for right triangle', () => {
      const quiz = getQuizForTriangle('rechtwinklig', { katheteA: 3, katheteB: 4 })

      expect(quiz.question).toBeDefined()
      expect(quiz.options.length).toBeGreaterThan(0)
      expect(quiz.correctAnswer).toBeDefined()
      expect(quiz.explanation).toBeDefined()
    })

    it('should ask about Pythagoras for right triangle with correct values', () => {
      const quiz = getQuizForTriangle('rechtwinklig', { katheteA: 3, katheteB: 4 })

      expect(quiz.question).toContain('Pythagoras')
      expect(quiz.question).toContain('3')
      expect(quiz.question).toContain('4')
      expect(quiz.correctAnswer).toBe('5')
    })

    it('should return a QuizQuestion for isosceles triangle', () => {
      const quiz = getQuizForTriangle('gleichschenklig', { schenkel: 5, basis: 6 })

      expect(quiz.question).toBeDefined()
      expect(quiz.options.length).toBeGreaterThan(0)
      expect(quiz.correctAnswer).toBeDefined()
      expect(quiz.explanation).toBeDefined()
    })

    it('should ask about "Schenkel" for isosceles triangle', () => {
      const quiz = getQuizForTriangle('gleichschenklig', { schenkel: 5, basis: 6 })

      expect(quiz.question).toContain('gleichschenkligen Dreieck')
      expect(quiz.options).toContain('Schenkel')
      expect(quiz.correctAnswer).toBe('Schenkel')
    })

    it('should return a QuizQuestion for general triangle', () => {
      const quiz = getQuizForTriangle('allgemein', { winkelA: 60, winkelB: 60, winkelC: 60 })

      expect(quiz.question).toBeDefined()
      expect(quiz.options.length).toBeGreaterThan(0)
      expect(quiz.correctAnswer).toBeDefined()
      expect(quiz.explanation).toBeDefined()
    })

    it('should ask about angle sum for general triangle', () => {
      const quiz = getQuizForTriangle('allgemein', { winkelA: 60, winkelB: 60, winkelC: 60 })

      expect(quiz.question).toContain('Winkelsumme')
      expect(quiz.options).toContain('180°')
      expect(quiz.correctAnswer).toBe('180°')
    })

    it('should have different quizzes for different triangle types', () => {
      const equilateralQuiz = getQuizForTriangle('gleichseitig', { seite: 5 })
      const isoscelesQuiz = getQuizForTriangle('gleichschenklig', { schenkel: 5, basis: 6 })

      expect(equilateralQuiz.question).not.toBe(isoscelesQuiz.question)
    })

    it('should return true for isCorrect when answer matches correctAnswer', () => {
      const quiz = getQuizForTriangle('gleichseitig', { seite: 5 })

      expect(quiz.isCorrect(quiz.correctAnswer)).toBe(true)
    })

    it('should return false for isCorrect when answer is wrong', () => {
      const quiz = getQuizForTriangle('gleichseitig', { seite: 5 })

      expect(quiz.isCorrect('wrong answer')).toBe(false)
    })

    it('should return false for isCorrect with case-sensitive matching', () => {
      const quiz = getQuizForTriangle('gleichseitig', { seite: 5 })

      expect(quiz.isCorrect('4X SO GROß')).toBe(false)
    })

    it('should have explanation text for all quiz types', () => {
      const types = ['gleichseitig', 'rechtwinklig', 'gleichschenklig', 'allgemein']
      const testValues: Record<string, number>[] = [
        { seite: 5 },
        { katheteA: 3, katheteB: 4 },
        { schenkel: 5, basis: 6 },
        { winkelA: 60, winkelB: 60, winkelC: 60 }
      ]

      types.forEach((type, idx) => {
        const quiz = getQuizForTriangle(type, testValues[idx])
        expect(quiz.explanation.length).toBeGreaterThan(0)
        expect(quiz.explanation).toContain('²')
      })
    })

    it('should have at least 3 options for all quizzes', () => {
      const equilateralQuiz = getQuizForTriangle('gleichseitig', { seite: 5 })
      const rightQuiz = getQuizForTriangle('rechtwinklig', { katheteA: 3, katheteB: 4 })
      const isoscelesQuiz = getQuizForTriangle('gleichschenklig', { schenkel: 5, basis: 6 })
      const generalQuiz = getQuizForTriangle('allgemein', { winkelA: 60, winkelB: 60, winkelC: 60 })

      expect(equilateralQuiz.options.length).toBeGreaterThanOrEqual(3)
      expect(rightQuiz.options.length).toBeGreaterThanOrEqual(3)
      expect(isoscelesQuiz.options.length).toBeGreaterThanOrEqual(3)
      expect(generalQuiz.options.length).toBeGreaterThanOrEqual(3)
    })
  })
})

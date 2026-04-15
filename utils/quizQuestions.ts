export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  isCorrect: (answer: string) => boolean
}

export function getQuizForTriangle(
  typ: string,
  values: Record<string, number>
): QuizQuestion {
  switch (typ) {
    case 'gleichseitig':
      return createEquilateralQuiz()
    case 'rechtwinklig':
      return createRightTriangleQuiz(values)
    case 'gleichschenklig':
      return createIsoscelesQuiz()
    case 'allgemein':
      return createGeneralQuiz()
    default:
      throw new Error(`Unknown triangle type: ${typ}`)
  }
}

function createEquilateralQuiz(): QuizQuestion {
  const correctAnswer = '4x so groß'
  return {
    question: 'Wenn man die Seitenlänge verdoppelt, wie ändert sich die Fläche?',
    options: ['2x so groß', '4x so groß', 'Bleibt gleich'],
    correctAnswer,
    explanation: "Bei Verdopplung aller Seiten wird die Fläche um den Faktor 2² = 4 größer",
    isCorrect: (answer: string) => answer === correctAnswer
  }
}

function createRightTriangleQuiz(values: Record<string, number>): QuizQuestion {
  const a = values.katheteA || 3
  const b = values.katheteB || 4
  const c = Math.sqrt(a * a + b * b)
  const correctAnswer = c.toString()

  // Generate wrong options
  const wrongOption1 = (a + b).toString()
  const wrongOption2 = Math.abs(a - b).toString()

  const options = [correctAnswer, wrongOption1, wrongOption2].sort(() => Math.random() - 0.5)

  return {
    question: `In deinem Dreieck mit Katheten ${a} und ${b}: Was ist die Hypotenuse nach Pythagoras?`,
    options,
    correctAnswer,
    explanation: `Nach dem Satz des Pythagoras: c² = a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}, also c = ${c}`,
    isCorrect: (answer: string) => answer === correctAnswer
  }
}

function createIsoscelesQuiz(): QuizQuestion {
  const correctAnswer = 'Schenkel'
  return {
    question:
      'Bei einem gleichschenkligen Dreieck sind zwei Seiten gleich. Wie heißen die gleichen Seiten?',
    options: ['Schenkel', 'Basis', 'Höhe'],
    correctAnswer,
    explanation:
      'Die beiden gleichen Seiten heißen Schenkel (a² = b²). Die dritte Seite heißt Basis.',
    isCorrect: (answer: string) => answer === correctAnswer
  }
}

function createGeneralQuiz(): QuizQuestion {
  const correctAnswer = '180°'
  return {
    question: 'Die Winkelsumme in jedem Dreieck ist...',
    options: ['90°', '180°', '360°'],
    correctAnswer,
    explanation:
      'In jedem ebenen Dreieck addieren sich die drei Winkel zu 180° (α² + β² + γ² = 180°).',
    isCorrect: (answer: string) => answer === correctAnswer
  }
}

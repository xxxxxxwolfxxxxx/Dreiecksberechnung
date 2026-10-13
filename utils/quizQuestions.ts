export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  isCorrect: (answer: string) => boolean
}

const fmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 })

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
    explanation: 'Bei Verdopplung aller Seiten wird die Fläche um den Faktor 2² = 4 größer.',
    isCorrect: (answer: string) => answer === correctAnswer
  }
}

function createRightTriangleQuiz(values: Record<string, number>): QuizQuestion {
  // Die beiden kürzeren Seiten sind die Katheten.
  const [a, b] = [values.a, values.b, values.c].filter(n => typeof n === 'number').sort((x, y) => x - y)
  const ka = a || 3
  const kb = b || 4
  const c = Math.sqrt(ka * ka + kb * kb)
  const correctAnswer = fmt.format(c)

  const options = [correctAnswer, fmt.format(ka + kb), fmt.format(Math.abs(kb - ka))].sort(() => Math.random() - 0.5)

  return {
    question: `In deinem Dreieck mit den Katheten ${fmt.format(ka)} und ${fmt.format(kb)}: Wie lang ist die Hypotenuse nach Pythagoras?`,
    options,
    correctAnswer,
    explanation: `Nach dem Satz des Pythagoras: c² = a² + b² = ${fmt.format(ka)}² + ${fmt.format(kb)}² = ${fmt.format(ka * ka + kb * kb)}, also c = ${correctAnswer}.`,
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
      'Die beiden gleichen Seiten heißen Schenkel. Die dritte Seite heißt Basis.',
    isCorrect: (answer: string) => answer === correctAnswer
  }
}

function createGeneralQuiz(): QuizQuestion {
  const correctAnswer = '180°'
  return {
    question: 'Die Winkelsumme in jedem Dreieck ist …',
    options: ['90°', '180°', '360°'],
    correctAnswer,
    explanation:
      'In jedem ebenen Dreieck addieren sich die drei Winkel zu 180° (α + β + γ = 180°).',
    isCorrect: (answer: string) => answer === correctAnswer
  }
}

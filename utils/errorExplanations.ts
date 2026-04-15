export interface ErrorExplanation {
  message: string
  suggestion?: string
  emoji?: string
}

export function getErrorExplanation(
  error: string,
  values: Partial<Record<string, number>>
): ErrorExplanation {
  // Triangle Inequality Error
  if (error.includes('Dreiecksungleichung verletzt')) {
    const valueEntries = Object.entries(values)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')

    const message = `Die Dreiecksungleichung ist verletzt. Bei den Werten ${valueEntries} ist die Summe zweier Seiten nicht größer als die dritte Seite.`

    const suggestion =
      'Stelle sicher, dass die Summe zweier Seiten immer größer als die dritte Seite ist. Zum Beispiel: a + b > c, a + c > b, b + c > a. Falls c die längste Seite ist, muss gelten: c ≤ a + b.'

    return {
      emoji: '⚠️',
      message,
      suggestion,
    }
  }

  // Negative Values Error
  if (error.includes('Alle Seiten müssen positiv sein')) {
    const negativeFields = Object.entries(values)
      .filter(([, value]) => value !== undefined && value < 0)
      .map(([key]) => key)

    const fieldList = negativeFields.join(', ')
    const message = `Die Seite(n) ${fieldList} sind negativ. Alle Seitenlängen müssen positiv sein.`

    const suggestion = 'Gib positive Werte für alle Seitenlängen ein. Negative oder null Werte sind nicht zulässig.'

    return {
      emoji: '❌',
      message,
      suggestion,
    }
  }

  // Fallback for unknown errors
  return {
    emoji: '⚠️',
    message: error || 'Ein unbekannter Fehler ist aufgetreten.',
    suggestion: 'Bitte versuche es erneut oder kontaktiere den Support.',
  }
}

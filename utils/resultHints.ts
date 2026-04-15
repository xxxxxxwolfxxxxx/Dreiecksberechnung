/**
 * Gibt eine beschreibende Erklärung für einen Result-Key zurück
 * @param key Der Key des Ergebnisses (z.B. 'flaeche', 'umfang')
 * @returns Erklärungstext oder leerer String
 */
export function getResultHint(key: string): string {
  const hints: Record<string, string> = {
    flaeche:
      '🎨 Dies ist die Gesamtfläche deines Dreiecks. Stell dir vor, du malst das Dreieck an – wie viel Farbe brauchst du? Die Fläche wird in Quadratzentimetern gemessen.',
    umfang:
      '🔗 Dies ist die Gesamtlänge aller drei Kanten zusammen. Wenn du ein Seil um dein Dreieck legst, wäre das dein Umfang.',
    h_a: '📏 Dies ist die Höhe von Seite a. Stelle dir eine senkrechte Linie vom gegenüberliegenden Punkt zur Seite a vor.',
    h_b: '📏 Dies ist die Höhe von Seite b. Stelle dir eine senkrechte Linie vom gegenüberliegenden Punkt zur Seite b vor.',
    h_c: '📏 Dies ist die Höhe von Seite c. Stelle dir eine senkrechte Linie vom gegenüberliegenden Punkt zur Seite c vor.',
    inkreis:
      '⭕ Dies ist der Radius des Inkreises – der größte Kreis, der ganz in dein Dreieck passt. Er berührt alle drei Seiten.',
    umkreis:
      '⭕ Dies ist der Radius des Umkreises – ein Kreis, der durch alle drei Ecken deines Dreiecks verläuft.',
    typ: '🔷 Dies ist die Klassifizierung deines Dreiecks. Je nach Seitenlängen oder Winkeln kann es gleichseitig, gleichschenklig oder unregelmäßig sein.',
  }

  return hints[key] || ''
}

/**
 * Gibt einen Alltagsvergleich für eine Fläche in cm² zurück
 * @param areaInCm2 Die Fläche in Quadratzentimetern
 * @returns Ein anschaulicher Vergleich
 */
export function getComparison(areaInCm2: number): string {
  if (areaInCm2 < 1) {
    return '📌 Kleiner als ein Reiskorn'
  } else if (areaInCm2 < 5) {
    return '👍 Ungefähr so groß wie dein Daumennagel'
  } else if (areaInCm2 < 25) {
    return '⛳ Wie ein Golfball von oben'
  } else if (areaInCm2 < 100) {
    return '📱 Größer als ein Smartphone'
  } else if (areaInCm2 < 500) {
    return '📄 Ungefähr wie ein DIN A4 Blatt'
  } else if (areaInCm2 < 2000) {
    return '🖥️ Wie ein Whiteboard'
  } else if (areaInCm2 < 10000) {
    return '🚪 Wie eine Klassenzimmertür'
  } else if (areaInCm2 < 100000) {
    return '🏠 Wie ein ganzes Zimmer'
  } else {
    return '🏫 Wie ein großes Klassenzimmer'
  }
}

/**
 * Gibt den Anwendungskontext für einen Result-Key zurück
 * @param key Der Key des Ergebnisses
 * @returns Kontext-Information oder leerer String
 */
export function getContextForKey(key: string): string {
  const contexts: Record<string, string> = {
    flaeche:
      '💡 Brauchst du für: Flächenberechnung von Grundstücken, Malen, Bodenflächen, Tessellationen',
    umfang:
      '💡 Brauchst du für: Zaun um ein Grundstück, Umrandung, Schnurlänge, Rahmengröße',
    h_a: '💡 Brauchst du für: Pyramidenvolumen, Höhenverhältnisse, geometrische Konstruktionen',
    h_b: '💡 Brauchst du für: Pyramidenvolumen, Höhenverhältnisse, geometrische Konstruktionen',
    h_c: '💡 Brauchst du für: Pyramidenvolumen, Höhenverhältnisse, geometrische Konstruktionen',
    inkreis:
      '💡 Brauchst du für: Tangentialkreise, Geometrische Konstruktionen, Optimierungsprobleme',
    umkreis:
      '💡 Brauchst du für: Umkreise zeichnen, Symmetrie-Probleme, Geometrische Konstruktionen',
    typ: '💡 Brauchst du für: Klassifizierung, Sonder-Eigenschaften nutzen, Symmetrie-Analysen',
  }

  return contexts[key] || ''
}

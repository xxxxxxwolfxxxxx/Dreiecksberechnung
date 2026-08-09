/**
 * Die Themenseiten rund um das Dreieck. Jede Suchanfrage-Gruppe aus der
 * Search Console (Flaeche/Flaecheninhalt, Winkel, Seitenlaengen, Umfang)
 * bekommt eine eigene Seite mit eigenem Rechenweg – der Rechner selbst ist
 * derselbe, die Erklaerung drumherum nicht.
 *
 * Die IDs sind gleichzeitig die Routen und die Schluessel fuer die Sitemap.
 */
export interface FormelBlock {
  formel: string
  erklaerung: string
}

export interface DreieckThema {
  id: string
  /** <title> der Seite */
  titel: string
  /** Meta-Description */
  beschreibung: string
  h1: string
  /** Anrisstext in der Themenliste auf der Startseite */
  linkText: string
  linkBeschreibung: string
  einleitung: string
  /** Welche Werte der Rechner dafuer mindestens braucht */
  brauchtWerte: string[]
  formeln: FormelBlock[]
  rechenweg: { aufgabe: string; schritte: string[] }
  haeufigeFehler: string[]
  matheThemen: string[]
}

export const DREIECK_THEMEN: DreieckThema[] = [
  {
    id: 'dreieck-flaeche',
    titel: 'Dreieck Fläche berechnen – Flächeninhalt online',
    beschreibung: 'Flächeninhalt eines Dreiecks berechnen: mit Grundseite und Höhe, mit drei Seiten (Heron) oder mit zwei Seiten und Winkel. Online-Rechner mit Rechenweg und Skizze.',
    h1: 'Dreieck Fläche berechnen',
    linkText: 'Fläche & Flächeninhalt',
    linkBeschreibung: 'Grundseite mal Höhe, Formel von Heron oder zwei Seiten mit Winkel',
    einleitung:
      'Der Flächeninhalt ist die Größe, nach der beim Dreieck am häufigsten gefragt wird – beim Giebel, beim Sonnensegel, beim Grundstück oder in der Mathearbeit. Welche Formel du brauchst, hängt allein davon ab, welche Werte du schon hast: Grundseite und Höhe ergeben eine simple Multiplikation, bei drei bekannten Seiten hilft die Formel von Heron, und bei zwei Seiten mit dem Winkel dazwischen kommt der Sinus ins Spiel. Gib deine Werte oben ein – der Rechner wählt die passende Formel selbst und zeigt sie dir mit an.',
    brauchtWerte: [
      'Grundseite a und die Höhe hₐ, die senkrecht darauf steht',
      'oder alle drei Seiten a, b und c',
      'oder zwei Seiten und den Winkel, der zwischen ihnen liegt',
    ],
    formeln: [
      {
        formel: 'A = (a · hₐ) / 2',
        erklaerung: 'Der Klassiker: halbe Grundseite mal Höhe. Wichtig ist, dass die Höhe senkrecht auf genau der Seite steht, die du als Grundseite einsetzt – jede der drei Seiten hat ihre eigene Höhe.',
      },
      {
        formel: 'A = √(s · (s−a) · (s−b) · (s−c))  mit  s = (a+b+c)/2',
        erklaerung: 'Die Formel von Heron. Sie braucht nur die drei Seitenlängen, keine Höhe und keinen Winkel – ideal, wenn du ein Grundstück oder ein Beet einfach abgemessen hast.',
      },
      {
        formel: 'A = (a · b · sin γ) / 2',
        erklaerung: 'Zwei Seiten und der eingeschlossene Winkel γ. Der Sinus ersetzt hier die Höhe: b · sin γ ist genau die Höhe über der Seite a.',
      },
    ],
    rechenweg: {
      aufgabe: 'Eine dreieckige Giebelwand ist unten 6,40 m breit und bis zum First 2,80 m hoch. Wie viel Fläche muss gestrichen werden?',
      schritte: [
        'Grundseite und Höhe herausschreiben: a = 6,40 m, hₐ = 2,80 m',
        'In die Formel einsetzen: A = (6,40 · 2,80) / 2',
        'Zähler ausrechnen: 6,40 · 2,80 = 17,92',
        'Halbieren: A = 17,92 / 2 = 8,96',
        'Ergebnis: Die Giebelfläche beträgt 8,96 m². Bei rund 8 m² Deckkraft pro Liter reicht also ein 2,5-Liter-Eimer für einen Anstrich.',
      ],
    },
    haeufigeFehler: [
      'Die Höhe wird mit einer Seitenlänge verwechselt. Bei einem schiefwinkligen Dreieck ist die Höhe kürzer als jede Schenkellänge – nur beim rechtwinkligen Dreieck fällt die Höhe mit einer Kathete zusammen.',
      'Das Halbieren wird vergessen. Grundseite mal Höhe ergibt das umschließende Rechteck, das Dreieck ist genau die Hälfte davon.',
      'Einheiten werden gemischt. Rechne alles in dieselbe Einheit um, bevor du multiplizierst – aus Zentimetern mal Metern wird sonst Unsinn.',
    ],
    matheThemen: ['Geometry'],
  },

  {
    id: 'dreieck-winkel',
    titel: 'Dreieck Winkel berechnen – online mit Rechenweg',
    beschreibung: 'Winkel im Dreieck berechnen: aus der Winkelsumme, mit dem Sinussatz oder mit dem Kosinussatz. Online-Rechner, der aus drei Werten alle drei Winkel bestimmt.',
    h1: 'Dreieck Winkel berechnen',
    linkText: 'Winkel',
    linkBeschreibung: 'Winkelsumme, Sinussatz und Kosinussatz – alle drei Winkel auf einmal',
    einleitung:
      'Im Dreieck ergeben die drei Winkel zusammen immer exakt 180°. Kennst du zwei davon, ist der dritte reine Subtraktion. Spannend wird es, wenn du gar keinen Winkel hast, sondern nur Seitenlängen – dann führen Kosinussatz und Sinussatz zum Ziel. Der Rechner oben nimmt beliebige drei Angaben entgegen und gibt dir α, β und γ zusammen mit dem verwendeten Satz aus.',
    brauchtWerte: [
      'Zwei Winkel – der dritte ergibt sich aus der Winkelsumme',
      'oder alle drei Seiten a, b und c (Kosinussatz)',
      'oder zwei Seiten und einen Winkel (Sinussatz oder Kosinussatz)',
    ],
    formeln: [
      {
        formel: 'α + β + γ = 180°',
        erklaerung: 'Die Winkelsumme. Sie gilt in jedem ebenen Dreieck, egal ob spitz-, recht- oder stumpfwinklig – und ist der schnellste Weg zum dritten Winkel.',
      },
      {
        formel: 'cos α = (b² + c² − a²) / (2 · b · c)',
        erklaerung: 'Der Kosinussatz, nach dem Winkel umgestellt. Damit bekommst du aus drei bekannten Seiten jeden Winkel – der Winkel gegenüber der längsten Seite ist dabei immer der größte.',
      },
      {
        formel: 'sin α / a = sin β / b',
        erklaerung: 'Der Sinussatz. Praktisch, wenn du eine Seite mit ihrem Gegenwinkel kennst und dazu eine zweite Seite. Achtung: Hier kann es zwei gültige Lösungen geben, weil sin(30°) und sin(150°) denselben Wert liefern.',
      },
    ],
    rechenweg: {
      aufgabe: 'Ein Dreieck hat die Seiten a = 7 cm, b = 5 cm und c = 6 cm. Wie groß ist der Winkel α gegenüber der längsten Seite?',
      schritte: [
        'Kosinussatz nach cos α umstellen: cos α = (b² + c² − a²) / (2 · b · c)',
        'Quadrate einsetzen: cos α = (25 + 36 − 49) / (2 · 5 · 6)',
        'Zähler und Nenner ausrechnen: cos α = 12 / 60 = 0,2',
        'Umkehrfunktion anwenden: α = arccos(0,2) ≈ 78,46°',
        'Kontrolle über die Winkelsumme: β ≈ 44,42°, γ ≈ 57,12° – zusammen 180°. Passt.',
      ],
    },
    haeufigeFehler: [
      'Der Taschenrechner steht auf RAD statt DEG. Ein Winkel von „1,37“ statt 78,46° ist fast immer dieses Problem.',
      'Beim Sinussatz wird die zweite Lösung übersehen. Ist der gesuchte Winkel möglicherweise stumpf, musst du auch 180° minus den gefundenen Wert prüfen.',
      'Seite und Gegenwinkel werden vertauscht. α liegt immer gegenüber von a, β gegenüber von b, γ gegenüber von c.',
    ],
    matheThemen: ['Geometry', 'Trigonometry'],
  },

  {
    id: 'dreieck-seiten',
    titel: 'Dreieck Seiten berechnen – Seitenlängen online',
    beschreibung: 'Fehlende Seitenlängen im Dreieck berechnen: mit dem Satz des Pythagoras, dem Kosinussatz oder dem Sinussatz. Online-Rechner mit Rechenweg und Skizze.',
    h1: 'Dreieck Seiten berechnen',
    linkText: 'Seitenlängen & Grundseite',
    linkBeschreibung: 'Pythagoras, Kosinussatz und Sinussatz für die fehlende Seite',
    einleitung:
      'Welche Formel dir die fehlende Seite liefert, entscheidet ein einziger Blick auf das Dreieck: Ist es rechtwinklig, reicht der Satz des Pythagoras. Ist es das nicht, übernimmt der Kosinussatz – er ist sozusagen der Pythagoras mit Korrekturterm für schiefe Winkel. Und wenn du eine Seite samt ihrem Gegenwinkel kennst, geht es über den Sinussatz am schnellsten. Trag deine bekannten Werte oben ein, der Rechner ergänzt die fehlenden Seiten.',
    brauchtWerte: [
      'Zwei Seiten im rechtwinkligen Dreieck (Pythagoras)',
      'oder zwei Seiten und den Winkel dazwischen (Kosinussatz)',
      'oder eine Seite mit Gegenwinkel plus einen weiteren Winkel (Sinussatz)',
    ],
    formeln: [
      {
        formel: 'c² = a² + b²',
        erklaerung: 'Der Satz des Pythagoras – aber nur im rechtwinkligen Dreieck. c ist dabei immer die Hypotenuse, also die Seite gegenüber dem rechten Winkel und damit die längste.',
      },
      {
        formel: 'a² = b² + c² − 2 · b · c · cos α',
        erklaerung: 'Der Kosinussatz. Bei α = 90° wird cos α = 0 und die Formel fällt auf den Pythagoras zurück – deshalb ist er dessen allgemeine Fassung.',
      },
      {
        formel: 'a = b · sin α / sin β',
        erklaerung: 'Der Sinussatz, nach einer Seite umgestellt. Du brauchst dafür ein vollständiges Paar aus Seite und Gegenwinkel plus den Winkel gegenüber der gesuchten Seite.',
      },
    ],
    rechenweg: {
      aufgabe: 'Zwei Wände treffen in einem Winkel von 110° aufeinander. Die eine misst 3,00 m, die andere 4,00 m. Wie lang wird die Diagonalstrebe zwischen den beiden Endpunkten?',
      schritte: [
        'Kosinussatz ansetzen: a² = b² + c² − 2 · b · c · cos α mit b = 3,00 m, c = 4,00 m, α = 110°',
        'Quadrate bilden: a² = 9 + 16 − 2 · 3 · 4 · cos 110°',
        'Kosinus einsetzen: cos 110° ≈ −0,342 – der Wert ist negativ, weil der Winkel stumpf ist',
        'Ausrechnen: a² = 25 − 24 · (−0,342) = 25 + 8,21 = 33,21',
        'Wurzel ziehen: a = √33,21 ≈ 5,76 m. Die Strebe muss also gut 5,76 m lang sein.',
      ],
    },
    haeufigeFehler: [
      'Der Pythagoras wird auf ein schiefwinkliges Dreieck angewendet. Ohne rechten Winkel gilt er nicht – dort brauchst du den Kosinussatz.',
      'Das Minuszeichen im Kosinussatz wird bei stumpfen Winkeln falsch behandelt. Ein negativer Kosinus verlängert die gegenüberliegende Seite, das doppelte Minus muss stehen bleiben.',
      'Am Ende wird die Wurzel vergessen. Der Kosinussatz liefert a², nicht a.',
    ],
    matheThemen: ['Geometry', 'Trigonometry'],
  },

  {
    id: 'dreieck-umfang',
    titel: 'Dreieck Umfang berechnen – online mit Rechenweg',
    beschreibung: 'Umfang eines Dreiecks berechnen: Summe der drei Seiten, auch wenn eine Seite fehlt. Online-Rechner, der die fehlende Seite ergänzt und den Umfang ausgibt.',
    h1: 'Dreieck Umfang berechnen',
    linkText: 'Umfang',
    linkBeschreibung: 'Summe der drei Seiten – auch wenn eine davon noch fehlt',
    einleitung:
      'Der Umfang ist die simpelste Größe am Dreieck: einmal außen herum, also a plus b plus c. Der eigentliche Aufwand steckt fast immer darin, eine noch fehlende Seite zu bestimmen – über den Pythagoras, den Kosinussatz oder den Sinussatz. Genau das übernimmt der Rechner oben: Er ergänzt aus deinen drei Angaben zuerst die fehlenden Seiten und addiert sie dann.',
    brauchtWerte: [
      'Alle drei Seiten a, b und c – dann ist es reine Addition',
      'oder drei beliebige Angaben, aus denen sich die fehlenden Seiten ergeben',
    ],
    formeln: [
      {
        formel: 'U = a + b + c',
        erklaerung: 'Der Umfang ist die Summe der drei Seitenlängen. Mehr steckt nicht dahinter – vorausgesetzt, alle drei Werte liegen in derselben Einheit vor.',
      },
      {
        formel: 's = U / 2',
        erklaerung: 'Der halbe Umfang, in Formelsammlungen meist s genannt. Du brauchst ihn für die Formel von Heron und für den Radius des Inkreises.',
      },
      {
        formel: 'U = a + b + √(a² + b² − 2ab · cos γ)',
        erklaerung: 'Fehlt dir die dritte Seite, setzt du erst den Kosinussatz ein und addierst danach. Bei γ = 90° vereinfacht sich der Wurzelterm zum Pythagoras.',
      },
    ],
    rechenweg: {
      aufgabe: 'Ein dreieckiges Beet soll eine Rasenkante bekommen. Die Seiten sind 2,50 m, 3,20 m und 4,10 m lang. Wie viel Kantenband wird gebraucht?',
      schritte: [
        'Alle drei Seiten notieren: a = 2,50 m, b = 3,20 m, c = 4,10 m',
        'Addieren: U = 2,50 + 3,20 + 4,10',
        'Ergebnis: U = 9,80 m',
        'Für den Zuschnitt rund 10 % Reserve einplanen: 9,80 · 1,1 ≈ 10,8 m',
        'Also eine 11-Meter-Rolle kaufen.',
      ],
    },
    haeufigeFehler: [
      'Umfang und Fläche werden verwechselt. Der Umfang hat die Einheit einer Länge (m), die Fläche eine Quadrateinheit (m²).',
      'Es wird mit gemischten Einheiten addiert. Rechne Zentimeter und Meter erst um, bevor du summierst.',
      'Bei einer nur teilweise bekannten Figur wird geschätzt statt gerechnet. Die fehlende Seite lässt sich aus drei Angaben immer sauber bestimmen.',
    ],
    matheThemen: ['Geometry'],
  },
]

export const DREIECK_THEMEN_IDS = DREIECK_THEMEN.map(t => t.id)

export function themaAusId(id: string): DreieckThema | undefined {
  return DREIECK_THEMEN.find(t => t.id === id)
}

interface FormulaBlock {
  formula: string
  explanation: string
}

interface ShapeInfoData {
  title: string
  intro: string
  examples: string[]
  formulas: FormulaBlock[]
  workedExample: {
    setup: string
    steps: string[]
  }
  funFacts: string[]
}

const INFO: Record<string, ShapeInfoData> = {
  dreieck: {
    title: 'Dreieck berechnen – Fläche, Winkel, Höhen & Seiten',
    intro: 'Das Dreieck ist die einfachste Figur mit geraden Seiten – und eine der wichtigsten in Mathe und Handwerk. Du findest es überall: im Dachgiebel, beim Segeln, auf Verkehrsschildern und sogar in der Brückenkonstruktion. Mit diesem Rechner gibst du einfach drei bekannte Werte ein (Seiten, Winkel oder Höhen) und bekommst sofort alle fehlenden Maße – Fläche, Umfang, Höhen, Winkel und sogar den Inkreis- und Umkreisradius.',
    examples: [
      'Du willst eine dreieckige Giebelwand streichen und brauchst die Fläche, um die Farbmenge zu berechnen? Miss die Breite unten (Seite a) und die Höhe bis zur Spitze – fertig.',
      'Für ein dreieckiges Sonnensegel brauchst du den Stoffbedarf? Gib die drei Seitenlängen ein und lies die Fläche ab.',
      'Dein Mathelehrer gibt dir zwei Seiten und einen Winkel – trag die Werte ein und der Rechner zeigt dir Schritt für Schritt den Lösungsweg.',
      'Du planst ein dreieckiges Beet im Garten? Gib die drei Seiten ein und erfahre sofort, wie viel Erde du brauchst.',
    ],
    formulas: [
      { formula: 'A = (a · hₐ) / 2', explanation: 'Die Fläche (A) ist die halbe Grundseite (a) mal die Höhe (hₐ), die senkrecht auf dieser Seite steht.' },
      { formula: 'U = a + b + c', explanation: 'Der Umfang (U) ist die Summe aller drei Seiten.' },
      { formula: 'a² = b² + c² − 2bc · cos(α)', explanation: 'Der Kosinussatz: Damit berechnest du eine Seite, wenn du die beiden anderen Seiten und den eingeschlossenen Winkel (α) kennst.' },
      { formula: 'a / sin(α) = b / sin(β) = c / sin(γ)', explanation: 'Der Sinussatz: Das Verhältnis jeder Seite zum Sinus ihres Gegenwinkels ist immer gleich. Damit findest du fehlende Winkel oder Seiten.' },
    ],
    workedExample: {
      setup: 'Stell dir vor, du hast ein Dreieck mit den Seiten a = 5 cm, b = 7 cm und c = 8 cm und willst die Fläche berechnen.',
      steps: [
        'Zuerst den Umfang berechnen: U = 5 + 7 + 8 = 20 cm',
        'Dann die Hälfte davon (den sogenannten „halben Umfang" s): s = 20 / 2 = 10 cm',
        'Jetzt die Formel von Heron anwenden: A = √(s · (s−a) · (s−b) · (s−c))',
        'Einsetzen: A = √(10 · 5 · 3 · 2) = √300 ≈ 17,32 cm²',
        'Ergebnis: Die Fläche deines Dreiecks beträgt etwa 17,32 cm².',
      ],
    },
    funFacts: [
      'Die drei Winkel in jedem Dreieck ergeben zusammen immer exakt 180° – egal wie schief oder spitz das Dreieck ist.',
      'Dreiecke sind die stabilste geometrische Form. Deshalb werden Brücken, Kräne und Fachwerkwände aus Dreiecken gebaut.',
      'Das Bermudadreieck im Atlantik ist eigentlich kein perfektes Dreieck – aber der Name klingt natürlich spannender als „Bermuda-Ungefähr-Dreieck".',
    ],
  },

  kreis: {
    title: 'Kreis berechnen – Radius, Durchmesser, Fläche & Umfang',
    intro: 'Der Kreis begegnet dir jeden Tag: Uhren, Räder, Pizzen, Teller, Rohre und Gullydeckel – alles rund. Gib einfach einen Wert ein, den du kennst (Radius, Durchmesser, Fläche oder Umfang), und der Rechner berechnet sofort alle anderen Größen. Ideal, wenn du schnell wissen willst, wie viel Fläche ein rundes Beet hat oder welchen Durchmesser du für ein Rohr brauchst.',
    examples: [
      'Du willst eine runde Poolabdeckung kaufen und kennst den Durchmesser? Gib ihn ein und lies die Fläche ab – so weißt du, welche Plangröße du brauchst.',
      'Beim Verlegen von Rohren brauchst du den Umfang, um das Dichtungsband abzuschneiden? Gib den Durchmesser ein und der Umfang wird sofort berechnet.',
      'Du backst eine runde Torte und willst den Fondant berechnen? Der Durchmesser deiner Form reicht als Eingabe.',
      'In der Schule sollst du aus der Fläche den Radius bestimmen? Gib die Fläche ein – der Rechner rechnet rückwärts.',
    ],
    formulas: [
      { formula: 'A = π · r²', explanation: 'Die Fläche (A) berechnet sich aus der Kreiszahl Pi (≈ 3,14159) mal dem Radius (r) zum Quadrat.' },
      { formula: 'U = 2 · π · r', explanation: 'Der Umfang (U) ist zwei mal Pi mal der Radius – also die Strecke einmal komplett um den Kreis herum.' },
      { formula: 'd = 2 · r', explanation: 'Der Durchmesser (d) ist einfach der doppelte Radius – die Strecke quer durch den Kreis von Rand zu Rand.' },
    ],
    workedExample: {
      setup: 'Dein runder Gartenteich hat einen Durchmesser von 3 Metern. Wie groß ist die Wasserfläche?',
      steps: [
        'Radius berechnen: r = d / 2 = 3 / 2 = 1,5 m',
        'Fläche einsetzen: A = π · r² = π · 1,5² = π · 2,25',
        'Ergebnis: A ≈ 7,07 m²',
        'Dein Teich hat also eine Wasserfläche von gut 7 Quadratmetern.',
      ],
    },
    funFacts: [
      'Die Zahl Pi (π) hat unendlich viele Nachkommastellen ohne sich je zu wiederholen. Der aktuelle Rekord liegt bei über 100 Billionen berechneten Stellen.',
      'Ein Rad ist nur deshalb rund, weil jeder Punkt auf dem Rand den gleichen Abstand zur Mitte hat – genau das ist die Definition eines Kreises.',
      'Der Äquator der Erde ist ein riesiger Kreis mit einem Umfang von etwa 40.075 km.',
    ],
  },

  rechteck: {
    title: 'Rechteck berechnen – Fläche, Umfang & Diagonale',
    intro: 'Das Rechteck ist die Form, die dir im Alltag am häufigsten begegnet: Zimmer, Fenster, Türen, Bildschirme, Bücher und Grundstücke – fast alles ist rechteckig. Gib einfach zwei Werte ein, die du kennst, und der Rechner liefert dir Fläche, Umfang und Diagonale. Auch umgekehrt: Wenn du die Diagonale und eine Seite hast, rechnet er dir die fehlende Seite aus.',
    examples: [
      'Du willst ein Zimmer (4,5 m × 3,2 m) streichen und musst die Wandfläche kennen? Trag Länge und Breite ein.',
      'Du verlegst Laminat und brauchst die Quadratmeter? Einfach die Raummaße eingeben und die Fläche ablesen.',
      'Für einen Gartenzaun brauchst du den Umfang deines Grundstücks? Länge und Breite reichen.',
      'Du willst wissen, ob dein neues Regal diagonal durch die Tür passt? Berechne die Diagonale der Türöffnung.',
    ],
    formulas: [
      { formula: 'A = a · b', explanation: 'Die Fläche (A) ist Länge (a) mal Breite (b) – so einfach ist das beim Rechteck.' },
      { formula: 'U = 2 · (a + b)', explanation: 'Der Umfang (U) ist die Summe aller vier Seiten: zweimal die Länge plus zweimal die Breite.' },
      { formula: 'd = √(a² + b²)', explanation: 'Die Diagonale (d) berechnet sich mit dem Satz des Pythagoras – sie ist die Strecke von einer Ecke zur gegenüberliegenden.' },
    ],
    workedExample: {
      setup: 'Dein Wohnzimmer ist 5 m lang und 3,5 m breit. Du willst neuen Teppichboden verlegen.',
      steps: [
        'Fläche: A = 5 · 3,5 = 17,5 m²',
        'Umfang (falls du eine Sockelleiste brauchst): U = 2 · (5 + 3,5) = 17 m',
        'Diagonale (um zu prüfen, ob dein Bücherregal reinpasst): d = √(25 + 12,25) = √37,25 ≈ 6,10 m',
        'Du brauchst also 17,5 m² Teppich und 17 m Sockelleiste.',
      ],
    },
    funFacts: [
      'DIN-A-Papierformate (A4, A3 usw.) sind so konstruiert, dass sich beim Halbieren immer wieder das gleiche Seitenverhältnis ergibt: 1 zu √2.',
      'Das „goldene Rechteck" mit dem Seitenverhältnis 1 : 1,618 gilt als besonders ästhetisch – du findest es in Kunst, Architektur und sogar bei Kreditkarten.',
      'Ein Quadrat ist ein Sonderfall des Rechtecks, bei dem alle vier Seiten gleich lang sind.',
    ],
  },

  trapez: {
    title: 'Trapez berechnen – Fläche, Umfang & Höhe',
    intro: 'Ein Trapez hat genau ein Paar paralleler Seiten – die obere und untere Grundlinie. Du findest Trapeze überall: bei Dachformen, Brückenquerschnitten, Handtaschen und sogar bei manchen Grundstücken. Trag einfach die Seiten und die Höhe ein, und der Rechner ermittelt sofort Fläche und Umfang.',
    examples: [
      'Dein Dach hat einen trapezförmigen Querschnitt? Miss die obere Kante, die untere Kante und die Höhe – schon hast du die Fläche für die Dämmung.',
      'Dein Grundstück ist vorne breiter als hinten? Mit den beiden Grundlinien und der Tiefe berechnest du die genaue Fläche.',
      'Du nähst eine trapezförmige Tasche und brauchst den Stoffbedarf? Gib die Maße ein und lies die Fläche ab.',
      'In der Mathearbeit kommt ein Trapez dran? Übe mit echten Zahlen und sieh dir den Rechenweg an.',
    ],
    formulas: [
      { formula: 'A = (a + c) / 2 · h', explanation: 'Die Fläche (A) ist der Durchschnitt der beiden parallelen Seiten (a und c) mal die Höhe (h) – also der senkrechte Abstand zwischen oben und unten.' },
      { formula: 'U = a + b + c + d', explanation: 'Der Umfang (U) ist die Summe aller vier Seiten.' },
    ],
    workedExample: {
      setup: 'Dein Garagentor hat die Form eines Trapezes: unten 3 m breit, oben 2,4 m breit, Höhe 2,2 m.',
      steps: [
        'Durchschnitt der parallelen Seiten: (3 + 2,4) / 2 = 2,7 m',
        'Fläche: A = 2,7 · 2,2 = 5,94 m²',
        'Das Garagentor hat eine Fläche von knapp 6 m².',
      ],
    },
    funFacts: [
      'Das Wort „Trapez" kommt aus dem Griechischen und bedeutet „Tischchen" – weil die Form an einen kleinen Tisch erinnert.',
      'In Amerika heißt ein Trapez „trapezoid", während „trapezium" dort etwas ganz anderes ist – das sorgt regelmäßig für Verwirrung.',
      'Viele Staudämme haben im Querschnitt eine Trapezform, weil das den Wasserdruck besonders gut verteilt.',
    ],
  },

  parallelogramm: {
    title: 'Parallelogramm berechnen – Fläche, Umfang & Diagonalen',
    intro: 'Beim Parallelogramm liegen immer zwei Seitenpaare parallel zueinander – wie ein „schiefes Rechteck". Du findest diese Form bei schrägen Fenstern, Parkettmustern und vielen technischen Bauteilen. Gib Seitenlängen, Winkel oder Höhe ein, und der Rechner ermittelt alles Weitere: Fläche, Umfang und die Länge der Diagonalen.',
    examples: [
      'Du verlegst Fliesen in Parallelogrammform und brauchst die Fläche pro Fliese? Gib Seitenlänge und Höhe ein.',
      'Beim Stoffzuschnitt für ein schräggeschnittenes Kissen brauchst du die exakte Fläche? Die Seitenlängen und ein Winkel reichen.',
      'Du willst ein schiefes Regal bauen und musst die Diagonale für die Rückwand kennen? Der Rechner zeigt sie dir.',
      'Im Matheunterricht sollst du beweisen, dass die Diagonalen sich gegenseitig halbieren? Rechne es mit konkreten Zahlen nach.',
    ],
    formulas: [
      { formula: 'A = a · h', explanation: 'Die Fläche (A) ist Grundseite (a) mal die zugehörige Höhe (h) – genau wie beim Rechteck, nur dass die Höhe schräg gemessen wird.' },
      { formula: 'U = 2 · (a + b)', explanation: 'Der Umfang (U) ist zweimal Seite a plus zweimal Seite b – die gegenüberliegenden Seiten sind ja gleich lang.' },
      { formula: 'd₁² + d₂² = 2(a² + b²)', explanation: 'Die Summe der Diagonalen-Quadrate ist doppelt so groß wie die Summe der Seiten-Quadrate – der sogenannte Parallelogrammsatz.' },
    ],
    workedExample: {
      setup: 'Du hast Fliesen in Parallelogrammform: Seite a = 30 cm, Seite b = 20 cm, Höhe h = 18 cm.',
      steps: [
        'Fläche: A = a · h = 30 · 18 = 540 cm²',
        'Umfang: U = 2 · (30 + 20) = 100 cm',
        'Für einen Quadratmeter Boden brauchst du also etwa 10.000 / 540 ≈ 19 Fliesen.',
      ],
    },
    funFacts: [
      'Jedes Rechteck ist automatisch auch ein Parallelogramm – aber nicht jedes Parallelogramm ist ein Rechteck (dafür bräuchte es 90°-Winkel).',
      'Die Diagonalen eines Parallelogramms halbieren sich immer gegenseitig – das kannst du mit einem Lineal nachmessen.',
      'Scheibenwischer beschreiben beim Wischen eine parallelogrammförmige Fläche.',
    ],
  },

  raute: {
    title: 'Raute berechnen – Fläche, Umfang & Diagonalen',
    intro: 'Die Raute (auch Rhombus genannt) ist ein Viereck, bei dem alle vier Seiten gleich lang sind – wie ein auf die Spitze gestelltes Quadrat. Du kennst die Form von Spielkarten (Karo), Verkehrsschildern und Fliesenmustern. Gib die Seitenlänge und einen Winkel ein – oder die beiden Diagonalen – und der Rechner berechnet den Rest.',
    examples: [
      'Du willst rautenförmige Fliesen verlegen und brauchst die Fläche pro Stück? Gib die Diagonalen ein und du weißt Bescheid.',
      'Für ein rautenförmiges Fenster brauchst du den Glasflächenbedarf? Seitenlänge und ein Winkel reichen.',
      'Du bastelst einen Drachen und willst die Folienfläche berechnen? Die Drachenform ist eine Raute – gib die Diagonalen ein.',
      'In der Geometriestunde musst du aus der Seitenlänge und einem Winkel die Diagonalen bestimmen? Dieser Rechner zeigt dir den Weg.',
    ],
    formulas: [
      { formula: 'A = (d₁ · d₂) / 2', explanation: 'Die Fläche (A) ist das halbe Produkt der beiden Diagonalen (d₁ und d₂), die sich rechtwinklig kreuzen.' },
      { formula: 'U = 4 · a', explanation: 'Der Umfang (U) ist einfach viermal die Seitenlänge (a), weil alle Seiten gleich lang sind.' },
      { formula: 'a = √((d₁/2)² + (d₂/2)²)', explanation: 'Die Seitenlänge berechnet sich aus den halben Diagonalen mit dem Satz des Pythagoras.' },
    ],
    workedExample: {
      setup: 'Du hast ein rautenförmiges Pflastermuster mit den Diagonalen d₁ = 40 cm und d₂ = 30 cm.',
      steps: [
        'Fläche: A = (40 · 30) / 2 = 600 cm²',
        'Seitenlänge: a = √(20² + 15²) = √(400 + 225) = √625 = 25 cm',
        'Umfang: U = 4 · 25 = 100 cm',
        'Jeder Pflasterstein hat also eine Fläche von 600 cm² und einen Umfang von 1 Meter.',
      ],
    },
    funFacts: [
      'Das Quadrat ist ein Sonderfall der Raute – nämlich eine Raute, bei der alle Winkel 90° betragen.',
      'Das Karo-Symbol auf Spielkarten ist eine Raute. In der Heraldik (Wappenkunde) steht die Raute für Ehrlichkeit.',
      'Viele Kristalle in der Natur wachsen in Rautenform, zum Beispiel bestimmte Salzkristalle.',
    ],
  },

  wuerfel: {
    title: 'Würfel berechnen – Volumen, Oberfläche & Diagonalen',
    intro: 'Der Würfel ist der perfekte 3D-Körper: sechs gleich große quadratische Flächen, zwölf gleich lange Kanten, acht Ecken. Du kennst ihn vom Spielwürfel, von Zuckerwürfeln und von Bauklötzen. Gib einfach die Kantenlänge ein, und der Rechner berechnet sofort Volumen, Oberfläche, Flächendiagonale und Raumdiagonale.',
    examples: [
      'Du willst eine Geschenkbox in Würfelform basteln und brauchst die Kartonfläche? Gib die Kantenlänge ein und lies die Oberfläche ab.',
      'Du baust ein Hochbeet als Würfel und willst wissen, wie viel Erde reinpasst? Das Volumen verrät es dir.',
      'Für ein würfelförmiges Aquarium brauchst du die Wassermenge in Litern? Berechne das Volumen in cm³ und teile durch 1000.',
      'Im Matheunterricht musst du die Raumdiagonale eines Würfels berechnen? Gib die Kantenlänge ein.',
    ],
    formulas: [
      { formula: 'V = a³', explanation: 'Das Volumen (V) ist die Kantenlänge (a) hoch drei – also a mal a mal a.' },
      { formula: 'O = 6 · a²', explanation: 'Die Oberfläche (O) besteht aus sechs Quadraten, also sechsmal die Kantenlänge zum Quadrat.' },
      { formula: 'd = a · √3', explanation: 'Die Raumdiagonale (d) – von einer Ecke quer durch den Würfel zur gegenüberliegenden Ecke – ist a mal Wurzel aus 3.' },
      { formula: 'f = a · √2', explanation: 'Die Flächendiagonale (f) – von einer Ecke einer Fläche zur gegenüberliegenden Ecke derselben Fläche – ist a mal Wurzel aus 2.' },
    ],
    workedExample: {
      setup: 'Du baust einen Würfel-Hocker mit einer Kantenlänge von 40 cm und willst ihn mit Stoff bespannen.',
      steps: [
        'Oberfläche: O = 6 · 40² = 6 · 1600 = 9600 cm²',
        'In Quadratmetern: 9600 / 10000 = 0,96 m²',
        'Volumen (falls du ihn mit Schaumstoff füllen willst): V = 40³ = 64.000 cm³ = 64 Liter',
        'Du brauchst also knapp 1 m² Stoff und 64 Liter Füllung.',
      ],
    },
    funFacts: [
      'Ein normaler Spielwürfel hat gegenüberliegende Seiten, die zusammen immer 7 ergeben: 1+6, 2+5, 3+4.',
      'Wenn du einen Würfel an einer Ecke aufstellst und von oben draufschaust, siehst du ein regelmäßiges Sechseck.',
      'Der berühmte Zauberwürfel (Rubik\'s Cube) hat 43.252.003.274.489.856.000 verschiedene Stellungen.',
    ],
  },

  quader: {
    title: 'Quader berechnen – Volumen, Oberfläche & Raumdiagonale',
    intro: 'Der Quader ist der 3D-Körper, den du am häufigsten im Alltag siehst: Schuhkartons, Zimmer, Kühlschränke, Bücher, Pakete – alles Quader. Er hat drei verschiedene Kantenlängen: Länge, Breite und Höhe. Gib sie ein, und der Rechner berechnet sofort Volumen, Oberfläche und die Raumdiagonale.',
    examples: [
      'Du willst wissen, ob dein neues Sofa ins Zimmer passt? Berechne die Raumdiagonale der Tür, um sicherzugehen.',
      'Du packst ein Paket (60 × 40 × 30 cm) und willst den Geschenkpapierbedarf? Die Oberfläche verrät es dir.',
      'Für einen Umzugskarton (Innenmaße) willst du wissen, wie viel reinpasst? Das Volumen in Litern hilft.',
      'Du planst ein Zimmer umzustreichen und brauchst die Wandfläche? Berechne die Oberfläche und ziehe Boden und Decke ab.',
    ],
    formulas: [
      { formula: 'V = a · b · c', explanation: 'Das Volumen (V) ist Länge (a) mal Breite (b) mal Höhe (c) – alle drei Kanten miteinander multipliziert.' },
      { formula: 'O = 2 · (ab + bc + ac)', explanation: 'Die Oberfläche (O) besteht aus drei verschiedenen Flächenpaaren: je zweimal Länge×Breite, Breite×Höhe und Länge×Höhe.' },
      { formula: 'd = √(a² + b² + c²)', explanation: 'Die Raumdiagonale (d) – von einer Ecke quer durch den gesamten Quader – berechnet sich mit dem erweiterten Satz des Pythagoras.' },
    ],
    workedExample: {
      setup: 'Dein Zimmer ist 4 m lang, 3 m breit und 2,5 m hoch. Du willst alle vier Wände streichen.',
      steps: [
        'Gesamte Oberfläche: O = 2 · (4·3 + 3·2,5 + 4·2,5) = 2 · (12 + 7,5 + 10) = 2 · 29,5 = 59 m²',
        'Davon abziehen: Boden (4 · 3 = 12 m²) und Decke (12 m²) = 24 m²',
        'Wandfläche: 59 − 24 = 35 m²',
        'Bei 10 m² pro Liter Farbe brauchst du also 3,5 Liter.',
      ],
    },
    funFacts: [
      'Der Würfel ist ein Sonderfall des Quaders, bei dem alle drei Kanten gleich lang sind.',
      'Ein Standard-Schiffscontainer (20 Fuß) hat ein Innenvolumen von etwa 33 Kubikmetern – das sind 33.000 Liter.',
      'Die meisten Zimmer sind Quader, aber viele ältere Häuser haben Wände, die nicht ganz rechtwinklig sind – dann stimmt die Berechnung nur ungefähr.',
    ],
  },

  kugel: {
    title: 'Kugel berechnen – Volumen & Oberfläche',
    intro: 'Die Kugel ist die perfekteste Form in der Natur: Seifenblasen, Planeten, Bälle und Murmeln – alles ist kugelförmig, weil die Kugel bei gleichem Volumen die kleinste Oberfläche hat. Gib einfach den Radius (oder Durchmesser) ein, und du erhältst sofort Volumen und Oberfläche.',
    examples: [
      'Du willst einen Fußball (Durchmesser 22 cm) mit Farbe bemalen? Die Oberfläche verrät dir den Farbverbrauch.',
      'Für einen kugelförmigen Gastank brauchst du das Fassungsvermögen? Gib den Radius ein und rechne das Volumen in Liter um.',
      'Du bastelst Christbaumkugeln und willst den Glitzerbedarf berechnen? Die Oberfläche ist die Antwort.',
      'In Physik sollst du das Volumen der Erde berechnen? Radius eingeben (6.371 km) – fertig.',
    ],
    formulas: [
      { formula: 'V = (4/3) · π · r³', explanation: 'Das Volumen (V) ist vier Drittel mal Pi mal Radius (r) hoch drei. Die Kugel braucht drei Dimensionen, deshalb steht der Radius in der dritten Potenz.' },
      { formula: 'O = 4 · π · r²', explanation: 'Die Oberfläche (O) ist viermal Pi mal Radius zum Quadrat – genau vier Kreisflächen mit demselben Radius.' },
      { formula: 'd = 2 · r', explanation: 'Der Durchmesser (d) ist doppelt so groß wie der Radius – die Strecke quer durch die Kugel.' },
    ],
    workedExample: {
      setup: 'Ein Basketball hat einen Durchmesser von 24 cm. Wie viel Luft passt rein?',
      steps: [
        'Radius: r = 24 / 2 = 12 cm',
        'Volumen: V = (4/3) · π · 12³ = (4/3) · π · 1728',
        'V ≈ 7238 cm³ ≈ 7,24 Liter',
        'Ein Basketball fasst also gut 7 Liter Luft.',
      ],
    },
    funFacts: [
      'Seifenblasen sind immer kugelförmig, weil die Kugel die Form mit der kleinsten Oberfläche bei gegebenem Volumen ist – die Seife „will" möglichst wenig Fläche.',
      'Die Erde ist keine perfekte Kugel, sondern am Äquator etwas dicker – man nennt das ein „Rotationsellipsoid".',
      'Wenn du den Radius einer Kugel verdoppelst, wird das Volumen achtmal (2³) so groß, aber die Oberfläche nur viermal (2²).',
    ],
  },

  zylinder: {
    title: 'Zylinder berechnen – Volumen, Mantel- & Oberfläche',
    intro: 'Zylinder sind überall: Getränkedosen, Rohre, Kerzen, Baumstämme, Regenfässer und Säulen. Der Zylinder besteht aus zwei gleichen Kreisflächen (oben und unten) und einer Mantelfläche, die sich wie ein Blatt Papier um die Kreise wickelt. Gib Radius und Höhe ein, und du bekommst alles: Volumen, Mantelfläche, Grundfläche und Gesamtoberfläche.',
    examples: [
      'Du willst wissen, wie viel Wasser in deine Regentonne passt? Miss den Durchmesser und die Höhe – der Rechner gibt dir das Volumen in cm³ (durch 1000 = Liter).',
      'Für ein zylindrisches Geschenk brauchst du Geschenkpapier? Die Mantelfläche verrät dir, wie viel du brauchst.',
      'Du berechnest den Materialverbrauch für ein Ofenrohr? Durchmesser und Länge eingeben, Mantelfläche ablesen.',
      'In der Schule sollst du das Volumen einer Konservendose berechnen? Miss Durchmesser und Höhe mit dem Lineal.',
    ],
    formulas: [
      { formula: 'V = π · r² · h', explanation: 'Das Volumen (V) ist die Grundfläche (π · r²) mal die Höhe (h) – wie ein Stapel aus unendlich vielen dünnen Kreisscheiben.' },
      { formula: 'M = 2 · π · r · h', explanation: 'Die Mantelfläche (M) ist wie ein aufgerolltes Rechteck: die Breite ist der Umfang des Kreises (2πr), die Höhe ist h.' },
      { formula: 'O = 2 · π · r · (r + h)', explanation: 'Die Gesamtoberfläche (O) ist die Mantelfläche plus die beiden Kreisflächen oben und unten.' },
      { formula: 'G = π · r²', explanation: 'Die Grundfläche (G) ist ein Kreis mit dem Radius r.' },
    ],
    workedExample: {
      setup: 'Deine Regentonne hat einen Durchmesser von 60 cm und ist 90 cm hoch. Wie viel Wasser passt rein?',
      steps: [
        'Radius: r = 60 / 2 = 30 cm',
        'Volumen: V = π · 30² · 90 = π · 900 · 90 = π · 81.000',
        'V ≈ 254.469 cm³',
        'In Litern: 254.469 / 1000 ≈ 254 Liter',
        'Deine Regentonne fasst also rund 254 Liter.',
      ],
    },
    funFacts: [
      'Getränkedosen sind so konstruiert, dass sie mit möglichst wenig Material möglichst viel Inhalt fassen – ein optimierter Zylinder.',
      'Wenn du ein Blatt Papier zu einer Röhre rollst, hast du einen Zylindermantel gebastelt. Die Fläche des Papiers ist die Mantelfläche.',
      'Baumstämme sind natürliche Zylinder. Förster berechnen das Holzvolumen mit der Zylinderformel und einem „Formfaktor" für die Verjüngung.',
    ],
  },

  kegel: {
    title: 'Kegel berechnen – Volumen, Mantelfläche & Mantellinie',
    intro: 'Kegel begegnen dir öfter als du denkst: Eistüten, Partyhüte, Trichter, Kirchturmspitzen und Pylonen. Der Kegel hat eine kreisförmige Grundfläche und läuft nach oben zu einer Spitze zusammen. Gib Radius und Höhe ein, und der Rechner berechnet alles: Mantellinie, Volumen, Mantelfläche und Gesamtoberfläche.',
    examples: [
      'Du bastelst einen Partyhut und willst wissen, wie viel Karton du brauchst? Gib den gewünschten Radius und die Höhe ein – die Mantelfläche ist dein Kartonbedarf.',
      'Du baust einen Trichter und willst das Fassungsvermögen wissen? Das Volumen verrät es dir.',
      'In der Eisdiele willst du ausrechnen, wie viel Eis in eine Waffel passt? Radius und Höhe der Waffel eingeben.',
      'Im Mathetest musst du die Mantellinie eines Kegels bestimmen? Radius und Höhe reichen aus.',
    ],
    formulas: [
      { formula: 's = √(r² + h²)', explanation: 'Die Mantellinie (s) ist die schräge Strecke von der Grundfläche zur Spitze – berechnet mit dem Satz des Pythagoras aus Radius (r) und Höhe (h).' },
      { formula: 'V = (1/3) · π · r² · h', explanation: 'Das Volumen (V) ist genau ein Drittel des Zylindervolumens mit gleichem Radius und gleicher Höhe. Drei Kegel füllen also einen Zylinder.' },
      { formula: 'M = π · r · s', explanation: 'Die Mantelfläche (M) ist Pi mal Radius mal Mantellinie – die Fläche des „aufgerollten" Kegelmantels.' },
      { formula: 'O = π · r · (r + s)', explanation: 'Die Gesamtoberfläche (O) ist die Mantelfläche plus die kreisförmige Grundfläche.' },
    ],
    workedExample: {
      setup: 'Du bastelst einen Partyhut mit 8 cm Radius und 20 cm Höhe.',
      steps: [
        'Mantellinie: s = √(8² + 20²) = √(64 + 400) = √464 ≈ 21,54 cm',
        'Mantelfläche: M = π · 8 · 21,54 ≈ 541 cm²',
        'Volumen (falls du ihn mit Konfetti füllen willst): V = (1/3) · π · 64 · 20 ≈ 1340 cm³ ≈ 1,34 Liter',
        'Du brauchst also gut 541 cm² Karton für den Hut.',
      ],
    },
    funFacts: [
      'Drei Kegel mit gleicher Grundfläche und Höhe passen genau in einen Zylinder – deshalb steht in der Volumenformel „ein Drittel".',
      'Viele Vulkane haben eine Kegelform. Der Fuji in Japan ist einer der berühmtesten Kegelberge der Welt.',
      'Wenn du ein Stück Pizza von der Spitze her aufrollst, bekommst du so etwas Ähnliches wie einen Kegelmantel.',
    ],
  },

  pyramide: {
    title: 'Pyramide berechnen – Volumen & Oberfläche',
    intro: 'Die Pyramide kennt jeder aus Ägypten – aber sie steckt auch in vielen anderen Dingen: Dachformen, Zelten, Kristallen und sogar im Louvre in Paris steht eine Glaspyramide. Dieser Rechner berechnet die quadratische Pyramide: Gib einfach die Grundkante und die Höhe ein und du bekommst Volumen, Mantelfläche, Grundfläche und Gesamtoberfläche.',
    examples: [
      'Du baust ein Vogelhaus mit Pyramidendach? Miss die Grundkante und die Dachhöhe, um den Holzbedarf für die vier schrägen Flächen zu berechnen.',
      'Du bastelst eine Pyramide aus Karton für ein Schulprojekt? Die Gesamtoberfläche verrät dir, wie viel Karton du brauchst.',
      'Du willst eine Sandpyramide im Sandkasten bauen und das Sandvolumen abschätzen? Grundkante und Höhe reichen.',
      'Im Matheunterricht kommt die Apothema (Schräghöhe der Seitenfläche) dran? Der Rechner berechnet sie automatisch.',
    ],
    formulas: [
      { formula: 'V = (1/3) · a² · h', explanation: 'Das Volumen (V) ist ein Drittel der Grundfläche (a²) mal die Höhe (h) – genau wie beim Kegel hat die Pyramide ein Drittel des Volumens eines Quaders.' },
      { formula: 's = √((a/2)² + h²)', explanation: 'Die Apothema (s) ist die Schräghöhe einer Seitenfläche – die Strecke von der Mitte einer Grundkante bis zur Spitze.' },
      { formula: 'M = 2 · a · s', explanation: 'Die Mantelfläche (M) besteht aus vier gleichen Dreiecken: zusammen ergibt sich 2 mal Grundkante mal Apothema.' },
      { formula: 'O = a² + 2 · a · s', explanation: 'Die Gesamtoberfläche (O) ist die Grundfläche (a²) plus die vier schrägen Dreiecksflächen (Mantelfläche).' },
    ],
    workedExample: {
      setup: 'Du baust eine Modellpyramide mit Grundkante a = 10 cm und Höhe h = 12 cm.',
      steps: [
        'Apothema: s = √((10/2)² + 12²) = √(25 + 144) = √169 = 13 cm',
        'Mantelfläche: M = 2 · 10 · 13 = 260 cm²',
        'Grundfläche: a² = 100 cm²',
        'Gesamtoberfläche: O = 100 + 260 = 360 cm²',
        'Volumen: V = (1/3) · 100 · 12 = 400 cm³',
        'Du brauchst 360 cm² Karton und die Pyramide fasst 400 cm³.',
      ],
    },
    funFacts: [
      'Die Große Pyramide von Gizeh hat eine Grundkante von 230 Metern und war mit 146 Metern Höhe über 3.800 Jahre lang das höchste Bauwerk der Welt.',
      'Die Seitenflächen der Cheops-Pyramide sind im Winkel von etwa 51,8° geneigt – fast exakt der Winkel, den ein Sandhaufen natürlich bildet.',
      'Genau wie beim Kegel gilt: Drei Pyramiden mit gleicher Grundfläche und Höhe ergeben das Volumen eines Quaders.',
    ],
  },
}

interface Props {
  shapeId: string
}

export function ShapeInfo({ shapeId }: Props) {
  const info = INFO[shapeId]
  if (!info) return null

  return (
    <section className="space-y-4 mt-4">
      {/* Einleitung */}
      <div className="rounded-2xl bg-white border border-blue-100 shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{info.title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{info.intro}</p>
      </div>

      {/* Praxisbeispiele */}
      <div className="rounded-2xl bg-white border border-blue-100 shadow-sm p-5">
        <h3 className="text-base font-bold text-gray-800 mb-3">Wann brauchst du das?</h3>
        <ul className="space-y-2">
          {info.examples.map((ex, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="leading-relaxed">{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Formeln mit Erklärung */}
      <div className="rounded-2xl bg-white border border-blue-100 shadow-sm p-5">
        <h3 className="text-base font-bold text-gray-800 mb-3">Formeln einfach erklärt</h3>
        <div className="space-y-3">
          {info.formulas.map((f, i) => (
            <div key={i} className="rounded-xl bg-blue-50 border border-blue-100 p-3">
              <p className="font-mono text-sm font-semibold text-blue-800">{f.formula}</p>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{f.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Durchgerechnetes Beispiel */}
      <div className="rounded-2xl bg-white border border-blue-100 shadow-sm p-5">
        <h3 className="text-base font-bold text-gray-800 mb-3">Beispielrechnung</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{info.workedExample.setup}</p>
        <ol className="space-y-2">
          {info.workedExample.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="leading-relaxed font-mono">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Wusstest du? */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 shadow-sm p-5">
        <h3 className="text-base font-bold text-amber-800 mb-3">Wusstest du?</h3>
        <ul className="space-y-2">
          {info.funFacts.map((fact, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-amber-900">
              <span className="mt-0.5 flex-shrink-0 text-amber-500 text-base leading-none">&#9733;</span>
              <span className="leading-relaxed">{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

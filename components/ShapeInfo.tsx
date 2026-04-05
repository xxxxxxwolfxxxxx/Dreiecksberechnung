const INFO: Record<string, { title: string; text: string; facts: string[] }> = {
  dreieck: {
    title: 'Dreieck berechnen – Fläche, Winkel, Höhen & Seiten',
    text: 'Ein Dreieck ist die einfachste geometrische Fläche mit drei Seiten und drei Winkeln. Mit diesem Rechner berechnest du alle Eigenschaften eines beliebigen Dreiecks – egal ob gleichseitig, gleichschenklig, rechtwinklig oder allgemein. Gib mindestens drei bekannte Größen ein (Seiten, Winkel oder Höhen) und der Rechner ermittelt automatisch alle fehlenden Werte inklusive Fläche, Umfang, Inkreis- und Umkreisradius.',
    facts: ['Winkelsumme im Dreieck = 180°', 'Fläche A = (a · h_a) / 2', 'Kosinussatz: a² = b² + c² − 2bc·cos(α)', 'Sinussatz: a/sin(α) = b/sin(β) = c/sin(γ)'],
  },
  kreis: {
    title: 'Kreis berechnen – Radius, Durchmesser, Fläche & Umfang',
    text: 'Der Kreis ist die symmetrischste geometrische Form. Mit diesem Rechner berechnest du aus einem bekannten Wert – Radius, Durchmesser, Fläche oder Umfang – sofort alle anderen Größen. Ideal für Schule, Handwerk und Technik: Rohrdurchmesser, Kreisflächen oder runde Bauteile lassen sich sekundenschnell bestimmen.',
    facts: ['Fläche A = π · r²', 'Umfang U = 2 · π · r', 'Durchmesser d = 2r', 'π ≈ 3,14159'],
  },
  rechteck: {
    title: 'Rechteck berechnen – Fläche, Umfang & Diagonale',
    text: 'Das Rechteck ist die häufigste geometrische Form im Alltag – von Zimmern über Fenster bis zu Bildschirmen. Dieser Rechner berechnet Fläche, Umfang und Diagonale aus jeweils zwei bekannten Größen. Du kannst auch aus Diagonale und einer Seite die fehlende Seite ermitteln.',
    facts: ['Fläche A = a · b', 'Umfang U = 2 · (a + b)', 'Diagonale d = √(a² + b²)', 'Alle Winkel = 90°'],
  },
  trapez: {
    title: 'Trapez berechnen – Fläche, Umfang & Höhe',
    text: 'Ein Trapez hat genau ein Paar paralleler Seiten (Grundlinien). Es kommt in Architektur, Technik und Natur häufig vor. Dieser Rechner bestimmt Fläche, Umfang und Höhe eines Trapezes aus den eingegebenen Seiten und Grundlinien.',
    facts: ['Fläche A = (a + c) / 2 · h', 'a und c sind die parallelen Seiten', 'Umfang U = a + b + c + d', 'Rechtwinkliges Trapez: ein Schenkel = h'],
  },
  parallelogramm: {
    title: 'Parallelogramm berechnen – Fläche, Umfang & Diagonalen',
    text: 'Im Parallelogramm sind gegenüberliegende Seiten parallel und gleich lang. Dieser Rechner berechnet Fläche, Umfang und beide Diagonalen. Rechteck und Raute sind Sonderfälle des Parallelogramms.',
    facts: ['Fläche A = a · h', 'Umfang U = 2 · (a + b)', 'Gegenüberliegende Winkel sind gleich', 'Diagonalen halbieren sich gegenseitig'],
  },
  raute: {
    title: 'Raute berechnen – Fläche, Umfang & Diagonalen',
    text: 'Eine Raute (Rhombus) hat vier gleich lange Seiten. Ihre Diagonalen stehen senkrecht aufeinander und halbieren sich. Dieser Rechner berechnet Fläche und Umfang aus Seitenlänge und einem Winkel oder aus den Diagonalen.',
    facts: ['Fläche A = (d₁ · d₂) / 2', 'Alle Seiten gleich lang', 'Diagonalen stehen senkrecht aufeinander', 'Quadrat = Raute mit 90°-Winkeln'],
  },
  wuerfel: {
    title: 'Würfel berechnen – Volumen, Oberfläche & Diagonalen',
    text: 'Der Würfel ist der einfachste dreidimensionale Körper – alle sechs Flächen sind gleich große Quadrate. Aus der Kantenlänge berechnet dieser Rechner sofort Volumen, Oberfläche, Raumdiagonale und Flächendiagonale. Ideal für Verpackungen, Behälter und geometrische Aufgaben.',
    facts: ['Volumen V = a³', 'Oberfläche A = 6 · a²', 'Raumdiagonale d = a · √3', 'Flächendiagonale f = a · √2'],
  },
  quader: {
    title: 'Quader berechnen – Volumen, Oberfläche & Raumdiagonale',
    text: 'Der Quader ist der häufigste 3D-Körper im Alltag – Schachteln, Zimmer, Pakete. Aus Länge, Breite und Höhe berechnet dieser Rechner Volumen, Oberfläche und Raumdiagonale. Nützlich für Umzug, Lagerung und Bauplanung.',
    facts: ['Volumen V = a · b · c', 'Oberfläche A = 2(ab + bc + ac)', 'Raumdiagonale d = √(a² + b² + c²)', 'Würfel = Sonderfall mit a = b = c'],
  },
  kugel: {
    title: 'Kugel berechnen – Volumen & Oberfläche',
    text: 'Die Kugel ist der dreidimensionale Körper mit dem günstigsten Verhältnis von Volumen zu Oberfläche. Dieser Rechner berechnet aus dem Radius sofort Volumen und Oberfläche. Anwendungen: Tanks, Sportbälle, Planetengröße, Füllmengen.',
    facts: ['Volumen V = (4/3) · π · r³', 'Oberfläche A = 4 · π · r²', 'Durchmesser d = 2r', 'Kugel hat die kleinste Oberfläche bei gleichem Volumen'],
  },
  zylinder: {
    title: 'Zylinder berechnen – Volumen, Mantel- & Oberfläche',
    text: 'Zylinder begegnen uns überall: Dosen, Rohre, Tanks, Säulen. Aus Radius und Höhe berechnet dieser Rechner Volumen, Mantelfläche, Grundfläche und Gesamtoberfläche – wichtig für Materialbedarf und Füllmengen.',
    facts: ['Volumen V = π · r² · h', 'Mantelfläche M = 2 · π · r · h', 'Oberfläche A = 2 · π · r · (r + h)', 'Grundfläche G = π · r²'],
  },
  kegel: {
    title: 'Kegel berechnen – Volumen, Mantelfläche & Mantellinie',
    text: 'Kegel kommen in Technik, Natur und Alltag vor: Trichter, Dächer, Eistüten. Dieser Rechner berechnet aus Radius und Höhe die Mantellinie, das Volumen, die Mantelfläche und die Gesamtoberfläche – inklusive schrittweiser Erklärung.',
    facts: ['Mantellinie s = √(r² + h²)', 'Volumen V = (1/3) · π · r² · h', 'Mantelfläche M = π · r · s', 'Oberfläche A = π · r · (r + s)'],
  },
  pyramide: {
    title: 'Pyramide berechnen – Volumen & Oberfläche',
    text: 'Die quadratische Pyramide – bekannt aus Ägypten – lässt sich aus Grundkante und Höhe vollständig berechnen. Dieser Rechner ermittelt Volumen, Mantelfläche, Grundfläche und Gesamtoberfläche samt verständlichem Rechenweg.',
    facts: ['Volumen V = (1/3) · a² · h', 'Apothema s = √((a/2)² + h²)', 'Mantelfläche M = 2 · a · s', 'Oberfläche A = a² + 2 · a · s'],
  },
}

interface Props {
  shapeId: string
}

export function ShapeInfo({ shapeId }: Props) {
  const info = INFO[shapeId]
  if (!info) return null

  return (
    <section className="rounded-2xl bg-white border border-blue-100 shadow-sm p-5 mt-4">
      <h2 className="text-base font-bold text-gray-800 mb-2">{info.title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{info.text}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {info.facts.map((fact, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">✓</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

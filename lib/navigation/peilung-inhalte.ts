/**
 * Redaktionelle Inhalte der beiden Peilungs-Rechner: Fließtext, Formelerklärung,
 * Beispielrechnung und FAQ. Getrennt von der Rechenlogik, damit Text und Mathe
 * unabhängig voneinander gepflegt werden können.
 *
 * Pro Seite steht genau ein weiterführender Link nach außen — dort, wo der
 * Text ihn inhaltlich braucht (Abschnitt „In der Praxis").
 */

export interface FaqEintrag {
  frage: string
  antwort: string
}

export interface FormelEintrag {
  formel: string
  erklaerung: string
}

export interface PeilungInhalt {
  /** Seitentitel für <title>. */
  metaTitel: string
  metaBeschreibung: string
  /** H2 über dem Erklärtext. */
  titel: string
  einleitung: string
  abschnitte: Array<{ titel: string; text: string }>
  formeln: FormelEintrag[]
  beispiel: { setup: string; schritte: string[] }
  praxis: {
    titel: string
    vorText: string
    linkText: string
    linkUrl: string
    nachText: string
  }
  faq: FaqEintrag[]
}

export const PEILUNG_INHALTE: Record<string, PeilungInhalt> = {
  kreuzpeilung: {
    metaTitel: 'Kreuzpeilung berechnen – Standort aus zwei Peilungen',
    metaBeschreibung:
      'Kreuzpeilung online berechnen: Entfernung zu zwei Landmarken und Abstand zur Basislinie aus zwei rechtweisenden Peilungen. Mit Warnung bei schleifendem Schnitt und Rechenweg.',
    titel: 'Kreuzpeilung – wie zwei Peilungen einen Standort ergeben',
    einleitung:
      'Eine Peilung allein sagt dir nur, in welcher Richtung ein Objekt liegt – du weißt danach, dass du irgendwo auf einer Linie stehst, aber nicht wo. Erst die zweite Peilung auf ein anderes Objekt macht daraus einen Punkt: Da wo sich die beiden Standlinien kreuzen, bist du. Genau das ist eine Kreuzpeilung, und mathematisch ist es nichts anderes als ein Dreieck, von dem du alle drei Winkel und eine Seite kennst.',
    abschnitte: [
      {
        titel: 'Das Dreieck hinter der Peilung',
        text: 'Die Ecken des Dreiecks sind dein Boot und die beiden gepeilten Objekte – zwei Landmarken, deren Abstand du aus der Seekarte abgreifen kannst. Dieser Abstand ist die Basis b, die einzige gemessene Länge im ganzen Ansatz. Die Winkel bekommst du geschenkt: Der Winkel an deinem Boot ist die Differenz der beiden Peilungen. Die Winkel an den beiden Objekten ergeben sich aus der Richtung der Basislinie und dem Peilstrahl, der zu dir zurückläuft. Damit ist der Fall komplett – ein Winkel-Seite-Winkel-Dreieck, das der Sinussatz löst. Kennt man eine Seite und alle Winkel, sind alle anderen Seiten festgelegt.',
      },
      {
        titel: 'Rechtweisend heißt: vorher umrechnen',
        text: 'Der Rechner erwartet rechtweisende Peilungen, also Richtungen bezogen auf geografisch Nord. Was du am Handpeilkompass abliest, ist eine missweisende Peilung; am Steuerkompass kommt zusätzlich die Deviation deines Bootes dazu. Erst Missweisung und Deviation aufschlagen, dann rechnen – sonst verschiebst du deinen Standort systematisch, und zwar bei beiden Peilungen in dieselbe Richtung, was den Fehler besonders unauffällig macht. Ebenso wichtig: möglichst schnell hintereinander peilen. Zwischen zwei Peilungen fährt das Boot weiter, und jede Sekunde Verzug verzerrt das Dreieck.',
      },
      {
        titel: 'Schleifender Schnitt – wenn die Mathematik empfindlich wird',
        text: 'Im Sinussatz steht der Schnittwinkel γ im Nenner: Die Entfernung ist proportional zu 1/sin(γ). Bei γ = 90° ist sin(γ) = 1 und der Schnittpunkt reagiert gelassen auf kleine Peilfehler. Bei γ = 10° ist sin(γ) nur noch 0,17 – jeder Peilfehler wird knapp sechsfach verstärkt, und die beiden Standlinien laufen so flach zusammen, dass der Schnittpunkt über eine lange Strecke wandert. Seemännisch heißt das schleifender Schnitt. Unter etwa 30° solltest du das Ergebnis nur als Anhaltspunkt nehmen, unter 15° gar nicht mehr verwenden. Derselbe Effekt tritt übrigens am anderen Ende auf: Liegen die beiden Objekte von dir aus fast genau gegenüber, geht sin(γ) ebenfalls gegen Null. Deshalb warnt der Rechner in beiden Fällen und schätzt die Streuung des Standorts für einen Peilfehler von ±2° mit ab.',
      },
      {
        titel: 'Welche Objekte taugen',
        text: 'Gut sind Objekte, die eindeutig und punktförmig sind und in der Karte sicher identifiziert werden können: Leuchttürme, Kirchtürme, Funkmasten, markante Molenköpfe. Schlecht sind schwimmende Seezeichen – Tonnen liegen auf Kette und driften um ihre Position herum – und alles, was in der Karte breit ist: Waldkanten, Ortschaften, Bergrücken. Und wähle die Objekte so, dass sie von dir aus deutlich auseinanderliegen; das ist der einfachste Weg, einen guten Schnittwinkel zu bekommen.',
      },
    ],
    formeln: [
      {
        formel: 'γ = |Peilung A − Peilung B|',
        erklaerung:
          'Der Winkel an deinem Boot ist einfach die Differenz der beiden rechtweisenden Peilungen – über den Nordpunkt hinweg immer als der kleinere der beiden Winkel gelesen (aus 350° und 010° werden 20°, nicht 340°).',
      },
      {
        formel: 'α + β + γ = 180°',
        erklaerung:
          'Die Winkelsumme im Dreieck. Sie ist gleichzeitig die Kontrolle des Rechners: Passen die beiden Peilungen nicht zur eingegebenen Basisrichtung, ergibt sich keine 180° – dann sind die Richtungen vertauscht oder falsch gemessen.',
      },
      {
        formel: 'dₐ = b · sin(β) / sin(γ)',
        erklaerung:
          'Der Sinussatz: Jede Seite verhält sich zum Sinus ihres Gegenwinkels wie jede andere. Die Entfernung zum Objekt A hängt also am Winkel β beim Objekt B – dem Winkel, der der Strecke Boot–A gegenüberliegt.',
      },
      {
        formel: 'h = dₐ · sin(α)',
        erklaerung:
          'Die Höhe im Dreieck ist dein senkrechter Abstand von der Verbindungslinie der beiden Objekte. Läuft diese Linie parallel zur Küste, ist h genau dein Küstenabstand.',
      },
    ],
    beispiel: {
      setup:
        'Du fährst vor einer Küste, in der Karte stehen zwei Leuchtfeuer 4,0 sm auseinander; die Verbindungslinie von A nach B verläuft rechtweisend 090° (also von West nach Ost). Du peilst A mit 315° und B mit 045°.',
      schritte: [
        'Schnittwinkel am Boot: γ = kleinerer Winkel zwischen 315° und 045° = 90° – ein sauberer Schnitt.',
        'Winkel bei A: Der Peilstrahl läuft von A aus mit 315° + 180° = 135° zu dir zurück, die Basis zeigt 090°. Also α = 45°.',
        'Winkel bei B: β = 180° − 90° − 45° = 45°. Das Dreieck ist gleichschenklig.',
        'Entfernung zu A: dₐ = 4,0 · sin(45°) / sin(90°) = 4,0 · 0,707 = 2,83 sm.',
        'Entfernung zu B: ebenfalls 2,83 sm – wegen der Symmetrie.',
        'Abstand von der Verbindungslinie: h = 2,83 · sin(45°) = 2,0 sm. Du stehst genau mittig 2 sm vor der Linie zwischen den Feuern.',
      ],
    },
    praxis: {
      titel: 'In der Praxis',
      vorText:
        'Die Kreuzpeilung ist auch heute die Rückfalllösung, wenn GPS ausfällt oder unplausible Werte liefert – deshalb steht sie in jeder Sportbootschein-Prüfung. Im Alltag läuft die Standortbestimmung dagegen digital: Position, Kurs und Route liegen fertig auf der Seekarte, und man vergleicht die Peilung nur noch gegen das, was das Gerät anzeigt. Wer auf deutschen Binnen- und Küstengewässern plant, findet die passende Karte samt Törnplaner bei ',
      linkText: 'sportbootnavi.de',
      linkUrl: 'https://sportbootnavi.de/karte',
      nachText:
        '. Der ehrliche Zusammenhang bleibt aber bestehen: Wenn du die Geometrie hinter deiner Position verstehst, erkennst du auch, wann ein angezeigter Standort nicht stimmen kann.',
    },
    faq: [
      {
        frage: 'Was ist ein schleifender Schnitt?',
        antwort:
          'Zwei Standlinien, die sich unter einem sehr spitzen Winkel kreuzen. Weil die Entfernung im Sinussatz mit 1/sin(γ) skaliert, wird jeder Peilfehler dabei stark verstärkt: Bei 10° Schnittwinkel wandert der Schnittpunkt bei nur 1° Peilfehler um mehrere Zehntel Seemeilen. Ab etwa 30° Schnittwinkel gilt eine Kreuzpeilung als brauchbar, darunter nur noch als Schätzung.',
      },
      {
        frage: 'Warum reichen zwei Peilungen für einen Standort?',
        antwort:
          'Eine Peilung liefert eine Standlinie – du bist irgendwo auf ihr. Zwei Standlinien schneiden sich in genau einem Punkt, solange sie nicht parallel laufen. Rechnerisch entspricht das einem Dreieck aus Boot und beiden Objekten, in dem alle Winkel und eine Seite bekannt sind. Eine dritte Peilung ist trotzdem sinnvoll: Sie bildet in der Karte ein kleines Fehlerdreieck und zeigt, wie sauber gepeilt wurde.',
      },
      {
        frage: 'Muss ich rechtweisend oder missweisend peilen?',
        antwort:
          'Der Rechner erwartet rechtweisende Peilungen. Am Handpeilkompass liest du missweisend ab, am Steuerkompass zusätzlich mit Deviation behaftet. Rechne beides heraus, bevor du die Werte einträgst – der Fehler wirkt sonst auf beide Peilungen gleichsinnig und verschiebt den Standort, ohne dass es auffällt.',
      },
      {
        frage: 'Wie genau ist eine Kreuzpeilung?',
        antwort:
          'Mit einem Handpeilkompass sind ±2° realistisch. Bei 3 sm Entfernung und gutem Schnittwinkel entspricht das grob 0,1 sm Streuung; bei schlechtem Schnittwinkel schnell dem Mehrfachen davon. Deshalb gibt der Rechner neben den Entfernungen auch eine Abschätzung dieser Streuung aus.',
      },
      {
        frage: 'Was ist der Unterschied zur Versegelungspeilung?',
        antwort:
          'Die Kreuzpeilung braucht zwei Objekte zur gleichen Zeit und liefert deinen Standort. Die Versegelungspeilung – bekannt als Vier-Strich-Peilung – braucht nur ein Objekt, dafür zwei Zeitpunkte und die dazwischen gefahrene Distanz, und liefert die Entfernung zu diesem Objekt.',
      },
    ],
  },

  'vier-strich-peilung': {
    metaTitel: 'Vier-Strich-Peilung berechnen – Versegelungspeilung online',
    metaBeschreibung:
      'Versegelungspeilung online berechnen: Entfernung und Querabstand aus zwei Seitenpeilungen und der gefahrenen Distanz. Mit 45°/90° als Voreinstellung, Strich-Umrechnung und Rechenweg.',
    titel: 'Vier-Strich-Peilung – Entfernung aus einer Peilung und dem Logbuch',
    einleitung:
      'Manchmal ist nur ein einziges Objekt in Sicht. Für eine Kreuzpeilung reicht das nicht – wohl aber für eine Versegelungspeilung: Du peilst das Objekt einmal, fährst geraden Kurs weiter und peilst es ein zweites Mal. Die dazwischen gefahrene Distanz ersetzt die zweite Landmarke. Der bekannteste Fall ist die Vier-Strich-Peilung: erst bei 45° peilen, dann warten, bis das Objekt querab steht – die gefahrene Distanz ist dann genau der Abstand, mit dem du daran vorbeifährst.',
    abschnitte: [
      {
        titel: 'Warum das gleichschenklige Dreieck funktioniert',
        text: 'Die drei Ecken sind deine Position bei der ersten Peilung, deine Position bei der zweiten Peilung und das Objekt. Der Winkel am Objekt ist die Differenz der beiden Seitenpeilungen – bei 45° und 90° also 45°. Bei der ersten Peilung beträgt der Winkel im Dreieck ebenfalls 45°. Zwei gleiche Winkel bedeuten zwei gleich lange Schenkel: Die gefahrene Distanz und die Entfernung zum Objekt beim Querabpassieren sind identisch. Das ist der ganze Trick – deshalb braucht die Vier-Strich-Peilung an Bord keinen Rechner, sondern nur einen Blick ins Logbuch.',
      },
      {
        titel: 'Vier Strich sind 45 Grad',
        text: 'Der Strich ist die alte seemännische Winkeleinheit: Der Vollkreis wird in 32 Strich geteilt, ein Strich sind also 11,25°. Vier Strich sind 45°, acht Strich sind querab. Die Einheit hält sich, weil sie sich an der Kompassrose ablesen und im Kopf halbieren lässt – „zwei Strich Backbord" ist an Bord schneller gesagt als eine Gradzahl. Der Rechner zeigt jede Eingabe zusätzlich in Strich an.',
      },
      {
        titel: 'Der allgemeine Fall: jede Winkelkombination geht',
        text: 'Die 45°/90°-Regel ist nur ein Sonderfall des Sinussatzes. Allgemein gilt: Entfernung bei der zweiten Peilung = gefahrene Distanz · sin(erste Peilung) / sin(zweite Peilung − erste Peilung). Damit kannst du auch peilen, wenn dir die Küste keine Zeit lässt, bis das Objekt querab steht. Eine hübsche Konsequenz aus der Formel: Immer wenn die zweite Peilung doppelt so groß ist wie die erste, kürzt sich der Bruch weg und die Entfernung ist wieder genau die gefahrene Distanz – bei 20°/40° genauso wie bei 30°/60°. Diese „Verdopplung der Seitenpeilung" ist die eigentliche Regel, die Vier-Strich-Peilung nur ihr bekanntester Vertreter, weil bei ihr zusätzlich der Querabstand herausfällt.',
      },
      {
        titel: 'Wo das Verfahren an seine Grenzen kommt',
        text: 'Gerechnet wird mit der Distanz über Grund und mit einem geraden Kurs. Setzt dich Strom oder Wind versetzt, ist die Dreiecksseite in Wirklichkeit anders lang und anders gerichtet als angenommen – das Ergebnis wird dann still und leise falsch, ohne dass die Rechnung protestiert. Zweiter Fallstrick: Liegen die beiden Peilungen dicht zusammen, steht im Nenner ein kleiner Sinus, und der Fehler explodiert genau wie beim schleifenden Schnitt der Kreuzpeilung. Deshalb lohnt sich die Geduld – lieber ein paar Minuten länger warten, damit die Peilung deutlich weiter gewandert ist.',
      },
    ],
    formeln: [
      {
        formel: 'δ = α2 − α1',
        erklaerung:
          'Der Winkel am Objekt ist die Differenz der beiden Seitenpeilungen. Er ist gleichzeitig der Winkel, um den sich deine Sichtlinie zum Objekt während der Fahrt gedreht hat.',
      },
      {
        formel: 'd₂ = s · sin(α1) / sin(δ)',
        erklaerung:
          'Sinussatz: Die gefahrene Distanz s liegt dem Winkel δ am Objekt gegenüber, die gesuchte Entfernung d₂ dem Winkel α1 bei der ersten Peilung. Ist δ = α1 – also α2 doppelt so groß wie α1 – wird d₂ = s.',
      },
      {
        formel: 'q = d₂ · sin(α2)',
        erklaerung:
          'Der Querabstand ist die Höhe des Dreiecks über der Kurslinie: der Abstand, mit dem du das Objekt passierst. Bei α2 = 90° ist sin(α2) = 1, dann sind Querabstand und Entfernung dasselbe.',
      },
      {
        formel: 's = v · t / 60',
        erklaerung:
          'Die gefahrene Distanz aus Fahrt über Grund (in Knoten) und Zeitspanne (in Minuten): 6 kn über 20 Minuten sind 2,0 sm. Der Rechner nimmt beide Wege – Distanz direkt oder Fahrt und Zeit.',
      },
    ],
    beispiel: {
      setup:
        'Du läufst mit 6 kn geraden Kurs an einer Landspitze vorbei. Als das Leuchtfeuer 45° an Steuerbord voraus steht (4 Strich), notierst du die Uhrzeit. 20 Minuten später steht es querab – also bei 90°.',
      schritte: [
        'Gefahrene Distanz: s = 6 kn · 20 min / 60 = 2,0 sm.',
        'Winkel am Objekt: δ = 90° − 45° = 45°.',
        'Entfernung beim Querabpassieren: d₂ = 2,0 · sin(45°) / sin(45°) = 2,0 sm.',
        'Querabstand: q = 2,0 · sin(90°) = 2,0 sm – bei querab sind beide Werte gleich.',
        'Entfernung bei der ersten Peilung: d₁ = 2,0 · sin(90°) / sin(45°) = 2,83 sm.',
        'Ergebnis: Du passierst die Landspitze mit 2,0 sm Abstand. Steht in der Karte 1,5 sm vor der Spitze eine Untiefe, weißt du jetzt, dass du frei bleibst.',
      ],
    },
    praxis: {
      titel: 'In der Praxis',
      vorText:
        'Der Querabstand ist die seitliche Sicherheitsmarge – die Antwort auf „bleibe ich frei von der Untiefe?". Auf Binnenrevieren kommt die senkrechte Marge dazu, und die hängt nicht an der Geometrie, sondern am Wasserstand: Ob der Mast unter der nächsten Brücke durchpasst, rechnet der ',
      linkText: 'Durchfahrtshöhen-Rechner von sportbootnavi.de',
      linkUrl: 'https://sportbootnavi.de/rechner/durchfahrtshoehe',
      nachText:
        ' aus der Bauwerkshöhe und dem aktuellen Pegel. Zusammen sind das die zwei Fragen, die vor jeder Engstelle beantwortet sein sollten: seitlicher Abstand und lichte Höhe.',
    },
    faq: [
      {
        frage: 'Warum heißt es Vier-Strich-Peilung?',
        antwort:
          'Weil die erste Peilung bei vier Strich genommen wird. Ein Strich ist 1/32 des Vollkreises, also 11,25° – vier Strich sind damit 45°. Die zweite Peilung erfolgt bei acht Strich, also querab (90°).',
      },
      {
        frage: 'Warum ist der Querabstand genau die gefahrene Distanz?',
        antwort:
          'Weil das Dreieck aus den beiden Peilpositionen und dem Objekt bei 45° und 90° gleichschenklig ist: Der Winkel am Objekt ist 45°, der Winkel bei der ersten Peilung ebenfalls. Gleiche Winkel heißt gleiche Gegenseiten – die gefahrene Distanz und die Entfernung beim Querabpassieren sind deshalb identisch.',
      },
      {
        frage: 'Geht das auch mit anderen Winkeln als 45° und 90°?',
        antwort:
          'Ja, der Rechner ist allgemein gebaut. Der Sinussatz löst jede Kombination, solange die zweite Seitenpeilung größer als die erste ist. Ist die zweite Peilung doppelt so groß wie die erste, ist die Entfernung bei der zweiten Peilung immer genau die gefahrene Distanz – 20°/40° funktioniert also genauso wie 30°/60°.',
      },
      {
        frage: 'Was macht Strom mit dem Ergebnis?',
        antwort:
          'Er verfälscht es, ohne sich zu zeigen. Die Rechnung unterstellt, dass du auf geradem Kurs die eingetragene Distanz über Grund zurückgelegt hast. Versetzt dich Strom quer zum Kurs, ist die Dreiecksseite in Wirklichkeit anders gerichtet – die Formel rechnet weiter, aber mit falschen Voraussetzungen. Rechne deshalb mit Distanz über Grund und prüfe das Ergebnis gegen eine zweite Information.',
      },
      {
        frage: 'Wann ist die Kreuzpeilung besser?',
        antwort:
          'Wenn zwei geeignete Objekte gleichzeitig zu sehen sind. Die Kreuzpeilung liefert dann sofort einen Standort, während die Versegelungspeilung erst eine gefahrene Strecke braucht und nur eine Entfernung ergibt. Umgekehrt ist die Versegelungspeilung unschlagbar, wenn nur ein einziges Objekt in Sicht ist.',
      },
    ],
  },
}

'use client'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
  shapeId: string
}

export function DeepExplanation({ solution, shapeId }: Props) {
  const typ = solution.values.typ as string
  const r = solution.values.r as number
  const d = solution.values.d as number
  const a = solution.values.a as number
  const b = solution.values.b as number
  const c = solution.values.c as number
  const h = solution.values.h as number

  const getExplanationContent = () => {
    // Dreieck-spezifische Texte
    if (shapeId === 'dreieck') {
      switch (typ) {
        case 'rechtwinklig':
          return {
            title: 'Das rechtwinklige Dreieck – Detaillierte Erklärung',
            sections: [
              {
                heading: 'Was ist ein rechtwinkliges Dreieck?',
                content: `Ein rechtwinkliges Dreieck ist eine geometrische Form mit drei Seiten und einem 90-Grad-Winkel (rechten Winkel). Die längste Seite heißt Hypotenuse, die beiden kürzeren Seiten nennt man Katheten. Rechtwinklige Dreiecke sind in der Mathematik und Praxis extrem wichtig und bilden die Grundlage des Satzes des Pythagoras.`
              },
              {
                heading: 'Der Satz des Pythagoras',
                content: `Der Satz des Pythagoras besagt: a² + b² = c² (wobei c die Hypotenuse ist). In deinem Fall: ${a}² + ${b}² = ${Math.sqrt(a*a + b*b).toFixed(2)}². Dieser fundamentale Satz ermöglicht es uns, die dritte Seite zu berechnen, wenn zwei Seiten bekannt sind.`
              },
              {
                heading: 'Praktische Anwendungen',
                content: `Rechtwinklige Dreiecke findest du überall: Beim Bau von Häusern für gerade Winkel, in der Navigation für Positionsbestimmung, in der Elektrotechnik für Spannungsberechnungen, und in der Kartografie für Entfernungsmessungen. Ein klassisches Beispiel ist die 3-4-5 Regel: Ein Dreieck mit den Seitenlängen 3, 4 und 5 hat immer einen rechten Winkel.`
              },
              {
                heading: 'Flächen- und Umfangsberechnung',
                content: `Die Fläche eines rechtwinkligen Dreiecks berechnet sich einfach mit: Fläche = (a × b) ÷ 2. Das ist halb so groß wie ein Rechteck mit denselben Seitenlängen. Der Umfang ist die Summe aller drei Seiten. Diese Maße sind wichtig für Materialberechnungen.`
              }
            ]
          }
        case 'gleichseitig':
          return {
            title: 'Das gleichseitige Dreieck – Detaillierte Erklärung',
            sections: [
              {
                heading: 'Was ist ein gleichseitiges Dreieck?',
                content: `Ein gleichseitiges Dreieck hat drei gleich lange Seiten und drei gleich große Winkel von je 60 Grad. Es ist eine der symmetrischsten geometrischen Formen und kommt häufig in der Natur vor – von Bienenwaben bis zu Kristallstrukturen.`
              },
              {
                heading: 'Eigenschaften und Symmetrie',
                content: `Jedes gleichseitige Dreieck hat drei Symmetrieachsen. Das bedeutet, es sieht gleich aus, egal wie man es dreht. Alle wichtigen Linien (Höhe, Median, Winkelhalbierende, Mittelsenkrechte) fallen zusammen und treffen sich im Mittelpunkt.`
              },
              {
                heading: 'Berechnung der Höhe',
                content: `Die Höhe eines gleichseitigen Dreiecks berechnet sich nach der Formel: h = (a × √3) ÷ 2. Diese spezielle Formel ergibt sich aus der speziellen Geometrie des gleichseitigen Dreiecks und ist fundamental für viele Berechnungen.`
              },
              {
                heading: 'Natürliche und technische Anwendungen',
                content: `Gleichseitige Dreiecke finden sich in Bienenwaben (maximale Stabilität bei minimalem Material), Molekülstrukturen, Verkehrsschildern und architektonischen Designs. Sie sind optimal für Flächenausfüllung und Stabilität.`
              }
            ]
          }
        case 'gleichschenklig':
          return {
            title: 'Das gleichschenklige Dreieck – Detaillierte Erklärung',
            sections: [
              {
                heading: 'Was ist ein gleichschenkliges Dreieck?',
                content: `Ein gleichschenkliges Dreieck hat zwei gleich lange Seiten (Schenkel) und eine unterschiedlich lange Basis. Die beiden Basiswinkel sind gleich groß. Diese Form ist symmetrisch und kommt häufig in der Architektur und Natur vor.`
              },
              {
                heading: 'Symmetrie und Eigenschaften',
                content: `Ein gleichschenkliges Dreieck hat eine Symmetrieachse, die von der Spitze zur Basis führt. Diese Achse teilt das Dreieck in zwei identische rechtwinklige Dreiecke. Die Höhe von der Spitze zur Basis halbiert auch die Basis.`
              },
              {
                heading: 'Berechnung von Winkeln',
                content: `Wenn die beiden Schenkel gleich lang sind, sind auch die beiden Basiswinkel identisch. Die Summe aller Winkel ist immer 180 Grad. Wenn du einen Winkel kennst, kannst du die anderen berechnen.`
              },
              {
                heading: 'Anwendungen in Praxis und Natur',
                content: `Gleichschenklige Dreiecke findest du in Dächer-Konstruktionen (für optimale Dachneigung), in Brückenkonstruktionen, Bergformen und vielen Symbolen. Sie vereinen Stabilität mit optischer Balance.`
              }
            ]
          }
        default:
          return {
            title: 'Das Dreieck – Detaillierte Erklärung',
            sections: [
              {
                heading: 'Was ist ein Dreieck?',
                content: `Ein Dreieck ist ein Polygon mit drei Ecken, drei Seiten und drei Innenwinkeln. Die Summe der Innenwinkel beträgt immer exakt 180 Grad – unabhängig von der Form des Dreiecks. Dreiecke sind die einfachsten Polygone und bilden die Grundlage vieler komplexerer geometrischer Formen.`
              },
              {
                heading: 'Grundlegende Eigenschaften',
                content: `Jedes Dreieck hat drei Höhen, drei Mediane und drei Winkelhalbierende. Diese besonderen Linien schneiden sich in charakteristischen Punkten: Orthozentrum, Schwerpunkt und Inzentrum. Die Dreiecksungleichung besagt: Die Summe zweier Seiten muss größer als die dritte Seite sein.`
              },
              {
                heading: 'Arten von Dreiecken',
                content: `Dreiecke werden nach Seitenlängen (gleichseitig, gleichschenklig, unregelmäßig) oder nach Winkeln (spitzwinklig, rechtwinklig, stumpfwinklig) klassifiziert. Jede Klassifizierung hilft uns, die Eigenschaften und Berechnungsmethoden zu verstehen.`
              },
              {
                heading: 'Praktische Bedeutung',
                content: `Dreiecke sind in der Praxis unverzichtbar: Bauingenieurwesen (Dachkonstruktionen, Brücken), Vermessung (Triangulation), Navigation, Optik (Lichtbrechung) und Computergrafik (3D-Modellierung). Das Dreieck ist die stabilste geometrische Form.`
              }
            ]
          }
      }
    }

    // Kreis
    if (shapeId === 'kreis') {
      return {
        title: 'Der Kreis – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Kreis?',
            content: `Ein Kreis ist eine perfekte geometrische Form, definiert durch einen Mittelpunkt und einen Radius. Alle Punkte auf der Kreislinie haben exakt denselben Abstand vom Mittelpunkt. Der Kreis ist eine der wichtigsten Formen in der Mathematik, Physik und Technik.`
          },
          {
            heading: 'Die Kreiszahl π (Pi)',
            content: `Die Kreiszahl π ist eine mathematische Konstante von ungefähr 3,14159... Sie beschreibt das Verhältnis zwischen Umfang und Durchmesser: U = π × d. π ist irrational und unendlich – Mathematiker haben bereits Billionen Dezimalstellen berechnet. π ist fundamental für alle Kreisberechnungen.`
          },
          {
            heading: 'Umfang und Fläche',
            content: `Der Umfang eines Kreises mit Radius r wird berechnet mit: U = 2πr = πd. Die Fläche wird berechnet mit: A = πr². In deinem Fall: U = 2π × ${r} ≈ ${(2 * Math.PI * r).toFixed(2)} und A = π × ${r}² ≈ ${(Math.PI * r * r).toFixed(2)}. Diese Formeln sind überall in Technik und Naturwissenschaften wichtig.`
          },
          {
            heading: 'Praktische Anwendungen',
            content: `Kreise sind überall: Räder und Rollen (Bewegung), Rohre und Zylinder (Flüssigkeitstransport), Optik (Linsen, Spiegel), Elektrotechnik (Kabel, Querschnitte), Uhren (Zeitmessung) und Architektur (Kuppeln, Rotunden). Der Kreis ist die effizienteste Form für viele natürliche und künstliche Strukturen.`
          }
        ]
      }
    }

    // Rechteck
    if (shapeId === 'rechteck') {
      return {
        title: 'Das Rechteck – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Rechteck?',
            content: `Ein Rechteck ist ein Viereck mit vier rechten Winkeln und vier Seiten, von denen jeweils zwei Seiten gleich lang sind. Es ist eine der wichtigsten geometrischen Formen und bildet die Grundlage vieler Konstruktionen.`
          },
          {
            heading: 'Eigenschaften und Symmetrie',
            content: `Rechtecke haben zwei Symmetrieachsen: eine horizontale und eine vertikale. Die beiden Diagonalen sind gleich lang und halbieren sich gegenseitig. Ein Rechteck mit vier gleich langen Seiten heißt Quadrat.`
          },
          {
            heading: 'Flächen- und Umfangsberechnung',
            content: `Die Fläche eines Rechtecks ist einfach: A = Länge × Breite. Der Umfang ist: U = 2 × (Länge + Breite). Die Diagonale wird mit dem Satz des Pythagoras berechnet: d = √(a² + b²). Diese Formeln sind in Bau und Planung essentiell.`
          },
          {
            heading: 'Überall in der Realität',
            content: `Rechtecke sind die häufigste Grundform in der Architektur: Häuser, Fenster, Türen, Zimmer, Möbel. Auch technisch: Computerbildschirme, Papier (DIN-A-Format), Smartphone-Displays. Das Rechteck ist optimal für Platznutzung und Stabilität.`
          }
        ]
      }
    }

    // Trapez
    if (shapeId === 'trapez') {
      return {
        title: 'Das Trapez – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Trapez?',
            content: `Ein Trapez ist ein Viereck mit genau einem Paar paralleler Seiten. Die parallelen Seiten heißen Basen, die nicht-parallelen Seiten heißen Schenkel. Trapeze sind vielfältig und asymmetrisch, was sie interessant und komplex macht.`
          },
          {
            heading: 'Arten von Trapezen',
            content: `Es gibt verschiedene Trapez-Typen: Das gleichschenkliges Trapez hat gleich lange Schenkel und Symmetrie. Das rechtwinklige Trapez hat zwei rechte Winkel. Das unregelmäßige Trapez hat völlig unterschiedliche Schenkel. Jeder Typ hat unterschiedliche Eigenschaften.`
          },
          {
            heading: 'Flächenberechnung',
            content: `Die Fläche eines Trapez wird berechnet mit: A = (a + b) × h ÷ 2, wobei a und b die parallelen Seiten und h die Höhe sind. Diese Formel ist das Durchschnitt der beiden Basenlängen mal der Höhe – eine elegante mathematische Beziehung.`
          },
          {
            heading: 'Praktische Anwendungen',
            content: `Trapeze findest du in Dachkonstruktionen (Dachneigung), in der Vermessung von Grundstücken, in Deichkonstruktionen und in vielen technischen Anwendungen. Auch in der Natur: Querschnitte von Bergen, Flussufern und anderen natürlichen Strukturen sind oft trapezförmig.`
          }
        ]
      }
    }

    // Parallelogramm
    if (shapeId === 'parallelogramm') {
      return {
        title: 'Das Parallelogramm – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Parallelogramm?',
            content: `Ein Parallelogramm ist ein Viereck, bei dem beide Paare von gegenüberliegenden Seiten parallel und gleich lang sind. Die Winkel sind nicht unbedingt rechtwinklig (sonst wäre es ein Rechteck). Parallelogramme sind asymmetrisch und vielfältig.`
          },
          {
            heading: 'Eigenschaften und Besonderheiten',
            content: `In einem Parallelogramm sind gegenüberliegende Winkel gleich groß. Die benachbarten Winkel ergänzen sich zu 180 Grad. Die Diagonalen halbieren sich gegenseitig, teilen das Parallelogramm aber nicht in kongruente Dreiecke.`
          },
          {
            heading: 'Flächenberechnung',
            content: `Die Fläche eines Parallelogramms wird berechnet mit: A = Basis × Höhe (nicht Basis × Seite!). Die Höhe ist der senkrechte Abstand zwischen den parallelen Seiten. Dies ist ein wichtiger Unterschied zu Rechtecken.`
          },
          {
            heading: 'Anwendungen in Natur und Technik',
            content: `Parallelogramme erscheinen in Kristallstrukturen, in der Mechanik (Parallelogrammlenker für starre Bewegungen), in Architektur (moderne schräge Designs) und in der Optik. Sie sind wichtig für Verständnis von Vektoren und Kräften.`
          }
        ]
      }
    }

    // Raute
    if (shapeId === 'raute') {
      return {
        title: 'Die Raute – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist eine Raute?',
            content: `Eine Raute (oder Rhombus) ist ein Viereck mit vier gleich langen Seiten. Sie ist ein Spezialfall eines Parallelogramms. Die Raute hat eine besondere Symmetrie und elegante geometrische Eigenschaften.`
          },
          {
            heading: 'Symmetrie und Diagonalen',
            content: `Die Raute hat zwei Symmetrieachsen, die durch ihre Diagonalen definiert werden. Die Diagonalen sind senkrecht zueinander und halbieren sich gegenseitig. Sie teilen die Raute in vier kongruente rechtwinklige Dreiecke.`
          },
          {
            heading: 'Flächenberechnung',
            content: `Die Fläche einer Raute wird berechnet mit: A = (d₁ × d₂) ÷ 2, wobei d₁ und d₂ die Diagonallängen sind. Alternativ: A = Seite × Höhe. Die Diagonalformel ist eleganter und wird häufiger verwendet.`
          },
          {
            heading: 'Vorkommen und Anwendungen',
            content: `Rauten findest du in Spielkarten (Karo-Zeichen), in Wappenkunde, in Kristallstrukturen und in modernem Design. In der Mechanik werden Rauten für spezielle Konstruktionen verwendet. Die Raute repräsentiert Eleganz und Symmetrie.`
          }
        ]
      }
    }

    // Würfel
    if (shapeId === 'wuerfel') {
      return {
        title: 'Der Würfel – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Würfel?',
            content: `Ein Würfel ist ein perfektes 3D-Objekt mit sechs quadratischen Flächen, acht Ecken und zwölf Kanten. Alle Kanten haben die gleiche Länge. Der Würfel ist das regelmäßigste dreidimensionale Objekt und kommt häufig in Natur und Technik vor.`
          },
          {
            heading: 'Geometrische Eigenschaften',
            content: `Der Würfel ist hochsymmetrisch mit 9 Symmetrieebenen. Alle Raumdiagonalen haben die gleiche Länge: d = a × √3. Der Würfel kann in Tetrader und andere Formen zerlegt werden. Er ist das Dual des Oktaeders.`
          },
          {
            heading: 'Volumen und Oberflächenberechnung',
            content: `Das Volumen eines Würfels mit Kantenlänge a ist: V = a³. Die Oberflächenfläche ist: O = 6 × a². Diese einfachen Formeln machen Würfel zu einem mathematischen Grundkonzept.`
          },
          {
            heading: 'Anwendungen überall',
            content: `Würfel sind überall: Spielwürfel, Verpackungen, Gebäude (moderne Architektur), Speichereinheiten, Kristalle. Der Würfel ist optimal für Raumeffizienz und Stabilität. In der Mathematik ist er ein Grundkonzept für Volumen und dreidimensionales Denken.`
          }
        ]
      }
    }

    // Quader
    if (shapeId === 'quader') {
      return {
        title: 'Der Quader – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Quader?',
            content: `Ein Quader ist ein 3D-Objekt mit sechs rechteckigen Flächen, acht Ecken und zwölf Kanten. Im Gegensatz zum Würfel haben die Kanten drei unterschiedliche Längen: Länge, Breite und Höhe. Der Quader ist eine der wichtigsten Formen in Technik und Architektur.`
          },
          {
            heading: 'Dimensionen und Eigenschaften',
            content: `Ein Quader ist definiert durch drei Dimensionen: Länge (a), Breite (b) und Höhe (c). Die Raumdiagonale wird berechnet mit: d = √(a² + b² + c²). Gegenüberliegende Flächen sind kongruent und parallel.`
          },
          {
            heading: 'Volumen und Oberflächenberechnung',
            content: `Das Volumen ist einfach: V = a × b × c (Länge × Breite × Höhe). Die Oberflächenfläche ist: O = 2(ab + bc + ac). Diese Formeln sind essentiell in der Bauwirtschaft und Logistik.`
          },
          {
            heading: 'Praktische Bedeutung',
            content: `Quader sind die häufigste 3D-Form: Häuser, Zimmer, Boxen, Container, Kühlschränke, Schränke. In der Logistik ist der Quader optimal für Lagerung und Transport. Auch in der Natur: viele Kristalle und organische Strukturen folgen der Quader-Form.`
          }
        ]
      }
    }

    // Kugel
    if (shapeId === 'kugel') {
      return {
        title: 'Die Kugel – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist eine Kugel?',
            content: `Eine Kugel ist eine perfekt symmetrische 3D-Form, definiert durch einen Mittelpunkt und einen Radius. Alle Punkte auf der Kugeloberfläche haben exakt denselben Abstand vom Mittelpunkt. Die Kugel ist die stabilste und symmetrischste Form im Raum.`
          },
          {
            heading: 'Mathematische Eigenschaften',
            content: `Die Kugel hat unendlich viele Symmetrieebenen – jede Ebene durch den Mittelpunkt ist eine Symmetrieebene. Die größte Querschnittsfläche ist ein Kreis mit Radius r (der Äquator). Jeder Schnitt durch die Kugel erzeugt einen Kreis.`
          },
          {
            heading: 'Volumen und Oberflächenberechnung',
            content: `Das Volumen einer Kugel ist: V = (4/3) × π × r³. Die Oberflächenfläche ist: O = 4 × π × r². Diese eleganten Formeln zeigen die mathematische Perfektion der Kugel.`
          },
          {
            heading: 'Vorkommen in Natur und Technik',
            content: `Kugeln sind überall: Planeten und Sterne, Atome, Wassertropfen, Früchte, Bälle, Kugellager. In der Natur ist die Kugel optimal für Volumenmaximierung bei minimalem Oberflächenmaterial. Auch technisch: ideale Form für Druck, Rotation und Balance.`
          }
        ]
      }
    }

    // Zylinder
    if (shapeId === 'zylinder') {
      return {
        title: 'Der Zylinder – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Zylinder?',
            content: `Ein Zylinder ist eine 3D-Form mit zwei parallelen kreisförmigen Basen und einer gekrümmten Seitenfläche. Die Achse ist die Linie, die die Mittelpunkte der beiden Basen verbindet. Der Zylinder ist eine der wichtigsten Formen in Technik und Natur.`
          },
          {
            heading: 'Eigenschaften und Symmetrie',
            content: `Der Zylinder hat unendlich viele vertikale Symmetrieebenen und eine horizontale Symmetrieebene in der Mitte. Die Seitenfläche ist eine gekrümmte Oberfläche, die sich "aufrollen" lässt zu einem Rechteck.`
          },
          {
            heading: 'Volumen und Oberflächenberechnung',
            content: `Das Volumen eines Zylinders ist: V = π × r² × h (Basisfläche × Höhe). Die Oberflächenfläche ist: O = 2πr² + 2πrh (zwei Kreise + Seitenfläche). Diese Formeln sind fundamentalen in Ingenieurwesen.`
          },
          {
            heading: 'Überall in der Praxis',
            content: `Zylinder sind die häufigste Form in Technik: Rohre, Flaschen, Dosen, Zistern, Motoren, Hydraulikzylinder, Speichertanks. In der Natur: Baumstämme, Stengel von Pflanzen, Knochen. Der Zylinder vereint Effizienz mit praktischer Handhabung.`
          }
        ]
      }
    }

    // Kegel
    if (shapeId === 'kegel') {
      return {
        title: 'Der Kegel – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist ein Kegel?',
            content: `Ein Kegel ist eine 3D-Form mit einer kreisförmigen Basis und einer Spitze (Apex). Die Seitenfläche ist glatt und gekrümmt. Der Kegel ist ein faszinierendes Objekt in Mathematik und Natur – elegant und asymmetrisch.`
          },
          {
            heading: 'Geometrische Eigenschaften',
            content: `Die Höhe eines Kegels ist der senkrechte Abstand von der Basis zur Spitze. Die Seitenlänge (Slant height) ist die Entfernung von der Spitze zur Basiskante. Der Kegel hat eine Symmetrieachse von der Spitze durch den Mittelpunkt der Basis.`
          },
          {
            heading: 'Volumen und Oberflächenberechnung',
            content: `Das Volumen eines Kegels ist: V = (1/3) × π × r² × h. Das ist exakt ein Drittel des Volumens eines Zylinders mit gleicher Basis und Höhe – eine faszinierende mathematische Beziehung. Die Oberflächenfläche ist: O = πr² + πrs (wobei s die Seitenlänge ist).`
          },
          {
            heading: 'Anwendungen in Natur und Design',
            content: `Kegel findest du überall: Eistüten, Trichter, Verkehrsleitkegel, Bergkuppen, Vulkane, Kiefernzapfen, Lautsprecher. Der Kegel ist optimal für Strömungsdynamik und Konzentration von Kräften. In der Architektur symbolisiert der Kegel Eleganz und Dynamik.`
          }
        ]
      }
    }

    // Pyramide
    if (shapeId === 'pyramide') {
      return {
        title: 'Die Pyramide – Detaillierte Erklärung',
        sections: [
          {
            heading: 'Was ist eine Pyramide?',
            content: `Eine Pyramide ist eine 3D-Form mit einer Polygonalen Basis (Dreieck, Quadrat, etc.) und Dreieckseiten, die sich zu einer Spitze (Apex) treffen. Die Pyramide ist eine der ältesten und faszinierendsten geometrischen Formen.`
          },
          {
            heading: 'Arten und Eigenschaften',
            content: `Es gibt verschiedene Pyramiden: die dreieckige Pyramide (Tetraeder), die quadratische Pyramide (Egyptische Pyramide), die Fünfeck-Pyramide, usw. Die Höhe ist der senkrechte Abstand von der Basis zur Spitze. Regelmäßige Pyramiden haben eine regelmäßige Basis und die Spitze über dem Mittelpunkt.`
          },
          {
            heading: 'Volumen und Oberflächenberechnung',
            content: `Das Volumen einer Pyramide ist: V = (1/3) × Basisfläche × Höhe. Das ist exakt ein Drittel des Volumens eines Prismas mit gleicher Basis und Höhe. Die Oberflächenfläche ist die Summe der Basisfläche und aller Seitendreiecke.`
          },
          {
            heading: 'Geschichte und praktische Bedeutung',
            content: `Pyramiden sind ikonisch: Die Großen Pyramiden von Ägypten sind Wunder der Antike. Modern: Gebäudestrukturen, Zelte, Verpackungen, Molekülstrukturen. Die Pyramide symbolisiert Stabilität, Kraft und Eleganz. Mathematisch fundamental für das Verständnis von Volumen und räumlicher Geometrie.`
          }
        ]
      }
    }

    // Default für unbekannte Formen
    return {
      title: 'Geometrische Form – Detaillierte Erklärung',
      sections: [
        {
          heading: 'Definition',
          content: `Diese geometrische Form hat einzigartige Eigenschaften und Berechnungsformeln. Geometrie ist die mathematische Wissenschaft von Formen, Größen und Raumbeziehungen.`
        },
        {
          heading: 'Mathematische Konzepte',
          content: `Geometrische Formen folgen mathematischen Gesetzen und Beziehungen. Durch das Verständnis dieser Konzepte können wir komplexe räumliche Probleme lösen.`
        },
        {
          heading: 'Praktische Anwendungen',
          content: `Geometrie ist überall in der realen Welt: Architektur, Ingenieurwesen, Natur und Kunst. Das Verständnis geometrischer Formen ist fundamental für viele Bereiche.`
        },
        {
          heading: 'Bedeutung in Wissenschaft',
          content: `Geometrie bildet die Grundlage für Physik, Chemie, Biologie und Engineering. Sie hilft uns, die Struktur der Welt zu verstehen und zu gestalten.`
        }
      ]
    }
  }

  const content = getExplanationContent()

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 p-6">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">{content.title}</h2>

      <div className="space-y-5">
        {content.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              {section.heading}
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-indigo-100 rounded-lg border border-indigo-300">
        <p className="text-xs text-indigo-900">
          💡 <strong>Merksatz:</strong> Geometrische Formen sind fundamental in Mathematik, Wissenschaft und Praxis. Das Verständnis ihrer Eigenschaften öffnet Türen zu komplexeren Konzepten.
        </p>
      </div>
    </div>
  )
}

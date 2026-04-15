'use client'
import type { Solution } from '@/lib/shapes/types'

interface Props {
  solution: Solution
}

export function DeepExplanation({ solution }: Props) {
  const typ = solution.values.typ as string
  const a = solution.values.a as number
  const b = solution.values.b as number
  const c = solution.values.c as number

  const getExplanationContent = () => {
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
              content: `Die Fläche eines rechtwinkligen Dreiecks berechnet sich einfach mit: Fläche = (a × b) ÷ 2. Das ist halb so groß wie ein Rechteck mit denselben Seitenlängen. Der Umfang ist die Summe aller drei Seiten: ${(a + b + c).toFixed(2)} cm. Diese Maße sind wichtig für Materialberechnungen.`
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
              content: `Die Höhe eines gleichseitigen Dreiecks mit Seitenlänge a berechnet sich nach der Formel: h = (a × √3) ÷ 2 ≈ ${(a * Math.sqrt(3) / 2).toFixed(2)} cm. Diese spezielle Formel ergibt sich aus der speziellen Geometrie des gleichseitigen Dreiecks.`
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
          💡 <strong>Merksatz:</strong> Dreiecke sind fundamental in Mathematik und Physik. Wenn du die Eigenschaften eines Dreiecks verstehst, kannst du komplexere geometrische Probleme lösen.
        </p>
      </div>
    </div>
  )
}

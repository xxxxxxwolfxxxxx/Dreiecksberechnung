/**
 * Häufige Fragen zur Dreiecksberechnung auf der Startseite.
 *
 * Die ersten Fragen stammen aus Googles "Ähnliche Fragen" für
 * "dreieck berechnen" (Stand 17.09.2026). Bewusst ohne FAQPage-JSON-LD:
 * Google zeigt FAQ-Rich-Results seit 2023 nur noch für Behörden- und
 * Gesundheitsseiten. Der sichtbare Text zählt trotzdem für die Suche.
 */
export interface FaqEintrag {
  frage: string
  antwort: string
}

export const DREIECK_FAQ: FaqEintrag[] = [
  {
    frage: 'Wie rechne ich ein Dreieck aus?',
    antwort: 'Ein Dreieck ist eindeutig bestimmt, sobald du drei Werte kennst, darunter mindestens eine Seite – also drei Seiten (SSS), zwei Seiten und den eingeschlossenen Winkel (SWS), eine Seite und zwei Winkel (WSW) oder zwei Seiten und den Gegenwinkel der längeren Seite (SsW). Aus diesen drei Werten folgen mit Sinussatz, Kosinussatz und der Winkelsumme von 180° alle übrigen Seiten und Winkel. Trag die Werte oben in den Rechner ein, er zeigt dir den Rechenweg.',
  },
  {
    frage: 'Wie berechnet man die fehlende Seite eines Dreiecks?',
    antwort: 'Im rechtwinkligen Dreieck hilft der Satz des Pythagoras: c² = a² + b², also c = √(a² + b²). In jedem anderen Dreieck nimmst du den Kosinussatz, wenn du zwei Seiten und den Winkel dazwischen kennst: c² = a² + b² − 2ab · cos(γ). Kennst du eine Seite und zwei Winkel, liefert der Sinussatz die fehlende Seite: b = a · sin(β) / sin(α).',
  },
  {
    frage: 'Wie berechne ich die Fläche eines Dreiecks?',
    antwort: 'Die Grundformel lautet A = (g · h) / 2 – Grundseite mal zugehörige Höhe, geteilt durch zwei. Kennst du nur die drei Seiten, rechnest du mit der Formel von Heron: A = √(s · (s−a) · (s−b) · (s−c)) mit s = (a + b + c) / 2. Bei zwei Seiten und dem eingeschlossenen Winkel gilt A = ½ · a · b · sin(γ).',
  },
  {
    frage: 'Wie berechne ich die Winkel eines Dreiecks aus drei Seiten?',
    antwort: 'Stelle den Kosinussatz nach dem Winkel um: cos(α) = (b² + c² − a²) / (2bc). Genauso berechnest du β. Den dritten Winkel bekommst du über die Winkelsumme: γ = 180° − α − β.',
  },
  {
    frage: 'Wann lässt sich ein Dreieck nicht berechnen?',
    antwort: 'Wenn die Werte kein Dreieck ergeben: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung), und zwei Winkel dürfen zusammen nicht 180° oder mehr ergeben. Mit drei Winkeln allein ist die Größe offen – es gibt unendlich viele ähnliche Dreiecke. Kennst du zwei Seiten und den Gegenwinkel der kürzeren Seite, kann es auch zwei Lösungen geben.',
  },
]

export function DreieckFaq() {
  return (
    <section aria-labelledby="faq-heading" className="rounded-2xl bg-white border border-indigo-100 shadow-sm p-5">
      <h2 id="faq-heading" className="text-lg font-black text-slate-800 mb-4 tracking-tight">
        Häufige Fragen zur Dreiecksberechnung
      </h2>
      <div className="space-y-5">
        {DREIECK_FAQ.map(eintrag => (
          <div key={eintrag.frage}>
            <h3 className="font-bold text-slate-800 mb-1">{eintrag.frage}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{eintrag.antwort}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

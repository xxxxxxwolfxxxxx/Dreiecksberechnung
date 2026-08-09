import { pfadFuerForm, istAktiverPfad, STARTSEITEN_FORM } from '@/lib/navigation/pfade'

describe('pfadFuerForm', () => {
  test('liefert für die Startseiten-Form den Wurzelpfad', () => {
    expect(pfadFuerForm(STARTSEITEN_FORM)).toBe('/')
  })

  test('liefert für alle anderen Formen den eigenen Unterpfad', () => {
    expect(pfadFuerForm('kreis')).toBe('/kreis')
    expect(pfadFuerForm('quader')).toBe('/quader')
    expect(pfadFuerForm('vier-strich-peilung')).toBe('/vier-strich-peilung')
  })
})

describe('istAktiverPfad', () => {
  test('erkennt die Startseiten-Form auf dem Wurzelpfad', () => {
    expect(istAktiverPfad('/', STARTSEITEN_FORM)).toBe(true)
  })

  test('erkennt die Startseiten-Form auch auf dem alten Unterpfad', () => {
    // /dreieck leitet zwar weiter, während der Weiterleitung soll die
    // Markierung aber nicht springen.
    expect(istAktiverPfad('/dreieck', STARTSEITEN_FORM)).toBe(true)
  })

  test('markiert andere Formen nicht auf dem Wurzelpfad', () => {
    expect(istAktiverPfad('/', 'kreis')).toBe(false)
  })

  test('markiert die passende Unterseite', () => {
    expect(istAktiverPfad('/kreis', 'kreis')).toBe(true)
    expect(istAktiverPfad('/kreis', 'quader')).toBe(false)
  })
})

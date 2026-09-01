import { lastmodFuer, LASTMOD_FALLBACK, LASTMOD } from '@/lib/seo/lastmod'

describe('lastmodFuer', () => {
  test('liefert für einen gepflegten Pfad genau dessen Datum', () => {
    expect(lastmodFuer('/kreis')).toEqual(new Date('2026-08-09'))
  })

  test('kennt auch den Wurzelpfad', () => {
    expect(lastmodFuer('/')).toEqual(new Date(LASTMOD['/']))
  })

  test('fällt für einen unbekannten Pfad auf das Fallback-Datum zurück', () => {
    expect(lastmodFuer('/gibt-es-nicht')).toEqual(new Date(LASTMOD_FALLBACK))
  })

  test('ist über die Zeit stabil und nicht der Build-Zeitpunkt', () => {
    // Der Kern des Fixes: frueher stand in der Sitemap `new Date()`, wodurch
    // alle URLs bei jedem Build gemeinsam auf "heute" sprangen.
    const heute = new Date()
    expect(lastmodFuer('/kreis').getTime()).toBeLessThan(heute.getTime())
    expect(lastmodFuer('/kreis').getTime()).toBe(lastmodFuer('/kreis').getTime())
  })

  test('gibt für jeden Aufruf ein eigenes Date-Objekt zurück', () => {
    // Sonst koennte ein Aufrufer das gepflegte Datum versehentlich mutieren.
    expect(lastmodFuer('/kreis')).not.toBe(lastmodFuer('/kreis'))
  })

  test('pflegt für jede Route ein Datum im Format YYYY-MM-DD', () => {
    for (const [pfad, datum] of Object.entries(LASTMOD)) {
      expect(datum).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(new Date(datum).getTime())).toBe(false)
      expect(pfad.startsWith('/')).toBe(true)
    }
  })
})

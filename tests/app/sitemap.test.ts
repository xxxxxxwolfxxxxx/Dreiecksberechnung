import sitemap from '@/app/sitemap'
import { LASTMOD } from '@/lib/seo/lastmod'
import { SITE_URL } from '@/lib/site'

const eintraege = sitemap()
const pfadVon = (url: string) => new URL(url).pathname

describe('sitemap', () => {
  test('enthält jede gepflegte Route genau einmal', () => {
    const pfade = eintraege.map(e => pfadVon(e.url))
    expect(new Set(pfade).size).toBe(pfade.length)
    expect(pfade.sort()).toEqual(Object.keys(LASTMOD).sort())
  })

  test('verwendet für jeden Eintrag das gepflegte Datum statt des Build-Zeitpunkts', () => {
    for (const eintrag of eintraege) {
      const pfad = pfadVon(eintrag.url)
      expect(eintrag.lastModified).toEqual(new Date(LASTMOD[pfad]))
    }
  })

  test('trägt nirgends das heutige Datum ein', () => {
    // Ein `new Date()` in der Sitemap laesst alle URLs bei jedem Build
    // gemeinsam auf "heute" springen – genau das soll nicht passieren.
    const heute = new Date().toISOString().slice(0, 10)
    for (const eintrag of eintraege) {
      expect((eintrag.lastModified as Date).toISOString().slice(0, 10)).not.toBe(heute)
    }
  })

  test('nutzt durchgehend absolute URLs der kanonischen Domain', () => {
    for (const eintrag of eintraege) {
      expect(eintrag.url.startsWith(SITE_URL)).toBe(true)
    }
  })

  test('gibt dem Dreieck-Rechner auf der Startseite die höchste Priorität', () => {
    const start = eintraege.find(e => pfadVon(e.url) === '/')
    expect(start?.priority).toBe(1)
  })
})

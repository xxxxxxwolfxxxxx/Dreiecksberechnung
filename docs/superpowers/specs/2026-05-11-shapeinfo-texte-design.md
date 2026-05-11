# ShapeInfo Texte v2 – Freundlich, praxisnah, lehrreich

## Ziel
Unter jedem der 12 Geometrie-Rechner ausführliche, freundliche Texte mit Du-Ansprache, die Hobby-Bastler, Handwerker und Kinder gleichermaßen ansprechen. Mehr organischer Traffic durch besseren SEO-Content.

## Zielgruppen
- **Handwerk**: Dachdecker, Schreiner, Heimwerker – brauchen schnelle Ergebnisse
- **Hobby/Garten**: Bastler, Nähende, Gartenplaner – konkrete Alltagsanwendungen
- **Schule/Kinder**: Matheaufgaben lösen, Geometrie verstehen

## Tonfall
Locker-freundlich, durchgehend Du-Ansprache. Fachbegriffe werden bei erster Nennung erklärt.

## Struktur pro Rechner (5 Blöcke)

### A) Einleitung (3-4 Sätze)
Was ist die Form, wo begegnest du ihr im Alltag. Kein Jargon ohne Erklärung. Direkt nützlich.

### B) Praxisbeispiele (3-4 Stück)
Jeweils ein Satz mit konkreter Situation + welche Werte man eingibt. Mix aus Handwerk, Hobby, Schule.

### C) Formeln mit Klartext-Erklärung
Jede Formel in eigenem Block. Jeder Buchstabe wird erklärt. Nicht nur die Formel hinschreiben.

### D) Durchgerechnetes Beispiel
Konkretes Szenario mit echten Zahlen, Schritt für Schritt nachvollziehbar.

### E) Wusstest du? (2-3 Fakten)
Überraschende, merkbare Fakten. Mischung aus Natur, Geschichte, Technik.

## Technische Umsetzung

### Datenmodell (ShapeInfo.tsx)
```typescript
interface ShapeInfoData {
  title: string
  intro: string           // Block A
  examples: string[]      // Block B
  formulas: {             // Block C
    formula: string
    explanation: string
  }[]
  workedExample: {        // Block D
    setup: string
    steps: string[]
  }
  funFacts: string[]      // Block E
}
```

### Betroffene Dateien
- `components/ShapeInfo.tsx` – Datenmodell erweitern + Rendering der 5 Blöcke
- Keine neuen Dateien nötig

### SEO
- Alle Texte als statisches HTML (kein JS-Toggle für Hauptinhalte)
- Strukturierte Überschriften (h2, h3)
- Natürliche Keyword-Dichte durch praxisnahe Formulierungen

## Rechner (12 Stück)
dreieck, kreis, rechteck, trapez, parallelogramm, raute, wuerfel, quader, kugel, zylinder, kegel, pyramide

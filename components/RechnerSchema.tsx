import { SITE_URL } from '@/lib/site'

type RechnerSchemaProps = {
  name: string
  description: string
  path: string
  /**
   * eduQuestionType-Werte aus Googles fester Liste (z. B. "Geometry",
   * "Circle", "Trigonometry"). Nur gesetzt, wenn die Seite den q-Parameter
   * tatsaechlich auswertet – dann wird zusaetzlich MathSolver ausgezeichnet.
   */
  matheThemen?: string[]
}

function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * JSON-LD-Auszeichnung fuer eine Rechnerseite.
 *
 * `WebApplication` beschreibt den Rechner als solchen und ist ohne
 * Zusatzfelder gueltig. `offers` bleibt bewusst weg, sonst aktiviert Google
 * den Software-App-Bericht und mahnt dann ein fehlendes aggregateRating an.
 *
 * `MathSolver` kommt nur dazu, wo `matheThemen` gesetzt ist. Google verlangt
 * dafuer zwingend `@type` als Paar mit `LearningResource`,
 * `learningResourceType: "Math Solver"`, `usageInfo` (Datenschutzerklaerung)
 * sowie eine `SolveMathAction`, deren target-URL einen mathematischen
 * Ausdruck entgegennimmt. Genau diese Pflichtfelder fehlten frueher, weshalb
 * die Search Console am 09.08.2026 alle Elemente als ungueltig meldete.
 * Der q-Parameter wird in lib/rechner-query.ts ausgewertet.
 */
export function RechnerSchema({ name, description, path, matheThemen }: RechnerSchemaProps) {
  const url = `${SITE_URL}${path}`

  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    inLanguage: 'de',
    educationalLevel: 'secondary',
    isAccessibleForFree: true,
  }

  const mathSolver = matheThemen && {
    '@context': 'https://schema.org',
    '@type': ['MathSolver', 'LearningResource'],
    name,
    url,
    usageInfo: `${SITE_URL}/datenschutz`,
    inLanguage: 'de',
    learningResourceType: 'Math Solver',
    assesses: matheThemen,
    potentialAction: [
      {
        '@type': 'SolveMathAction',
        target: `${url}?q={math_expression_string}`,
        'mathExpression-input': 'required name=math_expression_string',
        eduQuestionType: matheThemen,
      },
    ],
  }

  return (
    <>
      <JsonLd schema={webApplication} />
      {mathSolver && <JsonLd schema={mathSolver} />}
    </>
  )
}

import { SITE_URL } from '@/lib/site'

type RechnerSchemaProps = {
  name: string
  description: string
  path: string
}

/**
 * JSON-LD-Auszeichnung für eine Rechnerseite.
 *
 * Bewusst `WebApplication` statt `MathSolver`: MathSolver verlangt zwingend
 * `usageInfo` und eine `SolveMathAction`, deren target-URL einen freien
 * mathematischen Ausdruck entgegennimmt. Die Rechner hier arbeiten mit
 * Formularfeldern und lesen keine URL-Parameter – die Search Console hat das
 * Markup deshalb als ungültig gemeldet (itemtype + fehlendes usageInfo).
 */
export function RechnerSchema({ name, description, path }: RechnerSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    inLanguage: 'de',
    educationalLevel: 'secondary',
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

import { permanentRedirect } from 'next/navigation'

/**
 * Der Dreieck-Rechner liegt auf "/" – siehe lib/navigation/pfade.ts.
 * Dieser Pfad war frueher die Rechnerseite und bleibt als 308 bestehen,
 * damit alte Links und der Google-Index sauber zusammenlaufen.
 */
export default function DreieckPage() {
  permanentRedirect('/')
}

export interface AnalyticsEvent {
  event: string
  [key: string]: string | number | boolean | undefined
}

/**
 * Track an analytics event with optional data
 * @param eventName - The name of the event to track
 * @param eventData - Optional data associated with the event
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // Google Analytics 4 integration
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData || {})
  }

  // Local logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics:', eventName, eventData)
  }
}

/**
 * Track a page view event
 * @param pageName - The name of the page
 */
export function trackPageView(pageName: string) {
  trackEvent('page_view', { page_title: pageName })
}

/**
 * Analytics event names following GA4 snake_case convention
 */
export const EVENTS = {
  MODE_SELECTED: 'mode_selected',
  CALCULATION_COMPLETE: 'calculation_complete',
  CALCULATION_ERROR: 'calculation_error',
  QUIZ_ANSWERED: 'quiz_answered',
  RELATED_TRIANGLE_SELECTED: 'related_triangle_selected',
  SPICKZETTEL_EXPORTED: 'spickzettel_exported',
  QUIZ_CORRECT: 'quiz_correct',
  QUIZ_INCORRECT: 'quiz_incorrect'
} as const

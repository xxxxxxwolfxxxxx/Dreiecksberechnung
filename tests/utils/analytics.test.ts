import { trackEvent, trackPageView, EVENTS } from '@/utils/analytics'

describe('analytics', () => {
  beforeEach(() => {
    // Mock window.gtag
    ;(global as any).gtag = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('trackEvent', () => {
    it('tracks event with correct properties', () => {
      trackEvent('calculation_complete', { type: 'rechtwinklig' })
      expect((global as any).gtag).toHaveBeenCalledWith(
        'event',
        'calculation_complete',
        { type: 'rechtwinklig' }
      )
    })

    it('handles missing gtag gracefully', () => {
      ;(global as any).gtag = undefined
      expect(() => {
        trackEvent('test_event', {})
      }).not.toThrow()
    })

    it('tracks export event', () => {
      trackEvent('spickzettel_exported', { triangleType: 'rechtwinklig' })
      expect((global as any).gtag).toHaveBeenCalledWith(
        'event',
        'spickzettel_exported',
        { triangleType: 'rechtwinklig' }
      )
    })

    it('tracks event without data', () => {
      trackEvent('mode_selected')
      expect((global as any).gtag).toHaveBeenCalledWith('event', 'mode_selected', {})
    })

    it('handles undefined data parameter', () => {
      trackEvent('quiz_answered', undefined)
      expect((global as any).gtag).toHaveBeenCalledWith('event', 'quiz_answered', {})
    })

    it('logs to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'development'
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      trackEvent('test_event', { foo: 'bar' })

      expect(consoleSpy).toHaveBeenCalledWith('Analytics:', 'test_event', { foo: 'bar' })
      consoleSpy.mockRestore()
      ;(process.env as any).NODE_ENV = originalEnv
    })

    it('does not log to console in production mode', () => {
      const originalEnv = process.env.NODE_ENV
      ;(process.env as any).NODE_ENV = 'production'
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      trackEvent('test_event', { foo: 'bar' })

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
      ;(process.env as any).NODE_ENV = originalEnv
    })

    it('handles multiple event calls', () => {
      trackEvent('mode_selected', { mode: 'calculator' })
      trackEvent('calculation_complete', { result: 42 })
      trackEvent('calculation_error', { error: 'Division by zero' })

      expect((global as any).gtag).toHaveBeenCalledTimes(3)
    })
  })

  describe('trackPageView', () => {
    it('tracks page view with page name', () => {
      trackPageView('Home')
      expect((global as any).gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Home'
      })
    })

    it('tracks page view for different pages', () => {
      trackPageView('Calculator')
      expect((global as any).gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Calculator'
      })
    })
  })

  describe('EVENTS constant', () => {
    it('has all required event names', () => {
      expect(EVENTS.MODE_SELECTED).toBe('mode_selected')
      expect(EVENTS.CALCULATION_COMPLETE).toBe('calculation_complete')
      expect(EVENTS.CALCULATION_ERROR).toBe('calculation_error')
      expect(EVENTS.QUIZ_ANSWERED).toBe('quiz_answered')
      expect(EVENTS.RELATED_TRIANGLE_SELECTED).toBe('related_triangle_selected')
      expect(EVENTS.SPICKZETTEL_EXPORTED).toBe('spickzettel_exported')
      expect(EVENTS.QUIZ_CORRECT).toBe('quiz_correct')
      expect(EVENTS.QUIZ_INCORRECT).toBe('quiz_incorrect')
    })

    it('uses snake_case for event names', () => {
      Object.values(EVENTS).forEach((eventName) => {
        expect(eventName).toMatch(/^[a-z_]+$/)
      })
    })
  })
})

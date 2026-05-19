/**
 * Analytics tracking utility.
 * Wraps window.aif.track() with null-safe access and consistent interface.
 */
export function trackEvent(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.aif?.track) {
    window.aif.track(event, props);
  }
}

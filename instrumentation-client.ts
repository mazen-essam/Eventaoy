import posthog from "posthog-js"

// Initialize PostHog client for the browser
// Next.js will automatically import this file and handle pageview tracking
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: '2025-05-24',
  capture_exceptions: true, // Enables Error Tracking, set to false to disable
  debug: process.env.NODE_ENV === "development",
});

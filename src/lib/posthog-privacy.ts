import type { PostHogConfig } from "posthog-js";

// HashRouter keeps private routes in the fragment, not location.pathname.
export const privateRoute = /#\/(?:app|auth|aplikuj)(?:[/?#]|$)/;

export function redactAnalyticsUrl(value: string) {
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = privateRoute.test(value) ? "/private" : url.hash.split("?")[0];
    return url.toString();
  } catch {
    return "[redacted]";
  }
}

export const privacyConfig: Partial<PostHogConfig> = {
  autocapture: {
    dom_event_allowlist: ["click"],
    element_allowlist: ["a", "button"],
    url_ignorelist: [privateRoute],
    css_selector_ignorelist: [
      ".ph-no-autocapture",
      "[data-ph-no-autocapture]",
      ".ph-no-capture",
      "[data-sensitive]",
      "form",
      "input",
      "textarea",
      "select",
      "[contenteditable]",
      "[role='dialog']",
    ],
    capture_copied_text: false,
  },
  mask_all_text: true,
  mask_all_element_attributes: true,
  capture_pageview: false,
  capture_pageleave: false,
  capture_dead_clicks: false,
  capture_heatmaps: false,
  enable_recording_console_log: false,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: "*",
    blockSelector: ".ph-no-capture, [data-sensitive], form, [role='dialog']",
    recordCrossOriginIframes: false,
    recordHeaders: false,
    recordBody: false,
    maskCapturedNetworkRequestFn: (request) => ({
      ...request,
      name: redactAnalyticsUrl(request.name),
    }),
  },
  before_send: (event) => {
    if (!event) return null;
    for (const key of ["$current_url", "$referrer", "$initial_current_url", "$initial_referrer"]) {
      const value = event.properties[key];
      if (typeof value === "string") event.properties[key] = redactAnalyticsUrl(value);
    }
    return event;
  },
};

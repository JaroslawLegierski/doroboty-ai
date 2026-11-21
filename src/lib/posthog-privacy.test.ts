import { describe, expect, it } from "vitest";
import { privateRoute, redactAnalyticsUrl } from "./posthog-privacy";

describe("analytics URL privacy", () => {
  it("excludes private hash routes including nested records", () => {
    for (const path of [
      "app",
      "app/profil",
      "app/kandydaci/123",
      "auth/sign-in",
      "aplikuj/example",
    ]) {
      expect(privateRoute.test(`https://example.com/#/${path}`)).toBe(true);
    }
    expect(privateRoute.test("https://example.com/#/oferty")).toBe(false);
  });
  it("removes searches and private record identifiers", () => {
    expect(
      redactAnalyticsUrl("https://example.com/?email=private#/app/kandydaci/123?token=secret"),
    ).toBe("https://example.com/#/private");
    expect(redactAnalyticsUrl("https://example.com/#/oferty?query=private")).toBe(
      "https://example.com/#/oferty",
    );
    expect(redactAnalyticsUrl("invalid private text")).toBe("[redacted]");
  });
});

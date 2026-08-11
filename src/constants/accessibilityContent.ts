/** i18n keys for the main Accessibility page paragraphs, in display order. */
export const ACCESSIBILITY_PARAGRAPH_KEYS = [
  'accessibility.paragraphs.p1',
  'accessibility.paragraphs.p2',
  'accessibility.paragraphs.p3',
  'accessibility.paragraphs.p4',
] as const;

/** i18n keys for the mobile browsing subsection paragraphs, in display order. */
export const ACCESSIBILITY_MOBILE_PARAGRAPH_KEYS = [
  'accessibility.mobile.p1',
  'accessibility.mobile.p2',
] as const;

export type AccessibilityParagraphKey = (typeof ACCESSIBILITY_PARAGRAPH_KEYS)[number];
export type AccessibilityMobileParagraphKey = (typeof ACCESSIBILITY_MOBILE_PARAGRAPH_KEYS)[number];

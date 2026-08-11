/** i18n keys for the About page body paragraphs, in display order. */
export const ABOUT_PARAGRAPH_KEYS = [
  'about.paragraphs.p1',
  'about.paragraphs.p2',
  'about.paragraphs.p3',
  'about.paragraphs.p4',
  'about.paragraphs.p5',
] as const;

/** i18n keys for the About page objectives list, in display order. */
export const ABOUT_OBJECTIVE_KEYS = [
  'about.objectives.item1',
  'about.objectives.item2',
  'about.objectives.item3',
  'about.objectives.item4',
] as const;

export type AboutParagraphKey = (typeof ABOUT_PARAGRAPH_KEYS)[number];
export type AboutObjectiveKey = (typeof ABOUT_OBJECTIVE_KEYS)[number];

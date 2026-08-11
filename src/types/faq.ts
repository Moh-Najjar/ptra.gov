/** Unique identifier for a frequently asked question entry. */
export type FaqItemId = 'releaseTime';

/** Metadata for rendering a single FAQ accordion item. */
export interface FaqItem {
  id: FaqItemId;
  questionKey: string;
  answerKeys: string[];
}

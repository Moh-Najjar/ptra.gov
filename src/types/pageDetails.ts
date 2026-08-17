/** A single page-details row. Shape varies by page id. */
export type PageDetailValue = string | number | boolean | null;

export type PageDetailRecord = Record<string, PageDetailValue>;

export interface PaginatedPageDetails {
  items: PageDetailRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const DEFAULT_PAGE_DETAILS_PAGE_SIZE = 10;

/** Audit fields excluded from add/edit forms until dedicated endpoints exist. */
export const PAGE_DETAIL_AUDIT_FIELDS = [
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
] as const;

export const PAGE_DETAIL_MOVEMENT_FIELDS = ['movementTo', 'movementFrom'] as const;

export type PageDetailMovementField = (typeof PAGE_DETAIL_MOVEMENT_FIELDS)[number];

const movementFieldSet = new Set<string>(PAGE_DETAIL_MOVEMENT_FIELDS);

export const isPageDetailMovementField = (key: string): key is PageDetailMovementField =>
  movementFieldSet.has(key);

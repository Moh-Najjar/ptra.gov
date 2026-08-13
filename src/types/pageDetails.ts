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

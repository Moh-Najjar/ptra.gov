export const pagesKeys = {
  list: ['pages', 'list'] as const,
  details: (pageId: number, pageNumber: number, pageSize: number) =>
    ['pages', 'details', pageId, pageNumber, pageSize] as const,
} as const;

export interface CmsPage {
  id: number;
  title: string;
  status: string;
  publishedDate: string;
  modifiedDate: string;
  languageCode: string | null;
  isPageDetailsEnabled: boolean;
}

export const pageHasDetails = (page: CmsPage): boolean => page.isPageDetailsEnabled;

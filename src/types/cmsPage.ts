export interface CmsPage {
  id: number;
  title: string;
  status: string;
  publishedDate: string;
  modifiedDate: string;
  languageCode: string | null;
}

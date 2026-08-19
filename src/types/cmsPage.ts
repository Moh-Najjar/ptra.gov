export interface PageAuthor {
  id: number;
  name: string;
  slug: string;
}

export interface SearchablePageAuthor {
  id: number;
  name: string;
  email: string;
}

export interface AssignPageAuthorPayload {
  userId: number;
}

export interface CmsPage {
  id: number;
  title: string;
  status: string;
  publishedDate: string;
  modifiedDate: string;
  languageCode: string | null;
  isPageDetailsEnabled: boolean;
  authors: PageAuthor[];
}

export const pageHasDetails = (page: CmsPage): boolean => page.isPageDetailsEnabled;

export const formatPageAuthors = (authors: PageAuthor[]): string => {
  if (authors.length === 0) {
    return '';
  }

  return authors.map((author) => author.name).join(', ');
};

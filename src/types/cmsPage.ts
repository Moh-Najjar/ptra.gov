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
  content?: string | null;
}

export const PAGE_FORM_STATUSES = ['publish', 'draft'] as const;

export type PageFormStatus = (typeof PAGE_FORM_STATUSES)[number];

export interface PageFormValues {
  title: string;
  content: string;
  status: PageFormStatus;
}

export interface CreatePagePayload {
  title: string;
  content: string;
  status: PageFormStatus;
}

export type UpdatePagePayload = CreatePagePayload;

export const pageHasDetails = (page: CmsPage): boolean => page.isPageDetailsEnabled;

export const createEmptyPageFormValues = (): PageFormValues => ({
  title: '',
  content: '',
  status: 'publish',
});

const toPageFormStatus = (status: string): PageFormStatus =>
  status === 'draft' ? 'draft' : 'publish';

export const mapCmsPageToFormValues = (page: CmsPage): PageFormValues => ({
  title: page.title,
  content: typeof page.content === 'string' ? page.content : '',
  status: toPageFormStatus(page.status),
});

export const buildPagePayload = (values: PageFormValues): CreatePagePayload => ({
  title: values.title.trim(),
  content: values.content.trim(),
  status: values.status,
});

export const isPageFormValid = (values: PageFormValues): boolean =>
  values.title.trim().length > 0 &&
  values.content.trim().length > 0 &&
  PAGE_FORM_STATUSES.includes(values.status);

export const formatPageAuthors = (authors: PageAuthor[]): string => {
  if (authors.length === 0) {
    return '';
  }

  return authors.map((author) => author.name).join(', ');
};

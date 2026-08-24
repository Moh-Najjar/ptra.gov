export interface PostAuthor {
  id: number;
  name: string;
  slug: string;
}

export interface SearchablePostAuthor {
  id: number;
  name: string;
  email: string;
}

export interface AssignPostAuthorPayload {
  userId: number;
}

export interface AuthoredPost {
  id: number;
  title: string;
  iframeUrl: string | null;
}

export interface AdminPost {
  id: number;
  title: string;
  authors: PostAuthor[];
  iframeUrl: string | null;
  postUrl?: string | null;
}

export const POST_STATUSES = ['publish', 'draft'] as const;

export type PostStatus = (typeof POST_STATUSES)[number];

export interface PostFormValues {
  title: string;
  content: string;
  status: PostStatus;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  status: PostStatus;
}

export type UpdatePostPayload = CreatePostPayload;

export const createEmptyPostFormValues = (): PostFormValues => ({
  title: '',
  content: '',
  status: 'publish',
});

export const mapAdminPostToFormValues = (post: AdminPost): PostFormValues => ({
  title: post.title,
  content:
    typeof post.iframeUrl === 'string' && post.iframeUrl.trim().length > 0
      ? `<iframe title="${post.title}" width="800" height="836" src="${post.iframeUrl}" frameborder="0" allowFullScreen="true"></iframe>`
      : '',
  status: 'publish',
});

export const buildPostPayload = (values: PostFormValues): CreatePostPayload => ({
  title: values.title.trim(),
  content: values.content.trim(),
  status: values.status,
});

export const isPostFormValid = (values: PostFormValues): boolean =>
  values.title.trim().length > 0 &&
  values.content.trim().length > 0 &&
  POST_STATUSES.includes(values.status);

export const hasPostIframe = (
  post: AdminPost | AuthoredPost,
): post is (AdminPost | AuthoredPost) & { iframeUrl: string } =>
  typeof post.iframeUrl === 'string' && post.iframeUrl.trim().length > 0;

export const formatPostAuthors = (authors: PostAuthor[]): string => {
  if (authors.length === 0) {
    return '';
  }

  return authors.map((author) => author.name).join(', ');
};

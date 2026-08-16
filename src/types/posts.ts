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
}

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

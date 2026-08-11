import { isAxiosError } from 'axios';

export const getLoginErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
      const message = (responseData as { message: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

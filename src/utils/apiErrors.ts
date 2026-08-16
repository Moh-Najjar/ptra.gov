import { isAxiosError } from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const responseData: unknown = error.response?.data;

    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
      const message = (responseData as { message: unknown }).message;

      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

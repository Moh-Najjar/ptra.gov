const getEnvVar = (key: string, fallback: string): string => {
  const value = import.meta.env[key];
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return fallback;
};

export const env = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'https://api.example.com'),
} as const;

export interface AppConfig {
  name: string;
  version: string;
  author: string;
}

export const appConfig: AppConfig = {
  name: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
  author: import.meta.env.VITE_APP_AUTHOR,
};
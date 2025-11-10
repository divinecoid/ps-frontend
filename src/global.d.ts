export {};

declare global {
  interface Window {
    electronAPI: {
      saveToken: (token: string) => Promise<void>;
      getToken: () => Promise<string | null>;
      getRefreshToken: () => Promise<string | null>;
      saveRefreshToken: (token: string) => Promise<void>;
      deleteToken: () => Promise<boolean>;
      deleteRefreshToken: () => Promise<boolean>;
      onNavigate: (callback: (path: string) => void) => void;
      getInitialToken: () => Promise<string | null>;
    };
  }

  interface ImportMetaEnv {
    readonly BASE_URL: string;
    readonly VITE_API_URL?: string;
    readonly VITE_APP_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

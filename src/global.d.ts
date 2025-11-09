export {};

declare global {
  interface Window {
    electronAPI: {
      saveToken: (token: string) => Promise<void>;
      getToken: () => Promise<string | null>;
      onNavigate: (callback: (path: string) => void) => void;
      getInitialToken: () => Promise<string | null>;
    };
  }
}

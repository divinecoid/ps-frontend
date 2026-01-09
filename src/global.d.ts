import { PrintOptions } from "@/interfaces/print";

export { };

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
      startOauth: (url: string, successUrl: string) => Promise<void>;
      onOauthDone: (callback: () => void) => void;
      removeOauthListener: () => void;
      onFullscreenChange: (callback: (isFullscreen: boolean) => void) => void;
      notifyPrintReady: () => void;
      printPreview: (options: PrintOptions) => Promise<boolean>;
      startPrint: () => void;
      onSetPrintData: (callback: (data: PrintOptions) => void) => () => void;
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

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/provider/auth-provider";
import { AcmProvider } from "@/provider/acm-provider";

// Define browser fallback/mock for window.electronAPI if running outside Electron (in web browser)
if (typeof window !== "undefined" && !window.electronAPI) {
  let oauthListener: (() => void) | null = null;

  window.electronAPI = {
    saveToken: async (token: string) => {
      localStorage.setItem("token", token);
      return true;
    },
    getToken: async () => {
      return localStorage.getItem("token") || null;
    },
    saveRefreshToken: async (t: string) => {
      localStorage.setItem("refresh_token", t);
      return true;
    },
    getRefreshToken: async () => {
      return localStorage.getItem("refresh_token") || null;
    },
    deleteToken: async () => {
      localStorage.removeItem("token");
      return true;
    },
    deleteRefreshToken: async () => {
      localStorage.removeItem("refresh_token");
      return true;
    },
    onNavigate: (callback: (path: string) => void) => {
      return () => {};
    },
    startOauth: async (url: string, successUrl: string) => {
      const width = 1110;
      const height = 750;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      const oauthWin = window.open(
        url,
        "oauth",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      const pollTimer = setInterval(() => {
        try {
          if (!oauthWin || oauthWin.closed) {
            clearInterval(pollTimer);
            return;
          }
          const currentUrl = oauthWin.location.href;
          if (currentUrl && currentUrl.includes(successUrl)) {
            clearInterval(pollTimer);
            oauthWin.close();
            if (oauthListener) {
              oauthListener();
            }
          }
        } catch (e) {
          // Expected while loading external OAuth domains
        }
      }, 500);
    },
    onOauthDone: (callback: () => void) => {
      oauthListener = callback;
    },
    removeOauthListener: () => {
      oauthListener = null;
    },
    onFullscreenChange: (callback: (state: boolean) => void) => {
      const handler = () => callback(!!document.fullscreenElement);
      document.addEventListener("fullscreenchange", handler);
      return () => document.removeEventListener("fullscreenchange", handler);
    },
    notifyPrintReady: () => {},
    printPreview: async () => {
      window.print();
      return true;
    },
    startPrint: () => {
      window.print();
    },
    onSetPrintData: (cb: any) => {
      return () => {};
    },
    saveFile: async (buffer: any, filename: string) => {
      const blob = new Blob([buffer]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return filename;
    },
    openFile: async (filePath: string) => {
      console.log("File downloaded to browser storage:", filePath);
    },
  };
}

const initialToken = await window.electronAPI?.getToken();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <AuthProvider initialToken={initialToken}>
      <AcmProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
          <Toaster
            position="top-right"
            swipeDirections={["left", "right"]}
            className="select-none"
          />
        </ThemeProvider>
      </AcmProvider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    saveToken: (token) => ipcRenderer.invoke("save-token", token),
    getToken: () => ipcRenderer.invoke("get-token"),
    getRefreshToken: () => ipcRenderer.invoke("get-refresh-token"),
    saveRefreshToken: (t) => ipcRenderer.invoke("save-refresh-token", t),
    deleteToken: () => ipcRenderer.invoke("delete-token"),
    deleteRefreshToken: () => ipcRenderer.invoke("delete-refresh-token"),
    onNavigate: (callback) => ipcRenderer.on("navigate-to", (_, path) => callback(path)),
    startOauth: (url, successUrl) => ipcRenderer.invoke("open-oauth", url, successUrl),
    onOauthDone: (callback) => ipcRenderer.on("oauth-done", callback),
    removeOauthListener: () => ipcRenderer.removeAllListeners("oauth-done")
});
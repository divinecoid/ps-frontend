const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    saveToken: (token) => ipcRenderer.invoke("save-token", token),
    getToken: () => ipcRenderer.invoke("get-token"),
    onNavigate: (callback) => ipcRenderer.on("navigate-to", (_, path) => callback(path)),
    getInitialToken: async () => ipcRenderer.invoke("get-token")
});
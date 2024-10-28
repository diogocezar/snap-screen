const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getSources: () => ipcRenderer.send("getSources"),
  onSourcesReceived: (callback) =>
    ipcRenderer.on("sources", (event, sources) => callback(sources)),
});

const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false, // Remove a barra de título
    transparent: true, // Janela com fundo transparente
    hasShadow: true, // Adiciona sombra para destacá-la
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Certifique-se que esse caminho está correto
      contextIsolation: true, // Mantenha true para segurança
      enableRemoteModule: false,
      nodeIntegration: false, // Melhor mantê-lo false para segurança
    },
  });

  mainWindow.loadFile("src/index.html");
});

ipcMain.on("getSources", async (event) => {
  const sources = await desktopCapturer.getSources({
    types: ["screen", "window"], // Adiciona tanto 'screen' quanto 'window'
    thumbnailSize: { width: 200, height: 200 },
  });
  event.sender.send("sources", sources);
});

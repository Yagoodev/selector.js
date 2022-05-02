const { app, BrowserWindow, dialog, ipcMain } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },

    resizable: false
  });

  win.loadFile("index.html");
};

app.on("ready", () => {
  createWindow();

  ipcMain.on("get-path", async (event, message) => {
    const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });

    event.reply("path", { path: result.filePaths });
  });
})
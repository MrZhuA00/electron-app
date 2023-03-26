const { app, BrowserWindow, session, desktopCapturer } = require("electron");

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    center: true,
    title: "Example App",
    width: 1000,
    height: 700,
    resizable: true,
    // frame: false, // 隐藏窗口边框
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // sandbox: true,
      // contextIsolation: true,
      // webSecurity: false,
    },
  });

  win.loadURL("http://127.0.0.1:3000/");

  // 打开开发者工具
  win.webContents.openDevTools();

  // 发送消息到渲染进程
  win.webContents.send("message", { data: "Hello from main process!" });
}

// Electron 会在初始化完成并准备好创建浏览器窗口时调用这个函数
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "script-src 'self'  http://127.0.0.1:3000 ws://127.0.0.1:3000",
        ],
      },
    });
  });
  // 在主进程中将 Electron 模块暴露为全局变量
  // global.desktopCapturer = desktopCapturer;
});

// 当所有窗口都被关闭时退出应用
app.on("window-all-closed", () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持活动状态。
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

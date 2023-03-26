import electronPath from "electron";
import { execa } from "execa";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

(async () => {
  // 启动 Vite 服务
  const server = await createServer({
    root: path.join(projectRoot),
    server: {
      port: 3000,
      open: false,
    },
  });
  await server.listen();
  server.printUrls();

  // 启动 Electron 应用程序
  const inst = execa(
    electronPath,
    [
      "--inspect=5858",
      "--remote-debugging-port=9222",
      "--js-flags='--max-old-space-size=16384'",
      ".",
    ],
    {
      detached: false,
      cleanup: true,
      windowsHide: false,
    }
  );

  inst.stdout.pipe(process.stdout);
  inst.stderr.pipe(process.stderr);

  // 监听进程退出事件，关闭 Vite 服务
  inst.on("exit", () => {
    server.close();
    process.exit(0);
  });
})();

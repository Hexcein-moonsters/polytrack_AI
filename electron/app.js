import { app, BrowserWindow } from 'electron';
import { port, path, finalUrl } from '../config.js';

// Force the underlying Chromium engine to never throttle background tasks
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('intensive-wake-up-throttling-policy', '0');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      backgroundThrottling: false
    }
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    // Ignore subframes, aborted navigations (-3), or the error page itself failing
    if (!isMainFrame || errorCode === -3 || validatedURL.includes('error.html')) return;

    // Wait natively for Chromium to completely stop the failing navigation.
    // This perfectly synchronizes the load File action with Chromium's IPC lifecycle,
    // killing the Mojo crash and blank screen without arbitrary timeouts.
    win.webContents.once('did-stop-loading', () => {
      win.loadFile('error.html', {
        query: {
          errorCode: String(errorCode),
          errorDescription: errorDescription,
          validatedURL: validatedURL
        }
      });
    });
  });

  win.loadURL(finalUrl);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

process.on('SIGINT', () => {
  app.quit();
  process.exit(0);
});
process.on('SIGTERM', () => {
  app.quit();
  process.exit(0);
});
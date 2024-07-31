const { app, BrowserWindow, session, desktopCapturer } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        maxWidth: 1920,
        maxHeight: 1080,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
    })

    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
            callback({ video: sources[0], audio: 'loopback' })
        })
    })

    session.defaultSession.setDevicePermissionHandler((details) => {
        console.log('Запрашиваемый тип устройства:', details.deviceType);
        return true;
        // if (details.deviceType === 'media') {
        //     return true;
        // }
        // return false;
    });

    win.setMenuBarVisibility(false)
    win.loadURL('http://localhost:3000');
    win.setTitle("PinCode.Summarizer")

    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

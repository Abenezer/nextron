// Modules to control application life and create native browser window
const { autoUpdater } = require("electron-updater")

const {app, BrowserWindow, session, Tray, Menu} = require('electron')
const path = require('path')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const iconpath = path.join(__dirname, 'tray.ico')


let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});



function createWindow () {
  // Create the browser window.
   autoUpdater.checkForUpdatesAndNotify();
  
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
    mainWindow.loadURL('http://server_x.deweto.et/next');
    //mainWindow.loadURL('http://localhost:3000');
    mainWindow.maximize();

    mainWindow.setMenu(null);
	 tray = new Tray(iconpath)
	const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Next', click:  function(){
        mainWindow.show();
    } },
    { label: 'Quit Next', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
]);
	 tray.setToolTip('Next Planner by DDS')
  tray.setContextMenu(contextMenu)
	tray.on('double-click', function(event) {
		mainWindow.show();
	});
	
    session.defaultSession.allowNTLMCredentialsForDomains('*')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  
  
  
  
  
  
  // Emitted when the window is closed.
  
  
  
  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
	
});

mainWindow.on('close', function (event) {
    if(!app.isQuiting){
        event.preventDefault();
        mainWindow.hide();
    }

    return false;
});
  
  
  
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

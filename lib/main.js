const {app, Menu, Tray, BrowserWindow} = require('electron');
var request = require('request');

let tray = null;
let win = null;

app.on('ready', () => {
    win = new BrowserWindow({show: false});
    tray = new Tray(app.getAppPath() + '/assets/redicon.ico');
    tray.setToolTip('No IP Yet');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Toggle DevTools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click: function() {
                win.show();
                win.toggleDevTools();
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            role: 'quit',
        }
    ]);
    tray.setContextMenu(contextMenu);
    request('http://icanhazip.com', function (error, response, body) {
        if(!error && response.statusCode == 200) {
            tray.setToolTip("External IP " + body);
            console.log(body.toString('ascii'));
            if(body.trim() === "90.155.86.70") {
                tray.setImage(app.getAppPath() + '/assets/greenicon.ico');
                console.log("was equal");
            }
        }
    });


    setInterval(function() {
        request('http://icanhazip.com', function (error, response, body) {
            if(!error && response.statusCode == 200) {
                tray.setToolTip(body);
                console.log(body.toString('ascii'));
                if(body.trim() === "90.155.86.70") {
                    tray.setImage(app.getAppPath() + '/assets/greenicon.ico');
                    console.log("was equal");
                }
            }
        });
    }, 60000);
})

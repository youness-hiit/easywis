const electron = require('electron');
const _ = require('lodash');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const fs = require('fs');
const url = require('url');

const constants = require('./constants');

// Simple commandline way to run cli or bash style commands as if you were in the terminal.
const cmd = require('node-cmd');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 500, height: 620});

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

ipc.on('open-file-dialog', function(event) {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, function (files) {
        if (files) event.sender.send('selected-directory', files)
    })
});

ipc.on('create-branches', function(event, infos) {
    console.log('Source Branch name is: ', infos.sourceBranch);
    console.log('Macro Branch name is: ', infos.macroBranch);
    console.log('Has Version: ', infos.hasVersion);
    console.log('Version is: ', infos.version);
    console.log('Path Intranet: ', infos.intranetPath);
    cmd.get(
        `cd "${shellEscape(infos.intranetPath)}"
         git checkout ${infos.sourceBranch}
         git pull origin ${infos.sourceBranch}
         git checkout -B ${infos.macroBranch}

         cd node_modules/iad-ng-people
         git checkout ${infos.sourceBranch}
         git pull origin ${infos.sourceBranch}
         git checkout -B ${infos.macroBranch}

         cd ../iad-ng-club-business
         git checkout ${infos.sourceBranch}
         git pull origin ${infos.sourceBranch}
         git checkout -B ${infos.macroBranch}

         cd ../iad-ng-core
         git checkout ${infos.sourceBranch}
         git pull origin ${infos.sourceBranch}
         git checkout -B ${infos.macroBranch}

         cd ../iad-ng-css
         git checkout ${infos.sourceBranch}
         git pull origin ${infos.sourceBranch}
         git checkout -B ${infos.macroBranch}

         cd ../iad-ng-transaction
         git checkout ${infos.sourceBranch}
         git pull origin ${infos.sourceBranch}
         git checkout -B ${infos.macroBranch}

         cd ../iad-ng-dashboard
         git checkout ${infos.sourceBranch}
         git pull origin ${infos.sourceBranch}
         git checkout -B ${infos.macroBranch}
        `,
        function(err, data) {
            if (!err) {
                console.log(data);
                for (const project of constants.PROJECTS) {
                    modifyFile(infos, project);
                }
            } else {
                console.log('Error : ', err);
            }
        }
    );
});

// Utils
function shellEscape(str) {
    return str.replace(/(["\s'$`\\])/g, '\\$1');
};

function modifyFile(infos, project) {
    fs.readFile(infos.intranetPath + project.path, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        };
        const json = JSON.parse(data);
        if (infos.hasVersion && infos.version) {
            json.version = infos.version;
        };
        for (const project of constants.PROJECTS) {
            if (json.dependencies[_.kebabCase(project.name)]) {
                json.dependencies[_.kebabCase(project.name)] = `git@github.com:IAD-INTERNATIONAL/${project.name}.git#${infos.macroBranch}`;
            }
        };
        fs.writeFile(infos.intranetPath + project.path, JSON.stringify(json, null, 2), 'utf8', function(err) {
            if (err) return console.log(err);
            let isLast = project === _.last(constants.PROJECTS);


            if (isLast) {
                pushBranches(infos);
            }
        });
    });
}

function pushBranches(infos) {
    cmd.get(
        `cd "${shellEscape(infos.intranetPath)}"
         git commit -am "Init Branch : ${infos.macroBranch}"
         git push origin ${infos.macroBranch}

         cd node_modules/iad-ng-people
         git commit -am "Init Branch : ${infos.macroBranch}"
         git push origin ${infos.macroBranch}

         cd ../iad-ng-club-business
         git commit -am "Init Branch : ${infos.macroBranch}"
         git push origin ${infos.macroBranch}

         cd ../iad-ng-core
         git commit -am "Init Branch : ${infos.macroBranch}"
         git push origin ${infos.macroBranch}

         cd ../iad-ng-css
         git commit -am "Init Branch : ${infos.macroBranch}"
         git push origin ${infos.macroBranch}

         cd ../iad-ng-transaction
         git commit -am "Init Branch : ${infos.macroBranch}"
         git push origin ${infos.macroBranch}

         cd ../iad-ng-dashboard
         git commit -am "Init Branch : ${infos.macroBranch}"
         git push origin ${infos.macroBranch}
        `,
        function(err, data, err) {
            if (!err) {
                console.log(data);
                mainWindow.webContents.send('remove-class-m-progress');
            } else {
                console.log('Error : ', err);
            }
        }
    );

}
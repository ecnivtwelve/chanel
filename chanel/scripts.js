const { ipcRenderer } = require('electron');
const config = require('../config.json');
const path = require('path');

const wallpaper = require('node-wallpaper').default;
const fs = require('fs');

let currentWall;

wallpaper.get().then(wallpaper => {
    currentWall = wallpaper;
    fs.readFile(wallpaper, (err, data) => {
        if(err) throw err;
        let base64Wall = new Buffer(data, 'binary').toString('base64');
        let dataImage = `data:image/png;base64,${base64Wall}`;

        document.querySelector('html').style.backgroundImage = `url(${dataImage})`;
    });
});

setTimeout(() => {
    wallpaper.get().then(wallpaper => {
        if(wallpaper !== currentWall) {
            currentWall = wallpaper;
            fs.readFile(wallpaper, (err, data) => {
                if(err) throw err;
                let base64Wall = new Buffer(data, 'binary').toString('base64');
                let dataImage = `data:image/png;base64,${base64Wall}`;

                document.querySelector('html').style.backgroundImage = `url(${dataImage})`;
            });
        }
    });
}, 2000);

let iconPath = path.join(__dirname, '../build/icon.png')

if(config.appIcon !== undefined && config.appIcon !== null && config.appIcon !== '') {
  iconPath = path.join(__dirname, config.appIcon);
}

document.querySelector('#chanel_icon').src = iconPath;
document.querySelector('#chanel_name').innerHTML = config.appName;

document.getElementsByTagName("c3")[0].addEventListener('click', function(){
    ipcRenderer.send('close');
});

document.getElementsByTagName("c2")[0].addEventListener('click', function(){
    ipcRenderer.send('maximize');
});

document.getElementsByTagName("c1")[0].addEventListener('click', function(){
    ipcRenderer.send('minimize');
});
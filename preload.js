const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('expose', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    login: (account, password) => ipcRenderer.invoke('login-request', {account, password}),
});

window.getStr = 'str';
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('expose', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    login: (account, password) => ipcRenderer.invoke('login-request', {account, password}),
    select: (cmd) => ipcRenderer.invoke('select-request', {cmd}),
    insert: (formData, tableName) => ipcRenderer.invoke('insert-request', formData, tableName),
    update: (formData, tableName) => ipcRenderer.invoke('update-request', formData, tableName),
    delete: (sno, tableName) => ipcRenderer.invoke('delete-request', sno, tableName),
});

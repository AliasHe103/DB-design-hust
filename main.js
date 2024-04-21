const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const url = require('url');
const mode = process.argv[2];
const mysql = require('mysql');
let connection = null;

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            defaultEncoding: 'utf-8'
        }
    });

    //判断是否是开发模式
    if(mode === 'dev') {
        mainWindow.loadURL("http://localhost:3000/")
    }
    else {
        mainWindow.loadURL(url.format({
            pathname:path.join(__dirname, './build/index.html'),
            protocol:'file:',
            slashes:true
        }));
    }
}

app.commandLine.appendSwitch('charset', 'utf-8');

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong');

    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.handle('login-request', async (event, {account, password}) => {
    //建立mysql连接
    connection = mysql.createConnection({
        host: 'localhost',
        user: account,
        password: password,
        database: 'students_db'
    });

    return await new Promise((resolve) => {
        connection.connect(err => {
            if (err) {
                const error = 'Error connecting to database:' + err;
                console.error(error);
                resolve(error);
            } else {
                console.log('Connected to database');
                resolve('login success');
            }
        });
    });
});

ipcMain.handle('select-request', async(event, {cmd}) => {
    if (connection) {
        return await new Promise((resolve) => {
            connection.query(cmd, (err, results) => {
                if (err) {
                    const error = 'Error executing query:' + err;
                    console.error(error);
                    resolve(error);
                } else {
                    console.log('Query executed successfully');
                    resolve(results);
                }
            });
        });
    } else {
        console.error('No database connection');
        return 'No database connection';
    }
});

ipcMain.handle('insert-request', async(event, formData, tableName) => {
    if (connection) {
        return await new Promise((resolve) => {
            let cmd = `insert into ${tableName} (sno, sname, ssex, sage, sdept, scholarship) values (?, ?, ?, ?, ?, ?)`;
            if (tableName === 'course') {
                cmd = `insert into ${tableName} (cno, cname, cpno, ccredit) values (?, ?, ?, ?)`;
            }
            else if (tableName === 'sc') {
                cmd = `insert into ${tableName} (sno, cno, grade) values (?, ?, ?)`;
            }
            connection.query(cmd, formData, (err, results) => {
                if (err) {
                    const error = 'Error executing insert:' + err;
                    console.error(error);
                    if (error.includes('Duplicate entry')) {
                        resolve('增加数据出错，对应数据已经存在');
                    }
                    resolve('增加数据出错，请检查输入是否正确');
                } else {
                    console.log('Insert executed successfully');
                    resolve('新增数据成功');
                }
            });
        });
    } else {
        console.error('No database connection');
        return 'No database connection';
    }
});

ipcMain.handle('update-request', async(event, formData, tableName) => {
    if (connection) {
        return await new Promise((resolve) => {
            let cmd = `update ${tableName} set sname=?, ssex=?, sage=?, sdept=?, scholarship=? where sno=?`;
            if (tableName === 'course') {
                cmd = `update ${tableName} set cname=?, cpno=?, ccredit=? where cno=?`;
            }
            else if (tableName === 'sc') {
                cmd = `update ${tableName} set grade=? where sno=? and cno=?`;
            }
            connection.query(cmd, formData, (err, results) => {
                if (err) {
                    const error = 'Error executing update:' + err;
                    console.error(error);
                    resolve('更新学生数据出错，请检查输入是否正确');
                } else {
                    console.log('Update executed successfully');
                    resolve('更新学生数据成功');
                }
            });
        });
    } else {
        console.error('No database connection');
        return 'No database connection';
    }
});

ipcMain.handle('delete-request', async(event, sno, tableName) => {
    if (connection) {
        return await new Promise((resolve) => {
            let cmd = `delete from ${tableName} where sno=?`;
            if (tableName === 'course') {
                cmd = `delete from ${tableName} where cno=?`;
            }
            else if (tableName === 'sc') {
                cmd = `delete from ${tableName} where sno=? and cno=?`;
            }
            connection.query(cmd, sno, (err, results) => {
                if (err) {
                    const error = 'Error executing delete:' + err;
                    console.error(error);
                    resolve('删除数据失败');
                } else {
                    console.log('Delete executed successfully');
                    resolve('删除数据成功');
                }
            });
        });
    } else {
        console.error('No database connection');
        return 'No database connection';
    }
});

ipcMain.handle('overview-request', async(event) => {
    if (connection) {
        return await new Promise((resolve) => {
            let cmd = `select s.sdept,
                                avg(sc.grade) as avg_grade,max(sc.grade) as max_grade,min(sc.grade) as min_grade,
                                round(sum(case when sc.grade >= 90 then 1 else 0 end) * 1.0 / count(*), 2) as excellent_rate,
                                sum(case when sc.grade < 60 then 1 else 0 end) as fail_count
                                from student s join sc on s.sno = sc.sno join course c on sc.cno = c.cno
                                group by s.sdept;`;
            connection.query(cmd, (err, results) => {
                if (err) {
                    const error = 'Error executing overview:' + err;
                    console.error(error);
                    resolve('查看总览失败');
                } else {
                    console.log('Overview executed successfully');
                    resolve(results);
                }
            });
        });
    } else {
        console.error('No database connection');
        return 'No database connection';
    }
});


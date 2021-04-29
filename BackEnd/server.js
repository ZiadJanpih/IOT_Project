const express = require('express')
const authAPI = require('./DB/AuthQueries.js')
const adminAPI = require('./DB/AdminQueries.js')
const sensorAPI = require('./DB/SensorsQueries.js')
const adminAuthAPI = require('./DB/AdminAuth.js')
const adminReports = require('./DB/AdminReports.js')
const authorization = require('./Model/Helpers/Authorization.js')
const addData = require('./DB/AddData.js')
const { request } = require('express')
const app = express();

app.use(express.json())

// Normal User
app.post('/register', authAPI.register)
app.post('/login', authAPI.login)
app.post('/refreshToken', authAPI.refreshToken)

//Admin
app.get('/getBuildings', authorization.authorize, adminAPI.getBuildings)
app.post('/addBuilding', authorization.authorize, adminAPI.addBuilding)
app.post('/changeBuildingStatus', authorization.authorize, adminAPI.changeBuildingStatus)
app.get('/getFloors', authorization.authorize, adminAPI.getFloors)
app.post('/changeFloorStatus', authorization.authorize, adminAPI.changeFloorStatus)
app.post('/addFloor', authorization.authorize, adminAPI.addFloor)
app.get('/getCorridors', authorization.authorize, adminAPI.getCorridors)
app.get('/getBuildingCorridors', authorization.authorize, adminAPI.getBuildingCorridors)
app.post('/changeCorridorStatus', authorization.authorize, adminAPI.changeCorridorStatus)
app.post('/addCorridor', authorization.authorize, adminAPI.addCorridor)
app.post('/addCorridorConnection', authorization.authorize, adminAPI.addCorridorConnection)
app.post('/removeCorridorConnection', authorization.authorize, adminAPI.removeCorridorConnection)
app.get('/getCorridorConnections', authorization.authorize, adminAPI.getCorridorConnections)
app.get('/getFullCorridorConnections', authorization.authorize, adminAPI.getFullCorridorConnections)
app.get('/getRooms', authorization.authorize, adminAPI.getRooms)
app.post('/changeRoomStatus', authorization.authorize, adminAPI.changeRoomStatus)
app.post('/addRoom', authorization.authorize, adminAPI.addRoom)
app.get('/getAllUsers', authorization.authorize, adminAPI.getAllUsers)
app.get('/getUsersDevices', authorization.authorize, adminAPI.getUsersDevices)

app.post('/addSuperAdmin', adminAuthAPI.addSuperAdmin)
app.post('/adminLogin', adminAuthAPI.login)
app.post('/adminRefreshToken', adminAuthAPI.refreshToken)
app.get('/getAdmins', authorization.authorize, adminAuthAPI.getAdmins)
app.post('/addAdmin', authorization.authorize, adminAuthAPI.addAdmin)
app.post('/changeAdminStatus', authorization.authorize, adminAuthAPI.changeAdminStatus)

//Sensor
app.post('/checkSensor', sensorAPI.checkSensor)

//Reports
app.post('/getRCReport', authorization.authorize, adminReports.RCReport)
app.post('/getDWReport', authorization.authorize, adminReports.DWReport)
app.post('/avgPerHourReport', authorization.authorize, adminReports.avgPerHourReport)
app.post('/minMaxReport', authorization.authorize, adminReports.minMaxReport)

//AddData
app.post('/AddUsers', addData.registerNewUsers)
app.post('/AddUsersDevices', addData.addUsersDevices)
app.post('/AddCheckLog', addData.addCheckLog)


app.listen(3000);
console.log('Server is running...')


function job() {
    //get the mins of the current time
    adminReports.addData()
  }
  
  setInterval(job, 1000 * 60 * 60);
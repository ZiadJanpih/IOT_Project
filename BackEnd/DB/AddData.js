require('dotenv').config()
const { request, response } = require('express')
const authAPI = require('./AuthQueries.js')
const { v4: uuidv4 } = require('uuid');
const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.dbUser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbPassword,
    port: parseInt(process.env.dbport),
    multipleStatements: true
})

// Help Functions
function GenerateString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

// APIs Functions

const registerNewUsers = (request, response) => {
    for ( var i = 0; i < 100; i++ ) {
        request.body.fname = GenerateString(20)
        request.body.lname = GenerateString(20)
        request.body.email = GenerateString(20) + '@gmail.com'
        request.body.password = GenerateString(20)

        authAPI.register(request, response);
    }
    response.status(200).json(null)
}

const addUsersDevices = (request, response) => {
    pool.query("Select * From Users",(err, res) => {
        if (err) response.status(400).json(null)
        let users = res.rows
        for(var i in users) {
            let user = users[i]
            const id = uuidv4()
            const deviceId = uuidv4()
            pool.query("Insert into users_devices (id, userid, deviceid) values ($1, $2, $3)", [id, user['id'], deviceId], (err, res) => {
            })
        }
        response.status(200).json(null)
    })
}

const addCheckLog2= (request, response) => {
    for (i = 1; i<=31; i++) {
        for(h=0; h<=23; h++) {
            var day = ''
            var hour = ''
            if (i < 9) {
                day = '0' + i
            }
            else {
                day = i
            }
            if (h < 9) {
                hour = '0' + h
            }
            else {
                hour = h
            }
            let date = '2021-01-' + day + ' ' + hour + ':00:00'
            pool.query("select * from sensorentity s where s.entitytype in ('Corridor', 'Room', 'Entrance')", (err, res) => {
                for(var e in res.rows) {
                    var entity = res.rows[e]
                    var numberOfDevices = getRandomInt(20)
                    if (numberOfDevices > 0 ) {
                        pool.query("select * from users_devices", (err, res) => {
                            for (n=0 ; n<=numberOfDevices; n++){
                                let randomDevice = res.rows[getRandomInt(100)]
                                pool.query("Insert into sensorlog (userdeviceid, sesorentityid, actionid, resultid, params, actiondate) values ($1, $2, $3, $4, $5, to_timestamp($6, 'YYYY-mm-DD hh24:mi:ss'))", [randomDevice['id'], entity['id'], process.env.CheckSensor, 1, "Fake Data", date], (err,res) => {
                                })
                            }
                        })
                    }
                }
            })
        }
    }
    response.status(200).json(null)
}

const addCheckLog = (request, response) => {
    let weightArr = [0, 0, 0, 0, 0, 0, 0.05, 0.2, 0.6, 0.9, 1, 1, 1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2, 0.1, 0.05, 0, 0]
    pool.query("select * from sensorentity s where s.entitytype in ('Corridor', 'Room', 'Entrance')", (err, res) => {
        let entitiesArray = res.rows
        pool.query("select * from users_devices",(err, res) =>{
            let devicesArray = res.rows
            for (var e in entitiesArray) {
                var entity = entitiesArray[e]
                for (i = 1; i<=31; i++) {
                    for(h=0; h<=23; h++) {
                        var numberOfDevices = 50
                        numberOfDevices = Math.round(numberOfDevices * weightArr[h])
                        if (numberOfDevices > 0) {
                            var day = ''
                            var hour = ''
                            if (i < 9) {
                                day = '0' + i
                            }
                            else {
                                day = i
                            }
                            if (h < 9) {
                                hour = '0' + h
                            }
                            else {
                                hour = h
                            }
                            let date = '2021-01-' + day + ' ' + hour + ':00:00'
                            for (n=0 ; n<=numberOfDevices; n++){
                                let randomDevice = devicesArray[getRandomInt(devicesArray.length)]
                                pool.query("Insert into sensorlog (userdeviceid, sesorentityid, actionid, resultid, params, actiondate) values ($1, $2, $3, $4, $5, to_timestamp($6, 'YYYY-mm-DD hh24:mi:ss'))", [randomDevice['id'], entity['id'], process.env.CheckSensor, 1, "Fake Data", date], (err,res) => {
                                })
                            }
                        }
                    }
                }
            }
        })
    })
    response.status(200).json(null)
}

module.exports = {
    registerNewUsers,
    addUsersDevices,
    addCheckLog
}
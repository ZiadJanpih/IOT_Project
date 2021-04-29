require('dotenv').config()
const { request, response } = require('express')
const Pool = require('pg').Pool
const Result = require('../Model/Classes/Result.js')

const pool = new Pool({
    user: process.env.dbUser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbPassword,
    port: parseInt(process.env.dbport)
})

//Help function

function getResult(actionResult, callback) {
    pool.query("select * from actionresults ar where ar.id = $1", [actionResult], (err, res) => {
        if (err) callback(err, null)
        let resp = new Result();
        resp.code = res.rows[0]['id'];
        resp.message = res.rows[0]['result'];
        callback(null, resp)
    })
}

//APIs functions

const checkSensor = (request, response) => {
    const entityId = request.body.sensorEntityId
    const macAddresses = request.body.macAddresses
    const NumberOfCurrentUsers = parseInt(request.body.NumberOfCurrentUsers)

    if ((NumberOfCurrentUsers == null) || (macAddresses == null) || (macAddresses.length != NumberOfCurrentUsers)) {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
    else {
        pool.query("Select * from sensorentity se where se.entityid = $1", [entityId], (err, res) => {
            if (err) response.status(400).json(null)
            if (res.rows.length > 0) {
                let sensor = res.rows[0]
                let sensorEntityId = sensor["id"]
                pool.query("update sensorentity set currentquantity = $2 where id = $1", [sensorEntityId, NumberOfCurrentUsers], (err, res) => {
                    if (err) response.status(400).json(null)
                    for (let macAddress of macAddresses) {
                        pool.query("Select * from users_devices ud where ud.isDeleted = 0 and ud.deviceid = $1 and ud.creation_date = (select max(ud1.creation_date) From users_devices ud1 Where ud.deviceid = ud1.deviceid and ud1.isDeleted = 0)",
                        [macAddress], (err, res) => {
                            if (err) response.status(400).json(null)
                            if (res.rows.length > 0) {
                                deviceId = res.rows[0]['id'];
                                pool.query("Insert into sensorlog (userdeviceid, sesorentityid, actionid, resultid, params) values ($1, $2, $3, $4, $5)",
                                    [deviceId, sensorEntityId, process.env.CheckSensor, 1, ""], (err, res) => {
                                        if (err) response.status(400).json(null)
                                })
                            }
                            else {
                                pool.query("Insert into sensorlog (userdeviceid, sesorentityid, actionid, resultid, params) values ($1, $2, $3, $4, $5)",
                                    [null, sensorEntityId, process.env.CheckSensor, -6, ""], (err, res) => {
                                        if (err) response.status(400).json(null)
                                })
                            }
                        })
                    }
                    getResult(1, (err, res) => {
                        if (err) response.status(400).json(null)
                        response.status(200).json(res)
                    })
                })
            }
            else {
                getResult(-6, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
            }
        })
    }
}

module.exports = {
    checkSensor
}
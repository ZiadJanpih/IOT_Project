require('dotenv').config()
const { request, response } = require('express')
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Pool = require('pg').Pool
const Result = require('../Model/Classes/Result.js')
const { v4: uuidv4 } = require('uuid');
const User = require('../Model/Classes/User.js');
const UserDevice = require('../Model/Classes/UserDevice.js')
const RetUser = require('../Model/Classes/RetUser.js')
const RefreshToken = require('../Model/Classes/RefreshToken.js')

const pool = new Pool({
    user: process.env.dbUser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbPassword,
    port: parseInt(process.env.dbport)
})

//Help Functions

function checkUserExistance(email, callback){
    pool.query("select * from users u where lower(u.email) = lower($1)", [email], (err, res) => {
        if (err) callback(err, null)
        if (res.rows.length == 0)
            callback(null, 1)
        else
            callback(null, -1)
    })
}

function getResult(userId, action, actionResult, params, retObj, callback) {
    insertLog(userId, action, actionResult, params, (err, res) => {
        if (err) callback(err, null)
        pool.query("select * from actionresults ar where ar.id = $1", [actionResult], (err, res) => {
            if (err) callback(err, null)
            let resp = new Result();
            resp.code = res.rows[0]['id'];
            resp.message = res.rows[0]['result'];
            resp.data = retObj
            callback(null, resp)
        })
    })
}

function insertLog(userId, action, actionResult, params, callback){
    const actionNew = parseInt(action)
    const paramsS = JSON.stringify(params)
    pool.query("Insert into useractions (userid, actionid, resultId, params) values ($1, $2, $3, $4)"
                ,[userId, actionNew, actionResult, paramsS], 
                (err, res) => {
                    if (err) callback(err, null)
                    callback(null, 1)
            })
}

function verifyCredentials(email, password, callback) {
    pool.query("Select * from Users u where lower(u.email) = lower($1) and u.password = $2", [email, crypto.createHash('sha256').update(password).digest('hex')],
        (err, res) =>{
            if (err) callback(err, null)
    
            if (res.rows.length == 0) {
                callback(null, -3)
            }
            else {
                let user = new User()
                user.userId = res.rows[0]['id']
                user.fname = res.rows[0]['fname']
                user.lname = res.rows[0]['lname']
                user.email = res.rows[0]['email']
                user.password = res.rows[0]['password']
                callback(null, user)
            }
        })
}

function checkDeviceExistance(userId, deviceId, callback){
    pool.query("Select * from users_devices ud where ud.userId = $1 and ud.deviceid = $2",[userId, deviceId], (err, res) => {
        if (err) callback(err, null)
        if (res.rows.length == 0) {
            callback(null, -1)            
        }
        else {
            let userDevice = new UserDevice()
            userDevice.id = res.rows[0]['id']
            userDevice.userId = res.rows[0]['userid']
            userDevice.deviceId = res.rows[0]['deviceid']
            userDevice.lastlocation = res.rows[0]['lastlocation']
            userDevice.isDeleted = res.rows[0]['isdeleted']
            callback(null, userDevice)
        }
    })
}

function addNewDevice(userId, deviceId, callback) {
    const id = uuidv4()
    pool.query("Insert into users_devices (id, userid, deviceid) values ($1, $2, $3)", [id, userId, deviceId], (err, res) => {
        if (err) callback(err, null)
        let userDevice = new UserDevice()
        userDevice.id = id
        userDevice.userId = userId
        userDevice.deviceId = deviceId
        callback(null, userDevice)
    })
}

function addNotification(deviceId, token, callback){
    pool.query("Select * from notifications_tokens nt where nt.token = $1 and nt.userdeviceid = $2", [token, deviceId], (err, res) => {
        if (err) callback(err, null)
        if (res.rows.length > 0) {
            callback(null, 1)
        }
        else{
            pool.query("Insert into notifications_tokens(token, userdeviceid) values ($1, $2)",[token, deviceId], (err, res) => {
                if (err) callback(err, null)
                callback(null, 1)
            })
        }
    })
}

function generateAccessToken(user) {
    //let jsonUser = JSON.parse(user)
    return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn:'30s' })
}

function generateRefreshToken(user, callback) {
    let id = user.userId
    pool.query("select * from refreshtoken rf where rf.userid = $1", [id], (err, res) => {
        if(err) throw err
        if (res.rows.length > 0) {
            const refreshToken = res.rows[0]['refreshtoken']
            callback(refreshToken)
        }
        else {
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET)
            pool.query("insert into refreshtoken (userid, refreshtoken) values ($1, $2)", [id, refreshToken], (err, res) => {
                if(err) throw err
            })
            callback(refreshToken)
        }
    })
}

function generateRetUser(user, deviceId, accessToken, refreshToken) {
    let retUser = new RetUser()
    retUser.fname = user.fname
    retUser.lname = user.lname
    retUser.email = user.email
    retUser.deviceId = deviceId
    retUser.accessToken = accessToken
    retUser.refreshToken = refreshToken

    return retUser
}

function checkTokenExistance(token, callback) {
    pool.query("Select * From refreshtoken rf where rf.refreshtoken = $1", [token], (err, res) => {
        if (err) callback(err, null)
        if (res.rows.length > 0) {
            let refreshToken = new RefreshToken()
            refreshToken.id = res.rows[0]['userid']
            refreshToken.refreshToken = res.rows[0]['refreshtoken']
            callback(null, refreshToken)
        }
        else {
            callback(null, -1)
        }
    })
}

//APIs functions

const register = (request, response) => {
    // read parameteres 
    const fname = request.body.fname
    const lname = request.body.lname
    const email = request.body.email
    const password = request.body.password

    //Check User existance
    checkUserExistance(email, (err, res) =>{
        if (err) response.status(400).json(null)
        if (res == 1) {
            if (password.length > 8) {
                const userID = uuidv4()
                pool.query("Insert into users (ID, Fname, lname, email, password) Values ($1, $2, $3, $4, $5)",
                [userID, fname, lname, email, crypto.createHash('sha256').update(password).digest('hex')],
                (err, res) => {
                    if (err) response.status(400).json(null)
                    getResult(userID, process.env.Registration, 1, request.body, null, (err, res) => {
                        if (err) response.status(400).json(null)
                        response.status(200).json(res)
                    })
                })
            }
            else {
                res = -2
                getResult(null, process.env.Registration, res, request.body, null, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
            }
        }
        else {
            getResult(null, process.env.Registration, res, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        }
    })
}

const login = (request, response) => {
    const email = request.body.email
    const password = request.body.password
    const deviceId = request.body.deviceId
    const notificationToken = request.body.notificationToken

    verifyCredentials(email, password, (err, res) => {
        if (err) response.status(400).json(null)
        if (typeof res != "number"){
            let currentUser = res;
            checkDeviceExistance(currentUser.userId, deviceId, (err, res) => {
                if (err) response.status(400).json(null)
                if (typeof res != "number") {
                    let currentDevice = res
                    addNotification(currentDevice.id, notificationToken, (err, res) => {
                        if (err) response.status(400).json(null)
                        const accessToken = generateAccessToken(currentUser)
                        generateRefreshToken(currentUser, (refreshToken) => {
                            let retUser = generateRetUser(currentUser, currentDevice.id, accessToken, refreshToken)
                            getResult(currentUser.userId, process.env.Signin, 1, request.body, retUser, (err, res) => {
                                if (err) response.status(400).json(null)
                                response.status(200).json(res)
                            })
                        })
                    })
                }
                else {
                    addNewDevice(currentUser.userId, deviceId, (err, res) => {
                        if (err) response.status(400).json(null)
                        let currentDevice = res
                        addNotification(currentDevice.id, notificationToken, (err, res) => {
                            if (err) response.status(400).json(null)
                            const accessToken = generateAccessToken(currentUser)
                            generateRefreshToken(currentUser, (refreshToken) => {
                                let retUser = generateRetUser(currentUser, currentDevice.id, accessToken, refreshToken)
                                getResult(currentUser.userId, process.env.Signin, 1, request.body, retUser, (err, res) => {
                                    if (err) response.status(400).json(null)
                                    response.status(200).json(res)
                                })
                            })
                        })
                    })
                }
            })
        }
        else {
            getResult(null, process.env.Signin, res, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        }
    })
}

const refreshToken = (request, response) => {
    const refreshToken = request.body.refreshToken

    checkTokenExistance(refreshToken, (err, res) => {
        if (err) response.status(400).json(null)
        if (typeof res != "number") {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
                if(err) response.status(403).json(null)
                let currentUser = new User(data);
                const accessToken = generateAccessToken(currentUser)
                response.status(200).json({ accessToken: accessToken})
            })
        }
        else {
            response.status(403).json(null)
        }
    })
}

module.exports = {
    register,
    login,
    refreshToken
}
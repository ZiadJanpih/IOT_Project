require('dotenv').config()
const { request, response } = require('express')
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Pool = require('pg').Pool
const Admin = require('../Model/Classes/Admin.js');
const Result = require('../Model/Classes/Result.js');
const RetAdmin = require('../Model/Classes/RetAdmin.js');
const RefreshToken = require('../Model/Classes/RefreshToken.js');
const { stat } = require('fs');

const pool = new Pool({
    user: process.env.dbUser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbPassword,
    port: parseInt(process.env.dbport)
})

// Help Functions

function checkUserExistance(email, callback){
    pool.query("select * from administrators a where lower(a.username) = lower($1)", [email], (err, res) => {
        if (err) callback(err, null)
        if (res.rows.length == 0)
            callback(null, 1)
        else
            callback(null, -1)
    })
}

function insertLog(adminId, action, actionResult, params, callback){
    const actionNew = parseInt(action)
    const paramsS = JSON.stringify(params)
    pool.query("Insert into adminactions (adminid, actionid, resultId, params) values ($1, $2, $3, $4)"
                ,[adminId, actionNew, actionResult, paramsS], 
                (err, res) => {
                    if (err) callback(err, null)
                    callback(null, 1)
            })
}

function getResult(adminId, action, actionResult, params, retObj, callback) {
    insertLog(adminId, action, actionResult, params, (err, res) => {
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

function verifyCredentials(username, password, callback) {
    pool.query("Select a.id, a.username, a.isactive from administrators a where lower(a.username) = lower($1) and a.password = $2", 
    [username, crypto.createHash('sha256').update(password).digest('hex')], (err, res) =>{
            if (err) callback(err, null)
    
            if (res.rows.length == 0) {
                callback(null, -3)
            }
            else {
                let admin = new Admin(res.rows[0])
                callback(null, admin)
            }
        })
}

function generateAccessToken(admin) {
    return jwt.sign(admin.toJSON(), process.env.ACCESS_TOKEN_SECRET)//, { expiresIn:'15m' })
}

function generateRefreshToken(admin, callback) {
    let id = admin.id
    pool.query("select * from admins_refreshtokens rf where rf.adminid = $1", [id], (err, res) => {
        if(err) throw err
        if (res.rows.length > 0) {
            const refreshToken = res.rows[0]['refreshtoken']
            callback(refreshToken)
        }
        else {
            const refreshToken = jwt.sign(admin.toJSON(), process.env.REFRESH_TOKEN_SECRET)
            pool.query("insert into admins_refreshtokens (adminid, refreshtoken) values ($1, $2)", [id, refreshToken], (err, res) => {
                if(err) throw err
            })
            callback(refreshToken)
        }
    })
}

function generateRetAdmin(admin,  accessToken, refreshToken) {
    let retAdrmin = new RetAdmin()
    retAdrmin.username = admin.username
    retAdrmin.accessToken = accessToken
    retAdrmin.refreshToken = refreshToken

    return retAdrmin
}

function checkTokenExistance(token, callback) {
    pool.query("Select * From admins_refreshtokens rf where rf.refreshtoken = $1", [token], (err, res) => {
        if (err) callback(err, null)
        if (res.rows.length > 0) {
            let refreshToken = new RefreshToken()
            refreshToken.userId = res.rows[0]['adminid']
            refreshToken.refreshToken = res.rows[0]['refreshtoken']
            callback(null, refreshToken)
        }
        else {
            callback(null, -1)
        }
    })
}

//APIs functions

const addSuperAdmin = (request, response) => {
    // read parameteres
    const adminId = process.env.ADMINID
    const username = "superadmin" 
    const password = "superadmin"

    //Check User existance
    checkUserExistance(username, (err, res) =>{
        if (err) response.status(400).json(null)
        if (res == 1) {
            pool.query("Insert into administrators (ID, username, password) Values ($1, $2, $3)",
            [adminId, username, crypto.createHash('sha256').update(password).digest('hex')],
            (err, res) => {
                let result = new Result()
                result.code = 1
                result.message = "Operation Success"
                response.status(200).json(result)
            })
        }
        else {
            let result = new Result()
            result.code = -1
            result.message = "Already Exist"
            response.status(200).json(result)
        }
    })
}

const login = (request, response) => {
    const username = request.body.username
    const password = request.body.password

    verifyCredentials(username, password, (err, res) => {
        if (err) response.status(400).json(null)
        if (typeof res != "number"){
            let currentadmin = res;
            const accessToken = generateAccessToken(currentadmin)
            generateRefreshToken(currentadmin, (refreshtoken) => {
                let retAdmin = generateRetAdmin(currentadmin, accessToken, refreshtoken)
                getResult(currentadmin.id, process.env.Signin, 1, request.body, retAdmin, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
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
                if(err) response.status(400).json(null)
                let currentUser = new Admin(data);
                const accessToken = generateAccessToken(currentUser)
                response.status(200).json({ accessToken: accessToken})
            })
        }
        else {
            response.status(403).json(null)
        }
    })
}

const getAdmins = (request, response) => {
    let adminid = request.user['id']
    if (adminid == process.env.ADMINID) {
        pool.query("Select id, username, creation_date, isactive from administrators", (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetAdmins, 1, adminid, res.rows, (err, res) => {
                if(err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
    else {
        getResult(adminid, process.env.GetAdmins, -7, null, null, (err, res) => {
            if(err) response.status(400).json(null)
            response.status(200).json(res)
        })
    }
}

const addAdmin = (request, response) => {
    // read parameteres 
    let adminid = request.user['id']
    const username = request.body.username
    const password = request.body.password
    if (adminid == process.env.ADMINID) {
        //Check User existance
        checkUserExistance(username, (err, res) =>{
            if (err) response.status(400).json(null)
            if (res == 1) {
                if (password.length > 8) {
                    const id = uuidv4()
                    pool.query("Insert into administrators (id, username, password) Values ($1, $2, $3)",
                    [id, username, crypto.createHash('sha256').update(password).digest('hex')],
                    (err, res) => {
                        if (err) response.status(400).json(null)
                        getResult(adminid, process.env.AddAdmin, 1, request.body, null, (err, res) => {
                            if (err) response.status(400).json(null)
                            response.status(200).json(res)
                        })
                    })
                }
                else {
                    res = -2
                    getResult(adminid, process.env.AddAdmin, res, request.body, null, (err, res) => {
                        if (err) response.status(400).json(null)
                        response.status(200).json(res)
                    })
                }
            }
            else {
                getResult(adminid, process.env.AddAdmin, res, request.body, null, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
            }
        })
    }
    else {
        getResult(adminid, process.env.AddAdmin, -7, request.body, null, (err, res) => {
            if(err) response.status(400).json(null)
            response.status(200).json(res)
        })
    }
}

const changeAdminStatus = (request, response) => {
    let adminid = request.user['id']
    let userId = request.body.userid
    let status = parseInt(request.body.status)
    if (adminid == process.env.ADMINID) {
        pool.query("update administrators set isactive = $1 where id = $2", [status, userId], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.ChangeAdminStatus, 1, request.body, null, (err, res) => {
                if(err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
    else {
        getResult(adminid, process.env.ChangeAdminStatus, -7, request.body, null, (err, res) => {
            if(err) response.status(400).json(null)
            response.status(200).json(res)
        })
    }
}

module.exports = {
    addSuperAdmin,
    login,
    refreshToken,
    getAdmins,
    addAdmin,
    changeAdminStatus
}
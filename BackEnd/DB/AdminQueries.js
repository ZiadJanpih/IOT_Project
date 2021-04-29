require('dotenv').config()
const { request, response } = require('express')
const { v4: uuidv4 } = require('uuid');
const url = require('url');
const Pool = require('pg').Pool
const Building = require('../Model/Classes/Building.js');
const Result = require('../Model/Classes/Result.js')
const Floor = require('../Model/Classes/Floor.js')
const Room = require('../Model/Classes/Room.js')
const Corridor = require('../Model/Classes/Corridor.js');
const CorridorConnections = require('../Model/Classes/CorridorConnections.js')

const pool = new Pool({
    user: process.env.dbUser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbPassword,
    port: parseInt(process.env.dbport),
    multipleStatements: true
})

// Help Funcations

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

function insertEntity(id, type) {
    const entityId = uuidv4()
    pool.query("Insert into sensorentity (id, entityid, entitytype) values ($1, $2, $3)", [entityId, id, type], (err, res) =>{
    });
}

function getName(parrentId, number, type, callback) {
    if (type == "Corridor") {
        pool.query("Select * From floor f where f.id = $1", [parrentId], (err, res) => {
            if (err) callback(err, null)
            if (res.rows.length > 0) {
                let floor = res.rows[0]
                let floorName = floor["name"]
                let corridorName = floorName + "C" + number.toString()
                callback(null, corridorName)
            }
        })
    }
    else if ((type == "Room") || (type == "Entrance")) {
        pool.query("Select * From corridor cc where cc.id = $1", [parrentId], (err, res) => {
            if (err) callback(err, null)
            if (res.rows.length > 0) {
                let corridor = res.rows[0]
                let corridorName = corridor["name"]
                let roomName = "" 
                if (type == "Room") {
                    roomName = corridorName + "R" + number.toString()
                }
                else {
                    roomName = corridorName + "E" + number.toString()
                }
                callback(null, roomName)
            }
        })
    }
}

// APIs Functions

const addBuilding = (request, response) => {
    const adminid = request.user['id']
    const name = request.body.name
    pool.query("select * from building b where b.name = $1", [name], (err, res) => {
        if (err) response.status(400).json(null)
        if (res.rows.length > 0) {
            getResult(adminid, process.env.AddBuilding, -4, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        }
        else {
            const id = uuidv4()
            pool.query("Insert into building (id, name) values ($1, $2)", [id, name], (err, res) => {
                if (err) response.status(400).json(null)
                let building = new Building()
                building.id = id
                building.name = name
                building.isactive = 1
                insertEntity(id, "Building")
                getResult(adminid, process.env.AddBuilding, 1, request.body, building, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
            })
        }
    })
}

const changeBuildingStatus = (request, response) => {
    const adminid = request.user['id']
    const id = request.body.buildingId
    const status = parseInt(request.body.status)
    pool.query("update building set isactive = $2 where id = $1", [id, status], (err, res) => {
        if (err) response.status(400).json(null)
        getResult(adminid, process.env.ChangeBuildingStatus, 1, request.body, null, (err, res) => {
            if (err) response.status(400).json(null)
            response.status(200).json(res)
        })
    })
}

const getBuildings = (request, response) => {
    const adminid = request.user['id']
    pool.query("Select * From building", (err, res) => {
        if (err) response.status(400).json(null)
        getResult(adminid ,process.env.GetBuildings ,1, null, res.rows, (err, res) => {
            if (err) response.status(400).json(null)
            response.status(200).json(res)
        })
    })
}

const addFloor = (request, response) => {
    const adminid = request.user['id']
    const buildingId = request.body.buildingId
    const floorNumber = parseInt(request.body.floorNumber)
    const name = "F" + floorNumber.toString()
    pool.query("select * from floor f where f.building_id = $1 and f.number = $2", [buildingId, floorNumber], (err, res) => {
        if (err) response.status(400).json(null)
        if (res.rows.length > 0) {
            getResult(adminid, process.env.AddFloor, -4, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        }
        else {
            const id = uuidv4()
            pool.query("Insert into floor (id, building_id, number, name) values ($1, $2, $3, $4)", [id, buildingId, floorNumber, name], (err, res) => {
                if (err) response.status(400).json(null)
                let floor = new Floor()
                floor.id = id
                floor.number = floorNumber
                floor.name = name
                insertEntity(id, "Floor")
                getResult(adminid, process.env.AddFloor, 1, request.body, floor, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
            })
        }
    })
}

const changeFloorStatus = (request, response) => {
    const adminid = request.user['id']
    const id = request.body.floorid
    const status = parseInt(request.body.status)
    pool.query("update floor set isactive = $2 where id = $1", [id, status], (err, res) => {
        if (err) response.status(400).json(null)
        getResult(adminid, process.env.ChangeFloorStatus, 1, request.body, null, (err, res) => {
            if (err) response.status(400).json(null)
            response.status(200).json(res)
        })
    })
}

const getFloors = (request, response) => {
    const adminid = request.user['id']
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    const buildingId = query['BuildingId']
    if (buildingId) {
        pool.query("Select * From Floor f where f.building_id = $1", [buildingId], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetFloors, 1, { BuildingId: buildingId }, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
    else {
        pool.query("Select * From Floor", (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetFloors, 1, null, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const addCorridor = (request, response) => {
    const adminid = request.user['id']
    const floorId = request.body.floorId
    const corridorNumber = parseInt(request.body.corridorNumber)
    getName(floorId, corridorNumber, "Corridor", (err, res) =>{
        if (err) response.status(400).json(null)
        let name  = res
        pool.query("select * from corridor c where c.floorId = $1 and c.number = $2", [floorId, corridorNumber], (err, res) => {
            if (err) response.status(400).json(null)
            if (res.rows.length > 0) {
                getResult(adminid, process.env.AddCorridor, -4, request.body, null, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
            }
            else {
                const id = uuidv4()
                pool.query("Insert into corridor (id, floorId, number, name) values ($1, $2, $3, $4)", [id, floorId, corridorNumber, name], (err, res) => {
                    if (err) response.status(400).json(null)
                    let corridor = new Corridor()
                    corridor.id = id
                    corridor.floorId = floorId
                    corridor.number = corridorNumber
                    corridor.name = name
                    insertEntity(id, "Corridor")
                    getResult(adminid, process.env.AddCorridor, 1, request.body, corridor, (err, res) => {
                        if (err) response.status(400).json(null)
                        response.status(200).json(res)
                    })
                })
            }
        })
    })
}

const changeCorridorStatus = (request, response) => {
    const adminid = request.user['id']
    const id = request.body.corridorId
    const status = parseInt(request.body.status)
    const maxquantity = parseInt(request.body.maxquantity)
    if (maxquantity == null) {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
    else {
        pool.query("update corridor set isactive = $2, maxquantity = $3 where id = $1", [id, status, maxquantity], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.ChangeCorridorStatus, 1, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const getCorridors = (request, response) => {
    const adminid = request.user['id']
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    const floorId = query['FloorId']
    if (floorId) {
        pool.query("Select * From corridor c where c.floorid = $1", [floorId], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetCorridors, 1, { FloorId :floorId }, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
    else {
        pool.query("Select * From corridor", (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetCorridors, 1, null, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const getBuildingCorridors = (request, response) => {
    const adminid = request.user['id']
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    const buildingId = query['BuildingId']
    if (buildingId) {
        pool.query("Select C.* FROM BUILDING B, Floor f, corridor c WHERE B.ID = F.building_id AND F.ID = C.floorid AND B.ID=$1", [buildingId], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetCorridors, 1, { Building :buildingId }, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
    else {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
}

const addCorridorConnection = (request, response) => {
    const adminid = request.user['id']
    const fromId = request.body.fromCorridor;
    const toId = request.body.toCorridor;
    pool.query("Select * from corridor_connection cc where cc.fromcorridor = $1 and cc.tocorridor = $2", [fromId, toId], (err, res) => {
        if (err) response.status(400).json(null)
        if (res.rows.length > 0) {
            getResult(adminid, process.env.AddCorridorConnection,-5, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        }
        else {
            pool.query("Insert into corridor_connection(fromcorridor, tocorridor) values ($1, $2)", [fromId, toId], (err, res) => {
                if (err) response.status(400).json(null)
                pool.query("Insert into corridor_connection(fromcorridor, tocorridor) values ($1, $2)", [toId, fromId], (err, res) => {
                    if (err) response.status(400).json(null)
                    getResult(adminid, process.env.AddCorridorConnection, 1, request.body, null, (err, res) => {
                        if (err) response.status(400).json(null)
                        response.status(200).json(res)
                    })
                })
            })
        }
    })
}

const removeCorridorConnection = (request, response) => {
    const adminid = request.user['id']
    const fromId = request.body.fromCorridor;
    const toId = request.body.toCorridor;
    pool.query("Delete from corridor_connection cc Where (cc.fromcorridor = $1 and cc.tocorridor = $2) or (cc.fromcorridor = $2 and cc.tocorridor = $1)",
        [fromId, toId], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.RemoveCorridorConnection, 1, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
}

const getCorridorConnections = (request, response) => {
    const adminid = request.user['id']
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    const corridorid = query['CorridorId']
    if (corridorid) {
        pool.query("Select co.id, co.floorid, co.number, co.name From corridor co, corridor_connection cc where co.id = cc.tocorridor and cc.fromcorridor = $1" , [corridorid], 
            (err, res) => {
                if (err) response.status(400).json(null)
                getResult(adminid, process.env.GetCorridorConnections, 1, { CorridorId:corridorid } ,res.rows, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })            
            })
    }
    else {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
}

const getFullCorridorConnections = (request, response) => {
    const adminid = request.user['id']
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    const corridorid = query['CorridorId']
    if ((corridorid) && (corridorid != "")) {
        pool.query("Select r.id, r.roomnumber, r.isactive, r.roomtype, 'Room' as Type, r.name From rooms r where r.corridorid = $1 Union All Select co.id, co.number, co.isactive, null, 'Corridor' as Type, co.name From corridor co, corridor_connection cc where co.id = cc.tocorridor and cc.fromcorridor = $1",
            [corridorid], (err, res) => {
                if (err) response.status(400).json(null)
                corridorConecctions = new CorridorConnections(res.rows);
                getResult(adminid, process.env.GetFullCorridorConnections, 1, { CorridorId:corridorid } ,corridorConecctions, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })            
            })
    }
    else {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
}

const addRoom = (request, response) => {
    const adminid = request.user['id']
    const corridorId = request.body.corridorId
    const roomNumber = parseInt(request.body.roomNumber)
    const roomType = parseInt(request.body.isRoom)
    var type = ""
    if (roomType == 1) {
        type = "Room"
    }
    else {
        type = "Entrance"
    }
    getName(corridorId, roomNumber, type, (err, res) => {
        if (err) response.status(400).json(null)
        let name = res
        pool.query("select * from rooms r where r.corridorid = $1 and r.roomnumber = $2 and r.roomtype = $3", [corridorId, roomNumber, type], (err, res) => {
            if (err) response.status(400).json(null)
            if (res.rows.length > 0) {
                getResult(adminid, process.env.AddRoom, -4, request.body, null, (err, res) => {
                    if (err) response.status(400).json(null)
                    response.status(200).json(res)
                })
            }
            else {
                const id = uuidv4()
                pool.query("Insert into rooms (id, corridorid, roomnumber, roomtype, name) values ($1, $2, $3, $4, $5)", [id, corridorId, roomNumber, type, name], (err, res) => {
                    if (err) response.status(400).json(null)
                    let room = new Room()
                    room.id = id
                    room.corridorid = corridorId
                    room.roomnumber = roomNumber
                    room.roomtype = type
                    room.name = name
                    insertEntity(id, type)
                    getResult(adminid, process.env.AddRoom, 1, request.body, room, (err, res) => {
                        if (err) response.status(400).json(null)
                        response.status(200).json(res)
                    })
                })
            }
        })
    })
}

const changeRoomStatus = (request, response) => {
    const adminid = request.user['id']
    const id = request.body.roomid
    const status = parseInt(request.body.status)
    const maxquantity = parseInt(request.body.maxquantity)
    if (maxquantity == null) {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
    else {
        pool.query("update rooms set isactive = $2, maxquantity = $3 where id = $1", [id, status, maxquantity], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.ChangeRoomStatus, 1, request.body, null, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const getRooms = (request, response) => {
    const adminid = request.user['id']
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    const corridorId = query['CorridorId']
    if (corridorId) {
        pool.query("Select * From Rooms r where r.corridorid = $1", [corridorId], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetRooms, 1, { CorridorId:corridorId }, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
    else {
        pool.query("Select * From Rooms", (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.GetRooms, 1, null, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const getAllUsers = (request, response) => {
    const adminid = request.user['id']
    pool.query("select u.id, u.fname, u.lname, u.email, DATE_TRUNC('hour',u.creation_date) as creation_date from users u", (err, res) => {
        if (err) response.status(400).json(null)
        getResult(adminid ,process.env.GetAllUsers ,1, null, res.rows, (err, res) => {
            if (err) response.status(400).json(null)
            response.status(200).json(res)
        })
    })
}

const getUsersDevices = (request, response) => {
    const adminid = request.user['id']
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    const userId = query['userId']
    if (userId) {
        pool.query("select ud.id, ud.deviceid from users_devices ud where ud.userId = $1 and ud.isdeleted = 0", [userId], (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.getUsersDevices, 1, { UserId : userId }, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
    else{
        pool.query("select ud.id, ud.deviceid from users_devices ud where ud.isdeleted = 0", (err, res) => {
            if (err) response.status(400).json(null)
            getResult(adminid, process.env.getUsersDevices, 1, null, res.rows, (err, res) => {
                if (err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

module.exports = {
    addBuilding,
    changeBuildingStatus,
    getBuildings,
    addFloor,
    changeFloorStatus,
    getFloors,
    addCorridor,
    changeCorridorStatus,
    getCorridors,
    getBuildingCorridors,
    addCorridorConnection,
    removeCorridorConnection,
    getCorridorConnections,
    getFullCorridorConnections,
    addRoom,
    changeRoomStatus,
    getRooms,
    getAllUsers,
    getUsersDevices
}
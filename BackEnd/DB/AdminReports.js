require('dotenv').config()
const { request, response } = require('express')
const Pool = require('pg').Pool
const Result = require('../Model/Classes/Result.js')
const DWReportEntity = require('../Model/Classes/DWReportEntity.js')

const pool = new Pool({
    user: process.env.dbUser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbPassword,
    port: parseInt(process.env.dbport),
    multipleStatements: true
})

//Help function

function getResult(actionResult, respObj, callback) {
    pool.query("select * from actionresults ar where ar.id = $1", [actionResult], (err, res) => {
        if (err) callback(err, null)
        let resp = new Result();
        resp.code = res.rows[0]['id'];
        resp.message = res.rows[0]['result'];
        resp.data = respObj
        callback(null, resp)
    })
}

function addData() {
    pool.query("CALL public.insert_data_normally()",[], (err, res)=> {
        if (err) console.log(err)
    })
}

function orderDataByType(data, type) {
    
}

// APIs Functions

const RCReport = (request, response) => {
    let buildingId = request.body.buildingId

    if ((buildingId == null) || (buildingId == '')) {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
    else {
        pool.query(`Select r.id, r.roomnumber "number", r.name, se.currentquantity, r.maxquantity, se.entitytype 
        FROM Building b, floor f, corridor cc, rooms r, sensorentity se 
        WHERE b.id = f.building_id 
        and f.id = cc.floorid
        and cc.id = r.corridorid
        and se.entitytype in ('Room', 'Entrance')
        and se.entityid = r.id
        and b.id = $1
        UNION
        Select cc.id, cc.number "number", cc.name, se.currentquantity, cc.maxquantity, se.entitytype
        FROM Building b, floor f, corridor cc, sensorentity se
        WHERE b.id = f.building_id
        and f.id = cc.floorid
        and se.entitytype = 'Corridor'
        and se.entityid = cc.id
        and b.id = $1`, [buildingId], (err, res) => {
            if(err) response.status(400).json(null)
            getResult(1, res.rows, (err, res) => {
                if(err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const DWReport = (request, response) => {
    let buildingId = request.body.buildingId
    let date = request.body.date

    if ((buildingId == null) || (buildingId == '') || (date == null) || (date == '')) {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
    else {
        var reportArray = []
        var id = 0
        while (id < 24) {
            let repObj = new DWReportEntity()
            repObj.id = id.toString()
            if (id < 10) {
                repObj.date = "0" + id.toString() + ":00"
            }
            else {
                repObj.date = id.toString() + ":00"
            }
            reportArray.push(repObj)
            id = id + 1
        }
        pool.query(`Select b.id, b.name, extract(hour from dwn.actiondate) as "hour", sum(dwn.numberofusers) as "count"
        From dw_numberofusers dwn, dw_sensor dws, floor f, building b
        Where dwn.sensorid = dws.id
        and dws.floorid = f.id
        and f.building_id = b.id
        and b.id = $1
        and Date(dwn.actiondate) = Date($2)
        group by b.id, b.name, extract(hour from dwn.actiondate)`, [buildingId,date], (err, res) => {
            if(err) response.status(400).json(null)
            for (let retDic of res.rows){
                reportArray[retDic['hour']].value = parseInt(retDic['count'])
            }
            getResult(1, reportArray, (err, res) => {
                if(err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const avgPerHourReport = (request, response) => {
    let entityId = request.body.entityId
    let type = request.body.type
    let aggregationType = request.body.aggregationType
    let fromDate = request.body.fromDate
    let toDate = request.body.toDate

    if ((entityId == null) || (entityId == '') || (type == null) || (type == '') 
        || (fromDate == null) || (fromDate == '') || (toDate == null) || (toDate == '')) {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
    else {
        var query = ''
        let params = [entityId, fromDate, toDate]
        var agg = ""
        var allagg = ""
        switch (aggregationType) {
            case 'Hourly':
                agg = `to_char(dwn.actionDate, 'HH24:00')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'HH24:00')`
                break;
            case 'Daily':
                agg = `to_char(dwn.actionDate, 'DD/MM/YYYY')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'DD/MM/YYYY')`
                break;
            case 'DayWeek':
                agg = `TRIM(to_char(dwn.actionDate, 'Day'))`
                allagg = `TRIM(to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'Day'))`
                break;
            case 'DayMonth':
                agg = `to_char(dwn.actionDate, 'DD')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'DD')`
                break;
            case 'Monthly':
                agg = `to_char(dwn.actionDate, 'MM')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'MM')`
                break;
            case 'MonthYear':
                agg = `to_char(dwn.actionDate, 'MM/YYYY')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'MM/YYYY')`
                break;
            case 'Yearly':
                agg = `to_char(dwn.actionDate, 'YYYY')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'YYYY')`
                break;
            default:
                break;
        }
        if ((type == 'Room') || (type == 'Entrance')) {
            query = ` Select rep.id, rep.name, al.date, COALESCE(rep.avg, 0) as avg
            From (Select r.id, r.name, ` + agg + ` as Date, AVG(dwn.numberofusers) as avg
            From dw_numberofusers dwn, dw_sensor dws, sensorentity se, Rooms r
            Where dwn.sensorid = dws.id
            And dws.id = se.id
            And se.entityid = r.id
            And r.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by r.id, r.name, ` + agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`
        }
        else if (type == 'Corridor') {
            query = `Select rep.id, rep.name, al.date, COALESCE(rep.avg, 0) as avg
            FROM (Select cc.id, cc.name, ` + agg + ` as Date , AVG(dwn.numberofusers)
            From dw_numberofusers dwn, dw_sensor dws, sensorentity se, Corridor cc
            Where dwn.sensorid = dws.id
            And dws.id = se.id
            And se.entityid = cc.id
            And cc.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by cc.id, cc.name, ` + agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`
        }
        else if (type == 'Floor') {
            query = `Select rep.id, rep.name, al.date, COALESCE(rep.avg, 0) as avg
            FROM (Select f.id, f.name, ` + agg + ` as Date , AVG(dwn.numberofusers)
            From dw_numberofusers dwn, dw_sensor dws, Floor f
            Where dwn.sensorid = dws.id
            And dws.floorid = f.id
            And f.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by f.id, f.name, ` + agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`
        }
        else {
            query = `Select rep.id, rep.name, al.date, COALESCE(rep.avg, 0) as avg
            FROM (Select b.id, b.name, ` + agg + ` as Date , AVG(dwn.numberofusers) as avg
            From dw_numberofusers dwn, dw_sensor dws, Floor f, building b
            Where dwn.sensorid = dws.id
            And dws.floorid = f.id
            And f.building_id = b.id
            And b.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by b.id, b.name, ` + agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`            
        }

        console.log(query);

        if (aggregationType == 'DayWeek') {
            query += ` ORDER BY 
            CASE
                 WHEN al.date = 'Monday' THEN 1
                 WHEN al.date = 'Tuesday' THEN 2
                 WHEN al.date = 'Wednesday' THEN 3
                 WHEN al.date = 'Thursday' THEN 4
                 WHEN al.date = 'Friday' THEN 5
                 WHEN al.date = 'Saturday' THEN 6
                 WHEN al.date = 'Sunday' THEN 7
            END ASC `
        }
        else {
            query += ' order by al.date'
        }

        pool.query(query, params, (err, res) => {
            if(err) response.status(400).json(null)
            getResult(1, res.rows, (err, res) => {
                if(err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}

const minMaxReport = (request, response) => {
    let entityId = request.body.entityId
    let type = request.body.type
    let aggregationType = request.body.aggregationType
    let fromDate = request.body.fromDate
    let toDate = request.body.toDate

    if ((entityId == null) || (entityId == '') || (type == null) || (type == '') 
        || (fromDate == null) || (fromDate == '') || (toDate == null) || (toDate == '')) {
        let resp = new Result();
        resp.code = parseInt(process.env.EmptyFieldErrorID)
        resp.message = process.env.EmptyFieldErrorMessage
        response.status(200).json(resp)
    }
    else {
        var query = ''
        let params = [entityId, fromDate, toDate]
        var agg = ""
        var allagg = ""
        switch (aggregationType) {
            case 'Hourly':
                agg = `to_char(dwn.actionDate, 'HH24:00')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'HH24:00')`
                break;
            case 'Daily':
                agg = `to_char(dwn.actionDate, 'DD/MM/YYYY')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'DD/MM/YYYY')`
                break;
            case 'DayWeek':
                agg = `TRIM(to_char(dwn.actionDate, 'Day'))`
                allagg = `TRIM(to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'Day'))`
                break;
            case 'DayMonth':
                agg = `to_char(dwn.actionDate, 'DD')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'DD')`
                break;
            case 'Monthly':
                agg = `to_char(dwn.actionDate, 'MM')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'MM')`
                break;
            case 'MonthYear':
                agg = `to_char(dwn.actionDate, 'MM/YYYY')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'MM/YYYY')`
                break;
            case 'Yearly':
                agg = `to_char(dwn.actionDate, 'YYYY')`
                allagg = `to_char(generate_series(min(n.actiondate), max(n.actiondate), 'h24')::timestamp, 'YYYY')`
                break;
            default:
                break;
        }
        if ((type == 'Room') || (type == 'Entrance')) {
            query = `Select rep.id, rep.name, al.date, COALESCE(rep.minimum, 0) as minimum, COALESCE(rep.maximum, 0) as maximum
            FROM (Select r.id, r.name, ` + agg + ` as Date, Min(dwn.numberofusers) minimum, Max(dwn.numberofusers) maximum
            From dw_numberofusers dwn, dw_sensor dws, sensorentity se, Rooms r
            Where dwn.sensorid = dws.id
            And dws.id = se.id
            And se.entityid = r.id
            And r.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by r.id, r.name, `+ agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`
        }
        else if (type == 'Corridor') {
            query = `Select rep.id, rep.name, al.date, COALESCE(rep.minimum, 0) as minimum, COALESCE(rep.maximum, 0) as maximum
            FROM (Select cc.id, cc.name, ` + agg + ` as Date, Min(dwn.numberofusers) minimum, Max(dwn.numberofusers) maximum
            From dw_numberofusers dwn, dw_sensor dws, sensorentity se, Corridor cc
            Where dwn.sensorid = dws.id
            And dws.id = se.id
            And se.entityid = cc.id
            And cc.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by cc.id, cc.name, `+ agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`
        }
        else if (type == 'Floor') {
            query = `Select rep.id, rep.name, al.date, COALESCE(rep.minimum, 0) as minimum, COALESCE(rep.maximum, 0) as maximum
            FROM (Select f.id, f.name, ` + agg + ` as Date, Min(dwn.numberofusers) minimum, Max(dwn.numberofusers) maximum
            From dw_numberofusers dwn, dw_sensor dws, Floor f
            Where dwn.sensorid = dws.id
            And dws.floorid = f.id
            And f.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by f.id, f.name, `+ agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`
        }
        else {
            query = `Select rep.id, rep.name, al.date, COALESCE(rep.minimum, 0) as minimum, COALESCE(rep.maximum, 0) as maximum
            FROM (Select b.id, b.name, ` + agg + ` as Date, Min(dwn.numberofusers) minimum, Max(dwn.numberofusers) maximum
            From dw_numberofusers dwn, dw_sensor dws, Floor f, building b
            Where dwn.sensorid = dws.id
            And dws.floorid = f.id
            And f.building_id = b.id
            And b.id = $1
            And Date(dwn.actionDate) between Date($2) And Date($3)
            Group by b.id, b.name, `+ agg + `) rep Right outer join 
            (Select distinct ` + allagg +` as date FROM dw_numberofusers n) al on (rep.date = al.date)`
        }
        if (aggregationType == 'DayWeek') {
            query += ` ORDER BY 
            CASE
                 WHEN al.date = 'Monday' THEN 1
                 WHEN al.date = 'Tuesday' THEN 2
                 WHEN al.date = 'Wednesday' THEN 3
                 WHEN al.date = 'Thursday' THEN 4
                 WHEN al.date = 'Friday' THEN 5
                 WHEN al.date = 'Saturday' THEN 6
                 WHEN al.date = 'Sunday' THEN 7
            END ASC `
        }
        else {
            query += ' order by al.date'
        }

        pool.query(query, params, (err, res) => {
            if(err) response.status(400).json(null)
            getResult(1, res.rows, (err, res) => {
                if(err) response.status(400).json(null)
                response.status(200).json(res)
            })
        })
    }
}
module.exports = {
    RCReport,
    addData,
    DWReport,
    avgPerHourReport,
    minMaxReport
}
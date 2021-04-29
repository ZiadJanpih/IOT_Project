const Room = require('./Room.js')
const Corridor = require('./Corridor.js')

class CorridorConnections {

    constructor(DicArray) {
        this.Entrances = []
        this.Corridors = []
        this.rooms = []
        if (DicArray) {
            for(let conn of DicArray) {
                if (conn['type'] == 'Room'){
                    const type = conn['roomtype'] 
                    var room = new Room();
                    room.id = conn['id']
                    room.roomnumber = conn['roomnumber']
                    room.isactive = conn['isactive']
                    room.roomtype = type
                    if ( type == "Room") {
                        this.rooms.push(room)
                    }
                    else  {
                        this.Entrance.push(room)
                    }
                }
                else {
                    var corridor = new Corridor();
                    corridor.id = conn['id']
                    corridor.number = conn['roomnumber']
                    corridor.isactive = conn['isactive']
                    this.Corridors.push(corridor)
                }
            }
        }
    }
}

module.exports = CorridorConnections;
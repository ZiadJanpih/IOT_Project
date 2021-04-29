class User {
    constructor(data) {
        if (data != undefined) {
            this.userId = data['userId']
            this.fname = data['fname']
            this.lname = data['lname']
            this.email = data['email']
            this.password = ""
        }
        else {
            this.userId = ""
            this.fname = ""
            this.lname = ""
            this.email = ""
            this.password = ""
        }
    }

    toJSON() {
        return {
            userId: this.userId,
            fname: this.fname,
            lname: this.lname,
            email: this.email
        }
    }
}

module.exports = User;
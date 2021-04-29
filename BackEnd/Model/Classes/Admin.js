class Admin {
    constructor(data){
        this.id = ""
        this.username = ""
        this.isactive = 1
        this.accessToken = ""
        this.refreshToken = ""
        if (data) {
            this.id = data['id']
            this.username = data['username']
            this.isactive = data['isactive']
        }
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            isactive: this.isactive,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken
        }
    }
}

module.exports = Admin;
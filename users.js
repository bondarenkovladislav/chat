class Users {
    constructor() {
        this.users = [];
    }

    createSid() {
        return Math.random().toString().substring(2);
    }

    add(name) {
        const user = {
            name,
            sid: this.createSid()
        };
    
        this.users.push(user);
    
        return user;
    }

    get(name) {
        return this.users.find(user => user.name === name);
    }

    getCurrent(req) {
        const sid = req.cookies.sid;
        return this.users.find(user => user.sid === sid);
    }
}

module.exports = Users;
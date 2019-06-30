const Users = require('./users');
const sqlite = require('sqlite3');
const DB = require('./db');

class UsersDb extends Users {

    constructor() {
        super();
        this.db = new DB();
    }

    /**
     *
     * @param {string} name
     * @param {string} password
     * @returns {Promise}
     */
    add(name, password) {
        return new Promise((resolve, reject) => {
            const user = {
                name,
                password,
                sid: this.createSid()
            };

            this.db.forTable('Users').insert(user, (uid) => {
                if (!uid) {
                    reject();
                } else {
                    resolve(user);
                }
            });
        });
    }

    /**
     * get user by name
     * @param {string} name
     * @param {Function} callback
     */
    get(name, callback) {
        this.db.forTable('Users').filter({name}).select((result) => {
            if (!result) {
                callback(false);
                return;
            }

            callback(result);
        });
    }

    /**
     * get current user by ssid
     * @param {object} req
     * @param {Function} callback
     */
    getCurrent(req, callback) {
        const sid = req.cookies.sid;
        this.db.forTable('Users').filter({sid}).select((result) => {
            if (!result) {
                callback(false);
                return;
            }

            callback(result);
        });
    }

}

module.exports = UsersDb;
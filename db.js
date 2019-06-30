const sqlite = require('sqlite3');
const fs = require('fs');
const dbFileName = './db.db';

/**
 * Class like ORM for database
 */
class DB {
    constructor() {
        this._table = null;
        this._filter = null;
        if (!fs.existsSync(dbFileName)) {
            this.db = new sqlite.Database(dbFileName);
            this.db.run('CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, text TEXT, time real, repostText TEXT,' +
                'repostAuthor TEXT);');
            this.db.run('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, sid real);');
        } else {
            this.db = new sqlite.Database(dbFileName);
        }
    }

    /**
     * Set table for query
     * @param {string} table
     * @returns {DB}
     */
    forTable(table) {
        this._table = table;
        return this;
    }


    /**
     * Function set filter
     * @param {object} filter
     */
    filter(filter) {
        this._filter = filter;
        return this;
    }

    /**
     * Insert record to db
     * @param {object} data
     * @param {Function} callback
     */
    insert(data, callback) {
        if (!this._table) {
            callback(false);
            return;
        }
        const paramKeys = Object.keys(data);
        const values = [];
        const templates = new Array(paramKeys.length);
        templates.fill('?', 0);
        paramKeys.forEach((key) => {
            values.push(data[key]);
        });
        const q = `INSERT INTO ${this._table}(${paramKeys.join(', ')}) VALUES (${templates.join(',')});`;
        this.db.run(q, values, function (err) {
            if (err) {  /*TODO bug fix*/
                console.log(err);
                callback(false);
                return;
            }
            callback(this.lastID);
        });

        this._table = null;
    }

    /**
     * select data from table
     * @param {Function} callback
     * @param {number} limit
     */
    select(callback, limit = 40) {
        if (!this._table) {
            callback(false);
            return;
        }

        let q = `SELECT * FROM ${this._table}`;
        if (this._filter) {
            q = q + ` WHERE 1=1 `;
            Object.keys(this._filter).forEach((key) => {/*filter- объект, нам нужныего ключи для foreach*/
                q = q + ` AND ${key} = '${this._filter[key]}'`;
            });
        }

        q = q + ` LIMIT ${limit};`;

        this.db.all(q, (error, data) => {
            if (error) {
                console.log(error);
                callback(false);
                return;
            }
            callback(data);
        });

        this._table = null;
        this._filter = null;
    }
    // переписать в случае, если понадобится обновлять другие поля
    update(values, callback) {
        if (!this._table) {
            callback(false);
            return;
        }
        const q = `UPDATE Messages SET text= '${values[0]}' WHERE id= '${values[1]}'`;
        this.db.run(q, function (err) {
            if (err) {
                console.log(err);
                callback(false);
                return;
            }
            callback(this.lastID);
        });

        this._table = null;
    }
}

module.exports = DB;
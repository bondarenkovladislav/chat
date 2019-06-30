const Chat = require('./chat');
const sqlite = require('sqlite3');
const DB = require('./db');

class ChatDB extends Chat {
    constructor(dbFileName) {
        super();
        this.db = new DB();
    }

    /**
     * Add message by user name
     * @param {string} author
     * @param {string} text
     */
    add(author, text) {
       this.db.forTable('Messages').insert({
          author,
          text,
          time: Date.now()
       }, (id) => {
          if (!id) {
             console.log('error insert message');
          }
       });
    }

    /**
     * Get messages with limit
     * @param {string} currentUserName
     * @param {Function} callback
     * @param {number} limit
     */
    getAll(currentUserName, callback, limit = 40) {
       this.db.forTable('Messages').select((messages) => {
          if (!messages) {
             callback([]);
             return;
          }
          const data = messages.map(message => ({
             ...message,
             isMine: message.author === currentUserName
          }));
          callback(data);
       }, limit)
    }
}

module.exports = ChatDB;
class Chat {
    constructor() {
        this.messages = [];
    }

    add(author, text) {
        this.messages.push({
            author,
            text,
            time: Date.now()
        });
    }

    getAll(currentUserName) {
        return this.messages.map(message => ({
            ...message,
            isMine: message.author === currentUserName
        }));
    }
}

module.exports = Chat;
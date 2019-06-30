const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const Chat = require('./chatdb');
const Users = require('./usersdb');
let repost=null; /*Переменная для текста repost*/

const app = express();
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static('client'));

const chat = new Chat('db.db');
const users = new Users();

app.get('/', (req, res) => {
    const user = users.getCurrent(req, (user) => {
        const page = user.length ? 'chat' : 'login';
        res.sendFile('client/' + page + '.html', {root: __dirname});
    });
});

app.post('/users', (req, res) => {
    const name = req.body.user;
    const password = req.body.password;
    if (name === '') {
        res.sendStatus(401);
        return;
    }
    users.get(name, (user) => {
        if (user.length) {
            if (password !== user[0].password) {
                res.sendStatus(403);
            } else {
                res.cookie('sid', user[0].sid);
                res.redirect('/');
            }
        } else {
            users.add(name, password).then((user) => {
                res.cookie('sid', user.sid);
                res.redirect('/');
            }).catch(() => {
                res.sendStatus(500);
            });
        }
    });
});

app.get('/messages', (req, res) => {
    users.getCurrent(req, (user) => {
        if (!user.length) {
            res.sendStatus(403);
        } else {
            chat.getAll(user[0].name, (messages) => {
                res.json(messages);
            });
        }
    });
});

app.post('/messages', (req, res) => {
    const user = users.getCurrent(req, (user) => {
        if (!user.length) {
            res.sendStatus(403);
        } else {
            chat.add(user[0].name, req.body.text, repost);
            chat.getAll(user[0].name, (data) => {
                res.json(data);
            });
        }
    });

});

app.get('/messages/:id', (req, res) => {
    users.getCurrent(req, (user) => {
        if (!user.length) {
            res.sendStatus(403);
        } else {
            const messageId = req.params.id;
            // select message from DB
            chat.get(messageId, message => res.json(message));
        }
    });
});

app.post('/change', (req, res) => {
    users.getCurrent(req, (user) => {
        if (!user.length) {
            res.sendStatus(403);
        } else {
            chat.put(req.body.messageId, req.body.text, (callback) => {
            });
            chat.getAll(user[0].name, (data) => {
                res.json(data);
            });
        }
    });
});


app.get('/logout', (req, res) => {
    res.cookie('sid', null);
    res.redirect('/');
});

app.post('/repost', (req, res) => {
    repost = req.body;
});

app.listen(3000);
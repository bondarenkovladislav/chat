const chat = [];

function requestMessages(requestData) {
    return fetch('/messages', requestData)
        .then(response => response.json())
        .then(renderChat)
        .catch(showError);
}

function requestRepost(requestData) {
    return fetch('/repost', requestData)
        .then(response => response.json())
        .then(renderChat)
        .catch(showError);
}

function updateChat() {
    requestMessages({method: 'GET'});
}

function showError(error) {
    //alert(error.message);
    console.log(error.message)
}

function removeAllEntries() {
    const entries = document.querySelectorAll('.entry');
    entries.forEach(elem => elem.remove());
}

function div(className, text, children) {
    const div = document.createElement('div');
    div.className = className;

    if (text) {
        div.textContent = text;
    }

    if (children) {
        children.forEach(child => div.appendChild(child));
    }

    div.id = "messageField";

    return div;
}

function createEntry(message) {
    let link = document.createElement('a');
    link.className = 'repostLink';
    // link.href = '/repost';
    link.addEventListener('click', x => {
        let inputText = document.getElementById('text');
        inputText.value = message.author + ':' + (message.text.length >= 7 ? message.text.substr(0, 7) : message.text) + '...';
        return requestRepost({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message
            })
        });
    });
    link.text = 'Ответ';

    return div(
        'entry' + (message.isMine ? ' mine' : ''),
        '',
        [
            div('author', message.author, [
                div('time', new Date(message.time).toLocaleTimeString())
            ]),
            div('message', message.text),
            link
        ]);
}

function renderChat(messages) {
    removeAllEntries();

    const chat = document.getElementById('chat');

    messages
        .map(createEntry)
        .forEach(entry => chat.appendChild(entry));

    chat.lastElementChild && chat.lastElementChild.scrollIntoView();
}

function sendMessage(text) {
    return requestMessages({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    });
}

function sendButtonClick() {
    const text = document.getElementById('text').value;

    if (text) {
        sendMessage(text).then(() => {
            document.getElementById('text').value = '';
        });
    }
}

function updateOnlineUsers() {
    return fetch('/onlineUsers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    })
        .then(response => response.json())
        .then(renderOnline)
        .catch(showError);
}

function renderOnline(users) {
    const onlineUsers = document.getElementById('online-users');
    onlineUsers.innerText = 'Пользователи:' + users.length;
}

const onlineUsers = document.getElementById('online-users');


updateChat();

function doLogout() {
    return fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    })
        .then(response => response.json())
        .then(renderOnline)
        .catch(showError);
}

const updateInterval = setInterval(updateChat, 2000);
const updateIntervalUsers = setInterval(updateOnlineUsers, 2000);

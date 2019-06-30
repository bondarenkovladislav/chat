const chat = [];
let isEdit = false;
let idChange = null;

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

function requestMessage(id)
{
    return fetch('/messages/'+id)
        .then(response => response.json())
        .then(message => {
            document.getElementById('text').value = message.text;
            idChange=id;
        });
}

function updateMessage(messageId, text) {
    return fetch('/change', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messageId,
            text
        })
    })
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

function btn(id, is_Mine){
    const div=document.createElement('div');
    div.className='qwerty';

    const btn = document.createElement('button');
    const id_0 = id;
    if(is_Mine)
    {
        btn.className="redact_button";
    }
    else
    {
        btn.className="delete_button";
    }
    btn.textContent="E";
    btn.addEventListener('click',function(event)
    {
        isEdit=true;
        requestMessage(id_0);
    });
    div.appendChild(btn);
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
    console.log(message);


    if(message.repostText!=='')
        return div(
            'entry' + (message.isMine ? ' mine' : ''),
            '',
            [
                div('repost', message.repostAuthor+': '+ message.repostText),
                div('author', message.author, [
                    div('time', new Date(message.time).toLocaleTimeString())
                ]),
                div('message', message.text),
                link,
                btn(message.id,message.isMine)
            ]);
    else
        return div(
            'entry' + (message.isMine ? ' mine' : ''),
            '',
            [
                div('author', message.author, [
                    div('time', new Date(message.time).toLocaleTimeString())
                ]),
                div('message', message.text),
                link,
                btn(message.id,message.isMine)
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

    if (button.value.length) {
        if(isEdit)
        {
            updateMessage(idChange, document.getElementById('text').value);
            document.getElementById('text').value = '';
            isEdit = false;
            return;
        }
        if (text) {
            sendMessage(text).then(() => {
                document.getElementById('text').value = '';
            });
        }
    }
}

let button = document.getElementById('text');
button.addEventListener('keypress', function (event) {
    if (event.keyCode == 13){
        if (button.value.length) {
            if (isEdit) {
                updateMessage(idChange, document.getElementById('text').value);
                document.getElementById('text').value = '';
                isEdit = false;
            }
            else {
                sendMessage(button.value);
            }
            button.value='';
        }
    }
});

let input = document.getElementById('text')
input.addEventListener('keypress',x=>{
    if(event.keyCode==13){
        if(input.value.length){
            if(isEdit){
                updateMessage(idChange,document.getElementById('text').value);
                input.value ='';
                isEdit =false;
            }
            else{
                sendMessage(input.value);
            }
            input.value = '';
        }
    }
});

function sendToInput(selected_value)
{

    console.log(selected_value);
    const text=document.getElementById('text');

    text.value =text.value + selected_value;

}

function DoSelect(){
    document.addEventListener('DOMContentLoaded', () => {
        var option = ['&#x263B;', '&#9748;','&#128156;','&#128520;',' &#128552;','&#128557;','&#128545;','&#128529;','&#129300;','&#129412;',
            '&#128640;','&#128161;','&#128253;','&#129411;','&#129296;','&#128511;','&#9855;'];
        var select = '';
        for(var i=0;i<option.length; i++){
            select = select + '<option value="'+option[i]+'" class="images" >'+option[i]+'</option>';
        }
        document.getElementById('smile').innerHTML = select;
    });

}
DoSelect();

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


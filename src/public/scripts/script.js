const socket = io();

let user = null;
// let chatContainer = document.getElementById('chat_list');
let messageContainer = document.getElementById('message_container');
let messageForm = document.getElementById('message_form');
let inputField = document.getElementById('message_input');

function sendMessage(text, author, room) {
  socket.emit('sendMessage', {
    text,
    author,
    room,
    date: Date.now(),
  });
}

function getRoomMessages(room) {
  socket.emit('getAllMessages', {
    room,
  });
}

function handleMessage(handler) {
  socket.on('message', (data) => {
    handler(data);
  });
}

function handleMessageList(handler) {
  socket.on('allMessages', (data) => {
    handler(data);
  });
}

function showMessage(data) {
  if (currentRoom === data.room) {
    messageContainer.innerHTML += `<li class="list-group-item">
            ${data.author}: ${data.text}
        </li>`;
  }
}

async function setUser() {
  user = await (await fetch(`/v1/auth/self`, { method: 'GET' })).json();
}

handleMessage(showMessage);
handleMessageList((data) =>
  data.forEach((message) => {
    showMessage(message);
  }),
);

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (currentRoom) {
    sendMessage(inputField.value, user.email, currentRoom);
    inputField.value = '';
  } else {
    inputField.value = 'select room';
  }
});

setUser();
getRoomMessages(currentRoom);

var express = require('express');
var fs = require('fs');
var router = express.Router();

const CHAT_STORAGE_DELIMETER = '}]]]:[[[{';
const CHAT_CLEAR_TIME = 5 * 60000; // in milliseconds.
const CHAT_UPDATE_TIME = 1000; // in milliseconds as well.

var chats = [];

function loadChats() {
  chats = [];
  try {
    rawChats = fs.readFileSync('./chats.txt').toString().split('\n');
    for (var i = 0; i < rawChats.length; i++) {
      if (author == '' | message == '') {
        continue;
      }
      var info = rawChats[i].split(CHAT_STORAGE_DELIMETER);
      var chat = {
        author : info[0],
        message : info[1],
      };
      chats.push(chat);
    }
  }
  catch (err) {
    console.log('An error was encountered: [', err,']');
  }
  return;
}

function saveChats() {
  var rawChats = [];
  for (var i = 0; i < chats.length; i++) {
    var chatStr = [chats[i].author, chats[i].message].join(CHAT_STORAGE_DELIMETER);
    rawChats.push(chatStr);
  }
  fs.writeFileSync('./chats.txt', rawChats.join('\n'));
  return;
}

function appendChat(author, msg) {
  if (msg.replaceAll(' ', '') == '' || author == '[SYSTEM]') {
    return;
  }
  if (author == 'typedecker' && msg == '/clear') {
    clearChat();
    author = '[SYSTEM]';
    msg = 'Chat cleared successfully.'
  }
  var chat = {
    author : author,
    message : msg,
  };
  chats.push(chat);
  saveChats();
  return;
}

function partiallyClearChat() {
  chats = chats.slice(1)
  saveChats();
  return;
}

function clearChat() {
  chats = [];
  saveChats();
  return;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  loadChats();
  res.render('index', { chats : chats });
});

router.post('/', function(req, res, next) {
  appendChat(req.body['author_box'], req.body['message_box']);
});

router.get('/data', (req, res, next) => {
  res.json(chats);
});

setInterval(loadChats, CHAT_UPDATE_TIME);
setInterval(partiallyClearChat, CHAT_CLEAR_TIME);

module.exports = router;

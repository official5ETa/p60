const _text = $('#text');

let telepromptSocket;
function connectToTelepromptSocket() {
  telepromptSocket = io('/socket/teleprompt');

  telepromptSocket.on('connect', () => {
    console.log('Verbunden mit Socket.IO-Server');
    toast('Socket', 'Verbunden mit Socket.IO-Server');
  });

  telepromptSocket.on('disconnect', () => {
    console.log('Verbindung zum Socket.IO-Server getrennt');
    toast('Socket', 'Verbindung zum Socket.IO-Server getrennt');
    setTimeout(connectToTelepromptSocket, 200);
  });

  telepromptSocket.on('text', ({ text }) => {
    setText(text);
  });
}

function setText(text = '') {
  if (text) {
    _text.html(text);
    for (let i = 0; true; i++) {
      _text.css('font-size', i);
      if (_text.height() > window.innerHeight) {
        _text.css('font-size', i - 1);
        break;
      }
    }
  } else if (text === null) _text.text('');
}

function initStatusInterval() {
  setInterval(() => {
    telepromptSocket?.emit('status');
  }, 200);
}

connectToTelepromptSocket();
initStatusInterval();

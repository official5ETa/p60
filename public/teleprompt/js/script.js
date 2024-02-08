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
    _text.text(text);
  });
}

function initStatusInterval() {
  setInterval(() => {
    telepromptSocket?.emit('status');
  }, 200);
}

connectToTelepromptSocket();
initStatusInterval();

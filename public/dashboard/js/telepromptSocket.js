const _telepromptSocketReadyState = $('#telepromptSocketReadyState');
const _telepromptConnectedStatus = $('#telepromptConnectedStatus');

let telepromptDisconnectedTimeout,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  telepromptConnected = false;
function resetTelepromptDisconnectedTimeout() {
  clearTimeout(telepromptDisconnectedTimeout);
  telepromptDisconnectedTimeout = setTimeout(() => {
    telepromptConnected = false;
    _telepromptConnectedStatus.html('<span class="text-danger">NO</span>');
  }, 4e3);
}

let telepromptSocket;
function connectToTelepromptSocket() {
  telepromptSocket = io('/socket/teleprompt');

  telepromptSocket.on('connect', () => {
    console.log('Verbunden mit Socket.IO-Server');
  });

  telepromptSocket.on('disconnect', () => {
    console.log('Verbindung zum Socket.IO-Server getrennt');
    setTimeout(connectToTelepromptSocket, 200);
  });

  telepromptSocket.on('status', () => {
    resetTelepromptDisconnectedTimeout();
    telepromptConnected = true;

    loadTelepromptIndex();

    _telepromptConnectedStatus.html('<span class="text-success">YES</span>');
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function telepromptSocketSendText(text = '') {
  telepromptSocket.emit('text', { text: _telepromptConvertText(text) });
}

connectToTelepromptSocket();
resetTelepromptDisconnectedTimeout();

setInterval(() => {
  _telepromptSocketReadyState.html(
    (() => {
      switch (telepromptSocket.readyState) {
        case telepromptSocket.OPEN:
          return '<span class="text-success">OPEN</span>';
        case telepromptSocket.CONNECTING:
          return '<span class="text-warning">CONNECTING</span>';
        case telepromptSocket.CLOSING:
          return '<span class="text-danger">CLOSING</span>';
        case telepromptSocket.CLOSED:
          return '<span class="text-danger">CLOSED</span>';
      }
    })(),
  );
}, 200);

const _videoPreviewConnectedStatus = $('#videoPreviewConnectedStatus');
const _videoSocketReadyState = $('#videoSocketReadyState');
const _videoPreviewPlayheadStatus = $('#videoPreviewPlayheadStatus');
const _videoPreviewPlayButtonPaused = $('#videoPreviewPlayButtonPaused');
const _videoPreviewPlayButtonPlaying = $('#videoPreviewPlayButtonPlaying');
const _videoPreviewSeekbar = $('#videoPreviewSeekbar');
const _videoPreviewControlsEnabled = $('#videoPreviewControlsEnabled');

/** @type {HTMLVideoElement} */
const videoPreview = document.getElementById('videoPreview');

let videoDisconnectedTimeout;
function resetVideoDisconnectedTimeout() {
  clearTimeout(videoDisconnectedTimeout);
  videoDisconnectedTimeout = setTimeout(() => {
    _videoPreviewConnectedStatus.html('<span class="text-danger">NO</span>');
  }, 4e3);
}

let videoSocket;
function connectToVideoSocket() {
  videoSocket = io('/socket/video');

  videoSocket.on('connect', () => {
    console.log('Verbunden mit Socket.IO-Server');
  });

  videoSocket.on('disconnect', () => {
    console.log('Verbindung zum Socket.IO-Server getrennt');
    setTimeout(connectToVideoSocket, 200);
  });

  videoSocket.on('status', (data) => {
    resetVideoDisconnectedTimeout();

    if (videoPreview.src !== data.src) videoPreview.src = data.src;
    videoPreview.currentTime = data.currentTime;
    if (data.playing && videoPreview.paused) void videoPreview.play();
    else if (!data.playing && !videoPreview.paused) videoPreview.pause();

    const playhead = convertToTimeFormat(data.currentTime);
    _videoPreviewPlayheadStatus.html(
      `<span class="text-${data.playing ? 'success' : 'danger'}">
        ${playhead.minutes === '00' && data.playing ? '<span class="text-muted">00:</span>' : playhead.minutes + ':'}${playhead.seconds}<span class="text-muted">:${playhead.milliseconds}</span>
      </span>`,
    );

    _videoPreviewPlayButtonPlaying[data.playing ? 'show' : 'hide']();
    _videoPreviewPlayButtonPaused[data.playing ? 'hide' : 'show']();

    _videoPreviewSeekbar.val(
      (data.currentTime / data.duration) * +_videoPreviewSeekbar.attr('max'),
    );

    _videoPreviewConnectedStatus.html('<span class="text-success">YES</span>');
  });
}

_videoPreviewControlsEnabled.change(() => {
  const disabled = _videoPreviewControlsEnabled.is(':checked');
  _videoPreviewPlayButtonPaused.prop('disabled', disabled);
  _videoPreviewPlayButtonPlaying.prop('disabled', disabled);
  _videoPreviewSeekbar.prop('disabled', disabled);
});

_videoPreviewSeekbar.on('input', () => {
  videoSocketSendSeekPerc(
    _videoPreviewSeekbar.val() / +_videoPreviewSeekbar.attr('max'),
  );
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function videoSocketSendPlay(src) {
  videoSocket.emit('play', { src });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function videoSocketSendPause() {
  videoSocket.emit('pause');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function videoSocketSendStop() {
  videoSocket.emit('stop');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function videoSocketSendSeekPerc(seekPerc) {
  videoSocket.emit('seekPerc', { value: seekPerc });
}

connectToVideoSocket();
resetVideoDisconnectedTimeout();

setInterval(() => {
  _videoSocketReadyState.html(
    (() => {
      switch (videoSocket.readyState) {
        case videoSocket.OPEN:
          return '<span class="text-success">OPEN</span>';
        case videoSocket.CONNECTING:
          return '<span class="text-warning">CONNECTING</span>';
        case videoSocket.CLOSING:
          return '<span class="text-danger">CLOSING</span>';
        case videoSocket.CLOSED:
          return '<span class="text-danger">CLOSED</span>';
      }
    })(),
  );
}, 200);

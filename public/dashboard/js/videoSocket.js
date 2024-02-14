const _videoPreviewConnectedStatus = $('#videoPreviewConnectedStatus');
const _videoSocketReadyState = $('#videoSocketReadyState');
const _videoPreviewPlayheadStatus = $('#videoPreviewPlayheadStatus');
const _videoPreviewPlayButtonPaused = $('#videoPreviewPlayButtonPaused');
const _videoPreviewPlayButtonPlaying = $('#videoPreviewPlayButtonPlaying');
const _videoPreviewStopButton = $('#videoPreviewStopButton');
const _videoPreviewSeekbar = $('#videoPreviewSeekbar');
const _videoPreviewControlsEnabled = $('#videoPreviewControlsEnabled');
const _mediaTableFilterHideMedia = $('#mediaTableFilterHideMedia');
const _mediaTableFilterHideTeleprompt = $('#mediaTableFilterHideTeleprompt');
const _mediaTableFilterHideUnknown = $('#mediaTableFilterHideUnknown');
const _mediaTableFilterHideChecked = $('#mediaTableFilterHideChecked');

/** @type {HTMLVideoElement} */
const videoPreview = document.getElementById('videoPreview');

let videoDisconnectedTimeout,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoConnected = false,
  videoPlaying = false;
function resetVideoDisconnectedTimeout() {
  clearTimeout(videoDisconnectedTimeout);
  videoDisconnectedTimeout = setTimeout(() => {
    videoConnected = false;
    videoPlaying = false;
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
    videoConnected = true;
    videoPlaying = data.playing;

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

    setVideoPreviewControlsEnabled();
  });
}

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

function setVideoPreviewControlsEnabled() {
  const disabled =
    !videoConnected || _videoPreviewControlsEnabled.is(':checked');
  _videoPreviewPlayButtonPaused.prop('disabled', disabled);
  _videoPreviewPlayButtonPlaying.prop('disabled', disabled);
  _videoPreviewSeekbar.prop('disabled', disabled);
}

function updateVideoPreviewStopButtonEnabled() {
  _videoPreviewStopButton.prop(
    'disabled',
    !videoConnected ||
      !videoPlaying ||
      _videoPreviewControlsEnabled.is(':checked'),
  );
}

_videoPreviewControlsEnabled.change(() => {
  setVideoPreviewControlsEnabled();
});

_videoPreviewSeekbar.on('input', () => {
  videoSocketSendSeekPerc(
    _videoPreviewSeekbar.val() / +_videoPreviewSeekbar.attr('max'),
  );
});

_mediaTableFilterHideMedia.change(() => {
  setMediaTableDOMWithFilter();
});

_mediaTableFilterHideTeleprompt.change(() => {
  setMediaTableDOMWithFilter();
});

_mediaTableFilterHideUnknown.change(() => {
  setMediaTableDOMWithFilter();
});

_mediaTableFilterHideChecked.change(() => {
  setMediaTableDOMWithFilter();
});

connectToVideoSocket();
resetVideoDisconnectedTimeout();
setVideoPreviewControlsEnabled();

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
  updateVideoPreviewStopButtonEnabled();
}, 200);

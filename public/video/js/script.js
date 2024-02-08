let videoSocket;
function connectToVideoSocket() {
  videoSocket = io('/socket/video');

  videoSocket.on('connect', () => {
    console.log('Verbunden mit Socket.IO-Server');
    toast('Socket', 'Verbunden mit Socket.IO-Server');
  });

  videoSocket.on('disconnect', () => {
    console.log('Verbindung zum Socket.IO-Server getrennt');
    toast('Socket', 'Verbindung zum Socket.IO-Server getrennt');
    setTimeout(connectToVideoSocket, 200);
  });

  videoSocket.on('play', ({ src }) => {
    if (src) loadVideo(src);
    if (video.src) void video.play();

    console.log('play video:', `'${video.src}'`);
  });

  videoSocket.on('pause', () => {
    video.pause();
    console.log('paused video');
  });

  videoSocket.on('stop', () => {
    loadVideo();
    console.log('stopped video');
  });

  videoSocket.on('seekPerc', ({ value }) => {
    video.currentTime = video.duration * value;
    console.log('seek video perc:', value);
  });
}

function initStatusInterval() {
  setInterval(() => {
    videoSocket?.emit('status', {
      src: video.src,
      playing: !video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
    });
  }, 100);
}

connectToVideoSocket();

/** @type {HTMLVideoElement} */
const video = document.getElementById('video');

function loadVideo(src) {
  return (video.src = src || '/resource/assets/black.mp4');
}
loadVideo();
video.addEventListener('ended', () => loadVideo());

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(() => {
    video
      .play()
      .then(() => {
        loadVideo();
        initStatusInterval();
        $('#successAlert').html(`video frame successfully initialized`).show();
        $('#controls').show();
      })
      .catch((error) => {
        $('#errorAlert')
          .html(`<code>${error}</code><br>could not start playback`)
          .show();
      });
  })
  .catch((error) => {
    $('#errorAlert')
      .html(`<code>${error}</code><br>access to the microphone is required`)
      .show();
  });

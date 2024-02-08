/**
 * @param {HTMLAudioElement} audioElement
 * @param {number?} interval
 * @return Promise
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fadeoutAudio(audioElement, interval = 50) {
  return new Promise((resolve) => {
    const fadeoutInterval = setInterval(() => {
      const newVolume = audioElement.volume - 0.01;
      if (newVolume <= 0) {
        clearInterval(fadeoutInterval);
        audioElement.volume = 0;
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.volume = 1;
        resolve();
      } else audioElement.volume = newVolume;
    }, interval);
  });
}

/**
 * @param {number} time
 * @return {{ minutes: string, seconds: string, milliseconds: string }}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertToTimeFormat(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  let milliseconds = Math.round((time - Math.floor(time)) * 1000);

  minutes = (minutes < 10 ? '0' : '') + minutes;
  seconds = (seconds < 10 ? '0' : '') + seconds;
  milliseconds =
    (milliseconds < 10 ? '00' : milliseconds < 100 ? '0' : '') + milliseconds;

  return { minutes, seconds, milliseconds };
}

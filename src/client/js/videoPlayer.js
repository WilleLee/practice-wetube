const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtn = () => {
  // if the video is being played, pause
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  // else play it again
  playBtn.innerText = video.paused ? "Play" : "Pause";
};
const handleMute = () => {
  if (video.muted) {
    muteBtn.innerText = "Mute";
    video.muted = false;
  } else {
    muteBtn.innerText = "Unmute";
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
};
const handleMuteBtn = () => {
  // if the video is muted
  handleMute();
  volumeRange.value = video.muted ? 0 : 0.5;
  //else
};

const handleVolumeChange = (e) => {
  const {
    target: { value },
  } = e;
  handleMute();
  volumeValue = value;
  video.volume = value;
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolumeChange);

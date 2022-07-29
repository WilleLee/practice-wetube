const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovementTimeout = null;

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

const formatTime = (sec) => {
  return new Date(sec * 1000).toISOString().substring(11, 19);
};
const handleLoadedMetaData = () => {
  /*
  const min = Math.floor(Math.floor(video.duration) / 60)
    .toString()
    .padStart(2, "0");
  const sec = (Math.floor(video.duration) % 60).toString().padStart(2, "0");
  totalTime.innerText = `${min}:${sec}`;
  */
  const sec = Math.floor(video.duration);
  totalTime.innerText = formatTime(sec);
  timeline.max = sec;
};
const handleTimeUpdate = () => {
  /*
  const min = Math.floor(Math.floor(video.currentTime) / 60)
    .toString()
    .padStart(2, "0");
  const sec = (Math.floor(video.currentTime) % 60).toString().padStart(2, "0");
  currentTime.innerText = `${min}:${sec}`;
  */
  const sec = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(sec);
  timeline.value = sec;
};

const handleTimelineChange = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};

const handleFullScreenBtn = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreenBtn);

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

console.log(videoContainer.dataset);

let volumeValue = 0.5;
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovementTimeout = null;
let fullScreenElem = document.fullscreenElement || null;

const handlePlayVideo = () => {
  // if the video is being played, pause
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  // else play it again

  playIcon.classList = video.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
};
const handlePlayBtn = () => {
  handlePlayVideo();
};

const handleMute = () => {
  if (video.muted) {
    muteIcon.classList = "fa-solid fa-microphone-slash";
    video.muted = false;
  } else {
    muteIcon.classList = "fa-solid fa-microphone";
    video.muted = true;
  }
};
const handleMuteBtn = () => {
  // if the video is muted
  handleMute();
  volumeRange.value = video.muted ? 0 : 0.5;
  //else
};

const handleVolumeChange = (e) => {
  e.preventDefault();
  const {
    target: { value },
  } = e;
  volumeValue = value;
  video.volume = value;
  if (!video.volume) {
    muteIcon.classList = "fa-solid fa-microphone";
    video.muted = true;
  } else {
    muteIcon.classList = "fa-solid fa-microphone-slash";
    video.muted = false;
  }
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

const handleFullScreenBtn = (e) => {
  e.target.blur();
  //풀스크린 버튼 클릭 시 풀스크린 버튼에 포커스 되어 keydownspace event가 정상작동 하지 않음(풀스크린 해제/발동 + 비디오 재생/정지)
  //blur method 통해 포커스 해제
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fa-solid fa-expand";
    video.classList = "video__small-mode";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fa-solid fa-compress";
    video.classList = "video__large-mode";
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

const handleEnded = () => {
  const { id } = videoContainer.dataset;

  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const handleKeyDown = (e) => {
  const { keyCode } = e;
  if (keyCode === 32) handlePlayVideo();

  const fullscreen = document.fullscreenElement;
  if (fullscreen && keyCode === 27) {
    console.log("hi");
  }
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreenBtn);
document.addEventListener("keydown", handleKeyDown);

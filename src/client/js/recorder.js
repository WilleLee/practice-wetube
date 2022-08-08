import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordingBtn = document.getElementById("recordingBtn");
const preview = document.getElementById("preview");

let stream;
let recorder;
let recordedVideo;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(recordedVideo));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "recording.mp4");

  const mp4File = ffmpeg.FS("readFile", "recording.mp4");
  console.log(mp4File);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();
};

const handleStopBtn = () => {
  recordingBtn.innerText = "Download Records";
  recordingBtn.removeEventListener("click", handleStopBtn);
  recordingBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStartBtn = () => {
  recordingBtn.innerText = "Stop Recording";
  recordingBtn.removeEventListener("click", handleStartBtn);
  recordingBtn.addEventListener("click", handleStopBtn);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    const blobObj = event.data;
    recordedVideo = URL.createObjectURL(blobObj);
    preview.srcObject = null;
    preview.src = recordedVideo;
    preview.loop = true;
    preview.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  console.log(stream);
  preview.srcObject = stream;
  preview.play();
};

init();

recordingBtn.addEventListener("click", handleStartBtn);

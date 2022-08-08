const recordingBtn = document.getElementById("recordingBtn");
const preview = document.getElementById("preview");

let stream;
let recorder;
let recordedVideo;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = recordedVideo;
  a.download = "MyRecording.webm";
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

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
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

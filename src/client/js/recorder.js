import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordingBtn = document.getElementById("recordingBtn");
const preview = document.getElementById("preview");

let stream;
let recorder;
let recordedVideo;

const files = {
  input: "recording.webm",
  output: "recording.mp4",
  thumbnail: "thumbnail.jpg",
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 1024,
      height: 576,
    },
    audio: false,
  });
  console.log(stream);
  preview.srcObject = stream;
  preview.play();
};

init();

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  recordingBtn.removeEventListener("click", handleDownload);
  recordingBtn.innerText = "encoding...";
  recordingBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(recordedVideo));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumbnail
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbnailFile = ffmpeg.FS("readFile", files.thumbnail);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbnailBlob = new Blob([thumbnailFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbnailUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumbnail);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbnailUrl);

  recordingBtn.disabled = false;
  recordingBtn.innerText = "Record Again";
  recordingBtn.addEventListener("click", handleStartBtn);
  init();
};

const handleStartBtn = () => {
  recordingBtn.innerText = "Recording...";
  recordingBtn.disabled = true;
  recordingBtn.removeEventListener("click", handleStartBtn);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    const blobObj = event.data;
    recordedVideo = URL.createObjectURL(blobObj);
    preview.srcObject = null;
    preview.src = recordedVideo;
    preview.loop = true;
    preview.play();
    recordingBtn.innerText = "Download Records";
    recordingBtn.disabled = false;
    recordingBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

recordingBtn.addEventListener("click", handleStartBtn);

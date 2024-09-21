let mediaRecorder;
let recordedChunks = [];
let webcamStream;
let webcamVideo;
let microphoneStream;
let audioMeter;
let webcamPaused = false;
let microphonePaused = false;

async function startRecording() {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "screen" },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  });

  const combinedStream = new MediaStream();

  screenStream.getTracks().forEach(track => combinedStream.addTrack(track));

  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => combinedStream.addTrack(track));
  }

  mediaRecorder = new MediaRecorder(combinedStream);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const recordedUrl = URL.createObjectURL(recordedBlob);
    document.getElementById('recorded').style.display = "block";
    document.getElementById('recorded').src = recordedUrl;
  };

  recordedChunks = [];
  mediaRecorder.start();

  startAudioMeter();
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    stopAudioMeter();
  }
}

function pauseResumeRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.pause();
  } else if (mediaRecorder && mediaRecorder.state === "paused") {
    mediaRecorder.resume();
  }
}

async function toggleWebcam() {
  if (!webcamStream) {
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcamVideo = document.createElement('video');
    webcamVideo.srcObject = webcamStream;
    webcamVideo.style.height = "auto";
    webcamVideo.style.width = "100%";
    webcamVideo.play();
    document.getElementById('webcamContainer').appendChild(webcamVideo);
    toggleWebcamPiP();
  } else {
    webcamVideo.pause();
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
    document.getElementById('webcamContainer').innerHTML = '';
  }
}

async function toggleWebcamPiP() {
  if (webcamStream && webcamVideo) {
    await webcamVideo.play();
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      await webcamVideo.requestPictureInPicture();
    }
  }
}

async function toggleMicrophone() {
  if (!microphoneStream) {
    try {
      microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startAudioMeter();
    } catch (error) {
      console.error('Erro ao obter permissão do microfone:', error);
      return;
    }
  } else {
    stopAudioMeter();
    microphoneStream.getTracks().forEach(track => track.stop());
    microphoneStream = null;
  }
}

function muteMicrophone() {
  if (microphoneStream) {
    microphoneStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  }
}

function startAudioMeter() {
  if (microphoneStream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(microphoneStream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function drawMeter() {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const meterWidth = average / 128 * 100;
      document.getElementById('audioLevel').style.width = meterWidth + '%';
      requestAnimationFrame(drawMeter);
    }

    drawMeter();
  }
}

function stopAudioMeter() {
  document.getElementById('audioLevel').style.width = '0';
}

function downloadVideo() {
  if (document.getElementById('recorded').src) {
    const a = document.createElement('a');
    a.href = document.getElementById('recorded').src;
    a.download = 'gravacao.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

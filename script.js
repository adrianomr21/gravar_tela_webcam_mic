let mediaRecorder;
let recordedChunks = [];
let webcamStream;
let audioStream;
let recordingStream; // Stream da gravação principal
let isRecording = false;
let isPaused = false;

const webcamVideo = document.getElementById('webcamVideo');
const recordedVideo = document.getElementById('recordedVideo');
const toggleWebcamButton = document.getElementById('toggleWebcam');
const togglePipButton = document.getElementById('togglePip');
const toggleMicButton = document.getElementById('toggleMic');
const muteMicButton = document.getElementById('muteMic');
const startRecordingButton = document.getElementById('startRecording');
const pauseRecordingButton = document.getElementById('pauseRecording');
const downloadRecordingButton = document.getElementById('downloadRecording');
const meterBar = document.querySelector('.meter-bar');

// Função para alternar a webcam
toggleWebcamButton.addEventListener('click', async () => {
    if (!webcamStream) {
        try {
            webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamVideo.srcObject = webcamStream;
            toggleWebcamButton.innerHTML = '<i class="fas fa-video-slash"></i>';
            togglePipButton.classList.remove('hidden');
        } catch (err) {
            console.error('Erro ao acessar webcam:', err);
        }
    } else {
        stopWebcam();
    }
});

// Função para parar a webcam
function stopWebcam() {
    if (webcamStream) {
        const tracks = webcamStream.getTracks();
        tracks.forEach(track => track.stop());
        webcamStream = null;
        webcamVideo.srcObject = null;
        toggleWebcamButton.innerHTML = '<i class="fas fa-video"></i>';
        togglePipButton.classList.add('hidden');
    }
}

// Função para ativar/desativar o Picture-in-Picture
togglePipButton.addEventListener('click', async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else if (webcamVideo.srcObject) {
        await webcamVideo.requestPictureInPicture();
    }
});

// Função para alternar o microfone
toggleMicButton.addEventListener('click', async () => {
    if (!audioStream) {
        try {
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            monitorAudioLevel(audioStream);
            toggleMicButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            muteMicButton.classList.remove('hidden');
        } catch (err) {
            console.error('Erro ao acessar o microfone:', err);
        }
    } else {
        stopMicrophone();
    }
});

// Função para parar o microfone
function stopMicrophone() {
    if (audioStream) {
        const tracks = audioStream.getTracks();
        tracks.forEach(track => track.stop());
        audioStream = null;
        toggleMicButton.innerHTML = '<i class="fas fa-microphone"></i>';
        muteMicButton.classList.add('hidden');
    }
}

// Função para mutar/desmutar o microfone
muteMicButton.addEventListener('click', () => {
    audioStream.getAudioTracks()[0].enabled = !audioStream.getAudioTracks()[0].enabled;
    muteMicButton.innerHTML = audioStream.getAudioTracks()[0].enabled ?
        '<i class="fas fa-volume-mute">' : '<i class="fas fa-volume-up"></i></i>';
});

// Função para monitorar o nível de áudio e exibir no medidor
function monitorAudioLevel(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function updateMeter() {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        meterBar.style.width = `${Math.min(average / 2, 100)}%`;
        requestAnimationFrame(updateMeter);
    }
    updateMeter();
}

// Função para iniciar/parar a gravação
startRecordingButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

// Função para iniciar a gravação
async function startRecording() {
    try {
        // Capturar a tela e o áudio do sistema
        recordingStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true // Certifique-se de que o áudio está ativado
        });

        // Verificar se o áudio do microfone está ativo
        if (audioStream) {
            const audioTracks = audioStream.getAudioTracks();
            audioTracks.forEach(track => recordingStream.addTrack(track));
        }

        // Verificar se a webcam está ativa e adicionar ao stream
        if (webcamStream) {
            const webcamTrack = webcamStream.getVideoTracks()[0];
            recordingStream.addTrack(webcamTrack);
        }

        mediaRecorder = new MediaRecorder(recordingStream, {
            mimeType: 'video/webm'
        });
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleStopRecording;

        mediaRecorder.start();
        isRecording = true;
        startRecordingButton.innerHTML = '<i class="fas fa-stop"></i>';
        pauseRecordingButton.classList.remove('hidden');
        downloadRecordingButton.classList.add('hidden');
    } catch (error) {
        console.error('Erro ao iniciar a gravação:', error);
        alert('Erro: Permissões negadas para gravação de tela ou áudio. Verifique as permissões no navegador.');
    }
}

// Função para pausar/resumir a gravação
pauseRecordingButton.addEventListener('click', () => {
    if (!isPaused) {
        mediaRecorder.pause();
        pauseRecordingButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        mediaRecorder.resume();
        pauseRecordingButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPaused = !isPaused;
});

// Função para parar a gravação
function stopRecording() {
    if (recordingStream) {
        recordingStream.getTracks().forEach(track => track.stop());
    }
    mediaRecorder.stop();
    isRecording = false;
    startRecordingButton.innerHTML = '<i class="fas fa-circle"></i>';
    pauseRecordingButton.classList.add('hidden');
}

// Função que trata os dados gravados
function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

// Função que lida com o fim da gravação e prepara o download
function handleStopRecording() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    recordedVideo.src = url;
    recordedVideo.classList.remove('hidden');
    downloadRecordingButton.classList.remove('hidden');

    recordedChunks = [];
}

//Download
downloadRecordingButton.addEventListener('click', () => {
    if (document.getElementById('recordedVideo').src) {
      const a = document.createElement('a');
      a.href = document.getElementById('recordedVideo').src;
      a.download = 'gravacao.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
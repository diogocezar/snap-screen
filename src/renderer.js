const videoElement = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const screenSelect = document.getElementById("screenSelect");

let mediaRecorder;
let chunks = [];

// Preenche a lista com as telas disponíveis
window.electronAPI.getSources();
window.electronAPI.onSourcesReceived((sources) => {
  screenSelect.innerHTML = '<option value="">Selecione uma Tela</option>'; // Reinicia a lista
  sources.forEach((source) => {
    const option = document.createElement("option");
    option.value = source.id;
    option.textContent = source.name;
    screenSelect.appendChild(option);
  });

  screenSelect.addEventListener("change", async () => {
    console.log(screenSelect);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: screenSelect.value,
        },
      },
    });

    // Ajuste de tamanho do preview
    videoElement.srcObject = stream;
    videoElement.style.width = "100vw";
    videoElement.style.height = "100vh";

    // Atualiza a visualização do vídeo com o novo stream
    videoElement.srcObject = stream;
    videoElement.play();
  });
});

// Inicia a gravação
startBtn.onclick = async () => {
  const selectedSourceId = screenSelect.value;
  if (!selectedSourceId) {
    alert("Selecione uma tela para gravar!");
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: selectedSourceId,
      },
    },
  });

  // Ajuste de tamanho do preview
  videoElement.srcObject = stream;
  videoElement.style.width = "100vw";
  videoElement.style.height = "100vh";

  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
  });
  chunks = [];

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const completeBlob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(completeBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    a.click();
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

// Encerra a gravação e remove o preview
stopBtn.onclick = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    videoElement.srcObject = null;
  }
};

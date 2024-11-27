(async function () {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const output = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  try {
    // 確保 HTTPS 環境
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw new Error('Camera access requires HTTPS.');
    }

    // 嘗試請求相機
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, // 優先使用後置相機
    });

    video.srcObject = stream;

    // 使用 Promise 確保 `onloadedmetadata` 完成
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play(); // 開始播放
        resolve();
      };
    });

    // 初始化 canvas 尺寸
    canvas.width = video.videoWidth || 640; // 提供 fallback 尺寸
    canvas.height = video.videoHeight || 480;

    // 啟動畫布繪製和掃描
    function drawToCanvas() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 假設使用 jsQR 進行 QR Code 掃描
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) {
        output.textContent = `QR Code: ${code.data}`;
      } else {
        output.textContent = "Scanning...";
      }

      requestAnimationFrame(drawToCanvas);
    }

    drawToCanvas(); // 開始畫布更新
  } catch (error) {
    console.error('Error accessing camera:', error);
    output.textContent = `Error: ${error.message}`;
  }
})();

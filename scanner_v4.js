(async function () {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const output = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  try {
    // 確保頁面使用 HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw new Error('Camera access requires HTTPS.');
    }

    // 嘗試獲取相機視訊
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // 使用後置相機
        width: { ideal: 1280 },    // 可調整為更高的解析度
        height: { ideal: 720 },
      },
    });

    video.srcObject = stream;

    // 等待相機畫面加載
    video.onloadedmetadata = () => {
      video.play();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      scanQRCode(); // 開始掃描
    };

    // QR Code 掃描函數
    function scanQRCode() {
      if (!video.videoWidth || !video.videoHeight) {
        requestAnimationFrame(scanQRCode);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        output.textContent = `QR Code: ${code.data}`;
      } else {
        output.textContent = "Scanning...";
      }

      requestAnimationFrame(scanQRCode);
    }
  } catch (error) {
    output.textContent = `Error accessing camera: ${error.message}`;
    console.error('Error:', error);
  }
})();

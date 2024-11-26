(async function () {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const output = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  try {
    // 列出所有可用的媒體設備
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    if (videoDevices.length === 0) {
      output.textContent = "No video input devices found.";
      return;
    }

    // 選擇後置攝像頭（如可用）
    const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];

    const stream = await navigator.mediaDevices.getUserMedia({
      //video: { deviceId: { exact: backCamera.deviceId } }
      video: { facingMode: 'environment' }
    });

    video.srcObject = stream;

    // 等待相機畫面加載
    video.onloadedmetadata = () => {
      video.play();
      canvas.width = video.videoWidth;  // 設定 canvas 寬度
      canvas.height = video.videoHeight;  // 設定 canvas 高度
    };

    // 持續掃描 QR Code
    function scanQRCode() {
      if (!video.videoWidth || !video.videoHeight) {
        // 確保視頻已加載
        requestAnimationFrame(scanQRCode);
        return;
      }

      // 更新 canvas 大小
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 將相機影像畫到 canvas 上
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 取得影像資料
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 使用 jsQR 解析影像中的 QR Code
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        output.textContent = `QR Code: ${code.data}`;  // 顯示 QR Code 資訊
      } else {
        output.textContent = "Scanning...";  // 顯示掃描中的狀態
      }

      requestAnimationFrame(scanQRCode);  // 重複執行掃描
    }

    scanQRCode();
  } catch (error) {
    output.textContent = `Unable to access camera: ${error.name}`;
    console.error('Error accessing camera:', error);
  }
})();

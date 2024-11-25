(async function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const output = document.getElementById('output');
    const ctx = canvas.getContext('2d');
  
    try {
      // 請求使用者相機
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      video.srcObject = stream;
  
      // 等待相機畫面加載
      video.onloadedmetadata = () => video.play();
  
      // 持續掃描 QR Code
      function scanQRCode() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        // 將相機影像畫到 canvas 上
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        // 取得影像資料
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
        // 使用 jsQR 解析影像中的 QR Code
        const code = jsQR(imageData.data, canvas.width, canvas.height);
  
        if (code) {
          output.textContent = `QR Code: ${code.data}`;
          console.log('QR Code Found:', code.data);
        } else {
          output.textContent = 'Scanning...';
        }
  
        requestAnimationFrame(scanQRCode); // 重複執行掃描
      }
  
      scanQRCode();
    } catch (error) {
      console.error('Error accessing camera:', error);
      output.textContent = 'Unable to access camera';
    }
  })();
  
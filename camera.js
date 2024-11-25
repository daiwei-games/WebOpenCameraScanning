(async function () {
    const video = document.getElementById('video');
  
    try {
      // 請求使用者的相機
      const stream = await navigator.mediaDevices.getUserMedia({
         video: { facingMode: 'environment' }  
      });
      // 將相機串流連接到 <video> 元素
      video.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  })();
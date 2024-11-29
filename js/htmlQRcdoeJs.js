let OpenQRCodeButton = document.querySelector("#OpenQRCode");
const html5QrCode = new Html5Qrcode("reader"); //相機框的div，顯示畫面
const output = document.getElementById("output"); //顯示訊息div

const config = {
  fps: 10, // 每秒幀數，設置為 10 提高性能
  qrbox: { width: 300, height: 300 }, // 掃描區域大小
};

let IfString = document.getElementById("cname"); //被比較的字串
window.addEventListener("load", () => {
  OpenQRCodeButton.disabled = false; //網頁Loading完成再開放按鈕
  OpenQRCodeButton.onclick = () => {
    //賦予按鈕可以打開鏡頭
    ActionQRCodeCamera();
  };
});

async function ActionQRCodeCamera() {
  if (IfString.valueth == 0 || !IfString){
     output.innerHTML = "沒有產品可以比對";
     return;
  }
  OpenQRCodeButton.disabled = true; //點擊掃描之後關閉按鈕
  try {
    // html5-qrcode.js庫裡面的方法
    //使用後置相機掃描 QR Code
    await html5QrCode.start(
      { facingMode: "environment" }, // 優先後置相機
      config,
      (decodedText) => {
        // 成功掃描到 QR Code 讀取資料
        let result = decodedText == IfString.value;
        output.innerHTML = `結果是: ${decodedText}`; //decodedText = 取得的字串
        
        //成功取得資料停止相機
        html5QrCode.stop(); // 停止掃描（根據需要）

        //提醒視窗
        if(result) alert("一樣");
        else alert("不一樣！");

        OpenQRCodeButton.disabled = false; //掃描完成完畢鏡頭之後，還可以再掃一次
      },
      (errorMessage) => {
        // 錯誤處理（例如沒有檢測到 QR Code）
        console.log(`${errorMessage}`);
      }
    );
  } catch (error) {
    console.log(error);
    output.innerHTML = `錯誤: ${(() => {
      if (error.message === undefined) return "沒有偵測到相機鏡頭";
      else return error.message;
    })()}`;
  }
}

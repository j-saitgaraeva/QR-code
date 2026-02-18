// =====================================================
// 1. НАСТРОЙКА QR КОДА (создаём объект QRCodeStyling)
// =====================================================
let qrCode;

function createQR(data = "https://example.com") {
  qrCode = new QRCodeStyling({
    width: 320,
    height: 320,
    type: "png",
    data: data,
    margin: 0,
    qrOptions: {
      errorCorrectionLevel: "M"
    },
    backgroundOptions: {
      color: "rgba(0,0,0,0)"
    },
    dotsOptions: {
      type: "square",
      color: "#222222"
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#222222"
    },
    cornersDotOptions: {
      type: "square",
      color: "#222222"
    }
  });
  
  const container = document.getElementById("qr-container");
  container.innerHTML = "";
  qrCode.append(container);
}

createQR();

// =====================================================
// 2. ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
// =====================================================
const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// =====================================================
// 3. ОБРАБОТЧИК КНОПКИ (ИСПРАВЛЕННАЯ СТРОКА)
// =====================================================
downloadBtn.addEventListener("click", async () => {
  const value = (input.value || "").trim();

  if (!value) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  // ← ИСПРАВЛЕНО: один слеш вместо двух
  const url =
    /^https?:\/\//i.test(value) || /^mailto:/i.test(value)
      ? value
      : "https://" + value;

  createQR(url);

  setTimeout(async () => {
    try {
      await qrCode.download({
        extension: "png",
        name: "qr-link"
      });
    } catch (e) {
      console.error(e);
      alert("Не удалось скачать QR‑код. Попробуйте ещё раз.");
    }
  }, 100);
});

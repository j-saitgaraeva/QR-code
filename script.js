// =====================================================
// 1. БАЗОВЫЕ НАСТРОЙКИ (как в твоей рабочей версии)
// =====================================================
let qrCode; // сделаем глобальной для пересоздания

function createQR(data = "https://example.com") {
  qrCode = new QRCodeStyling({
    // ДИНАМИЧЕСКИЙ РАЗМЕР — будет подстраиваться под матрицу
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
  container.innerHTML = ""; // очищаем старый QR
  qrCode.append(container);
}

// Создаём начальный QR
createQR();

// =====================================================
// 2. ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
// =====================================================
const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// =====================================================
// 3. ДИНАМИЧЕСКАЯ ЛОГИКА: обработчик кнопки
// =====================================================
downloadBtn.addEventListener("click", async () => {
  const value = (input.value || "").trim();

  if (!value) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  const url = /^https?:\/\/i.test(value) || /^mailto:/i.test(value)
    ? value
    : "https://" + value;

  // ПЕРЕСОЗДАЁМ QR с новыми данными (убирает отступ)
  createQR(url);

  // Ждём отрисовки и скачиваем
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
  }, 100); // небольшая задержка для полной отрисовки
});

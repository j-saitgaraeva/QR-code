// Настройки QR с фиксированным стилем
const qrCode = new QRCodeStyling({
  width: 320,
  height: 320,
  type: "png",
  data: "https://example.com", 
  margin: 0,
  qrOptions: {
    errorCorrectionLevel: "M" 
  },
  backgroundOptions: {
    color: "rgba(0,0,0,0)" 
  },
  dotsOptions: {
    type: "square", 
    color: "#000000"
  },
  cornersSquareOptions: {
    type: "rounded", 
    color: "#000000"
  },
  cornersDotOptions: {
    type: "rounded", 
    color: "#000000"
  }
});

const container = document.getElementById("qr-container");
qrCode.append(container);

const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", async () => {
  const value = (input.value || "").trim();

  if (!value) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  const url =
    /^https?:\/\//i.test(value) || /^mailto:/i.test(value)
      ? value
      : "https://" + value;

  qrCode.update({
    data: url
  });

  try {
    await qrCode.download({
      extension: "png",
      name: "qr-link"
    });
  } catch (e) {
    console.error(e);
    alert("Не удалось скачать QR‑код. Попробуйте ещё раз.");
  }
});

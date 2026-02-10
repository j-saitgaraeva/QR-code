export function generateMatrix(text) {
    const qr = QRCode.generate(text); // библиотека qrjs2
    return qr.modules;
}

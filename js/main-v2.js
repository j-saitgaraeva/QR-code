import { generateMatrix } from './qrMatrix.js';
import { renderQR } from './qrRenderer.js';

const qrContainer = document.getElementById('qr');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');
const urlInput = document.getElementById('urlInput');

// Простое сокращение через is.gd
async function shortenUrl(url) {
    try {
        const api = 'https://is.gd/create.php?format=simple&url=' + encodeURIComponent(url);
        const res = await fetch(api);
        if (!res.ok) return url;
        const text = (await res.text()).trim();
        if (!text || !text.startsWith('http')) return url;
        return text;
    } catch (e) {
        return url;
    }
}

generateBtn.addEventListener('click', async () => {
    const originalUrl = urlInput.value.trim();
    if (!originalUrl) return;

    // 1) Пытаемся сократить ссылку
    const shortUrl = await shortenUrl(originalUrl);

    // 2) Генерируем матрицу по сокращённой (или исходной, если не вышло)
    const matrix = generateMatrix(shortUrl);

    // 3) Создаём canvas без фиксированного размера
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // 4) Рендерим QR
    await renderQR(ctx, matrix);

    // 5) Вставляем в DOM
    qrContainer.innerHTML = '';
    qrContainer.appendChild(canvas);

    // 6) Кнопка скачивания
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = 'qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
});

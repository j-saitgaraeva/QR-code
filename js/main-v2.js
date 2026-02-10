import { generateMatrix } from './qrMatrix.js';
import { renderQR } from './qrRenderer.js';

const size = 165; // итоговый размер QR в пикселях

const qrContainer = document.getElementById('qr');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');
const urlInput = document.getElementById('urlInput');

generateBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    // Генерируем матрицу QR
    const matrix = generateMatrix(url);

    // Количество модулей (21, 25, 29, 33, 37...)
    const modules = matrix.length;

    // Вычисляем размер модуля так, чтобы QR всегда был ровно 165px
    const moduleSize = size / modules;

    // Создаём canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Рисуем QR-код
    await renderQR(ctx, matrix, moduleSize);

    // Показываем QR
    qrContainer.innerHTML = '';
    qrContainer.appendChild(canvas);

    // Кнопка скачивания
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = 'qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
});

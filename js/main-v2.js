import { renderQR } from './qrRenderer.js';
import { createMatrix } from './qrMatrix.js';

const size = 165;              // ← новый размер
const moduleSize = 5;          // ← 165 / 33 = 5 px
const qrContainer = document.getElementById('qr');
const downloadBtn = document.getElementById('downloadBtn');

document.getElementById('generateBtn').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return;

    const matrix = createMatrix(url);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;   // ← важно для чёткости

    renderQR(ctx, matrix, moduleSize);

    qrContainer.innerHTML = '';
    qrContainer.appendChild(canvas);

    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = 'qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
});

import { generateMatrix } from './qrMatrix.js';
import { renderQR } from './qrRenderer.js';

const qrContainer = document.getElementById('qr');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');
const urlInput = document.getElementById('urlInput');

generateBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    const matrix = generateMatrix(url);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    await renderQR(ctx, matrix);

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

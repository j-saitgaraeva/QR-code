import { generateMatrix } from './qrMatrix.js';

// ТЕСТ: генерируем QR-матрицу и выводим её в консоль
const testUrl = "https://t.me/blackufa_official";

const matrix = generateMatrix(testUrl);

console.log("Размер матрицы:", matrix.length, "x", matrix.length);
console.log("Матрица:", matrix);

// Рисуем матрицу без глазок, чтобы проверить, валиден ли QR
const qrContainer = document.getElementById('qr');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const modules = matrix.length;
const moduleSize = 5;
const canvasSize = modules * moduleSize;

canvas.width = canvasSize;
canvas.height = canvasSize;

ctx.fillStyle = "#000";
ctx.imageSmoothingEnabled = false;

for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
        if (matrix[r][c] === 1) {
            ctx.fillRect(
                c * moduleSize,
                r * moduleSize,
                moduleSize,
                moduleSize
            );
        }
    }
}

qrContainer.innerHTML = "";
qrContainer.appendChild(canvas);

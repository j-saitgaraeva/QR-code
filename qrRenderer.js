// qrRenderer.js

/**
 * Рендерит QR-матрицу в PNG 150x150 с прозрачным фоном.
 * matrix: двумерный массив boolean (true = чёрный модуль, false = пусто)
 * return: dataURL PNG (image/png)
 */
export function renderMatrixToPng(matrix, sizePx = 150) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("Matrix is empty or invalid");
  }

  const moduleCount = matrix.length; // количество модулей по одной стороне
  const canvas = document.createElement("canvas");
  canvas.width = sizePx;
  canvas.height = sizePx;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context is not available");
  }

  // Прозрачный фон
  ctx.clearRect(0, 0, sizePx, sizePx);

  // Размер одного модуля в пикселях
  const moduleSize = sizePx / moduleCount;

  // Рисуем квадратные модули
  ctx.fillStyle = "black";

  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (!matrix[y][x]) continue;

      const x0 = Math.round(x * moduleSize);
      const y0 = Math.round(y * moduleSize);
      const x1 = Math.round((x + 1) * moduleSize);
      const y1 = Math.round((y + 1) * moduleSize);

      const w = x1 - x0;
      const h = y1 - y0;

      ctx.fillRect(x0, y0, w, h);
    }
  }

  return canvas.toDataURL("image/png");
}

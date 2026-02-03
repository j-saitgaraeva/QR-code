// qrRenderer.js

export function renderMatrixToPng(matrix, sizePx = 150) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("Matrix is empty or invalid");
  }

  const moduleCount = matrix.length;
  const canvas = document.createElement("canvas");
  canvas.width = sizePx;
  canvas.height = sizePx;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, sizePx, sizePx);

  const moduleSize = sizePx / moduleCount;

  // --- Шаг 4: определяем зоны глазков ---
  const finderZones = [
    { x: 0, y: 0 },
    { x: moduleCount - 7, y: 0 },
    { x: 0, y: moduleCount - 7 }
  ];

  function isInFinderZone(x, y) {
    return finderZones.some(zone =>
      x >= zone.x &&
      x < zone.x + 7 &&
      y >= zone.y &&
      y < zone.y + 7
    );
  }

  // --- Рисуем обычные модули, кроме глазков ---
  ctx.fillStyle = "black";

  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (!matrix[y][x]) continue;
      if (isInFinderZone(x, y)) continue; // <-- исключаем глазки

      const x0 = Math.round(x * moduleSize);
      const y0 = Math.round(y * moduleSize);
      const w = Math.ceil(moduleSize);
      const h = Math.ceil(moduleSize);

      ctx.fillRect(x0, y0, w, h);
    }
  }

  // --- На следующем шаге сюда вставим SVG глазков ---
  // drawCustomFinder(ctx, moduleSize, finderZones);

  return canvas.toDataURL("image/png");
}

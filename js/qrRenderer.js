// Загружаем SVG глазка и превращаем в <img>
async function loadSvg(url) {
    const res = await fetch(url);
    const text = await res.text();
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(text);
    await img.decode();
    return img;
}

// Основной рендер QR-кода
export async function renderQR(ctx, matrix) {
    const modules = matrix.length;

    // Фиксированный размер модуля в пикселях (целое число)
    const moduleSize = 5;
    const canvasSize = modules * moduleSize;

    // Настраиваем реальный размер canvas строго по модулям
    ctx.canvas.width = canvasSize;
    ctx.canvas.height = canvasSize;

    // Чистим фон (прозрачный)
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.imageSmoothingEnabled = false;

    // Цвет модулей
    ctx.fillStyle = "#000";

    // 1. Рисуем QR без зон глаз (оставляем 9×9 под каждый глаз)
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {

            // Зоны глаз: 9×9 модулей
            const inTopLeft = (r < 9 && c < 9);
            const inTopRight = (r < 9 && c >= modules - 9);
            const inBottomLeft = (r >= modules - 9 && c < 9);

            if (inTopLeft || inTopRight || inBottomLeft) continue;

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

    // 2. Загружаем SVG глазка (35×35, 7×7 модулей по 5 px)
    const eye = await loadSvg("./js/eyes/eye.svg");

    const eyeModules = 7;
    const eyePx = moduleSize * eyeModules;

    // Смещение на 1 модуль от края зоны (1 модуль — белый разделитель)
    const offset = moduleSize;

    // 3. Рисуем глазки

    // Левый верхний
    ctx.drawImage(
        eye,
        offset,
        offset,
        eyePx,
        eyePx
    );

    // Правый верхний
    ctx.drawImage(
        eye,
        canvasSize - offset - eyePx,
        offset,
        eyePx,
        eyePx
    );

    // Левый нижний
    ctx.drawImage(
        eye,
        offset,
        canvasSize - offset - eyePx,
        eyePx,
        eyePx
    );
}

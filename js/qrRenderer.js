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

    // Выбираем целый размер модуля так, чтобы всё поместилось
    // и модули были не слишком мелкими
    const targetSize = 130; // желаемый визуальный размер
    const moduleSize = Math.floor(targetSize / modules) || 1;
    const canvasSize = moduleSize * modules;

    // Настраиваем реальный размер canvas под целые модули
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

    // 2. Загружаем SVG глазка
    const eye = await loadSvg("./js/eyes/eye.svg");

    // Глаз = 7×7 модулей
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

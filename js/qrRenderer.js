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

    // ЭТАП 1: внутренний canvas для пиксель‑перфект QR
    // Увеличиваем базовый модуль для высокой чёткости
    const baseModuleSize = Math.floor(512 / modules);
    const internalSize = baseModuleSize * modules;

    const internalCanvas = document.createElement("canvas");
    internalCanvas.width = internalSize;
    internalCanvas.height = internalSize;

    const internalCtx = internalCanvas.getContext("2d");
    internalCtx.clearRect(0, 0, internalSize, internalSize);

    internalCtx.fillStyle = "#000";

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            const inTopLeft = (r < 9 && c < 9);
            const inTopRight = (r < 9 && c >= modules - 9);
            const inBottomLeft = (r >= modules - 9 && c < 9);

            if (inTopLeft || inTopRight || inBottomLeft) continue;

            if (matrix[r][c] === 1) {
                internalCtx.fillRect(
                    c * baseModuleSize,
                    r * baseModuleSize,
                    baseModuleSize,
                    baseModuleSize
                );
            }
        }
    }

    // Вырезаем зоны под глазки
    const eyeModules = 7;
    const quietModules = 1;
    const eyeBlockModules = eyeModules + quietModules * 2;
    const eyeBlockSize = eyeBlockModules * baseModuleSize;

    clearEyeZone(internalCtx, 0, 0, eyeBlockSize);
    clearEyeZone(internalCtx, internalSize - eyeBlockSize, 0, eyeBlockSize);
    clearEyeZone(internalCtx, 0, internalSize - eyeBlockSize, eyeBlockSize);

    // Вставляем SVG‑глазки
    const eye = await loadSvg("./js/eyes/eye.svg");

    const eyePx = eyeModules * baseModuleSize;
    const offset = baseModuleSize;

    internalCtx.drawImage(eye, offset, offset, eyePx, eyePx);
    internalCtx.drawImage(
        eye,
        internalSize - offset - eyePx,
        offset,
        eyePx,
        eyePx
    );
    internalCtx.drawImage(
        eye,
        offset,
        internalSize - offset - eyePx,
        eyePx,
        eyePx
    );

    // ЭТАП 2: Масштабирование в DOM‑canvas до 130×130
    const finalSize = 130;

    ctx.canvas.width = finalSize;
    ctx.canvas.height = finalSize;

    ctx.clearRect(0, 0, finalSize, finalSize);
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        internalCanvas,
        0, 0, internalSize, internalSize,
        0, 0, finalSize, finalSize
    );
}

// Вспомогательная функция: очистка зоны под глазок
function clearEyeZone(ctx, x, y, size) {
    ctx.clearRect(x, y, size, size);
}

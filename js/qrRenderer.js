async function loadSvg(url) {
    const res = await fetch(url);
    const text = await res.text();
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(text);
    await img.decode();
    return img;
}

export async function renderQR(ctx, matrix) {
    const modules = matrix.length;

    // Модуль строго 5 px
    const moduleSize = 5;
    const canvasSize = modules * moduleSize;

    ctx.canvas.width = canvasSize;
    ctx.canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#000";

    // Рисуем QR без зон глазок
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

    // Глазки
    const eye = await loadSvg("./js/eyes/eye.svg");

    const eyeModules = 7;
    const eyePx = eyeModules * moduleSize;
    const offset = moduleSize;

    ctx.drawImage(eye, offset, offset, eyePx, eyePx);
    ctx.drawImage(eye, canvasSize - offset - eyePx, offset, eyePx, eyePx);
    ctx.drawImage(eye, offset, canvasSize - offset - eyePx, eyePx, eyePx);
}

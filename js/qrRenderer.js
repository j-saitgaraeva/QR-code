export function renderMatrixToPng(matrix, sizePx) {
    const modules = matrix.length;
    const scale = sizePx / modules;

    const canvas = document.createElement("canvas");
    canvas.width = sizePx;
    canvas.height = sizePx;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (matrix[r][c] === 1) {
                ctx.fillRect(
                    Math.round(c * scale),
                    Math.round(r * scale),
                    Math.ceil(scale),
                    Math.ceil(scale)
                );
            }
        }
    }

    return canvas.toDataURL("image/png");
}

export function renderQR(ctx, matrix) {
    const modules = matrix.length;
    const moduleSize = 5;
    const canvasSize = modules * moduleSize;

    ctx.canvas.width = canvasSize;
    ctx.canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#000";

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (matrix[r][c]) {
                ctx.fillRect(
                    c * moduleSize,
                    r * moduleSize,
                    moduleSize,
                    moduleSize
                );
            }
        }
    }
}

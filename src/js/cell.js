/**
 * Data class to store x and y coordinates of the matrix.
 * Has some methods to get coordinates of the cell on canvas.
 */

class Cell extends Point {
    getCanvasX() {
        return this.x * settings.cellSize + settings.lineWidth
    }

    getCanvasY() {
        return this.y * settings.cellSize + settings.lineWidth
    }

    getCanvasWidth() {
        return settings.cellSize - settings.lineWidth
    }

    getCanvasHeight() {
        return settings.cellSize - settings.lineWidth
    }
}

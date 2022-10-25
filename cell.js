/**
 * Data class to store x and y coordinates of the matrix.
 * Has some methods to get coordinates of the cell on canvas.
 */

class Cell extends Point {
    get_canvas_x() {
        return this.x * settings.cell_size + settings.line_width;
    }

    get_canvas_y() {
        return this.y * settings.cell_size + settings.line_width;
    }

    get_canvas_width() {
        return settings.cell_size - settings.line_width;
    }

    get_canvas_height() {
        return settings.cell_size - settings.line_width;
    }
}

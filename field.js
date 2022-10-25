class Field {
    constructor() {
        this.width = settings.field_width;
        this.height = settings.field_height;

        this.matrix = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.matrix[i] = this.#get_empty_line();
        }

        this.ground = [];

        this.all_figures = [FigureL, FigureJ, FigureI, FigureO, FigureZ, FigureS, FigureT];
        const class_name = this.#get_random_figure_class();
        this.figure = null;
        this.next_figure = new class_name();

        this.what_to_draw = [];
        this.colours = [];
        this.all_figures.forEach(class_name => {
            const object = new class_name();
            this.what_to_draw.push(object.code);
            this.colours.push(object.colour);
        });

        this.speed_watcher = 0;
    }

    push_next_figure() {
        this.#add_figure(this.next_figure);
        const class_name = this.#get_random_figure_class();
        this.next_figure = new class_name();
    }

    rotate_figure() {
        if (this.figure.shape === 'O') {
            return;
        }
        let possible = true;
        this.figure.get_rotate_coordinates().forEach(point => {
            if (point.x < 0 || point.x >= this.width) {
                possible = false;
                return false;
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x && ground.y === point.y) {
                    possible = false;
                    return false;
                }
            });
        });
        if (possible) {
            this.#erase_figure();
            this.figure.rotate();
            this.#fill_figure();
        }
    }

    move_figure_down() {
        let possible = true;
        this.figure.coordinates.forEach(point => {
            if (point.y === settings.field_height - 1) {
                possible = false;
                return false;
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x && ground.y === point.y + 1) {
                    possible = false;
                    return false;
                }
            });
        });
        if (possible) {
            this.#erase_figure();
            this.figure.move_down();
            this.#fill_figure();
        } else {
            this.#ground_figure();
        }
    }

    move_figure_left() {
        let possible = true;
        this.figure.coordinates.forEach(point => {
            if (point.x === 0) {
                possible = false;
                return false;
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x - 1 && ground.y === point.y) {
                    possible = false;
                    return false;
                }
            });
        });
        if (possible) {
            this.#erase_figure();
            this.figure.move_left();
            this.#fill_figure();
        }
    }

    move_figure_right() {
        let possible = true;
        this.figure.coordinates.forEach(point => {
            if (point.x === settings.field_width - 1) {
                possible = false;
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x + 1 && ground.y === point.y) {
                    possible = false;
                    return false;
                }
            });
        });
        if (possible) {
            this.#erase_figure();
            this.figure.move_right();
            this.#fill_figure();
        }
    }

    draw(ctx, next_figure_ctx) {
        this.#draw_cell_net(ctx);
        this.#draw_field(ctx);
        this.#draw_next_figure(next_figure_ctx);
    }

    #get_random_figure_class() {
        const idx = Math.floor(Math.random() * this.all_figures.length);
        return this.all_figures[idx];
    }

    #add_figure(figure) {
        this.figure = figure;
        this.#fill_figure();
    }

    #ground_figure() {
        this.figure.coordinates.forEach(point => {
            this.ground.push(point);
            if (point.y >= 0) {
                this.matrix[point.y][point.x] = this.figure.code;
            }
        });

        let counter;
        const erase = [];
        for (let i = 0; i < this.height; i++) {
            counter = 0;
            for (let j = 0; j < this.width; j++) {
                if (this.matrix[i][j] === settings.empty_code) {
                    break;
                }
                counter++;
            }
            if (counter === this.width) {
                erase.push(i);
            }
        }

        if (erase.length) {
            game.increase_score(erase.length);
            erase.forEach(line_number => {
                this.#erase_line(line_number);
            });

            this.speed_watcher += erase.length;
            if (this.speed_watcher >= 4) {
                game.increase_speed();
                this.speed_watcher = 0;
            }
        }

        // detect if the game is over
        this.figure.coordinates.forEach(point => {
            if (point.y < 0) {
                game.over();
            }
        });

        if (game.status === 'ACTION') {
            this.push_next_figure();
        }
    }

    #erase_figure() {
        this.figure.coordinates.forEach(point => {
            if (point.y >= 0 && point.y < settings.field_height) {
                this.matrix[point.y][point.x] = settings.empty_code;
            }
        });
    }

    #fill_figure() {
        this.figure.coordinates.forEach(point => {
            if (point.y >= 0 && point.y < settings.field_height) {
                this.matrix[point.y][point.x] = this.figure.code;
            }
        });
    }

    #get_empty_line() {
        return new Array(this.width).fill(settings.empty_code);
    }

    #erase_line(number) {
        const new_matrix = [
            this.#get_empty_line(),
        ];
        this.matrix.forEach((line, i) => {
            if (i !== number) {
                new_matrix.push(line);
            }
        });
        this.matrix = new_matrix;

        const new_ground = [];
        this.matrix.forEach((line, i) => {
            line.forEach((e, j) => {
                if (e !== settings.empty_code) {
                    new_ground.push(new Point(j, i));
                }
            });
        });
        this.ground = new_ground;
    }

    #draw_cell_net(ctx) {
        const horizontal_line_length = this.width * settings.cell_size;
        const vertical_line_length = this.height * settings.cell_size;

        ctx.fillStyle = settings.net_colour;

        for (let i = 0; i <= this.width; i++) {
            ctx.beginPath();
            ctx.rect(settings.cell_size * i, 0, settings.line_width, vertical_line_length);
            ctx.fill();
        }
        for (let i = 0; i <= this.height; i++) {
            ctx.beginPath();
            ctx.rect(0, settings.cell_size * i, horizontal_line_length, settings.line_width);
            ctx.fill();
        }
    }

    #draw_field(ctx) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const idx = this.what_to_draw.indexOf(this.matrix[i][j]);
                if (idx > -1) {
                    const cell = new Cell(j, i);
                    ctx.fillStyle = this.colours[idx];
                    ctx.beginPath();
                    ctx.rect(
                        cell.get_canvas_x(),
                        cell.get_canvas_y(),
                        cell.get_canvas_width(),
                        cell.get_canvas_height(),
                    );
                    ctx.fill();
                }
            }
        }
    }

    #draw_next_figure(ctx) {
        let start_x = 0;
        let start_y = 0;
        let [width, height] = this.next_figure.get_width_height();
        width += 2;
        height += 2;
        ctx.fillStyle = settings.net_colour;
        for (let i = 0; i <= height; i++) {
            ctx.beginPath();
            ctx.rect(
                start_x,
                start_y + i * settings.cell_size,
                width * settings.cell_size,
                settings.line_width,
            );
            ctx.fill();
        }
        for (let i = 0; i <= width; i++) {
            ctx.beginPath();
            ctx.rect(
                start_x + i * settings.cell_size,
                start_y,
                settings.line_width,
                height * settings.cell_size,
            );
            ctx.fill();
        }

        start_x += settings.cell_size;
        start_y += settings.cell_size;
        ctx.fillStyle = this.next_figure.colour;
        this.next_figure.points[0].forEach(point => {
            ctx.beginPath();
            ctx.rect(
                start_x + point.x * settings.cell_size + settings.line_width,
                start_y + point.y * settings.cell_size + settings.line_width,
                settings.cell_size - settings.line_width,
                settings.cell_size - settings.line_width,
            );
            ctx.fill();
        });
    }
}

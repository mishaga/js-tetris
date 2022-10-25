class Figure {
    constructor(points) {
        this.points = points;

        this.shape = null;
        this.code = null;
        this.colour = null;

        this.rotation_index = 0;
        this.top_x = 0;
        this.top_y = 0;

        this.coordinates = this.#get_coordinates();
    }

    get_rotate_coordinates() {
        const previous = this.rotation_index;
        this.rotation_index = this.#get_next_rotation_index();
        const coordinates = this.#get_coordinates();
        this.rotation_index = previous;
        return coordinates;
    }

    rotate() {
        this.coordinates = this.get_rotate_coordinates();
        this.rotation_index = this.#get_next_rotation_index();
    }

    move_down() {
        this.coordinates = this.coordinates.map(point => {
            return new Point(point.x, point.y + 1);
        });
        this.top_y++;
    }

    move_left() {
        this.coordinates = this.coordinates.map(point => {
            return new Point(point.x - 1, point.y);
        });
        this.top_x--;
    }

    move_right() {
        this.coordinates = this.coordinates.map(point => {
            return new Point(point.x + 1, point.y);
        });
        this.top_x++;
    }

    get_width_height() {
        let width = 0;
        let height = 0;
        const points = this.points[this.rotation_index];

        points.forEach(point => {
            if (point.x >= width) {
                width = point.x + 1;
            }
            if (point.y >= height) {
                height = point.y + 1;
            }
        });
        return [width, height];
    }

    #get_coordinates() {
        const [width, height] = this.get_width_height();
        const mid = Math.round(settings.field_width / 2) - Math.round(width / 2);
        const points = this.points[this.rotation_index];
        return points.map(point => {
            return new Point(mid + point.x + this.top_x, point.y - height + this.top_y);
        });
    }

    #get_next_rotation_index() {
        return this.rotation_index + 1 === this.points.length ? 0 : this.rotation_index + 1;
    }
}

class FigureL extends Figure {
    constructor() {
        const points = [
            [
                new Point(0, 0),
                new Point(0, 1),
                new Point(0, 2),
                new Point(1, 2),
            ],
            [
                new Point(0, 1),
                new Point(1, 1),
                new Point(2, 1),
                new Point(2, 0),
            ],
            [
                new Point(0, 0),
                new Point(1, 0),
                new Point(1, 1),
                new Point(1, 2),
            ],
            [
                new Point(0, 2),
                new Point(0, 1),
                new Point(1, 1),
                new Point(2, 1),
            ],
        ];
        super(points);
        this.shape = 'L';
        this.code = 1;
        this.colour = 'lightsteelblue';
    }
}

class FigureJ extends Figure {
    constructor() {
        const points = [
            [
                new Point(1, 0),
                new Point(1, 1),
                new Point(1, 2),
                new Point(0, 2),
            ],
            [
                new Point(0, 1),
                new Point(1, 1),
                new Point(2, 1),
                new Point(2, 2),
            ],
            [
                new Point(0, 0),
                new Point(1, 0),
                new Point(0, 1),
                new Point(0, 2),
            ],
            [
                new Point(0, 0),
                new Point(0, 1),
                new Point(1, 1),
                new Point(2, 1),
            ],
        ];
        super(points);
        this.shape = 'J';
        this.code = 2;
        this.colour = 'lightsteelblue';
    }
}

class FigureI extends Figure {
    constructor() {
        const points = [
            [
                new Point(0, 0),
                new Point(0, 1),
                new Point(0, 2),
                new Point(0, 3),
            ],
            [
                new Point(0, 0),
                new Point(1, 0),
                new Point(2, 0),
                new Point(3, 0),
            ],
        ];
        super(points);
        this.shape = 'I';
        this.code = 3;
        this.colour = 'plum';
    }
}

class FigureO extends Figure {
    constructor() {
        const points = [
            [
                new Point(0, 0),
                new Point(0, 1),
                new Point(1, 0),
                new Point(1, 1),
            ],
        ];
        super(points);
        this.shape = 'O';
        this.code = 4;
        this.colour = 'lightblue';
    }
}

class FigureZ extends Figure {
    constructor() {
        const points = [
            [
                new Point(0, 0),
                new Point(1, 0),
                new Point(1, 1),
                new Point(2, 1),
            ],
            [
                new Point(1, 0),
                new Point(0, 1),
                new Point(1, 1),
                new Point(0, 2),
            ],
        ];
        super(points);
        this.shape = 'Z';
        this.code = 5;
        this.colour = 'lightpink';
    }
}

class FigureS extends Figure {
    constructor() {
        const points = [
            [
                new Point(2, 0),
                new Point(1, 0),
                new Point(1, 1),
                new Point(0, 1),
            ],
            [
                new Point(0, 0),
                new Point(0, 1),
                new Point(1, 1),
                new Point(1, 2),
            ],
        ];
        super(points);
        this.shape = 'S';
        this.code = 6;
        this.colour = 'lightpink';
    }
}

class FigureT extends Figure {
    constructor() {
        const points = [
            [
                new Point(0, 0),
                new Point(1, 0),
                new Point(2, 0),
                new Point(1, 1),
            ],
            [
                new Point(0, 0),
                new Point(0, 1),
                new Point(0, 2),
                new Point(1, 1),
            ],
            [
                new Point(0, 1),
                new Point(1, 1),
                new Point(2, 1),
                new Point(1, 0),
            ],
            [
                new Point(1, 0),
                new Point(1, 1),
                new Point(1, 2),
                new Point(0, 1),
            ],
        ];
        super(points);
        this.shape = 'T';
        this.code = 7;
        this.colour = 'plum';
    }
}

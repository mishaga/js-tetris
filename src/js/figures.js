class Figure {
    constructor(points) {
        this.points = points

        this.shape = null
        this.code = null
        this.colour = null

        this.rotationIndex = 0
        this.topX = 0
        this.topY = 0

        this.coordinates = this.#getCoordinates()
    }

    getRotateCoordinates() {
        const previous = this.rotationIndex
        this.rotationIndex = this.#getNextRotationIndex()
        const coordinates = this.#getCoordinates()
        this.rotationIndex = previous
        return coordinates
    }

    rotate() {
        this.coordinates = this.getRotateCoordinates()
        this.rotationIndex = this.#getNextRotationIndex()
    }

    moveDown() {
        this.coordinates = this.coordinates.map(point => {
            return new Point(point.x, point.y + 1)
        })
        this.topY++
    }

    moveLeft() {
        this.coordinates = this.coordinates.map(point => {
            return new Point(point.x - 1, point.y)
        })
        this.topX--
    }

    moveRight() {
        this.coordinates = this.coordinates.map(point => {
            return new Point(point.x + 1, point.y)
        })
        this.topX++
    }

    getWidthAndHeight() {
        let width = 0
        let height = 0
        const points = this.points[this.rotationIndex]

        points.forEach(point => {
            if (point.x >= width) {
                width = point.x + 1
            }
            if (point.y >= height) {
                height = point.y + 1
            }
        })
        return [width, height]
    }

    #getCoordinates() {
        const [width, height] = this.getWidthAndHeight()
        const mid = Math.round(settings.fieldWidth / 2) - Math.round(width / 2)
        const points = this.points[this.rotationIndex]
        return points.map(point => {
            return new Point(mid + point.x + this.topX, point.y - height + this.topY)
        })
    }

    #getNextRotationIndex() {
        return this.rotationIndex + 1 === this.points.length ? 0 : this.rotationIndex + 1
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
        ]
        super(points)
        this.shape = 'L'
        this.code = 1
        this.colour = 'lightsteelblue'
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
        ]
        super(points)
        this.shape = 'J'
        this.code = 2
        this.colour = 'lightsteelblue'
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
        ]
        super(points)
        this.shape = 'I'
        this.code = 3
        this.colour = 'plum'
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
        ]
        super(points)
        this.shape = 'O'
        this.code = 4
        this.colour = 'lightblue'
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
        ]
        super(points)
        this.shape = 'Z'
        this.code = 5
        this.colour = 'lightpink'
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
        ]
        super(points)
        this.shape = 'S'
        this.code = 6
        this.colour = 'lightpink'
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
        ]
        super(points)
        this.shape = 'T'
        this.code = 7
        this.colour = 'plum'
    }
}

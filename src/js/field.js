class Field {
    constructor() {
        this.width = settings.fieldWidth
        this.height = settings.fieldHeight

        this.matrix = new Array(this.height)
        for (let i = 0; i < this.height; i++) {
            this.matrix[i] = this.#getEmptyLine()
        }

        this.ground = []

        this.allFigures = [FigureL, FigureJ, FigureI, FigureO, FigureZ, FigureS, FigureT]
        const className = this.#getRandomFigureClass()
        this.figure = null
        this.nextFigure = new className()

        this.whatToDraw = []
        this.colours = []
        this.allFigures.forEach(className => {
            const object = new className()
            this.whatToDraw.push(object.code)
            this.colours.push(object.colour)
        })

        this.speedWatcher = 0
    }

    pushNextFigure() {
        this.#addFigure(this.nextFigure)
        const className = this.#getRandomFigureClass()
        this.nextFigure = new className()
    }

    rotateFigure() {
        if (this.figure.shape === 'O') {
            return
        }
        let possible = true
        this.figure.getRotateCoordinates().forEach(point => {
            if (point.x < 0 || point.x >= this.width) {
                possible = false
                return false
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x && ground.y === point.y) {
                    possible = false
                    return false
                }
            })
        })
        if (possible) {
            this.#eraseFigure()
            this.figure.rotate()
            this.#fillFigure()
        }
    }

    moveFigureDown() {
        let possible = true
        this.figure.coordinates.forEach(point => {
            if (point.y === settings.fieldHeight - 1) {
                possible = false
                return false
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x && ground.y === point.y + 1) {
                    possible = false
                    return false
                }
            })
        })
        if (possible) {
            this.#eraseFigure()
            this.figure.moveDown()
            this.#fillFigure()
        } else {
            this.#groundFigure()
        }
    }

    moveFigureLeft() {
        let possible = true
        this.figure.coordinates.forEach(point => {
            if (point.x === 0) {
                possible = false
                return false
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x - 1 && ground.y === point.y) {
                    possible = false
                    return false
                }
            })
        })
        if (possible) {
            this.#eraseFigure()
            this.figure.moveLeft()
            this.#fillFigure()
        }
    }

    moveFigureRight() {
        let possible = true
        this.figure.coordinates.forEach(point => {
            if (point.x === settings.fieldWidth - 1) {
                possible = false
            }
            this.ground.forEach(ground => {
                if (ground.x === point.x + 1 && ground.y === point.y) {
                    possible = false
                    return false
                }
            })
        })
        if (possible) {
            this.#eraseFigure()
            this.figure.moveRight()
            this.#fillFigure()
        }
    }

    draw(ctx, nextFigureCtx) {
        this.#drawCellNet(ctx)
        this.#drawField(ctx)
        this.#drawNextFigure(nextFigureCtx)
    }

    #getRandomFigureClass() {
        const idx = Math.floor(Math.random() * this.allFigures.length)
        return this.allFigures[idx]
    }

    #addFigure(figure) {
        this.figure = figure
        this.#fillFigure()
    }

    #groundFigure() {
        this.figure.coordinates.forEach(point => {
            this.ground.push(point)
            if (point.y >= 0) {
                this.matrix[point.y][point.x] = this.figure.code
            }
        })

        let counter
        const erase = []
        for (let i = 0; i < this.height; i++) {
            counter = 0
            for (let j = 0; j < this.width; j++) {
                if (this.matrix[i][j] === settings.emptyCode) {
                    break
                }
                counter++
            }
            if (counter === this.width) {
                erase.push(i)
            }
        }

        if (erase.length) {
            game.increaseScore(erase.length)
            erase.forEach(lineNumber => {
                this.#eraseLine(lineNumber)
            })

            this.speedWatcher += erase.length
            if (this.speedWatcher >= 4) {
                game.increaseSpeed()
                this.speedWatcher = 0
            }
        }

        // detect if the game is over
        this.figure.coordinates.forEach(point => {
            if (point.y < 0) {
                game.over()
            }
        })

        if (game.status === 'ACTION') {
            this.pushNextFigure()
        }
    }

    #eraseFigure() {
        this.figure.coordinates.forEach(point => {
            if (point.y >= 0 && point.y < settings.fieldHeight) {
                this.matrix[point.y][point.x] = settings.emptyCode
            }
        })
    }

    #fillFigure() {
        this.figure.coordinates.forEach(point => {
            if (point.y >= 0 && point.y < settings.fieldHeight) {
                this.matrix[point.y][point.x] = this.figure.code
            }
        })
    }

    #getEmptyLine() {
        return new Array(this.width).fill(settings.emptyCode)
    }

    #eraseLine(number) {
        const newMatrix = [
            this.#getEmptyLine(),
        ]
        this.matrix.forEach((line, i) => {
            if (i !== number) {
                newMatrix.push(line)
            }
        })
        this.matrix = newMatrix

        const newGround = []
        this.matrix.forEach((line, i) => {
            line.forEach((e, j) => {
                if (e !== settings.emptyCode) {
                    newGround.push(new Point(j, i))
                }
            })
        })
        this.ground = newGround
    }

    #drawCellNet(ctx) {
        const horizontalLineLength = this.width * settings.cellSize
        const verticalLineLength = this.height * settings.cellSize

        ctx.fillStyle = settings.netColour

        for (let i = 0; i <= this.width; i++) {
            ctx.beginPath()
            ctx.rect(settings.cellSize * i, 0, settings.lineWidth, verticalLineLength)
            ctx.fill()
        }
        for (let i = 0; i <= this.height; i++) {
            ctx.beginPath()
            ctx.rect(0, settings.cellSize * i, horizontalLineLength, settings.lineWidth)
            ctx.fill()
        }
    }

    #drawField(ctx) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const idx = this.whatToDraw.indexOf(this.matrix[i][j])
                if (idx > -1) {
                    const cell = new Cell(j, i)
                    ctx.fillStyle = this.colours[idx]
                    ctx.beginPath()
                    ctx.rect(
                        cell.getCanvasX(),
                        cell.getCanvasY(),
                        cell.getCanvasWidth(),
                        cell.getCanvasHeight(),
                    )
                    ctx.fill()
                }
            }
        }
    }

    #drawNextFigure(ctx) {
        let startX = 0
        let startY = 0
        let [width, height] = this.nextFigure.getWidthAndHeight()
        width += 2
        height += 2
        ctx.fillStyle = settings.netColour
        for (let i = 0; i <= height; i++) {
            ctx.beginPath()
            ctx.rect(
                startX,
                startY + i * settings.cellSize,
                width * settings.cellSize,
                settings.lineWidth,
            )
            ctx.fill()
        }
        for (let i = 0; i <= width; i++) {
            ctx.beginPath()
            ctx.rect(
                startX + i * settings.cellSize,
                startY,
                settings.lineWidth,
                height * settings.cellSize,
            )
            ctx.fill()
        }

        startX += settings.cellSize
        startY += settings.cellSize
        ctx.fillStyle = this.nextFigure.colour
        this.nextFigure.points[0].forEach(point => {
            ctx.beginPath()
            ctx.rect(
                startX + point.x * settings.cellSize + settings.lineWidth,
                startY + point.y * settings.cellSize + settings.lineWidth,
                settings.cellSize - settings.lineWidth,
                settings.cellSize - settings.lineWidth,
            )
            ctx.fill()
        })
    }
}

class Game {
    static speedList = [600, 550, 500, 450, 400, 350, 300, 250, 200, 170, 150, 130]

    constructor(gameCanvas, nextFigureCanvas) {
        this.gameCanvas = gameCanvas
        this.nextFigureCanvas = nextFigureCanvas
        this.ctx = gameCanvas.getContext('2d')
        this.nextFigureCtx = nextFigureCanvas.getContext('2d')
        this.field = new Field()

        this.speedIndex = 0
        this.score = 0

        this.tick = null

        gameCanvas.width = settings.fieldWidth * settings.cellSize + settings.lineWidth
        gameCanvas.height = settings.fieldHeight * settings.cellSize + settings.lineWidth
        nextFigureCanvas.width = nextFigureCanvas.height = 6 * settings.cellSize + settings.lineWidth

        this.#ready()
        this.#animate()
    }

    increaseScore(linesCount) {
        switch (linesCount) {
            case 1:
                this.score += 1
                break
            case 2:
                this.score += 3
                break
            case 3:
                this.score += 5
                break
            case 4:
                this.score += 8
                break
        }
    }

    increaseSpeed() {
        if (this.speedIndex + 1 < Game.speedList.length) {
            this.speedIndex++
            this.#resetTimer()
        }
    }

    start() {
        this.status = 'ACTION'
        this.#printStatistics()
        this.field.pushNextFigure()
        this.#resetTimer(this.speedIndex)
    }

    over() {
        this.status = 'OVER'
        this.#printStatistics()
        this.#stopTimer()
    }

    #ready() {
        this.status = 'READY'
        this.#printStatistics()
        this.#stopTimer()
    }

    #stopTimer() {
        clearInterval(this.tick)
    }

    #resetTimer() {
        this.#stopTimer()
        this.tick = setInterval(() => {this.#move()}, Game.speedList[this.speedIndex])
    }

    #animate() {
        this.ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)
        this.nextFigureCtx.clearRect(0, 0, this.nextFigureCanvas.width, this.nextFigureCanvas.height)
        this.field.draw(this.ctx, this.nextFigureCtx)
        requestAnimationFrame(()=>{this.#animate()})
    }

    #move() {
        this.field.moveFigureDown()
        this.#printStatistics()
    }

    #printStatistics() {
        const pointsInfo = `Score: ${this.score}`
        const nextFigureText = 'Next figure'
        let statistics, next
        switch (this.status) {
            case 'READY':
                statistics = ['Press Enter to start']
                next = [nextFigureText]
                break
            case 'ACTION':
                statistics = [pointsInfo]
                next = [nextFigureText]
                break
            case 'OVER':
                statistics = [pointsInfo, 'Press Esc to restart']
                next = [`<del>${nextFigureText}</del>`, 'Game over']
                break
        }
        const statisticsField = document.getElementById('statistics')
        statisticsField.innerHTML = statistics.join('<br />')

        const nextFigureField = document.getElementById('next-figure')
        nextFigureField.innerHTML = next.join('<br />')
    }
}

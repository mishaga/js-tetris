const gameCanvas = document.getElementById('tetris-game-canvas')
const nextFigureCanvas = document.getElementById('next-figure-canvas')

const settings = new Settings()
let game = new Game(gameCanvas, nextFigureCanvas)

document.onkeydown = event => {
    switch (game.status) {
        case 'READY':
            if (event.code === 'Enter') {
                game.start()
            }
            break
        case 'ACTION':
            if (game.field.figure) {
                switch (event.code) {
                    case 'ArrowUp':
                        game.field.rotateFigure()
                    break
                    case 'ArrowRight':
                        game.field.moveFigureRight()
                    break
                    case 'ArrowDown':
                        game.field.moveFigureDown()
                    break
                    case 'ArrowLeft':
                        game.field.moveFigureLeft()
                    break
                }
            }
            break
        case 'OVER':
        case 'WIN':
            if (event.code === 'Escape') {
                game = new Game(gameCanvas, nextFigureCanvas)
            }
            break
    }
}

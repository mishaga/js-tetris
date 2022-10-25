const game_canvas = document.getElementById('tetris-game-canvas');
const next_figure_canvas = document.getElementById('next-figure-canvas');

const settings = new Settings();
let game = new Game(game_canvas, next_figure_canvas);

document.onkeydown = event => {
    switch (game.status) {
        case 'READY':
            if (event.code === 'Enter') {
                game.start();
            }
            break;
        case 'ACTION':
            if (game.field.figure) {
                switch (event.code) {
                    case 'ArrowUp':
                        game.field.rotate_figure();
                    break;
                    case 'ArrowRight':
                        game.field.move_figure_right();
                    break;
                    case 'ArrowDown':
                        game.field.move_figure_down();
                    break;
                    case 'ArrowLeft':
                        game.field.move_figure_left();
                    break;
                }
            }
            break;
        case 'OVER':
        case 'WIN':
            if (event.code === 'Escape') {
                game = new Game(game_canvas, next_figure_canvas);
            }
            break;
    }
}

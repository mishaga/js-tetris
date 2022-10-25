class Game {
    static speed_list = [600, 550, 500, 450, 400, 350, 300, 250, 200, 170, 150, 130];

    constructor(game_canvas, next_figure_canvas) {
        this.game_canvas = game_canvas;
        this.next_figure_canvas = next_figure_canvas;
        this.ctx = game_canvas.getContext('2d');
        this.next_figure_ctx = next_figure_canvas.getContext('2d');
        this.field = new Field();

        this.speed_index = 0;
        this.score = 0;

        this.tick = null;

        game_canvas.width = settings.field_width * settings.cell_size + settings.line_width;
        game_canvas.height = settings.field_height * settings.cell_size + settings.line_width;
        next_figure_canvas.width = next_figure_canvas.height = 6 * settings.cell_size + settings.line_width;

        this.#ready();
        this.#animate();
    }

    increase_score(lines_count) {
        switch (lines_count) {
            case 1:
                this.score += 1;
                break;
            case 2:
                this.score += 3;
                break;
            case 3:
                this.score += 5;
                break;
            case 4:
                this.score += 8;
                break;
        }
    }

    increase_speed() {
        if (this.speed_index + 1 < Game.speed_list.length) {
            this.speed_index++;
            this.#reset_timer();
        }
    }

    start() {
        this.status = 'ACTION';
        this.#print_statistics();
        this.field.push_next_figure();
        this.#reset_timer(this.speed_index);
    }

    over() {
        this.status = 'OVER';
        this.#print_statistics();
        this.#stop_timer();
    }

    #ready() {
        this.status = 'READY';
        this.#print_statistics();
        this.#stop_timer();
    }

    #stop_timer() {
        clearInterval(this.tick);
    }

    #reset_timer() {
        this.#stop_timer();
        this.tick = setInterval(() => {this.#move()}, Game.speed_list[this.speed_index]);
    }

    #animate() {
        this.ctx.clearRect(0, 0, this.game_canvas.width, this.game_canvas.height);
        this.next_figure_ctx.clearRect(0, 0, this.next_figure_canvas.width, this.next_figure_canvas.height);
        this.field.draw(this.ctx, this.next_figure_ctx);
        requestAnimationFrame(()=>{this.#animate()});
    }

    #move() {
        this.field.move_figure_down();
        this.#print_statistics();
    }

    #print_statistics() {
        const points_info = `Score: ${this.score}`;
        const next_figure_text = 'Next figure';
        let statistics, next;
        switch (this.status) {
            case 'READY':
                statistics = ['Press Enter to start'];
                next = [next_figure_text];
                break;
            case 'ACTION':
                statistics = [points_info];
                next = [next_figure_text];
                break;
            case 'OVER':
                statistics = [points_info, 'Press Esc to restart'];
                next = [`<del>${next_figure_text}</del>`, 'Game over'];
                break;
        }
        const statistics_field = document.getElementById('statistics');
        statistics_field.innerHTML = statistics.join('<br />');

        const next_figure_field = document.getElementById('next-figure');
        next_figure_field.innerHTML = next.join('<br />');
    }
}

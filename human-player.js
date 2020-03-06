class HumanPlayer {
    constructor(options) {
        this.canvas = options.canvas;
        this.context = options.context;
        this.settings = options.settings;
        this.b = options.b;
        this.size = options.size;
        this.image = options.image;
        this.b.humanStones = 0;
        this.clickedI = -1;
        this.mouseX = 0;
        this.mouseY = 0;
        
        const game = this;
        this.canvas.addEventListener("mousedown", function(event) {
            if (event.defaultPrevented) {
				return;
			}
            if (game.settings.menu == false) {
                var rect = game.canvas.getBoundingClientRect();
                game.mouseX = event.clientX - rect.left;
                game.mouseY = event.clientY - rect.top;
            }
        });
    }
    
    // check if a 3 stone line has been formed
    checkWin(){
        if (this.b.state[0] == this.settings.human &&
            ((this.b.state[0] == this.b.state[1] && this.b.state[1] == this.b.state[2]) ||
            (this.b.state[0] == this.b.state[3] && this.b.state[3] == this.b.state[6]))) {
            this.b.winner = 'human';
        }
        else if (this.b.state[4] == this.settings.human &&
            ((this.b.state[0] == this.b.state[4] && this.b.state[4] == this.b.state[8]) ||
            (this.b.state[1] == this.b.state[4] && this.b.state[4] == this.b.state[7]) ||
            (this.b.state[2] == this.b.state[4] && this.b.state[4] == this.b.state[6]) ||
            (this.b.state[3] == this.b.state[4] && this.b.state[4] == this.b.state[5]))) {
            this.b.winner = 'human';
        }
        else if (this.b.state[8] == this.settings.human &&
            ((this.b.state[8] == this.b.state[5] && this.b.state[5] == this.b.state[2]) ||
            (this.b.state[8] == this.b.state[7] && this.b.state[7] == this.b.state[6]))) {
            this.b.winner = 'human';
        }
    }
    
    findHint(intersection) {
        switch (intersection) {
            case 0:
                console.log("here");
                if (this.b.state[1] == 0) {
                    this.b.state[1] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[3] == 0) {
                    this.b.state[3] = this.settings.humanHint;
                }
                break;
            case 1:
                console.log("here");
                if (this.b.state[0] == 0) {
                    this.b.state[0] = this.settings.humanHint;
                }
                if (this.b.state[2] == 0) {
                    this.b.state[2] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                break;
            case 2:
                console.log("here");
                if (this.b.state[1] == 0) {
                    this.b.state[1] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[5] == 0) {
                    this.b.state[5] = this.settings.humanHint;
                }
                break;
            case 3:
                console.log("here");
                if (this.b.state[0] == 0) {
                    this.b.state[0] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[6] == 0) {
                    this.b.state[6] = this.settings.humanHint;
                }
                break;
            case 4:
                console.log("here");
                if (this.b.state[0] == 0) {
                    this.b.state[0] = this.settings.humanHint;
                }
                if (this.b.state[1] == 0) {
                    this.b.state[1] = this.settings.humanHint;
                }
                if (this.b.state[2] == 0) {
                    this.b.state[2] = this.settings.humanHint;
                }
                if (this.b.state[3] == 0) {
                    this.b.state[3] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[5] == 0) {
                    this.b.state[5] = this.settings.humanHint;
                }
                if (this.b.state[6] == 0) {
                    this.b.state[6] = this.settings.humanHint;
                }
                if (this.b.state[7] == 0) {
                    this.b.state[7] = this.settings.humanHint;
                }
                if (this.b.state[8] == 0) {
                    this.b.state[8] = this.settings.humanHint;
                }
                break;
            case 5:
                console.log("here");
                if (this.b.state[2] == 0) {
                    this.b.state[2] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[8] == 0) {
                    this.b.state[8] = this.settings.humanHint;
                }
                break;
            case 6:
                console.log("here");
                if (this.b.state[3] == 0) {
                    this.b.state[3] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[7] == 0) {
                    this.b.state[7] = this.settings.humanHint;
                }
                break;
            case 7:
                console.log("here");
                if (this.b.state[6] == 0) {
                    this.b.state[6] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[8] == 0) {
                    this.b.state[8] = this.settings.humanHint;
                }
                break;
            case 8:
                console.log("here");
                if (this.b.state[5] == 0) {
                    this.b.state[5] = this.settings.humanHint;
                }
                if (this.b.state[4] == 0) {
                    this.b.state[4] = this.settings.humanHint;
                }
                if (this.b.state[7] == 0) {
                    this.b.state[7] = this.settings.humanHint;
                }
                break;
        }
    }
    
    // Clear all move hints on the board
    clearHints() {
        for (let i = 0; i < 9; i++) {
            if (this.b.state[i] == this.settings.humanHint) {
                this.b.state[i] = 0;
            }
        }
    }

    update() {
        if (this.b.turn == 'human'){
            if (this.mouseX != 0 || this.mouseY != 0) {
                for (let i = 0; i<this.b.intersections.length; i++) {
                    if (Math.abs(this.mouseX - this.b.intersections[i][0]) < this.b.rad &&
                        Math.abs(this.mouseY - this.b.intersections[i][1]) < this.b.rad) {
                        // if there are fewer than three stones on the board place a stone
                        if (this.b.humanStones < 3 && this.b.state[i] == 0) {
                            this.b.state[i] = this.settings.human;
                            this.b.humanStones += 1;
                            this.mouseX, this.mouseY = 0;
                            this.checkWin();
                            this.b.turn = 'bot';
                        }
                        // if there are 3 stones and a human stone is clicked clear old hints then show hints
                        else if (this.b.humanStones == 3 && this.b.state[i] == this.settings.human) {
                            this.clearHints();
                            this.clickedI = i;
                            this.findHint(i);
                            this.mouseX, this.mouseY = 0;
                        }
                        // if a hint is clicked move the clicked piece there and clear hints
                        else if (this.clickedI != -1 && this.b.state[i] == this.settings.humanHint) {
                            this.b.state[this.clickedI] = 0;
                            this.b.state[i] = this.settings.human;
                            this.clickedI = -1;
                            this.clearHints();
                            this.mouseX, this.mouseY = 0;
                            this.checkWin();
                            this.b.turn = 'bot';
                        }
                    }
                }
            }
        }
    }

    render() {

    }
}
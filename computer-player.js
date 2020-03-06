class ComputerPlayer {
    constructor(options) {
        this.canvas = options.canvas;
        this.context = options.context;
        this.settings = options.settings;
        this.b = options.b;
        this.size = options.size;
        this.image = options.image;
        this.b.botStones = 0;
    }
    
    checkWin(){
        if (this.b.state[0] == this.settings.bot &&
            ((this.b.state[0] == this.b.state[1] && this.b.state[1] == this.b.state[2]) ||
            (this.b.state[0] == this.b.state[3] && this.b.state[3] == this.b.state[6]))) {
            this.b.winner = 'bot';
        }
        else if (this.b.state[4] == this.settings.bot &&
            ((this.b.state[0] == this.b.state[4] && this.b.state[4] == this.b.state[8]) ||
            (this.b.state[1] == this.b.state[4] && this.b.state[4] == this.b.state[7]) ||
            (this.b.state[2] == this.b.state[4] && this.b.state[4] == this.b.state[6]) ||
            (this.b.state[3] == this.b.state[4] && this.b.state[4] == this.b.state[5]))) {
            this.b.winner = 'bot';
        }
        else if (this.b.state[8] == this.settings.bot &&
            ((this.b.state[8] == this.b.state[5] && this.b.state[5] == this.b.state[2]) ||
            (this.b.state[8] == this.b.state[7] && this.b.state[7] == this.b.state[6]))) {
            this.b.winner = 'bot';
        }
    }
    
    // find move adds multiple 2 length arrays to moveList
    // moveList[0] is the originating stone position and 
    // moveList[1] is the position to move to
    findMove(intersection, list) {
        switch (intersection) {
            case 0:
                console.log("here");
                if (this.b.state[1] == 0) {
                    list.push([0, 1]);
                }
                if (this.b.state[4] == 0) {
                    list.push([0, 4]);
                }
                if (this.b.state[3] == 0) {
                    list.push([0, 3]);
                }
                break;
            case 1:
                console.log("here");
                if (this.b.state[0] == 0) {
                    list.push([1, 0]);
                }
                if (this.b.state[2] == 0) {
                    list.push([1, 2]);
                }
                if (this.b.state[4] == 0) {
                    list.push([1, 4]);
                }
                break;
            case 2:
                console.log("here");
                if (this.b.state[1] == 0) {
                    list.push([2, 1]);
                }
                if (this.b.state[4] == 0) {
                    list.push([2, 4]);
                }
                if (this.b.state[5] == 0) {
                    list.push([2, 5]);
                }
                break;
            case 3:
                console.log("here");
                if (this.b.state[0] == 0) {
                    list.push([3, 0]);
                }
                if (this.b.state[4] == 0) {
                    list.push([3, 4]);
                }
                if (this.b.state[6] == 0) {
                    list.push([3, 6]);
                }
                break;
            case 4:
                console.log("here");
                if (this.b.state[0] == 0) {
                    list.push([4, 0]);
                }
                if (this.b.state[1] == 0) {
                    list.push([4, 1]);
                }
                if (this.b.state[2] == 0) {
                    list.push([4, 2]);
                }
                if (this.b.state[3] == 0) {
                    list.push([4, 3]);
                }
                if (this.b.state[4] == 0) {
                    list.push([4, 4]);
                }
                if (this.b.state[5] == 0) {
                    list.push([4, 5]);
                }
                if (this.b.state[6] == 0) {
                    list.push([4, 6]);
                }
                if (this.b.state[7] == 0) {
                    list.push([4, 7]);
                }
                if (this.b.state[8] == 0) {
                    list.push([4, 8]);
                }
                break;
            case 5:
                console.log("here");
                if (this.b.state[2] == 0) {
                    list.push([5, 2]);
                }
                if (this.b.state[4] == 0) {
                    list.push([5, 4]);
                }
                if (this.b.state[8] == 0) {
                    list.push([5, 8]);
                }
                break;
            case 6:
                console.log("here");
                if (this.b.state[3] == 0) {
                    list.push([6, 3]);
                }
                if (this.b.state[4] == 0) {
                    list.push([6, 4]);
                }
                if (this.b.state[7] == 0) {
                    list.push([6, 7]);
                }
                break;
            case 7:
                console.log("here");
                if (this.b.state[6] == 0) {
                    list.push([7, 6]);
                }
                if (this.b.state[4] == 0) {
                    list.push([7, 4]);
                }
                if (this.b.state[8] == 0) {
                    list.push([7, 8]);
                }
                break;
            case 8:
                console.log("here");
                if (this.b.state[5] == 0) {
                    list.push([8, 5]);
                }
                if (this.b.state[4] == 0) {
                    list.push([8, 4]);
                }
                if (this.b.state[7] == 0) {
                    list.push([8, 7]);
                }
                break;
        }
    }

    update() {
        if (this.b.turn == 'bot') {       
            var moveList = [];
            // if there are fewer than 3 stones, 
            // make a list of moves and choose one at random
            if (this.b.botStones < 3) {
                for (let i=0; i<this.b.state.length; i++) {
                    if (this.b.state[i] == 0) {
                        moveList.push(i);
                    }
                }
                let move = Math.floor(Math.random() * moveList.length);
                this.b.state[moveList[move]] = this.settings.bot;
                this.b.botStones += 1;
                this.checkWin();
                this.b.turn = 'human';
            }
            // otherwise if there are 3 stones, 
            // randomly choose a stone to move
            else if (this.b.botStones == 3) {
                for (let i=0; i<this.b.state.length; i++) {
                    if (this.b.state[i] == this.settings.bot) {
                        this.findMove(i, moveList);
                    }
                }
                let move = Math.floor(Math.random() * moveList.length);
                this.b.state[moveList[move][1]] = this.settings.bot;
                this.b.state[moveList[move][0]] = 0;
                this.checkWin();
                this.b.turn = 'human';
            }
        }
    }

    render() {

    }
}
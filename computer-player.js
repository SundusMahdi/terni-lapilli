class ComputerPlayer {
    constructor(options) {
        this.canvas = options.canvas;
        this.context = options.context;
        this.settings = options.settings;
        this.settings.mctSim = 100;
        this.settings.mctTimeLimit = 1000;
        this.b = options.b;
        this.size = options.size;
        this.image = options.image;
        this.b.botStones = 0;
        this.mct = {};
    }
    
    checkWin(state){
        if (state[0] == this.settings.bot &&
            ((state[0] == state[1] && state[1] == state[2]) ||
            (state[0] == state[3] && state[3] == state[6]))) {
            return 'bot';
        }
        else if (state[4] == this.settings.bot &&
            ((state[0] == state[4] && state[4] == state[8]) ||
            (state[1] == state[4] && state[4] == state[7]) ||
            (state[2] == state[4] && state[4] == state[6]) ||
            (state[3] == state[4] && state[4] == state[5]))) {
            return 'bot';
        }
        else if (state[8] == this.settings.bot &&
            ((state[8] == state[5] && state[5] == state[2]) ||
            (state[8] == state[7] && state[7] == state[6]))) {
            return 'bot';
        }
        else if (state[0] == this.settings.human &&
            ((state[0] == state[1] && state[1] == state[2]) ||
            (state[0] == state[3] && state[3] == state[6]))) {
            return 'human';
        }
        else if (state[4] == this.settings.human &&
            ((state[0] == state[4] && state[4] == state[8]) ||
            (state[1] == state[4] && state[4] == state[7]) ||
            (state[2] == state[4] && state[4] == state[6]) ||
            (state[3] == state[4] && state[4] == state[5]))) {
            return 'human';
        }
        else if (state[8] == this.settings.human &&
            ((state[8] == state[5] && state[5] == state[2]) ||
            (state[8] == state[7] && state[7] == state[6]))) {
            return 'human';
        }
        return false;
    }
    
    // find move adds multiple 2 length arrays to moveList
    // moveList[0] is the originating stone position and 
    // moveList[1] is the position to move to
    findMove(state, intersection, list) {
        switch (intersection) {
            case 0:
                if (state[1] == 0) {
                    list.push([0, 1]);
                }
                if (state[4] == 0) {
                    list.push([0, 4]);
                }
                if (state[3] == 0) {
                    list.push([0, 3]);
                }
                break;
            case 1:
                if (state[0] == 0) {
                    list.push([1, 0]);
                }
                if (state[2] == 0) {
                    list.push([1, 2]);
                }
                if (state[4] == 0) {
                    list.push([1, 4]);
                }
                break;
            case 2:
                if (state[1] == 0) {
                    list.push([2, 1]);
                }
                if (state[4] == 0) {
                    list.push([2, 4]);
                }
                if (state[5] == 0) {
                    list.push([2, 5]);
                }
                break;
            case 3:
                if (state[0] == 0) {
                    list.push([3, 0]);
                }
                if (state[4] == 0) {
                    list.push([3, 4]);
                }
                if (state[6] == 0) {
                    list.push([3, 6]);
                }
                break;
            case 4:
                if (state[0] == 0) {
                    list.push([4, 0]);
                }
                if (state[1] == 0) {
                    list.push([4, 1]);
                }
                if (state[2] == 0) {
                    list.push([4, 2]);
                }
                if (state[3] == 0) {
                    list.push([4, 3]);
                }
                if (state[4] == 0) {
                    list.push([4, 4]);
                }
                if (state[5] == 0) {
                    list.push([4, 5]);
                }
                if (state[6] == 0) {
                    list.push([4, 6]);
                }
                if (state[7] == 0) {
                    list.push([4, 7]);
                }
                if (state[8] == 0) {
                    list.push([4, 8]);
                }
                break;
            case 5:
                if (state[2] == 0) {
                    list.push([5, 2]);
                }
                if (state[4] == 0) {
                    list.push([5, 4]);
                }
                if (state[8] == 0) {
                    list.push([5, 8]);
                }
                break;
            case 6:
                if (state[3] == 0) {
                    list.push([6, 3]);
                }
                if (state[4] == 0) {
                    list.push([6, 4]);
                }
                if (state[7] == 0) {
                    list.push([6, 7]);
                }
                break;
            case 7:
                if (state[6] == 0) {
                    list.push([7, 6]);
                }
                if (state[4] == 0) {
                    list.push([7, 4]);
                }
                if (state[8] == 0) {
                    list.push([7, 8]);
                }
                break;
            case 8:
                if (state[5] == 0) {
                    list.push([8, 5]);
                }
                if (state[4] == 0) {
                    list.push([8, 4]);
                }
                if (state[7] == 0) {
                    list.push([8, 7]);
                }
                break;
        }
    }
    
    simulate(mct) {
        var turn = mct.turn.slice(0);
        var board = mct.board.slice(0);
        for (let i = 0; i < this.settings.mctSim; i++) {
            let win = this.checkWin(board);
            if (win == 'bot') {
                return 1;
            }else if (win == 'human'){
                return 0;
            }
            var moveList = [];            
            if (turn == 'bot'){
                var botStones = 0;
                for (var int in board){
                    if (int == this.settings.bot) {
                        botStones += 1;
                    }
                }
                // if there are fewer than 3 stones, 
                // make a list of moves and choose one at random
                if (botStones < 3) {
                    for (let i=0; i<board.length; i++) {
                        if (board[i] == 0) {
                            moveList.push(i);
                        }
                    }
                    let move = Math.floor(Math.random() * moveList.length);
                    board[moveList[move]] = this.settings.bot;
                    botStones += 1;
                    turn = 'human';
                }
                // otherwise if there are 3 stones, 
                // randomly choose a stone to move
                else if (botStones == 3) {
                    for (let i=0; i<board.length; i++) {
                        if (board[i] == this.settings.bot) {
                            this.findMove(board, i, moveList);
                        }
                    }
                    let move = Math.floor(Math.random() * moveList.length);
                    board[moveList[move][1]] = this.settings.bot;
                    board[moveList[move][0]] = 0;
                    let win = this.checkWin(board);
                    turn = 'human';
                }
            }else if (turn == 'human'){
                var humanStones = 0;
                for (int in board){
                    if (int == this.settings.human) {
                        humanStones += 1;
                    }
                }
                // if there are fewer than 3 stones, 
                // make a list of moves and choose one at random
                if (humanStones < 3) {
                    for (let i=0; i<board.length; i++) {
                        if (board[i] == 0) {
                            moveList.push(i);
                        }
                    }
                    let move = Math.floor(Math.random() * moveList.length);
                    board[moveList[move]] = this.settings.human;
                    humanStones += 1;
                    let win = this.checkWin(board);
                    turn = 'bot';
                }
                // otherwise if there are 3 stones, 
                // randomly choose a stone to move
                else if (humanStones == 3) {
                    for (let i=0; i<board.length; i++) {
                        if (board[i] == this.settings.human) {
                            this.findMove(board, i, moveList);
                        }
                    }
                    let move = Math.floor(Math.random() * moveList.length);
                    board[moveList[move][1]] = this.settings.human;
                    board[moveList[move][0]] = 0;
                    let win = this.checkWin(board);
                    turn = 'bot';
                }
            }
        }
        return 0;
    }
    
    updateMct(thisMct, path, win) {
        if (path.length == 0) {
            return 0;
        }else{
            thisMct.visits += 1;
            thisMct.wins += win;
            let index = path.shift();
            this.updateMct(thisMct.children[index], path, win);
        }
    }
    
    findNextMax(mct, target) {
        var maxRatio = -1;
        var maxIndex = false;
        for (var i = 0; i < mct.children.length; i++) {
            var ratio = mct.children[i].wins/mct.children[i].visits;
            if (ratio < target && ratio > maxRatio) {
                maxIndex = i;
                maxRatio = ratio;
            }
        }
        return maxIndex;
    }
    
    selectNode(mct, path) {
        if (mct.children.length == 0) {
            if (this.checkWin(mct.board)) {
                return [false, mct.wins/mct.visits];
            }else{
                mct = Object.assign({}, mct);
                return [mct, path];
            }
        }else{
            let maxIndex = this.findNextMax(mct, 1.1);
            path.push(maxIndex);
            var result = this.selectNode(mct.children[maxIndex], path);
            while (!result[0]) {
                path.pop();
                let maxIndex = this.findNextMax(mct, result[1]);
                if (!maxIndex) {
                    return [false, mct.wins/mct.visits];
                }
                path.push(maxIndex);
                result = this.selectNode(mct.children[maxIndex], path);
            }
            return result;
        }
    }
    
    update() {
        if (this.b.turn == 'bot') {  
            if (this.settings.opPolicy == "Random") {
                this.settings.opPolicy_new = false;
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
                    this.b.winner = this.checkWin(this.b.state);
                    this.b.turn = 'human';
                }
                // otherwise if there are 3 stones, 
                // randomly choose a stone to move
                else if (this.b.botStones == 3) {
                    for (let i=0; i<this.b.state.length; i++) {
                        if (this.b.state[i] == this.settings.bot) {
                            this.findMove(this.b.state, i, moveList);
                        }
                    }
                    let move = Math.floor(Math.random() * moveList.length);
                    this.b.state[moveList[move][1]] = this.settings.bot;
                    this.b.state[moveList[move][0]] = 0;
                    this.b.winner = this.checkWin(this.b.state);
                    this.b.turn = 'human';
                }
            }else if (this.settings.opPolicy == "Minimax") {
                //TODO
                
                
                
            }else if (this.settings.opPolicy == "MCTS") {
                let board = this.b.state.slice(0);
                let temp = this.b.turn.slice(0);
                this.mct = {board: board, turn: temp, visits: 1, wins: 0.5, children:[]};
                const time = Date.now();
                while ((Date.now() - time) < this.settings.mctTimeLimit) {
                    
                    // Selection
                    var mct = Object.assign({}, this.mct);
                    var path = [];
                    let selected = this.selectNode(mct, path);
                    mct = selected[0];
                    path = selected[1];
                    if (!mct) {
                        break;
                    }
                    var turn = mct.turn.slice(0);

                    // Expansion
                    var stones = 0;
                    var opponent = false;
                    if (turn == 'human'){
                        opponent = 'bot';
                    }else if (turn == 'bot') {
                        opponent = 'human';
                    }
                    for (var int in mct.board) {
                        if (mct.board[int] == this.settings[turn]) {
                            stones += 1;
                        }
                    }
                    var moveList = []; 
                    if (stones < 3) {
                        for (let i=0; i<mct.board.length; i++) {
                            if (mct.board[i] == 0) {
                                moveList.push(i);
                            }
                        }
                        for (var move in moveList) {
                            let tempBoard = mct.board.slice(0);
                            let state = {board: tempBoard, turn: opponent, visits: 1, wins: 0.6, children: []};
                            state.board[moveList[move]] = this.settings[turn];
                            mct.children.push(state);
                        }
                    }else if (stones == 3) {
                        for (let i=0; i<mct.board.length; i++) {
                            if (mct.board[i] == this.settings[turn]) {
                                this.findMove(mct.board, i, moveList);
                            }
                        }
                        for (var move in moveList) {
                            let tempBoard = mct.board.slice(0);
                            let state = {board: tempBoard, turn: opponent, visits: 1, wins: 0.6, children: []};
                            state.board[moveList[move][1]] = this.settings[turn];
                            state.board[moveList[move][0]] = 0;
                            mct.children.push(state);
                        }
                    }
                
                    // Simulation 
                    var max = 0;
                    for (let i = 0; i < mct.children.length; i++) {
                        if (mct.children[i].wins/mct.children[i].visits > 
                            mct.children[max].wins/mct.children[max].visits) {
                            max = i;
                        }
                    }
                    path.push(max);
                    mct = Object.assign({}, mct.children[max]);
                    let win = this.simulate(mct); 

                    // Backpropagation
                    this.updateMct(this.mct, path, win);
                    
                
                }
                console.log(this.mct);
                var max = 0;
                for (let i=0; i<this.mct.children.length; i++) {
                    if (this.mct.children[i].wins/this.mct.children[i].visits >
                        this.mct.children[max].wins/this.mct.children[max].visits) {
                        max = i;
                    }
                }
                this.b.state = this.mct.children[max].board;
                this.b.winner = this.checkWin(this.b.state);
                this.b.turn = 'human';
            }
        }
    }

    render() {

    }
}
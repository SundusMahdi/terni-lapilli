class Game{
    constructor(){
        
        this.canvas = document.getElementById("game");
		this.context = this.canvas.getContext("2d");
		this.objects = [];
        this.size = 0.8;
		this.lastUpdateTime = Date.now();
        this.settings = {};
        this.b = {};
        this.b.state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        
        
        const board = new Board({
            canvas: this.canvas,
            context: this.context,
            b: this.b,
            size: this.size,
            color: '#44eeff'
        });
        
        const human = new HumanPlayer({
            canvas: this.canvas,
            context: this.context,
            settings: this.settings,
            b: this.b,
            size: this.size,
            image: "pass.png"
        });
        
        const bot = new ComputerPlayer({
            canvas: this.canvas,
            context: this.context,
            settings: this.settings,
            b: this.b,
            size: this.size,
            image: "pass.png"
        });
        
        const menu = new Menu({
            canvas: this.canvas,
            context: this.context,
            settings: this.settings,
            b: this.b,
            intersections: this.intersections,
            determineP1: true
        });
        
        this.spawn(board);
        this.spawn(human);
        this.spawn(bot);
        this.spawn(menu);
        this.refresh();
    }
    
    
    spawn(obj) {
		this.objects.push(obj);
	}
    
    refresh() {
		const now = Date.now();
		const dt = ((now - this.lastUpdateTime)/10);
		if (dt >= 1){
            // Allow canvas resizing
			if (this.canvas.width != innerWidth || this.canvas.height != innerHeight){
				let oldW = innerWidth - this.canvas.width;
				let oldH = innerHeight - this.canvas.height;
				this.context.canvas.width = innerWidth;
				this.context.canvas.height = innerHeight;
			}
			
			// update objects
			this.update();
			this.lastUpdateTime = now;
		}
		this.render();
				
		const game = this;
		requestAnimationFrame(function() {
			game.refresh();
		});
	}
	
	update() {
		for (let i=0; i<this.objects.length; i++) {
			this.objects[i].update();
		}
	}
	
	render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let obj of this.objects) {
			obj.render();
		}
	}
}

class Menu{
    constructor(options) {
        this.canvas = options.canvas;
        this.context = options.context;
        this.settings = options.settings;
        this.determineP1 = options.determineP1;
        this.b = options.b;
        this.size = 0.75;
        this.windowX = 0;
        this.windowY = 0;
        this.windowW = this.canvas.width/2;
        this.windowH = this.canvas.height/4;
        this.menuMsg = "";
        this.btn1 = {};
        this.btn2 = {};
        
        this.settings.menu = 'start';
        
        const game = this;
        this.canvas.addEventListener("mouseup", function(event) {
            if (event.defaultPrevented) {
				return;
			}
            var rect = game.canvas.getBoundingClientRect();
            game.mouseX = event.clientX - rect.left;
            game.mouseY = event.clientY - rect.top;
        });
    }
    
    update() {
        if (this.b.winner) {
            this.settings.menu = 'restart';
        }
        if (this.settings.menu == 'start') {
            // Determine menu position based on canvas size
            if (this.canvas.height > this.canvas.width) {
                this.windowW = this.canvas.width*this.size;
                this.windowH = this.windowW/2;
                this.windowX = (this.canvas.width - this.windowW)/2;
                this.windowY = (this.canvas.height - this.windowH)/2;
            }else{
                this.windowW = this.canvas.height*this.size;
                this.windowH = this.windowW/2;
                this.windowX = (this.canvas.width - this.windowW)/2;
                this.windowY = (this.canvas.height - this.windowH)/2;
            }
            
            this.menuMsg = "Play first or second?";
            
            this.btn1 = {x: this.windowX+this.windowW/9, 
                     y: this.windowY+this.windowH/2, 
                     w: this.windowW/3, h: this.windowH/4,
                     msg: "First"};
            this.btn2 = {x: this.windowX+this.windowW*5/9, 
                     y: this.windowY+this.windowH/2, 
                     w: this.windowW/3, h: this.windowH/4,
                     msg: "Second"};
            
            // if menu button is pressed
            if (this.mouseX > this.btn1.x && 
                this.mouseX < this.btn1.x+this.btn1.w &&
                this.mouseY > this.btn1.y &&
                this.mouseY < this.btn1.y+this.btn1.h) {
                this.b.turn = 'human';
                this.settings.human = 'X';
                this.settings.humanHint = 'x';
                this.settings.bot = 'O';
                this.btn1 = {};
                this.btn2 = {};
                this.mouseX, this.mouseY = 0;
                this.settings.menu = false;
            }
            
            if (this.mouseX > this.btn2.x && 
                this.mouseX < this.btn2.x+this.btn2.w &&
                this.mouseY > this.btn2.y &&
                this.mouseY < this.btn2.y+this.btn2.h) {
                this.b.turn = 'bot';
                this.settings.human = 'O';
                this.settings.humanHint = 'o';
                this.settings.bot = 'X';
                this.btn1 = {};
                this.btn2 = {};
                this.mouseX, this.mouseY = 0;
                this.settings.menu = false;
            }
        }
        if (this.settings.menu == 'restart') {
            this.b.turn = false;
            this.b.humanStones = 0;
            this.b.botStones = 0;
            if (this.b.winner == 'human') {
                this.menuMsg = "You won!";
            }
            else {
                this.menuMsg = "You lost :(";
            }
            
            this.btn1 = {x: this.windowX+this.windowW/4, 
                         y: this.windowY+this.windowH/2, 
                         w: this.windowW/2, h: this.windowH/4,
                         msg: "Play again"};
            
            if (this.mouseX > this.btn1.x && 
                this.mouseX < this.btn1.x+this.btn1.w &&
                this.mouseY > this.btn1.y &&
                this.mouseY < this.btn1.y+this.btn1.h) {
                this.b.state = [0,0,0,0,0,0,0,0,0];
                this.b.winner = false;
                this.mouseX, this.mouseY = 0;
                this.settings.menu = "start";
            }
        }
    }
    
    render() {
        if (this.settings.menu) {        
            
            // menu view
            this.context.fillStyle = "#000000";
            this.context.globalAlpha = 0.3;
            this.context.fillRect(this.windowX, this.windowY, 
                                  this.windowW, this.windowH);
            this.context.globalAlpha = 1;
            let font = (Math.min(this.windowH, this.windowW)/210 * 30).toString();
            this.context.font = font+"px arial";
            this.context.fillText(this.menuMsg, 
                                  this.windowX+this.windowW/20, this.windowY+this.windowH/5);
            
            // menu button 1
            this.context.fillStyle = "#000000";
            this.context.globalAlpha = 0.3;
            this.context.fillRect(this.btn1.x, this.btn1.y, this.btn1.w, this.btn1.h);
            this.context.globalAlpha = 1;
            font = (Math.min(this.windowH, this.windowW)/210 * 30).toString();
            this.context.font = font+"px arial";
            this.context.fillText(this.btn1.msg, 
                                  this.btn1.x + this.windowW/30,
                                  this.btn1.y + this.windowH/6);
            
            // menu button 2
            if (this.btn2) {
                this.context.fillStyle = "#000000";
                this.context.globalAlpha = 0.3;
                this.context.fillRect(this.btn2.x, this.btn2.y, this.btn2.w, this.btn2.h);
                this.context.globalAlpha = 1;
                let font = (Math.min(this.windowH, this.windowW)/210 * 30).toString();
                this.context.font = font+"px arial";
                this.context.fillText(this.btn2.msg, 
                                      this.btn2.x + this.windowW/30,
                                      this.btn2.y + this.windowH/6);
            }            
        }
    }
}

class Board{
    constructor(options){
        this.canvas = options.canvas;
        this.context = options.context;
        this.b = options.b;
        this.size = options.size;
        this.color = options.color;
        this.lineWidth = 10;
        this.sideLength;
        this.x;
        this.y; 
        this.b.winner = false;
    }
    
    update(){
        // Determine board position based on canvas size
        if (this.canvas.height > this.canvas.width) {
            this.sideLength = this.canvas.width*this.size;
            this.x = (this.canvas.width - this.sideLength)/2;
            this.y = (this.canvas.height - this.sideLength)/2;
        }else{
            this.sideLength = this.canvas.height*this.size;
            this.x = (this.canvas.width - this.sideLength)/2;
            this.y = (this.canvas.height - this.sideLength)/2;
        }
        
        this.b.intersections = [
            [this.x, this.y],
            [this.x+this.sideLength/2, this.y],
            [this.x+this.sideLength, this.y],
            [this.x, this.y+this.sideLength/2],
            [this.x+this.sideLength/2, this.y+this.sideLength/2],
            [this.x+this.sideLength, this.y+this.sideLength/2],
            [this.x, this.y+this.sideLength],
            [this.x+this.sideLength/2, this.y+this.sideLength],
            [this.x+this.sideLength, this.y+this.sideLength],
        ];
        
        this.b.rad = this.sideLength/12;
    }
    
    render() {
        this.context.fillStyle = this.color;
        
        // Horizontal lines
        this.context.fillRect(this.x - this.lineWidth/2, 
                              this.y - this.lineWidth/2, 
                              this.sideLength + this.lineWidth, 
                              this.lineWidth);
        this.context.fillRect(this.x - this.lineWidth/2, 
                              this.y + this.sideLength/2 - this.lineWidth/2, 
                              this.sideLength + this.lineWidth, 
                              this.lineWidth);
        this.context.fillRect(this.x - this.lineWidth/2,
                              this.y + this.sideLength - this.lineWidth/2, 
                              this.sideLength + this.lineWidth, 
                              this.lineWidth);
        
        // Vertical lines
        this.context.fillRect(this.x - this.lineWidth/2, 
                              this.y - this.lineWidth/2, 
                              this.lineWidth, 
                              this.sideLength + this.lineWidth);
        this.context.fillRect(this.x + this.sideLength/2 - this.lineWidth/2, 
                              this.y - this.lineWidth/2, 
                              this.lineWidth, 
                              this.sideLength + this.lineWidth);
        this.context.fillRect(this.x + this.sideLength - this.lineWidth/2,
                              this.y - this.lineWidth/2,
                              this.lineWidth, 
                              this.sideLength + this.lineWidth);
        
        // Diagonal lines
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + this.sideLength, this.y + this.sideLength);
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = this.color;
        this.context.stroke();
        
        this.context.beginPath();
        this.context.moveTo(this.x, this.y + this.sideLength);
        this.context.lineTo(this.x + this.sideLength, this.y);
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = this.color;
        this.context.stroke();
        
        // Draw pieces
        for (let i = 0; i<this.b.state.length; i++) {
            if (this.b.state[i] == 'X') {
                this.context.beginPath();
                this.context.arc(this.b.intersections[i][0], 
                                 this.b.intersections[i][1], 
                                 this.sideLength/16, 0, 2 * Math.PI);
                this.context.lineWidth = 5;
                this.context.strokeStyle = "#444444"
                this.context.fillStyle = '#111111';
                this.context.fill();
                this.context.stroke();
            } else if (this.b.state[i] == 'O') {
                this.context.beginPath();
                this.context.arc(this.b.intersections[i][0], 
                                 this.b.intersections[i][1], 
                                 this.sideLength/16, 0, 2 * Math.PI);
                this.context.lineWidth = 5;
                this.context.strokeStyle = "#cccccc"
                this.context.fillStyle = '#eeeeee';
                this.context.fill();
                this.context.stroke();
            } else if (this.b.state[i] == 'x') {
                this.context.beginPath();
                this.context.arc(this.b.intersections[i][0], 
                                 this.b.intersections[i][1], 
                                 this.sideLength/16, 0, 2 * Math.PI);
                this.context.lineWidth = 5;
                this.context.globalAlpha = 0.5;
                this.context.strokeStyle = "#444444"
                this.context.fillStyle = '#111111';
                this.context.fill();
                this.context.stroke();
                this.context.globalAlpha = 1;
            } else if (this.b.state[i] == 'o') {
                this.context.beginPath();
                this.context.arc(this.b.intersections[i][0], 
                                 this.b.intersections[i][1], 
                                 this.sideLength/16, 0, 2 * Math.PI);
                this.context.lineWidth = 5;
                this.context.globalAlpha = 0.5;
                this.context.strokeStyle = "#cccccc"
                this.context.fillStyle = '#eeeeee';
                this.context.fill();
                this.context.stroke();
                this.context.globalAlpha = 1;
            }
        }
    }
}

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

    update() {
        if (this.b.turn == 'human'){
            if (this.mouseX != 0 || this.mouseY != 0) {
                for (let i = 0; i<this.b.intersections.length; i++) {
                    if (Math.abs(this.mouseX - this.b.intersections[i][0]) < this.b.rad &&
                        Math.abs(this.mouseY - this.b.intersections[i][1]) < this.b.rad) {
                        if (this.b.humanStones < 3 && this.b.state[i] == 0) {
                            this.b.state[i] = this.settings.human;
                            this.b.humanStones += 1;
                            this.mouseX, this.mouseY = 0;
                            this.checkWin();
                            this.b.turn = 'bot';
                        }
                        else if (this.b.humanStones == 3 && this.b.state[i] == this.settings.human) {
                            for (let i = 0; i < 9; i++) {
                                if (this.b.state[i] == this.settings.humanHint) {
                                    this.b.state[i] = 0;
                                }
                            }
                            this.clickedI = i;
                            this.findHint(i);
                            this.mouseX, this.mouseY = 0;
                        }
                        else if (this.clickedI != -1 && this.b.state[i] == this.settings.humanHint) {
                            this.b.state[this.clickedI] = 0;
                            this.b.state[i] = this.settings.human;
                            this.clickedI = -1;
                            for (let i = 0; i < 9; i++) {
                                if (this.b.state[i] == this.settings.humanHint) {
                                    this.b.state[i] = 0;
                                }
                            }
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
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
        this.size = 0.75;
        this.windowX = 0;
        this.windowY = 0;
        this.windowW = this.canvas.width/2;
        this.windowH = this.canvas.height/4;
        this.btn1 = {};
        this.btn2 = {};
        
        this.settings.menu = this.determineP1;
        
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
        if (this.settings.menu) {
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
            this.btn1 = {x: this.windowX+this.windowW/9, 
                         y: this.windowY+this.windowH/2, 
                         w: this.windowW/3, h: this.windowH/4}
            
            this.btn2 = {x: this.windowX+this.windowW*5/9, 
                         y: this.windowY+this.windowH/2, 
                         w: this.windowW/3, h: this.windowH/4}
            
            // if menu button is pressed
            if (this.mouseX > this.btn1.x && 
                this.mouseX < this.btn1.x+this.btn1.w &&
                this.mouseY > this.btn1.y &&
                this.mouseY < this.btn1.y+this.btn1.h) {
                this.settings.turn = 'human';
                this.settings.human = 'X';
                this.settings.bot = 'O';
                this.settings.menu = false;
            }
            
            if (this.mouseX > this.btn2.x && 
                this.mouseX < this.btn2.x+this.btn2.w &&
                this.mouseY > this.btn2.y &&
                this.mouseY < this.btn2.y+this.btn2.h) {
                this.settings.turn = 'bot';
                this.settings.human = 'O';
                this.settings.bot = 'X';
                this.settings.menu = false;
            }
        }
    }
    
    render() {
        if (this.settings.menu) {        
            this.context.fillStyle = "#000000";
            this.context.globalAlpha = 0.3;
            
            // menu view
            this.context.fillRect(this.windowX, this.windowY, 
                                  this.windowW, this.windowH);
            
            // menu buttons
            this.context.fillRect(this.btn1.x, this.btn1.y, this.btn1.w, this.btn1.h);
            this.context.fillRect(this.btn2.x, this.btn2.y, this.btn2.w, this.btn2.h);
            
            // menu text
            this.context.globalAlpha = 1;
            let font = (Math.min(this.windowH, this.windowW)/210 * 30).toString();
            this.context.font = font+"px arial";
            this.context.fillText("Play first or second?", 
                                  this.windowX+this.windowW/20, this.windowY+this.windowH/5);
            this.context.fillText("First", 
                                  this.windowX+this.windowW/9+this.windowW/30,
                                  this.windowY+this.windowH/2+this.windowH/6);
            this.context.fillText("Second", 
                                  this.windowX+this.windowW*5/9+this.windowW/30,
                                  this.windowY+this.windowH/2+this.windowH/6);
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
        this.positions = [];
        this.hint = false;
        this.clicked = false;
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

    update() {
        if (this.settings.turn == 'human'){
            
            for (let i = 0; i<this.b.intersections.length; i++) {
                if (Math.abs(this.mouseX - this.b.intersections[i][0]) < this.b.rad &&
                    Math.abs(this.mouseY - this.b.intersections[i][1]) < this.b.rad &&
                    this.b.state[i] == 0){
                        this.b.state[i] = this.settings.human;
                        this.mouseX, this.mouseY = 0
                        this.settings.turn = 'bot';
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
        this.positions = [];
        this.hint = false;
    }

    update() {
        if (this.settings.turn == 'bot') {
            
            var moveList = [];
            for (let i=0; i<this.b.state.length; i++) {
                if (this.b.state[i] == 0) {
                    console.log("working");
                    moveList.push(i);
                }
            }
            let move = Math.floor(Math.random() * moveList.length);
            this.b.state[moveList[move]] = this.settings.bot;
            this.settings.turn = 'human';
        }
    }

    render() {

    }
}
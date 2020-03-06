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
    
    // Determine menu position based on canvas size
    positionMenu() {
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
    }
    
    // Check for button press
    btnPressed(btn) {
        if (this.mouseX > btn.x && 
            this.mouseX < btn.x+btn.w &&
            this.mouseY > btn.y &&
            this.mouseY < btn.y+btn.h) {
            return true;
        }else{
            return false;
        }
    }
    
    update() {
        if (this.b.winner) {
            this.settings.menu = 'restart';
        }
        if (this.settings.menu == 'start') {
            // Determine menu position based on canvas size
            this.positionMenu();
            this.menuMsg = "Play first or second?";
            
            // Set buttons
            this.btn1 = {x: this.windowX+this.windowW/9, 
                     y: this.windowY+this.windowH/2, 
                     w: this.windowW/3, h: this.windowH/4,
                     msg: "First"};
            this.btn2 = {x: this.windowX+this.windowW*5/9, 
                     y: this.windowY+this.windowH/2, 
                     w: this.windowW/3, h: this.windowH/4,
                     msg: "Second"};
            
            // if menu button is pressed
            if (this.btnPressed(this.btn1)) {
                this.b.turn = 'human';
                this.settings.human = 'X';
                this.settings.humanHint = 'x';
                this.settings.bot = 'O';
                this.btn1 = {};
                this.btn2 = {};
                this.mouseX, this.mouseY = 0;
                this.settings.menu = false;
            }
            
            if (this.btnPressed(this.btn2)) {
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
            this.positionMenu();
            this.b.turn = false;
            this.b.humanStones = 0;
            this.b.botStones = 0;
            if (this.b.winner == 'human') {
                this.menuMsg = "You won!";
            }
            else {
                this.menuMsg = "You lost :(";
            }
            
            // set button values
            this.btn1 = {x: this.windowX+this.windowW/4, 
                         y: this.windowY+this.windowH/2, 
                         w: this.windowW/2, h: this.windowH/4,
                         msg: "Play again"};
            
            if (this.btnPressed(this.btn1)) {
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
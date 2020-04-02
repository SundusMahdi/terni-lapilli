class Menu{
    constructor(options) {
        this.canvas = options.canvas;
        this.context = options.context;
        this.settings = options.settings;
        this.settings.opPolicy = 'Random';
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
        this.policyMenu_active = false;
        this.policyMenu_w = 0;
        this.policyMenu_h = 0;
        this.policyMenu_pullTab = {x: 0, y: 0};
        this.policyMenu_box = [{id:'Random', x:0, y:0, w:0, h:0},
                               {id:'Minimax', x:0, y:0, w:0, h:0},
                               {id:'MCTS', x:0, y:0, w:0, h:0}];
        this.longScreen = false;
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
            this.longScreen = true;
            this.policyMenu_w = this.canvas.width;
            if (this.policyMenu_active){
                this.policyMenu_h = this.canvas.width/4;
                this.policyMenu_pullTab = {x: 0, y: this.policyMenu_h, w: this.canvas.width, h: 30};
                let yOffset = (Math.min(this.windowH, this.windowW)/210 * 20);
                let boxSide = this.policyMenu_h - 20 - yOffset;
                this.policyMenu_box = [{id:'Random', x:10, y:10+yOffset, 
                                        w:boxSide, h:boxSide},
                                       {id:'Minimax', x:20 + boxSide, y:10+yOffset, 
                                        w:boxSide, h:boxSide},
                                       {id:'MCTS', x:30 + 2*boxSide, y:10+yOffset, 
                                        w:boxSide , h:boxSide}];

            }else{
                this.policyMenu_h = 0;
                this.policyMenu_pullTab = {x: 0, y: 0, w: this.canvas.width, h: 30};
                let boxSide = this.policyMenu_h - 20;
                this.policyMenu_box = [{id:'Random', x:10, y:10, 
                                        w:0, h:0},
                                       {id:'Minimax', x:20 + boxSide, y:10, 
                                        w:0, h:0},
                                       {id:'MCTS', x:30 + 2*boxSide, y:10, 
                                        w:0, h:0}];
            }
        }else{
            this.windowW = this.canvas.height*this.size;
            this.windowH = this.windowW/2;
            this.windowX = (this.canvas.width - this.windowW)/2;
            this.windowY = (this.canvas.height - this.windowH)/2;
            this.longScreen = false;
            this.policyMenu_h = this.canvas.height;
            if (this.policyMenu_active){
                this.policyMenu_w = this.canvas.height/4;
                this.policyMenu_pullTab = {x: this.policyMenu_w, y: 0, w: 30, h: this.canvas.height};
                let boxSide = this.policyMenu_w - 20;
                let yOffset = (Math.min(this.windowH, this.windowW)/210 * 40);
                this.policyMenu_box = [{id:'Random', x:10, y:10 + yOffset, 
                                        w:boxSide, h:boxSide},
                                       {id:'Minimax', x:10, y:20 + boxSide + yOffset, 
                                        w:boxSide, h:boxSide},
                                       {id:'MCTS', x:10, y:30 + 2*boxSide + yOffset, 
                                        w:boxSide, h:boxSide}];
            }else{
                this.policyMenu_w = 0;
                this.policyMenu_pullTab = {x: 0, y: 0, w: 30, h: this.canvas.height};
                let boxSide = this.policyMenu_w - 20;
                this.policyMenu_box = [{id:'Random', x:10, y:10, 
                                        w:0, h:0},
                                       {id:'Minimax', x:10, y:20 + boxSide, 
                                        w:0, h:0},
                                       {id:'MCTS', x:10, y:30 + 2*boxSide, 
                                        w:0, h:0}];
            }
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
        // Determine menu position based on canvas size
        this.positionMenu();
        
        if (this.b.winner) {
            this.settings.menu = 'restart';
        }
        if (this.settings.menu == 'start') {
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
                         y: this.windowY+this.windowH/1.5, 
                         w: this.windowW/2, h: this.windowH/4,
                         msg: "Play again"};
            
            if (this.btnPressed(this.btn1)) {
                this.b.state = [0,0,0,0,0,0,0,0,0];
                this.b.winner = false;
                this.mouseX, this.mouseY = 0;
                this.settings.menu = "start";
            }
        }
        if (this.btnPressed(this.policyMenu_pullTab)) {
            // policy menu hidden
            if (!this.policyMenu_active) {
                // on long screen
                if (this.longScreen) {
                    this.policyMenu_pullTab.y = 100;
                    this.policyMenu_h = 100;
                    this.policyMenu_active = true;
                // on wide screen
                }else{
                    this.policyMenu_pullTab.x = 100;
                    this.policyMenu_w = 100;
                    this.policyMenu_active = true;
                }
            // policy menu shown
            }else{
                // on long screen
                if (this.longScreen) {
                    this.policyMenu_pullTab.y = 0;
                    this.policyMenu_h = 0;
                    this.policyMenu_active = false;
                // on wide screen
                }else{
                    this.policyMenu_pullTab.x = 0;
                    this.policyMenu_w = 0;
                    this.policyMenu_active = false;
                }
            }
            this.mouseX, this.mouseY = 0;
        }
        for (let i = 0; i<this.policyMenu_box.length; i++) {
            if (this.btnPressed(this.policyMenu_box[i])) {
                if (this.settings.opPolicy != this.policyMenu_box[i].id) {
                    this.settings.opPolicy = this.policyMenu_box[i].id;
                    this.settings.opPolicy_new = true;
                }
            }
        }
    }
    
    render() {
        // draw policy menu
        this.context.fillStyle = "#000000";
        // policy menu body
        this.context.globalAlpha = 1;
        let font = (Math.min(this.windowH, this.windowW)/210 * 20).toString();
        this.context.font = font+"px arial";
        if (this.policyMenu_active && this.longScreen){
            this.context.fillText("Opponent Move Policy", this.windowW/40, this.windowH/10);
        }else if (this.policyMenu_active && !this.longScreen) {
            this.context.fillText("Opponent", this.windowW/40, this.windowH/10);
            this.context.fillText("Move Policy", this.windowW/40, this.windowH/5);
        }
        // Pulltab arrow
        if (this.longScreen && this.policyMenu_active) {
            this.context.beginPath();
            this.context.moveTo(this.canvas.width/2 - 10, this.policyMenu_h + 20);
            this.context.lineTo(this.canvas.width/2, this.policyMenu_h + 10);
            this.context.lineWidth = 3;
            this.context.strokeStyle = '#000000';
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(this.canvas.width/2, this.policyMenu_h + 10);
            this.context.lineTo(this.canvas.width/2 + 10, this.policyMenu_h + 20);
            this.context.stroke();
        }else if (this.longScreen && !this.policyMenu_active) {
            this.context.beginPath();
            this.context.moveTo(this.canvas.width/2 - 10, this.policyMenu_h + 10);
            this.context.lineTo(this.canvas.width/2, this.policyMenu_h + 20);
            this.context.lineWidth = 3;
            this.context.strokeStyle = '#000000';
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(this.canvas.width/2, this.policyMenu_h + 20);
            this.context.lineTo(this.canvas.width/2 + 10, this.policyMenu_h + 10);
            this.context.stroke();
        }else if (!this.longScreen && this.policyMenu_active){
            this.context.beginPath();
            this.context.moveTo(this.policyMenu_w + 20, this.canvas.height/2-10);
            this.context.lineTo(this.policyMenu_w + 10, this.canvas.height/2);
            this.context.lineWidth = 3;
            this.context.strokeStyle = '#000000';
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(this.policyMenu_w + 10, this.canvas.height/2);
            this.context.lineTo(this.policyMenu_w + 20, this.canvas.height/2+10);
            this.context.stroke();
        }else if (!this.longScreen && !this.policyMenu_active){
            this.context.beginPath();
            this.context.moveTo(this.policyMenu_w + 10, this.canvas.height/2-10);
            this.context.lineTo(this.policyMenu_w + 20, this.canvas.height/2);
            this.context.lineWidth = 3;
            this.context.strokeStyle = '#000000';
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(this.policyMenu_w + 20, this.canvas.height/2);
            this.context.lineTo(this.policyMenu_w + 10, this.canvas.height/2+10);
            this.context.stroke();
        }     
        this.context.globalAlpha = 0.3;
        this.context.fillRect(0, 0, this.policyMenu_w, this.policyMenu_h);
        // policy menu boxes
        for (let i = 0; i<this.policyMenu_box.length; i++) {
            if (this.settings.opPolicy == this.policyMenu_box[i].id) {
                this.context.globalAlpha = 0.6;
            }
            this.context.fillRect(this.policyMenu_box[i].x, this.policyMenu_box[i].y,
                                  this.policyMenu_box[i].w, this.policyMenu_box[i].h);
            if (this.policyMenu_active) {
                this.context.globalAlpha = 1;
                let font = (Math.min(this.windowH, this.windowW)/210 * 17).toString();
                this.context.font = font+"px arial";
                this.context.fillText(this.policyMenu_box[i].id, 
                                      this.policyMenu_box[i].x+this.windowW/40, 
                                      this.policyMenu_box[i].y+this.windowH/10);
            }
            this.context.globalAlpha = 0.3;
        }
        // policy menu pulltab
        this.context.globalAlpha = 0.5;
        this.context.fillRect(this.policyMenu_pullTab.x, this.policyMenu_pullTab.y, 
                              this.policyMenu_pullTab.w, this.policyMenu_pullTab.h);
        this.context.globalAlpha = 1;
        
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
class Game{
    constructor(){
        
        this.canvas = document.getElementById("game");
		this.context = this.canvas.getContext("2d");
		this.objects = [];
        this.size = 0.8;
		this.lastUpdateTime = Date.now();
        
        const board = new Board({
            canvas: this.canvas,
            context: this.context,
            size: this.size,
            color: '#44eeff'
        });
        
        this.spawn(board);
        this.refresh();
    }
    
    spawn(obj) {
        
		this.objects.push(obj);
	}
    
    refresh(){
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
		for (let obj of this.objects) {
			obj.render();
		}
	}
}

class Board{
    constructor(options){
        this.canvas = options.canvas;
        this.context = options.context;
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
    }
    
    render() {
        this.context.fillStyle = this.color;
        
        // Horizontal lines
        console.log(this.x+" "+this.y);
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
    }
}
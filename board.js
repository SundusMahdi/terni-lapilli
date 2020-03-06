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

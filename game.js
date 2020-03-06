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
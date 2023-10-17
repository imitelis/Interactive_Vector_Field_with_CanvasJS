let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

const mouse = {
	x: null,
	y: null,
}

window.onload = function(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
	flowField.animate(0);
}

window.addEventListener('resize', function(){
	cancelAnimationFrame(flowFieldAnimation)
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
	flowField.animate(0);
})

window.addEventListener('mousemove', function(e){
	mouse.x = e.x;
	mouse.y = e.y;
})

window.addEventListener('mouseout', function() {
	mouse.x = null;
	mouse.y = null;
});

class FlowFieldEffect {
	constructor(ctx, width, height){
		this.ctx = ctx;
		this.ctx.lineWidth = 0.5;
		this.width = width;
		this.height = height;
		this.lastTime = 0;
		this.interval = 1000/60;
		this.timer = 0;
		this.cellSize = 10;
		this.gradient;
		this.createGradient();
		this.ctx.strokeStyle = this.gradient;
		this.radius = 0;
		this.vr = 0.05;
	}
	createGradient(){
		this.gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
		this.gradient.addColorStop("0.1", "#FF5C33");
		this.gradient.addColorStop("0.2", "#FF66B3");
		this.gradient.addColorStop("0.4", "#CCCCFF");
		this.gradient.addColorStop("0.6", "#B3FFFF");
		this.gradient.addColorStop("0.8", "#80FF80");
		this.gradient.addColorStop("0.9", "#FFFF33");
	}
	drawLine(angle, x, y) {
		let positionX = x;
		let positionY = y;
		let dx = mouse.x - positionX;
		let dy = mouse.y - positionY;
		let distance = dx * dx + dy * dy;
		if (distance > 600000) distance = 600000;
		else if (distance < 50000) distance = 50000;
		let length = distance * 0.0001;
		if (mouse.x == null || mouse.y == null) length = 24;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
		this.ctx.stroke();
	}
	animate(timeStamp){
		const deltaTime = timeStamp - this.lastTime;
		this.lastTime = timeStamp;
		if (this.timer > this.interval){
			this.ctx.clearRect(0, 0, this.width, this.height);
			this.radius += this.vr;
			if (this.radius > 16 || this.radius < - 16) this.vr *= -1;
			for (let y = 0; y < this.height; y += this.cellSize){
				for (let x = 0; x < this.width; x += this.cellSize){
					let angle = (Math.cos(mouse.x * x * 0.00001) + Math.sin(mouse.y * y * 0.00001)) * this.radius;
					if (mouse.x == null || mouse.y == null) angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius;
					this.drawLine(angle, x, y);
				}
			}

			this.timer = 0;
		} else {
			this.timer += deltaTime;
		}	
		
		flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
	}
}
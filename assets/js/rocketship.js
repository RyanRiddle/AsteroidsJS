function RocketShip(){
	this.position = new Coordinate(canvas.width/2, canvas.height/2);
	this.velocity = 0.0;
	this.velAng = 0.0;
	this.acceleration=0.0;
	this.theta = 0.0;
	this.leftWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+(-1*Math.PI/6.0))), this.position.y+(50*Math.sin(this.theta+(-1*Math.PI/6.0))));
	this.rightWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+Math.PI/6.0)), this.position.y+(50*Math.sin(this.theta+Math.PI/6.0)));
		
}

RocketShip.prototype = {

	update: function() {
		var vx = this.velocity * Math.cos(this.velAng);
		var vy = this.velocity * Math.sin(this.velAng);
		var ax = this.acceleration * Math.cos(this.theta);
		var ay = this.acceleration * Math.sin(this.theta);
		vx += ax;
		vy += ay;
		this.velocity = Math.sqrt( Math.pow(vx, 2) + Math.pow(vy, 2) );
		this.velAng = Math.atan2(vy,vx);
			
		if( this.position.x < 0 ){
			this.position.x = canvas.width;
		}
		else if( this.position.x > canvas.width ){
			this.position.x = 0;
		}
		if( this.position.y < 0 ){
			this.position.y = canvas.height;
		}
		else if (this.position.y > canvas.height ){
			this.position.y = 0;
		}
			
		this.position.x += Math.cos(this.velAng)*this.velocity;
		this.position.y += Math.sin(this.velAng)*this.velocity;
		this.leftWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+(-1*Math.PI/6.0))), this.position.y+(50*Math.sin(this.theta+(-1*Math.PI/6.0))));
		this.rightWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+Math.PI/6.0)), this.position.y+(50*Math.sin(this.theta+Math.PI/6.0)));
	},
	
	fire: function(){
		var bullet = new Bullet(rocket.position.x, rocket.position.y, rocket.theta+Math.PI, 30+rocket.velocity);
		bullets.push(bullet);
		game.points--;
		
	},


	draw: function(context)
	{
		rocket.update();
		context.fillStyle = 'white';
		context.beginPath();
		context.moveTo(rocket.leftWing.getX(), rocket.leftWing.getY());
		context.lineTo(rocket.position.getX(), rocket.position.getY());
		context.lineTo(rocket.rightWing.getX(), rocket.rightWing.getY());
		context.strokeStyle = 'white';
		context.stroke();

	},
	report: function()
	{
		var posString = "(" + rocket.position.x + ", " + rocket.position.y + ")";
		var velString = rocket.velocity + " " + rocket.velAng;
		var accelString = rocket.acceleration + " " + rocket.theta;
		
		context.fillText(posString, 100, 100);
		context.fillText(velString, 100, 200);
		context.fillText(accelString, 100, 300);
	},
};

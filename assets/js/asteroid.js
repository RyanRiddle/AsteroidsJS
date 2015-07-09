
function Asteroid(anX, anY, aR, aTheta, aVelocity){
	this.x = typeof anX !== 'undefined' ? anX : 0;
	this.y = typeof anY !== 'undefined' ? anY : 0;
	this.radius = typeof aR !== 'undefined' ? aR : 1;
	this.thetaDirection = typeof aTheta !== 'undefined' ? aTheta : 0.0;
	this.velocity = typeof aVelocity !== 'undefined' ? aVelocity : 0.0;
};

Asteroid.prototype = 
{
	update: function()
	{
		if (this.x < 0 ){
			this.x = canvas.width;
		}
		else if (this.x > canvas.width){
			this.x = 0;
		}
		if(this.y > canvas.height ){
			this.y = 0;
		}
		else if (this.y < 0){
			this.y = canvas.height;
		}
		this.x += Math.cos(this.thetaDirection)*this.velocity;
		this.y += Math.sin(this.thetaDirection)*this.velocity;
	},
};

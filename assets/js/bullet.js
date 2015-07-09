function Bullet(anX, anY, aTheta, aVelocity)
{
	this.x = typeof anX !== 'undefined' ? anX : 0;
	this.y = typeof anY !== 'undefined' ? anY : 0;
	this.radius = 10;
	this.thetaDirection = typeof aTheta !== 'undefined' ? aTheta : 0;
	this.velocity = typeof aVelocity !== 'undefined' ? aVelocity : 0;
};

Bullet.prototype = 
{
	update: function()
	{
		this.x += Math.cos(this.thetaDirection)*this.velocity;
		this.y += Math.sin(this.thetaDirection)*this.velocity;
	},
};

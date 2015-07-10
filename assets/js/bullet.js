function Bullet(anX, anY, aTheta, aVelocity)
{
	Circle.call(this, anX, anY, 10);
	this.thetaDirection = typeof aTheta !== 'undefined' ? aTheta : 0;
	this.velocity = typeof aVelocity !== 'undefined' ? aVelocity : 0;
};

Bullet.prototype = Object.create(Circle.prototype,
{
	update: {
		value: function()
		{
			this.x += Math.cos(this.thetaDirection)*this.velocity;
			this.y += Math.sin(this.thetaDirection)*this.velocity;
		},
	},
});

Bullet.prototype.constructor = Bullet;

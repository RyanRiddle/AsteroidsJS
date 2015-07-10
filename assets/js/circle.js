function Circle(x, y, r)
{
	this.x = x;
	this.y = y;
	this.r = r;
}

Circle.prototype = {
	draw: function(canvasContext)
	{
		canvasContext.beginPath();
		canvasContext.arc(this.x, this.y, this.r, 2*Math.PI, false);
		canvasContext.strokeStyle = 'white';
		canvasContext.lineWidth = 1;
		canvasContext.stroke();
	},
};

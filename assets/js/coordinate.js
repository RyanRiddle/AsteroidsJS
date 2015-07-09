function Coordinate( anX, anY ){
	this.x = typeof anX !== 'undefined' ? anX : 0;
	this.y = typeof anY !== 'undefined' ? anY : 0;
};

Coordinate.prototype = 
{
	getX: function() 
	{ 
		return this.x; 
	},
	getY: function()
	{ 
		return this.y; 
	}
};

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const FIRE = 70;

var keyState = {};

function GameState(){
	this.lives = 3;
	this.collisionDetectionOn = true;
	this.regenerateTime = 0;
	this.points = 0;
}

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

function RocketShip(){
	this.position = new Coordinate(500,500);
	this.velocity = 0.0;
	this.velAng = 0.0;
	this.acceleration=0.0;
	this.theta = 0.0;
	this.leftWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+(-1*Math.PI/6.0))), this.position.y+(50*Math.sin(this.theta+(-1*Math.PI/6.0))));
	this.rightWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+Math.PI/6.0)), this.position.y+(50*Math.sin(this.theta+Math.PI/6.0)));
	this.update = update;
	function update() {
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
	}
	this.fire = fire;
	function fire(){
		var bullet = new Bullet(rocket.position.x, rocket.position.y, rocket.theta+Math.PI, 10+rocket.velocity);
		bullets.push(bullet);
		game.points--;
		
	}	
		
}

populateAsteroids = function(){
	var r = 100;
	for( var i = 1; i <= 4; i++ ){
		var tempAst = new Asteroid(i*100, i*100, r, i*Math.PI/4, 1.0);
		asteroids.push(tempAst);
	}
}

drawCircle = function(x, y, r){
	context.beginPath();
	context.arc(x, y, r, 2*Math.PI, false);
	context.strokeStyle = 'white';
	context.lineWidth = 1;
	context.stroke();
}

drawAsteroids = function(){
	for( var i = 0; i < asteroids.length; i++ ){
		if (typeof asteroids[i] === 'undefined')
			continue;
		asteroids[i].update();
		drawCircle(asteroids[i].x, asteroids[i].y, asteroids[i].radius);
	}
}

drawBullet = function(){
	for( var i = 0; i < bullets.length; i++ ){
		var bullet = bullets[i];
		if( typeof bullet !== 'undefined' ){
			if( bullet.x > canvas.width + 10 || bullet.x < -10 || bullet.y > canvas.height + 10 || bullet.y < -10)
			{
				delete bullet[i];
				continue;
			}	
			bullet.update();
			if( typeof bullet !== 'undefined' ){
				drawCircle(bullet.x, bullet.y, 10);
			}
		}
	}
}
	

drawRocket = function(){
	context.clearRect(0,0,canvas.width, canvas.height);
	context.fillStyle = 'white';
	var posString = "(" + rocket.position.x + ", " + rocket.position.y + ")";
	var velString = rocket.velocity + " " + rocket.velAng;
	var accelString = rocket.acceleration + " " + rocket.theta;
	var strDirections = "Directions: arrow keys move, f key fires.";
	context.font="20px Arial";
	context.fillText( "Lives: " + game.lives, 100, 20 );
	context.fillText( "Points: " + game.points, 300, 20 );
	context.fillText( strDirections, 500, 20 );
	//context.fillText(posString, 100, 100);
	//context.fillText(velString, 100, 200);
	//context.fillText(accelString, 100, 300);
	rocket.update();
	context.beginPath();
	context.moveTo(rocket.leftWing.getX(), rocket.leftWing.getY());
	context.lineTo(rocket.position.getX(), rocket.position.getY());
	context.lineTo(rocket.rightWing.getX(), rocket.rightWing.getY());
	context.strokeStyle = 'white';
	context.stroke();

}

checkCollisions = function(){
	for( var i = 0; i < asteroids.length; i++ ){
		var ast = asteroids[i];
		if( typeof ast !== 'undefined' ){
			var dist1 = Math.sqrt(Math.pow(ast.x-rocket.position.x, 2) + Math.pow(ast.y-rocket.position.y, 2));
			var dist2 = Math.sqrt(Math.pow(ast.x-rocket.leftWing.x, 2) + Math.pow(ast.y-rocket.leftWing.y, 2));
			var dist3 = Math.sqrt(Math.pow(ast.x-rocket.rightWing.x, 2) + Math.pow(ast.y-rocket.rightWing.y, 2));
			if (dist1 < ast.radius || dist2 < ast.radius || dist3 < ast.radius)
			{
				rocketShipAsteroidCollision(rocket, ast);
				delete asteroids[i];
				break;
			}
			for( var j = 0; j < bullets.length; j++ ){
				var bullet = bullets[j];
				if (typeof bullet !== 'undefined' )
				{
					var dist = Math.sqrt(Math.pow(ast.x-bullet.x, 2) + Math.pow(ast.y-bullet.y, 2));
					if( dist < bullet.radius + ast.radius ){
						bulletAsteroidCollision(bullet, ast);
						delete asteroids[i];
						delete bullets[j];
						break;
					}
				}
			}
		}
	}
}

collide = function( obj1, obj2 )
{
	if (Object.getPrototypeOf(obj1) === Bullet.prototype && Object.getPrototypeOf(obj2) === Asteroid.prototype)
		bulletAsteroidCollision(obj1, obj2);
	else if (Object.getPrototypeOf(obj1) === RocketShip.prototype && Object.getPrototypeOf(obj2) === Asteroid.prototype)
		rocketShipAsteroidCollision(obj1, obj2);
}

bulletAsteroidCollision = function(bullet, asteroid)
{
	awardPoints(asteroid.radius);
	if (asteroid.radius > 25)
	{
		var leftHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.radius/2, Math.random()*Math.PI, asteroid.velocity);
		var rightHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.radius/2, Math.random()*Math.PI, asteroid.velocity);
		asteroids.push(leftHalf);
		asteroids.push(rightHalf);
	}
}

awardPoints = function(asteroidRadius)
{
	if(asteroidRadius === 100)
		game.points += 25;
	else if(asteroidRadius === 50)
		game.points += 50;
	else	//asteroidRadius === 25
		game.points += 100;
}

rocketShipAsteroidCollision = function(rocketShip, asteroid)
{
	if (asteroid.radius > 25)
	{
		var leftHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.radius/2, Math.random()*Math.PI, asteroid.velocity);
		var rightHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.radius/2, Math.random()*Math.PI, asteroid.velocity);
		asteroids.push(leftHalf);
		asteroids.push(rightHalf);
	}
	game.lives--;
	game.collisionDetectionOn = false;
	game.regenerateTime = 250;
	rocket = new RocketShip();
}

function handleInput(){
	if( keyState[LEFT] ){
		rocket.theta -= Math.PI/180.0;
	}
	if ( keyState[RIGHT] ){
		rocket.theta += Math.PI/180.0;
	}
	if ( keyState[UP] == true ){
		rocket.acceleration -= 0.0005;
	}
	if ( keyState[DOWN] == true ){
		rocket.acceleration += 0.0005;
	}
	if ( keyState[FIRE] ){
		//rocket.fire();
	}
	
	
}

cleanup = function()
{
	var validBullets = new Array();
	var validAsteroids = new Array();
	for (var i = 0; i < bullets.length; i++)
	{
		var bullet = bullets[i];
		if (typeof bullet !== 'undefined')
			validBullets.push(bullet);
	}
	bullets = validBullets;
	for (var i = 0; i < asteroids.length; i++)
	{
		var asteroid = asteroids[i];
		if (typeof asteroid !== 'undefined')
			validAsteroids.push(asteroid);
	}
	asteroids = validAsteroids;
}

drawMap = function(){
	if( game.lives === 0 )
		clearInterval(refreshID);
	handleInput();
	cleanup();
	if (game.collisionDetectionOn)
		checkCollisions();
	else
	{
		game.regenerateTime--;
		if (game.regenerateTime === 0)
			game.collisionDetectionOn = true;
	}
	drawRocket();
	drawAsteroids();
	drawBullet();
}

window.onkeydown = function(e){
	var code = e.keycode ? e.keycode : e.which;
	//if( code == 38 ) alert( 'up' );
	keyState[code] = true;
}

window.onkeyup = function(e){
	var code = e.keycode ? e.keycode : e.which;
	if ( code == UP || code == DOWN ){
		rocket.acceleration = 0.0;
	}
	if( code == FIRE ) rocket.fire();
	keyState[code] = false;

}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var rocket = new RocketShip();
var asteroids = new Array();
populateAsteroids();
var bullets = new Array();
var game = new GameState();


var refreshID = setInterval(drawMap, 10);

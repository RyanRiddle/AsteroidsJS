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
	
populateAsteroids = function()
{
	var r = 100;
	var nAsteroids = 4;
	for( var i = 1; i <= nAsteroids; i++ ){
		var x = i % nAsteroids ? Math.random()*canvas.width : 0;
		var y = i % nAsteroids ? 0 : Math.random()*canvas.height;
		var tempAst = new Asteroid(x, y, r, i*Math.PI/4, 2.0);
			asteroids.push(tempAst);
	}
}


drawAsteroids = function()
{
	asteroids.forEach(function(asteroid)
	{
		asteroid.update();
		asteroid.draw(context);
	});
}

drawBullets = function()
{
	bullets.forEach(function(bullet)
	{
		bullet.update();
		bullet.draw(context);
	});
}
	


checkCollisions = function()
{
	deadBullets = [];
	deadAsteroids = [];

	for( var i = 0; i < asteroids.length; i++ ){
		var ast = asteroids[i];
		if( typeof ast !== 'undefined' ){
			var dist1 = Math.sqrt(Math.pow(ast.x-rocket.position.x, 2) + Math.pow(ast.y-rocket.position.y, 2));
			var dist2 = Math.sqrt(Math.pow(ast.x-rocket.leftWing.x, 2) + Math.pow(ast.y-rocket.leftWing.y, 2));
			var dist3 = Math.sqrt(Math.pow(ast.x-rocket.rightWing.x, 2) + Math.pow(ast.y-rocket.rightWing.y, 2));
			if (dist1 < ast.r || dist2 < ast.r || dist3 < ast.r)
			{
				rocketShipAsteroidCollision(rocket, ast);
				deadAsteroids.push(i);
				break;
			}
			for( var j = 0; j < bullets.length; j++ ){
				var bullet = bullets[j];
				if (typeof bullet !== 'undefined' )
				{
					var dist = Math.sqrt(Math.pow(ast.x-bullet.x, 2) + Math.pow(ast.y-bullet.y, 2));
					if( dist < bullet.r + ast.r ){
						bulletAsteroidCollision(bullet, ast);
						deadAsteroids.push(i);
						deadBullets.push(j);
						break;
					}
				}
			}
		}
	}

	for (var i = 0; i < deadAsteroids.length; i++)
	{
		var ndx = deadAsteroids[i];
		asteroids.splice(ndx-i, 1);		// remove
	}

	for (var i = 0; i < deadBullets.length; i++)
	{
		var ndx = deadBullets[i];
		bullets.splice(ndx-i, 1);
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
	awardPoints(asteroid.r);
	if (asteroid.r > 25)
	{
		var leftHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.r/2, Math.random()*Math.PI, asteroid.velocity);
		var rightHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.r/2, Math.random()*Math.PI, asteroid.velocity);
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
	if (asteroid.r > 25)
	{
		var leftHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.r/2, Math.random()*Math.PI, asteroid.velocity);
		var rightHalf = new Asteroid(asteroid.x, asteroid.y, asteroid.r/2, Math.random()*Math.PI, asteroid.velocity);
		asteroids.push(leftHalf);
		asteroids.push(rightHalf);
	}
	game.lives--;
	game.collisionDetectionOn = false;
	game.regenerateTime = 250;
	rocket = new RocketShip();
}

function handleInput()
{
	if( keyState[LEFT] ){
		rocket.theta -= Math.PI/60.0;
	}
	if ( keyState[RIGHT] ){
		rocket.theta += Math.PI/60.0;
	}
	if ( keyState[UP] == true ){
		rocket.acceleration -= 0.005;
	}
	if ( keyState[DOWN] == true ){
		rocket.acceleration += 0.005;
	}
	if ( keyState[FIRE] ){
		//rocket.fire();
	}
	
	
}

drawGameInfo = function()
{
	context.fillStyle = 'white';
	var strDirections = "Directions: arrow keys move, f key fires.";
	context.font="20px Arial";
	context.fillText( "Lives: " + game.lives, 100, 20 );
	context.fillText( "Points: " + game.points, 300, 20 );
	context.fillText( strDirections, 500, 20 );
}

drawMap = function()
{
	if( game.lives === 0 )
		clearInterval(refreshID);
	handleInput();
	if (game.collisionDetectionOn)
		checkCollisions();
	else
	{
		game.regenerateTime--;
		if (game.regenerateTime === 0)
			game.collisionDetectionOn = true;
	}
	context.clearRect(0,0,canvas.width, canvas.height);
	drawGameInfo();
	rocket.draw(context);
	drawAsteroids();
	drawBullets();
}

window.onkeydown = function(e)
{
	var code = e.keycode ? e.keycode : e.which;
	//if( code == 38 ) alert( 'up' );
	keyState[code] = true;
}

window.onkeyup = function(e)
{
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

var animate = function()
{
	drawMap();
	window.requestAnimationFrame(animate);
}; 
requestAnimationFrame(animate);

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const FIRE = 70;

var keyState = {};

function Coordinate( anX, anY ){
	this.x = typeof anX !== 'undefined' ? anX : 0;
	this.y = typeof anY !== 'undefined' ? anY : 0;
	this.getX = getX;
	this.getY = getY;
	function getX() { return this.x; }
	function getY() { return this.y; }
}

function Bullet(anX, anY, aTheta, aVelocity){
	this.x = typeof anX !== 'undefined' ? anX : 0;
	this.y = typeof anY !== 'undefined' ? anY : 0;
	this.radius = 10;
	this.thetaDirection = typeof aTheta !== 'undefined' ? aTheta : 0;
	this.velocity = typeof aVelocity !== 'undefined' ? aVelocity : 0;
	this.update = update;
	function update(){
		this.x += Math.cos(this.thetaDirection)*this.velocity;
		this.y += Math.sin(this.thetaDirection)*this.velocity;
	}
}

function Asteroid(anX, anY, aR, aTheta, aVelocity){
	this.x = typeof anX !== 'undefined' ? anX : 0;
	this.y = typeof anY !== 'undefined' ? anY : 0;
	this.radius = typeof aR !== 'undefined' ? aR : 1;
	this.thetaDirection = typeof aTheta !== 'undefined' ? aTheta : 0.0;
	this.velocity = typeof aVelocity !== 'undefined' ? aVelocity : 0.0;
	this.update = update;
	function update(){
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
	}

}

function RocketShip(){
	this.position = new Coordinate(500,500);
	this.velocity = 0.0;
	this.acceleration=0.0;
	this.theta = 0.0;
	this.leftWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+(-1*Math.PI/6.0))), this.position.y+(50*Math.sin(this.theta+(-1*Math.PI/6.0))));
	this.rightWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+Math.PI/6.0)), this.position.y+(50*Math.sin(this.theta+Math.PI/6.0)));
	this.update = update;
	function update() {
		if( this.velocity < 1.0 && this.velocity > -1.0 ){
			this.velocity += this.acceleration;
		}
		else if( this.velocity >= 1.0 ){
			this.velocity = 0.98;
		}
		else if( this.velocity <= -1.0 ){
			this.velocity = -0.98;
		}
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
			
		this.position.x += Math.cos(this.theta)*this.velocity;
		this.position.y += Math.sin(this.theta)*this.velocity;
		this.leftWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+(-1*Math.PI/6.0))), this.position.y+(50*Math.sin(this.theta+(-1*Math.PI/6.0))));
		this.rightWing = new Coordinate(this.position.x+(50*Math.cos(this.theta+Math.PI/6.0)), this.position.y+(50*Math.sin(this.theta+Math.PI/6.0)));
	}
	this.fire = fire;
	function fire(){
		var bullet = new Bullet(rocket.position.x, rocket.position.y, rocket.theta+Math.PI, 10+rocket.velocity);
		bullets.push(bullet);
		
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
		asteroids[i].update();
		drawCircle(asteroids[i].x, asteroids[i].y, asteroids[i].radius);
	}
}

drawBullet = function(){
	for( var i = 0; i < bullets.length; i++ ){
		var bullet = bullets[i];
		if( typeof bullet !== 'undefined' ){
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
	var velString = rocket.velocity;
	var accelString = rocket.acceleration;
	context.fillText( posString, 100, 100 );
	context.fillText( velString, 100, 150 );
	context.fillText( accelString, 100, 200 );
	rocket.update();
	context.beginPath();
	context.moveTo(rocket.leftWing.getX(), rocket.leftWing.getY());
	context.lineTo(rocket.position.getX(), rocket.position.getY());
	context.lineTo(rocket.rightWing.getX(), rocket.rightWing.getY());
	context.strokeStyle = 'white';
	context.stroke();

}

checkCollisions = function(){
	for( var i = 0; i < bullets.length; i++ ){
		var bullet = bullets[i];
		if( typeof bullet !== 'undefined' ){
			for( var j = 0; j < asteroids.length; j++ ){
				var ast = asteroids[j];
				var dist = Math.sqrt(Math.pow(ast.x-bullet.x, 2) + Math.pow(ast.y-bullet.y, 2));
				if( dist < bullet.radius + ast.radius ){
					delete bullet.x;
					delete ast.x;
				}
			}
		}
	}
}

function handleInput(){
	if( keyState[LEFT] ){
		rocket.theta -= Math.PI/360.0;
	}
	if ( keyState[RIGHT] ){
		rocket.theta += Math.PI/360.0;
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

drawMap = function(){
	handleInput();
	checkCollisions();
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


//drawCircle();
setInterval(drawMap, 1);
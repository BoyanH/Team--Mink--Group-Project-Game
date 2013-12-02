(function() {

    var canvas = document.getElementById("the-canvas"),
		ctx = canvas.getContext("2d"),
		direction = {
		    x: "right",
		    y: "down"
		},
        directions = {
            "left": -1.1,
            "right": +1.1,
            "up": -1.5,
            "down": +1.3

        },
		
		ball = new Ball(400, 400, 5, 4, direction);	
        racket = new Racket(ctx.canvas.width / 2, ctx.canvas.height - 10, 100, 8);
	
	racket.direction = "none";
    var intialize = true;
    var firstMoveAfterBounce = false;
    
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

    function Brick(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 20;
        this.color = color;
        this.isDestroyed = false;
        this.isClearStroke = false;
        this.draw = function (ctx) {
            ctx.beginPath();
            ctx.rect(x, y, 100, 20);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }

    var bricks = [];
    var r = 30, t = 10;
    for (var i = 0; i < 7; i++) {
        bricks.push(new Brick(r, t, get_random_color()));
        r += bricks[i].width + 5;
    }
    t += 30;
    r = 30;
    for (var i = 0; i < 7; i++) {
        bricks.push(new Brick(r, t, get_random_color()));
        r += bricks[i].width + 5;
    }
    t += 30;
    r = 30;
    for (var i = 0; i < 7; i++) {
        bricks.push(new Brick(r, t, get_random_color()));
        r += bricks[i].width + 5;
    }
    t += 30;
    r = 30;
    for (var i = 0; i < 7; i++) {
        bricks.push(new Brick(r, t, get_random_color()));
        r += bricks[i].width + 5;
    }
    t += 30;
    r = 30;
    for (var i = 0; i < 7; i++) {
        bricks.push(new Brick(r, t, get_random_color()));
        r += bricks[i].width + 5;
    }
    var destroyedBrick = false;
    var bounceBall = false;
	function Ball(x, y, radius, speed, direction) {

		this.x = x;
		this.y = y;
		this.speed = speed;
		this.radius = radius;
		this.direction = direction;

		this.draw = function(ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
			ctx.fill();
			ctx.strokeStyle = "black";
			ctx.stroke();
		};

		this.move = function() {

		this.x += this.speed * directions[this.direction.x];
		this.y += this.speed * directions[this.direction.y];
		
		};

		this.bounce = function(maxX, maxY) {

			if(this.x < 0 + this.radius) {
				this.direction.x = "right";
			}
			if(this.x > maxX - this.radius) {
				this.direction.x = "left";
			}
			if(this.y < 0 + this.radius) {
				this.direction.y = "down";
			}
			if (this.y >= racket.y - this.radius) {

			    if (this.x >= racket.x && this.x <= racket.x + racket.width && this.y <= ctx.canvas.height) {
			        if (this.x <= racket.x + (racket.width / 2)) {
			            this.direction.y = "up";
			            this.direction.x = "left";
			        }
			        else {
			            this.direction.y = "up";
			            this.direction.x = "right";
			        }
			    }
			}
			for (var i in bricks) {
			    if (!bricks[i].isDestroyed) {
			        if (this.y - 15 >= bricks[i].y - bricks[i].height && this.y - 15 < bricks[i].y
                        && this.x >= bricks[i].x && this.x <= bricks[i].x+bricks[i].width) {
			            bricks[i].isDestroyed = true;
			            destroyedBrick = true;
			            this.direction.y = "down";
			            ctx.clearRect(bricks[i].x, bricks[i].y, bricks[i].width, bricks[i].height);
			            break;
			        }
			    }
			}
		};

	}

	function Racket(x,y,width,speed) {
	    this.x = x;
	    this.y = y;
	    this.speed = speed;
	    this.width = width;
	    this.direction = direction;
	    this.move = function () {
	        if (this.direction == "left")
	            this.x -= this.speed;
	        if (this.direction == "right")
	            this.x += this.speed;
	    }
	    this.draw = function (ctx) {
	        ctx.beginPath();
	        ctx.moveTo(this.x, this.y);
	        ctx.lineTo(this.x + this.width / 2, this.y - 8);
	        ctx.lineTo(this.x + this.width, this.y);
	        ctx.lineTo(this.x, this.y);
	        ctx.fill();
	        ctx.strokeStyle = "black";
	        ctx.stroke();
	    }
	}

	for (var i in bricks) {
	    if (!bricks[i].isDestroyed)
	        bricks[i].draw(ctx);
	}

	function animationFrame() {
		ctx.clearRect(ball.x - ball.radius - 5, ball.y - ball.radius - 5, ball.radius * 2 + 15, ball.radius * 2 + 15);
	    ctx.clearRect(racket.x - 5, racket.y - 10 ,racket.width + 10, 20);
	    ball.bounce(ctx.canvas.width, ctx.canvas.height);
		ball.move();
		ball.draw(ctx);
		racket.move();
		racket.draw(ctx);
		if (firstMoveAfterBounce) {
		    for (var i in bricks) {
		        if (!bricks[i].isDestroyed)
		            bricks[i].draw(ctx);
		        else {
		            if (!bricks[i].isClearStroke) {
		                ctx.clearRect(bricks[i].x - 2, bricks[i].y - 2, bricks[i].width + 4, bricks[i].height + 4);
		                bricks[i].isClearStroke = true;
		            }
		        }
		    }
		}
		if (destroyedBrick) {
		    for (var i in bricks) {
		        if (!bricks[i].isDestroyed)
		            bricks[i].draw(ctx);
		    }
		    destroyedBrick = false;
		    firstMoveAfterBounce = true;
		}
        //not to move outside the canvas
		if (racket.x + racket.width >= ctx.canvas.width) {
		    racket.x -= racket.speed;
		}
		if (racket.x < 0) {
		    racket.x += racket.speed;
		}

        //when key is not down the direction should be none
		document.addEventListener('keyup',function(event)
		{
		    if (event.keyCode == 37) {
		        racket.direction = "none";
		    }
		    if (event.keyCode == 39) {
		        racket.direction = "none";
		    }
		})

        //if one if the arrows is down
		document.addEventListener('keydown', function (event) {
		    if (event.keyCode == 37) {
		        racket.direction = "left";
		    }
		    else if (event.keyCode == 39) {
		        racket.direction = "right";
		    }
		});


		requestAnimationFrame(animationFrame);

	}

	requestAnimationFrame(animationFrame);
}())




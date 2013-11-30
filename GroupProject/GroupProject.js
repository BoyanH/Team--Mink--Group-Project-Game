(function() {

    var canvas = document.getElementById("the-canvas"),
		ctx = canvas.getContext("2d"),
		direction = {
		    x: "right",
		    y: "down"
		},
        directions = {
            "left": -1,
            "right": +1,
            "up": -1.5,
            "down": +1

        },
		ball = new Ball(100, 100, 5, 5, direction);	
    
    var racket = new Racket(ctx.canvas.width / 2, ctx.canvas.height - 10, 100, 8);
	racket.direction = "none";
    var intialize = true;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

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
			if(this.y === racket.y - this.radius) {
				if ((this.x + this.radius >= racket.x) && (this.x - this.radius <= racket.x + racket.width/2)) {
					this.direction.y = "up";
					this.direction.x = "left";
				};
				if ((this.x - this.radius >= racket.x + racket.width/2) && (this.x - this.radius <= racket.x + racket.width)) {
					this.direction.y = "up";
					this.direction.x = "right";
				};

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
	    }
	}

	function animationFrame() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ball.bounce(ctx.canvas.width, ctx.canvas.height);
		ball.move();
		ball.draw(ctx);
		racket.draw(ctx);

        //not to move outside the canvas
		if (racket.x + racket.width >= ctx.canvas.width) {
		    racket.x -= racket.speed;
		}
		if (racket.x < 0) {
		    racket.x += racket.speed;
		}
		racket.move();

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




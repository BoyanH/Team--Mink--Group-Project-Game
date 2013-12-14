(function () {

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

        };
    isAnimationOn = true;
    intialize = true,
    firstMoveAfterBounce = false,
    beforePushBall = true,
    countBrokenBeerBrics = 0,
    countBrokenCokeBrics = 0,
    destroyedBrick = false,
    bounceBall = false,
    score = 0,
    displayScore = "Score: " + score;
    cordinatesOfLastDestroyedBrick = { x: 0, y: 0 };

    //make a requestAnimationFrame
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    //function for random color
    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

    //function which make us brick
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

    //arrays where we will put our bricks, cokes and beers
    var bricks = [];
    var bottlesBeer = [];
    var bottlesCoke = [];
    var r = 30, t = 10;

    //bricks of the game
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

    //function that make us a ball
    function Ball(x, y, radius, speed, direction) {

        this.x = x;
        this.y = y;
        this.speed = speed;
        this.radius = radius;
        this.direction = direction;

        this.draw = function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
        };

        this.move = function () {

            this.x += this.speed * directions[this.direction.x];
            this.y += this.speed * directions[this.direction.y];

        };

        this.bounce = function (maxX, maxY) {

            if (this.x < 0 + this.radius) {
                this.direction.x = "right";
            }
            if (this.x > maxX - this.radius) {
                this.direction.x = "left";
            }
            if (this.y < 0 + this.radius) {
                this.direction.y = "down";
            }
            if (this.y >= racket.y - this.radius) {

                //if the ball hit the left side of the racket it bounce up and left
                if (this.x >= racket.x && this.x <= racket.x + racket.width && this.y <= ctx.canvas.height) {
                    if (this.x <= racket.x + (racket.width / 2)) {
                        this.direction.y = "up";
                        this.direction.x = "left";
                    }

                 // else it if it hit the right side of the racket the ball will go up and right
                    else {
                        this.direction.y = "up";
                        this.direction.x = "right";
                    }
                }
            }

            //if the ball hit a brick and it is not destroyed
            for (var i in bricks) {
                if (!bricks[i].isDestroyed) {
                    if (this.y - 15 >= bricks[i].y - bricks[i].height && this.y - 15 < bricks[i].y
            && this.x >= bricks[i].x && this.x <= bricks[i].x + bricks[i].width) {
                        bricks[i].isDestroyed = true;  //the brick is now destroyed
                        destroyedBrick = true;         
                        cordinatesOfLastDestroyedBrick.x = bricks[i].x; //cordinates of the last destroyed brick because we will
                        cordinatesOfLastDestroyedBrick.y = bricks[i].y; //use them to produce bottles
                        countBrokenBeerBrics++;                         //the counters for cokes and beers +1 and when they reach
                        countBrokenCokeBrics++;                         //a specific number the next brick will produce bottle
                        if (this.direction.y == "up") {                 
                            this.direction.y = "down";              //the bounce of the ball
                        }
                        else {
                            this.direction.y = "up";
                        }
                        ctx.clearRect(bricks[i].x, bricks[i].y, bricks[i].width, bricks[i].height);
                        break;
                    }
                }
            }
        };

    }

    //function that makes us a coke bottle
    function cokeBottle(x, y, speed) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.move = function () {
            this.y += speed;
        }
        this.draw = function (ctx) {
            //bottle
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - 25);
            ctx.lineTo(this.x + 5, this.y - 30);
            ctx.lineTo(this.x + 5, this.y - 40);
            ctx.lineTo(this.x + 10, this.y - 40);
            ctx.lineTo(this.x + 10, this.y - 30);
            ctx.lineTo(this.x + 15, this.y - 25);
            ctx.lineTo(this.x + 15, this.y);
            ctx.lineTo(this.x + 13, this.y + 2);
            ctx.lineTo(this.x + 2, this.y + 2);
            ctx.lineTo(this.x, this.y);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.stroke();

            //(coffee)
            ctx.beginPath();
            ctx.moveTo(this.x + 7, this.y - 1);
            ctx.lineTo(this.x + 4, this.y - 5);
            ctx.moveTo(this.x + 7, this.y - 1);
            ctx.lineTo(this.x + 11, this.y - 5);
            //(o)
            ctx.moveTo(this.x + 4, this.y - 7);
            ctx.lineTo(this.x + 11, this.y - 7);
            ctx.lineTo(this.x + 11, this.y - 11);
            ctx.lineTo(this.x + 4, this.y - 11);
            ctx.lineTo(this.x + 4, this.y - 7);
            //:*
            ctx.moveTo(this.x + 4, this.y - 14);
            ctx.lineTo(this.x + 11, this.y - 14);
            ctx.moveTo(this.x + 7, this.y - 14);
            ctx.lineTo(this.x + 4, this.y - 18);
            ctx.moveTo(this.x + 7, this.y - 14);
            ctx.lineTo(this.x + 11, this.y - 18);
            //(e)
            ctx.moveTo(this.x + 4, this.y - 20);
            ctx.lineTo(this.x + 11, this.y - 20);
            ctx.lineTo(this.x + 11, this.y - 24);
            ctx.moveTo(this.x + 7, this.y - 20);
            ctx.lineTo(this.x + 7, this.y - 24);
            ctx.moveTo(this.x + 4, this.y - 20);
            ctx.lineTo(this.x + 4, this.y - 24);

            ctx.strokeStyle = "black";
            ctx.stroke();

        }
    }

    //function that makes us a beer bottle
    function beerBottle(x, y, speed) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.move = function () {
            this.y += speed;
        }
        this.draw = function (ctx) {
            //bottle
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - 25);
            ctx.lineTo(this.x + 5, this.y - 30);
            ctx.lineTo(this.x + 5, this.y - 40);
            ctx.lineTo(this.x + 10, this.y - 40);
            ctx.lineTo(this.x + 10, this.y - 30);
            ctx.lineTo(this.x + 15, this.y - 25);
            ctx.lineTo(this.x + 15, this.y);
            ctx.lineTo(this.x + 13, this.y + 2);
            ctx.lineTo(this.x + 2, this.y + 2);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
            ctx.fillStyle = "#B85C00";
            ctx.fill();

            //(beer)
            ctx.beginPath();
            ctx.moveTo(this.x + 4, this.y - 2);
            ctx.lineTo(this.x + 11, this.y - 2);
            ctx.lineTo(this.x + 11, this.y - 6);
            ctx.lineTo(this.x + 7, this.y - 6);
            ctx.lineTo(this.x + 7, this.y - 2);
            ctx.moveTo(this.x + 7, this.y - 6);
            ctx.lineTo(this.x + 4, this.y - 6);
            ctx.lineTo(this.x + 4, this.y - 2);
            //(e)
            ctx.moveTo(this.x + 4, this.y - 9);
            ctx.lineTo(this.x + 11, this.y - 9);
            ctx.lineTo(this.x + 11, this.y - 13);
            ctx.moveTo(this.x + 7, this.y - 9);
            ctx.lineTo(this.x + 7, this.y - 13);
            ctx.moveTo(this.x + 4, this.y - 9);
            ctx.lineTo(this.x + 4, this.y - 13);
            //(e)
            ctx.moveTo(this.x + 4, this.y - 16);
            ctx.lineTo(this.x + 11, this.y - 16);
            ctx.lineTo(this.x + 11, this.y - 20);
            ctx.moveTo(this.x + 7, this.y - 16);
            ctx.lineTo(this.x + 7, this.y - 20);
            ctx.moveTo(this.x + 4, this.y - 16);
            ctx.lineTo(this.x + 4, this.y - 20);
            //(R)
            ctx.moveTo(this.x + 4, this.y - 23);
            ctx.lineTo(this.x + 12, this.y - 23);
            ctx.moveTo(this.x + 4, this.y - 23);
            ctx.lineTo(this.x + 6, this.y - 26);
            ctx.lineTo(this.x + 8, this.y - 23);
            ctx.lineTo(this.x + 11, this.y - 26);

            ctx.stroke();

        }


    }

    //function that make us a racket
    function Racket(x, y, width, speed) {
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

    //if the brick is not destroyed then draw it on the canvas
    for (var i in bricks) {
        if (!bricks[i].isDestroyed)
            bricks[i].draw(ctx);
    }

    //we make our ball and racket
    var ball = new Ball(400, 400, 5, 4, direction);
    var racket = new Racket(ctx.canvas.width / 2, ctx.canvas.height - 10, 100, 8);

    racket.direction = "none"; //at the begining the racket dont have direction

    //our function that makes the game proceed
    function animationFrame() {
        displayScore = "Score: " + score;                   //the score of the game
        ctx.clearRect(ctx.canvas.width - 100, 200, ctx.canvas.width, 300);
        ctx.font = "bold 24px Chiller";
        ctx.fillStyle = "black";
        ctx.fillText(displayScore, ctx.canvas.width - 100, 300);

        if (beforePushBall) { //this is when the user havent click the button space and the ball moves with the racket
            ctx.clearRect(racket.x - 25, racket.y - 25, racket.width + 50, 30);
            racket.draw(ctx);
            ball.direction.y = "up";
            ball.x = racket.x + racket.width / 2 - 5;
            ball.y = racket.y - 10;
            ball.draw(ctx);
            document.addEventListener('keydown', function (event) {
                if (event.keyCode == 32) {
                    beforePushBall = false;
                }
            })
            //when key is not down the direction should be none
            document.addEventListener('keyup', function (event) {
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
            racket.move();
        }
        //if the counter for the beer reach 5 - drop a beer bottle
        if (countBrokenBeerBrics == 5) {
            bottlesBeer.push(new beerBottle(cordinatesOfLastDestroyedBrick.x + 50, cordinatesOfLastDestroyedBrick.y + 40, 3));
            countBrokenBeerBrics = 0;
        }//if the counter for the coke reach 2 - drop a coke bottle
        if (countBrokenCokeBrics == 2) {
            bottlesCoke.push(new cokeBottle(cordinatesOfLastDestroyedBrick.x + 50, cordinatesOfLastDestroyedBrick.y + 40, 3));
            countBrokenCokeBrics = 0;
        }
        if (destroyedBrick) {
            for (var i in bricks) {
                if (!bricks[i].isDestroyed)
                    bricks[i].draw(ctx);
            }
            destroyedBrick = false;
            firstMoveAfterBounce = true;
        }

        for (var i in bottlesCoke) {
            ctx.clearRect(bottlesCoke[i].x - 5, bottlesCoke[i].y - 50, 30, 60);
            bottlesCoke[i].draw(ctx);
            bottlesCoke[i].move();
            if ((bottlesCoke[i].y >= racket.y) && (bottlesCoke[i].x >= racket.x && bottlesCoke[i].x <= racket.x + racket.width)) {
                ctx.clearRect(bottlesCoke[i].x - 5, bottlesCoke[i].y - 50, 30, 60);
                score += 50;
                bottlesCoke.splice(i, 1);
            }
            else if (bottlesCoke[i].y - 50 > ctx.canvas.height) {

                bottlesCoke.splice(i, 1);
            }
        }

        for (var i in bottlesBeer) {
            ctx.clearRect(bottlesBeer[i].x - 5, bottlesBeer[i].y - 50, 30, 60);
            bottlesBeer[i].draw(ctx);
            bottlesBeer[i].move();
            
            if ((bottlesBeer[i].y >= racket.y) && (bottlesBeer[i].x >= racket.x && bottlesBeer[i].x <= racket.x + racket.width)) {
                ctx.clearRect(bottlesBeer[i].x - 5, bottlesBeer[i].y - 50, 30, 60);
                score += 200;
                bottlesBeer.splice(i, 1);
            }
            else if (bottlesBeer[i].y - 50 > ctx.canvas.height) {
                
                bottlesBeer.splice(i, 1);
            }
        }

        //not to move outside the canvas
        if (racket.x + racket.width >= ctx.canvas.width) {
            racket.x -= racket.speed;
        }
        if (racket.x < 0) {
            racket.x += racket.speed;
        }

        if (firstMoveAfterBounce) { //if first move after bounce is made then draw the bricks that are not destroyed(in this case all of them)
            for (var i in bricks) {
                if (!bricks[i].isDestroyed) {
                    bricks[i].draw(ctx);
                }
                else {
                    if (!bricks[i].isClearStroke) {
                        ctx.clearRect(bricks[i].x - 2, bricks[i].y - 2, bricks[i].width + 4, bricks[i].height + 4);
                        score += 10;
                        bricks[i].isClearStroke = true;
                    }
                }
            }
        }

        //clear the previous place of the ball
        ctx.clearRect(ball.x - ball.radius - 5, ball.y - ball.radius - 5, ball.radius * 2 + 15, ball.radius * 2 + 15);
        //clear the previous place of the racket
        ctx.clearRect(racket.x - 5, racket.y - 10, racket.width + 10, 20);
        ball.bounce(ctx.canvas.width, ctx.canvas.height);
        ball.move();
        ball.draw(ctx);
        racket.move();
        racket.draw(ctx);
        if (ball.y >= ctx.canvas.height) { //if the ball go outside the canvas - the game ends
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = "bold 100px Chiller";
            ctx.fillStyle = "purple";
            ctx.fillText("GAME OVER", ctx.canvas.width / 2 - 220, ctx.canvas.height / 2);
            ctx.font = "bold 42px Chiller";
            ctx.fillStyle = "purple";
            ctx.fillText(displayScore, ctx.canvas.width / 2 - 220, ctx.canvas.height / 2 + 50);
            isAnimationOn = false;
        }

        if (isAnimationOn) {
            requestAnimationFrame(animationFrame);
        }
    }

    requestAnimationFrame(animationFrame);
}())

function reset() {
    //a reset function for the game and a message
    alert("Go cry to your mama!");
    location.reload();
}
//the button for the reset of the game
var resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", reset, true);

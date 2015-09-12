var jumper = document.getElementById('jumper'),
    height = document.getElementById('stage').clientHeight,
    baseStage = document.getElementById('stage'),
    stage = document.getElementById('inner-stage'),
    spikeyTop = document.getElementById('spikey-top'),
    spikeyBottom = document.getElementById('spikey-bottom'),
    message = document.getElementById('message'),
    points = document.createElement('div'),
    scoreContainer = document.getElementById('score-cont'),
    stageHeight = stage.clientHeight,
    stageWidth = stage.clientWidth,
    jumperX = (stageWidth / 2) - 84,
    stageY = 1200,
    stageYOffset = 400,
    jumperY = 1900,
    vy = 0.0,
    gravity = 0.5,
    canJump = true,
    keyTimer = null,
    collided = false,
    collidedBubble = null,
    scale = 0.5,
    bubbles = [],
    backgroundBubbles = [],
    timerInterval,
    time = 1,
    direction = 1,
    j = 0,
    grounded = 0,
    score = 0,
    isPlaying = false,
    seconds = 0,
    minutes = 0,
    hours = 0,
    timerTimeout,
    messageTimeout,
    playingCounter = 0,
    combo = 0,
    comboTicks = 0,
    savior = false,
    firstBlood = false,
    messages = {
        FIRST_BLOOD: 'First blood!',
        SAVIOR: 'Savior!!',
        COMBO: 'Combo!!',
        SURVIVOR: 'Survivor!!'
    };

//Create the first bubble
bubbles.push(new Bubble(j, 100, 100, 'collidable', jumperX - 15, jumperY));
collidedBubble = bubbles[0];
collided = true;

//Set the jumper initial position
jumper.style.cssText = 'left:' + jumperX + 'px;top:' + 1897 + 'px;';

//Set the stage initial position
stage.style.top = 0 + 'px';

//Build the bottom spikies
var spikeyLeft = -18;
for (var i = 0; i < 40; i++) {

    var spikey = document.createElement('div');

    spikey.className = 'spikey';
    spikey.style.cssText = 'left:' + spikeyLeft + 'px;top:' + 1897 + 'px;';

    spikeyLeft += 45;

    spikeyBottom.appendChild(spikey);
}

/*timerInterval = setInterval(function () {

    if (time % 10 === 0) {
        //direction *= -1;
        if (direction === -1) {
            stage.className = 'reverse';
        } else {
            stage.className = 'forward';
        }
    }
    time += 1;
}, 1000);*/

//Create random background bubbles
for (var i = 0; i < 40; i++) {
    var x = Math.round(Math.random() * stage.clientWidth);
    var y = Math.round(Math.random() * stage.clientHeight);

    backgroundBubbles.push(new Bubble('', 30, 30, 'background', x, y));
}

/**
 * jump
 * Sets the y velocity if their is a jump state
 * @returns 
 */
function jump() {
    if (canJump) {
        vy = -16.0;
        canJump = false;
        removeBubble();
    }
}

/**
 * checkCollison
 * Checks for intersect collisions with collidable bubbles
 * @returns 
 */
function checkCollison() {
    //Check for bubble collision
    if (!collided) {
        for (var i in bubbles) {
            var bubble = bubbles[i].bubble;
            if (hasCollided(jumper, bubble)) {
                collided = true;
                canJump = true;

                var occupiedBubble = document.getElementById(bubble.id);
                occupiedBubble.className = 'bubble inner animate-bubble';
                collidedBubble = bubbles[i];

                points.className = 'points';
                points.innerText = '+1';

                occupiedBubble.appendChild(points);

                updateScore(score++);

                combo++;

                if (!firstBlood) {
                    firstBlood = true;
                    showMessage(messages.FIRST_BLOOD, 2);
                    return;
                }
                if (grounded === 1 && !savior) {
                    savior = true;
                    showMessage(messages.SAVIOR, 10);

                    return;
                }

                if (comboTicks <= 5 && combo === 3) {
                    showMessage(messages.COMBO, 3);
                } else if (comboTicks > 5) {
                    comboTicks = 0;
                    combo = 0;
                }

            }
        }

        if (jumperY == stageHeight - 75) {
            //Jumper has crashed on spikey
            canJump = true;
            jump();
            grounded++;
        }
    }
}

/**
 * removeBubbles
 * removes collidable bubbles and resets non-collidable bubbles
 * @returns 
 */
function removeBubbles() {
    var i = bubbles.length;
    while (i--) {
        //Pop bubble if it his top spikies
        if (bubbles[i].y < 30) {
            stage.removeChild(document.getElementById(bubbles[i].id));
            bubbles.splice(i, 1);

        }
    }
}

/**
 * moveBubbles
 * Moves collidable and non-collidable bubble posiitons
 * @returns 
 */
function moveBubbles() {
    var i = bubbles.length;
    while (i--) {
        var placement = bubbles[i].bubble.parentElement.offsetTop + bubbles[i].offsetTop;
        bubbles[i].y -= bubbles[i].s;

        if (placement > 1000 && placement < 0) {
            bubbles[i].bubble.style.left = bubbles[i].x + 'px';
            bubbles[i].bubble.style.top = bubbles[i].y + 'px';
        }
    }
}

/**
 * hasCollided
 * Checks for collision intersection
 * @param {element} el1 - jumper
 * @param {element} el2 = bubble
 * @returns 
 */
function hasCollided(el1, el2) {
    var r1 = el1.getBoundingClientRect(),
        r2 = el2.getBoundingClientRect();

    return !(
        r1.top > r2.bottom ||
        r1.right < r2.left + 25 ||
        r1.bottom < r2.top ||
        r1.left > r2.right - 25)
}


/**
 * checkRemoveBubble
 * Checks to see if jumper has grown to scale, then sets bubble outside of view for cleanup
 * @returns 
 */
function checkRemoveBubble() {
    if (scale > 0.75) {
        removeBubble();
    }
}

/**
 * removeBubble
 * Remove the bubble
 * @returns 
 */
function removeBubble() {
    collided = false;
    scale = 0.5;
    jumper.style.transform = 'scale(' + scale + ')';
    collidedBubble.y = -collidedBubble.h - 50;

}

/**
 * draw
 * Draw actions
 * @returns 
 */
function draw() {
    if (isPlaying) {
        removeBubbles();
        moveBubbles();

        if (!collided) {
            jumping();
            checkCollison();
        }

        render();

        checkRemoveBubble();

        if (grounded < 2) {
            requestAnimationFrame(draw);
        } else {
            clearTimeout(timerTimeout);
            document.getElementById('game-over').className = ''
        }

        //Create new bubble when count is at 50
        if (playingCounter % 50 === 0) {
            if (bubbles.length < 15) {
                bubbles.push(new Bubble(playingCounter, 100, 100, 'collidable'));

            }
        }

        playingCounter++;
    }
}

/**
 * move
 * Move the jumper every 0.0033 seconds; if the jumper is already moving return
 * @param {number} dir - 0=left, 1=right
 * @returns 
 */

function move(dir) {
    if (keyTimer !== null) {
        return;
    }

    keyTimer = setInterval(function () {
        if (dir === 1) {
            jumperX -= 5;
        } else {
            jumperX += 5;
        }
    }, 33);
}

/**
 * jumping
 * The jumper is jumping, increase/decrease the y point. If the jumper is near the bottom, reset velocity, canJump, and collided state
 * @returns 
 */

function jumping() {
    vy += gravity;
    jumperY += vy;


    if (jumperY > stageHeight - 75) {
        jumperY = stageHeight - 75;
        vy = 0.0;
        canJump = true;
        collided = false;

    }

}

/**
 * keyDown
 * Key down listener for arrow keys. Move or jump accordingly
 * @returns 
 */

function keyDown(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    switch (key) {
    case 38:
        //up
        jump();
        break;
    case 40:
        //down
        break;
    case 37:
        //left
        move(direction);
        break;
    case 39:
        //right
        move(direction * -1);
        break;

    }


}

/**
 * keyUp
 * Key up listener for arrow keys. Listening for move only since jump is handled by jumping()
 * @returns 
 */

function keyUp(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    //Start playing if not already playing and user pressed space key
    if (!isPlaying && key === 32) {
        isPlaying = true;
        stage.style.top = -stageY + 'px';
        //stage.style.transform='translateY(' + -stageY + 'px);';

        //Remove title messages
        baseStage.removeChild(document.getElementById('title'));
        baseStage.removeChild(document.getElementById('instructions'));

        //Clear control classes
        document.getElementById('time-cont').className = '';
        document.getElementById('score-cont').className = '';

        //Start drawing
        draw();

        //Start game timer
        gameTimer();
    }

    //left or right
    if (key === 37 || key === 39) {

        clearInterval(keyTimer);
        keyTimer = null;
    }
}

/**
 * render
 * Render all screen assets; move jumper and collidable bubles
 * @returns 
 */
function render() {

    //Move bubbles
    for (var i in bubbles) {
        bubbles[i].bubble.style.top = bubbles[i].y + 'px'
    }

    //If jumper is in bubble
    if (collided) {
        jumperX = collidedBubble.x + 10;
        jumperY = collidedBubble.y + 1;

        //Slowly grow jumper and bubble
        scale += 0.001;
        jumper.style.transform = 'scale(' + scale + ')';
        collidedBubble.bubble.transform = 'scale(' + scale + ')';

        //Set the starting placement
        if (jumperY < stageY + stageYOffset) {
            stageY -= 1;
            stage.style.top = -stageY + 'px';
            stage.className = 'start-playing';
        }

        if (jumper.parentElement.offsetTop + jumper.offsetTop < 200) {
            collidedBubble.y = collidedBubble.y + 1;
        }


    } else {

        //Drop the stage
        if (stageY < 1190) {
            stageY += Math.round(vy);
            stage.style.top = -stageY + 'px';
        }

    }

    //Update jumper position
    jumper.style.left = jumperX + 'px';
    jumper.style.top = jumperY + 'px';
}

/**
 * Update the score shown 
 **/
function updateScore(score) {
    document.getElementById('score').innerText = score;
}



/**
 * Bubble
 * Creates collidable and non-collidable bubbles
 * @param {Number} - id
 * @param {Number} - width
 * @param {Number} - height
 * @param {bool} - collidable (is a moving bubble)
 * @param {Number} - x starting left value
 * @param {Number} - y starting top value
 * @returns {object} bubble 
 */
function Bubble(id, w, h, collidable, x, y) {
    var bubble = document.createElement('div'),
        id = 'bubble_' + id,
        s = Math.round(Math.random() * 1) + 2,
        x = x || Math.round(Math.random() * stageWidth) - w / 2,
        y = y || Math.round(Math.random() * 100) + (stageHeight);

    bubble.setAttribute('id', id);
    bubble.className = 'bubble inner ' + collidable;
    bubble.style.cssText = 'left: ' + x + 'px; top: ' + y + 'px; width:' + w + 'px; height:' + h + 'px;';
    stage.appendChild(bubble);

    return {
        bubble: bubble,
        id: id,
        s: s,
        x: x,
        y: y,
        w: w,
        h: h
    }
}

/**
 * updateTime
 * Updates the time control, updates combo ticks, and sets message and points for suriving every 30 seconds
 * @returns 
 */
function updateTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }

    if (seconds % 30 === 0) {
        showMessage(messages.SURVIVOR, 5);
    }

    comboTicks++;

    document.getElementById('time').innerText = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    gameTimer();
}

/**
 * showMessage
 * Creates points message, updates score, and manages message animation
 * @param {string} - msg
 * @param {Number} - points
 * @param {Number} - height
 * @returns 
 */
function showMessage(msg, points) {
    message.innerText = '';
    message.className = '';
    scoreContainer.className = '';

    clearTimeout(messageTimeout);

    message.innerText = msg;
    message.className = 'show';

    messageTimeout = setTimeout(function () {
        message.innerText = '';
        message.className = '';
        scoreContainer.className = '';
    }, 750);

    points.innerText = '+' + points;
    updateScore(score += points);

    scoreContainer.className = 'score-animate';
}

/**
 * gameTimer
 * Starts a game timer timeout
 * @returns 
 */
function gameTimer() {
    timerTimeout = setTimeout(updateTime, 1000);
}

function placeStage() {
    baseStage.style.left = (window.innerWidth / 2 - baseStage.clientWidth / 2) + 'px';
}

//Events
window.onkeydown = keyDown;
window.onkeyup = keyUp;
window.addEventListener('resize', placeStage);

placeStage();

//Kick off first drawing
draw();
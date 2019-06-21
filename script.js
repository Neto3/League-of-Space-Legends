var width = 40;
var height = 25;
var started_at = new Date();

var players = [];
var map = [];
var missiles = [];
var enemies = [];
var enemy_id = 0;
var last_enemy_at = started_at;
var last_enemy_interval = 1000;

for (var i = 0; i < height; i++) {
    map[i] = [];
    for (var j = 0; j < width; j++) {
        map[i][j] = 0;
    }
}

class Player {

    constructor(x, y, color) {

        this.x = x;
        this.y = y;
        this.color = color;
        this.score = 0;
        this.id = 0;
		this.isMoving = false;
		this.movingDirection;
		this.lastMove = new Date();

    }
	
	startMoving(direction) {
		this.isMoving = true;
		this.movingDirection = direction;
	}
	
	move() {
		switch (this.movingDirection) {
			case 0:
				this.moveUp();
				break;
			case 1:
				this.moveRight();
				break;
			case 2:
				this.moveDown();
				break;
			case 3:
				this.moveLeft();
				break;
		}
		this.lastMove = new Date();
	}

    moveUp() {
        if (this.y > 0)
        this.y--;
    }

    moveRight() {
        if (this.x < width - 1)
        this.x++;
    }

    moveDown() {
        if (this.y < height - 1)
        this.y++;
    }

    moveLeft() {
        if (this.x > 0)
        this.x--;
    }

    shootUp() {
        missiles.push(new Missile(this, new Date(), this.x, this.y - 1, 0, '#FFFFFF'));
    }

    shootRight() {
        missiles.push(new Missile(this, new Date(), this.x + 1, this.y, 1, '#FFFFFF'));
    }

    shootDown() {
        missiles.push(new Missile(this, new Date(), this.x, this.y + 1, 2, '#FFFFFF'));
    }

    shootLeft() {
        missiles.push(new Missile(this, new Date(), this.x - 1, this.y, 3, '#FFFFFF'));
    }

}

function getRandomX() {return Math.floor(Math.random()*width)};

function getRandomY() {return Math.floor(Math.random()*height)};

players[0] = new Player(getRandomX(), getRandomY(), '#FF0000');

class Missile {

    constructor(player, launched_at, x, y, direction, color) {
        this.player = player;
        this.launched_at = launched_at;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
    }

}

class Enemy {

    constructor(x, y, color, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = enemy_id++;
    }

}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function getRandomColor() {return '#'+(Math.random()*0xFFFFFF<<0).toString(16);}

function updateMap(date) {    

    for (var i = 0; i < 25; i++) {
        map[i] = [];
        for (var j = 0; j < 40; j++) {
            map[i][j] = 0;
        }
    }

    for (var i = 0; i < players.length; i++) {
        var player = players[i];
		if (player.isMoving && date.getTime() - player.lastMove.getTime() > 40) {player.move();}
        map[player.y][player.x] = player;
    }

    if (date.getTime() - last_enemy_at.getTime() > last_enemy_interval) {
        enemies.push(new Enemy(getRandomX(), getRandomY(), '#0000FF'));
        last_enemy_at = new Date();
        last_enemy_interval = (Math.cos(enemies.length * 0.3) + 1.1) * 200;
        //console.log(last_enemy_interval);
    }

    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (enemy != null)
        map[enemy.y][enemy.x] = enemy;
    }

    for (var i = 0; i < missiles.length; i++) {
        var missile = missiles[i];
        if (missile != null) {
            if (date.getTime() - missile.launched_at.getTime() > 15) {
                switch (missile.direction) {
                    case 0:
                        missile.y--;
                        break;
                    case 1:
                        missile.x++;
                        break;
                    case 2:
                        missile.y++;
                        break;
                    case 3:
                        missile.x--;
                }
                missile.launched_at = new Date();
            }
            if (missile.y < 0 || missile.x < 0 || missile.y > height - 1 || missile.x > 40 - 1) {
                missiles[i] = null;
            } else {
                if (map[missile.y][missile.x] instanceof Enemy) {
                    enemies[map[missile.y][missile.x].id] = null;
                    missiles[i] = null;
                    players[missile.player.id].score++;
                    document.getElementById('score').innerHTML = players[missile.player.id].score;
                }
                else
                    map[missile.y][missile.x] = missile;
            }
        }
    }

}


function updateCanvas() {

    for (y = 0; y < map.length; y++) {

        for (x = 0; x < map[y].length; x++) {

            if (map[y][x] == 0) {

                ctx.fillStyle = "#000000";
                ctx.fillRect(x * 20 + 1, y * 20 + 1, 18, 18);

            } else if (typeof map[y][x] === 'object') {

                ctx.fillStyle = map[y][x].color;
                ctx.fillRect(x * 20 + 1, y * 20 + 1, 18, 18);

            }             

        }

    }

}

function updateGame() {
	
	var date = new Date();

    var remaining = 30000 - parseInt(date.getTime() - started_at.getTime());

    document.getElementById("time").innerHTML = remaining;

    if (remaining <= 0){
        
		gameOver();

    }
	
	updateMap(date);
	updateCanvas();
	
}

function gameOver() {
	
	alert(players[0].score);
    players[0].score = 0;
    enemies = [];
    enemy_id = 0;
    started_at = new Date();
	
}

setInterval(updateGame, 1000/60);

window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 38:
            players[0].startMoving(0);
            break;
        case 39:
            players[0].startMoving(1);
            break;
        case 40:
            players[0].startMoving(2);
            break;
        case 37:
            players[0].startMoving(3);
            break;
        case 87:
            players[0].shootUp();
            break;
        case 68:
            players[0].shootRight();
            break;
        case 83:
            players[0].shootDown();
            break;
        case 65:
            players[0].shootLeft();
            break;
    }
})

window.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
        case 38:
			if (players[0].movingDirection == 0)
            players[0].isMoving = false;
            break;
        case 39:
			if (players[0].movingDirection == 1)
            players[0].isMoving = false;
            break;
        case 40:
			if (players[0].movingDirection == 2)
            players[0].isMoving = false;
            break;
        case 37:
			if (players[0].movingDirection == 3)
            players[0].isMoving = false;
            break;
    }
})

function canvasClick(event) {

    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    var i = Math.floor(y/20);
    var j = Math.floor(x/20);

    console.log(map);
    
    if (map[i][j] instanceof Enemy) {
        enemies[map[i][j].id] = null;
        players[0].score++;
        document.getElementById('score').innerHTML = players[0].score;
    } else if (map[i][j] instanceof Player) {
        players[map[i][j].id].color = getRandomColor();
    }
    
}
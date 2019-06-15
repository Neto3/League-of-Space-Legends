var players = [];
var map = [];
var missiles = [];
var enemies = [];
var enemy_id = 0;

for (var i = 0; i < 25; i++) {
    map[i] = [];
    for (var j = 0; j < 40; j++) {
        map[i][j] = 0;
    }
}

var x;
var y;

class Player {

    constructor(x, y, color) {

        this.x = x;
        this.y = y;
        this.color = color;

    }

    moveUp(params) {
        this.y--;
    }

    moveRight() {
        this.x++;
    }

    moveDown() {
        this.y++;
    }

    moveLeft() {
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

players[0] = new Player(4, 12, "#FF0000");

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

function updateMap() {

    var date = new Date();

    for (var i = 0; i < 25; i++) {
        map[i] = [];
        for (var j = 0; j < 40; j++) {
            map[i][j] = 0;
        }
    }

    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        map[player.y][player.x] = player;
    }

    if (Math.floor(Math.random()*500) == 1) {
        enemies.push(new Enemy(Math.floor(Math.random()*10), 3, "#0000FF"));
    }

    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        map[enemy.y][enemy.x] = enemy;
    }

    for (var i = 0; i < missiles.length; i++) {
        var missile = missiles[i];
        if (date.getTime() - missile.launched_at.getTime() > 10) {
            missile.y--;
            missile.launched_at = new Date();
        }
        if (missile.y < 0 || missile.x < 0) {
            missiles.slice(i, 1);
        } else {
            if (map[missile.y][missile.x] instanceof Enemy) {
                enemies.splice(map[missile.y][missile.x].id, 1);
            }
            else
                map[missile.y][missile.x] = missile;
        }
    }

}


function updateCanvas() {

    updateMap();

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

setInterval(updateCanvas, 1000/60);

window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 38:
            players[0].moveUp();
            break;
        case 39:
            players[0].moveRight();
            break;
        case 40:
            players[0].moveDown();
            break;
        case 37:
            players[0].moveLeft();
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
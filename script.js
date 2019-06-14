var players = [];
var map = [];

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

    moveup(params) {
        this.y--;
    }

}

players[0] = new Player(4, 12, "#FF0000");



var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


function updateCanvas() {

    map[players[0].y][players[0].x] = players[0];

    for (y = 0; y < map.length; y++) {

        for (x = 0; x < map[y].length; x++) {

            if (map[y][x] == 0) {

                ctx.fillStyle = "#000000";
                ctx.fillRect(x * 20 + 1, y * 20 + 1, 18, 18);

            } else if (typeof map[y][x] === 'object' && map[y][x] instanceof Player) {

                ctx.fillStyle = map[y][x].color;
                ctx.fillRect(x * 20 + 1, y * 20 + 1, 18, 18);

            }             

        }

    }

}

setInterval(updateCanvas, 1000/60);

window.addEventListener('keydown', function (e) {
    if (e.keyCode == 38) {
        players[0].moveup();
    }
})
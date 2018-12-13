var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    backgroundColor: 'black',
    parent: 'Juego_nave',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [{
        preload: preload,
        create: create,
        update: update,
        extend: {
            generarAsteroides: generarAsteroides
        }
    }]
};

var game = new Phaser.Game(config);

var nave;
var derecha;
var izquierda;
var asteroides;

const vidaNave = 4;
const municionInicial = 4;
const velocidadNave = 800;
const minAsteroides = 2;
const maxAsteroides = 4;
const velocidadCaida = 5;
const tiempoAparicion = 600;

function preload() {
    this.load.image('nave','assets/sprites/nave.png');
    this.load.spritesheet('asteroides','assets/sprites/asteroides.png',{frameWidth: 64, frameHeight: 64});
}

function create() {
    nave = this.physics.add.sprite(game.config.width / 2, game.config.height - 100, 'nave');
    nave.vida = vidaNave;
    nave.municion = municionInicial;

    asteroides = this.physics.add.group({
        defaultKey: 'asteroides',
        frame: 0,
        maxSize: 50
    });

    this.time.addEvent({
        delay: tiempoAparicion,
        loop: true,
        callback: () => {
            this.generarAsteroides()
        }
    });

    derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

}

function update() {
    Phaser.Actions.IncY(asteroides.getChildren(), velocidadCaida);
    asteroides.children.iterate(function (asteroide) {
        if (asteroide.y > 600) {
            asteroides.killAndHide(asteroide);
        }
    });

    nave.body.setVelocityX(0);
    if (izquierda.isDown) {
        nave.body.setVelocityX(-velocidadNave);
    }
    else if (derecha.isDown) {
        nave.body.setVelocityX(velocidadNave);
    }
}

function generarAsteroides(){
    var numeroAsteroides = Phaser.Math.Between(minAsteroides, maxAsteroides);

    for (let i = 0; i < numeroAsteroides; i++) {
        var asteroide = asteroides.get();

        if(asteroide){
            asteroide.setActive(true).setVisible(true);
            asteroide.setFrame(Phaser.Math.Between(0,1));
            asteroide.y = -100;
            asteroide.x = Phaser.Math.Between(0,game.config.width);
            this.physics.add.overlap(asteroide, asteroides, (asteroideEnColicion) => {
                asteroideEnColicion.x = Phaser.Math.Between(0, game.config.width);
            });
        }
    }
}
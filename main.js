// Initialize Phaser
const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let playerSpeed = 201;
let laserGroup;
let enemyGroup;
let emitter;
let score = 0;
let scoreText;
let lives = 20;
let livesText;
let laser;
let oof;
let destroy;




function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('laser','assets/laser.png');
  this.load.image('enemy','assets/enemy.png');
  this.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion.json');
  this.load.audio('laser', 'assets/sounds/laser_player.ogg');
  this.load.audio('oof', 'assets/sounds/player_destroyed.ogg');
  this.load.audio('destroy', 'assets/sounds/enemy_destroyed.ogg');
}

function create() {
  player = this.physics.add.sprite(100, 450, 'player');

  laserGroup = new LaserGroup(this);
  enemyGroup = new EnemyGroup(this);
  enemyGroup.children.iterate(function (child) {
    move(child, this);
  }, this);
  emitter = this.add.particles(0,0,'explosion',
                               {
                                 frame: ['red','yellow','green','blue','purple'],
                                 lifespan: 1000,
                                 speed: {min: 50, max: 100},
                                 emitting: false
                               });
  this.physics.add.overlap(enemyGroup, laserGroup, (enemy, laser) => {
    laserCollision(enemy, laser, this);
  });
  scoreText = this.add.text(16, 16, 'Score is 0', {fontSize: '32px', fill: '#FFFF00'});
   livesText = this.add.text(16, 50, 'You have ' + lives + ' lives left.', {fontSize: '32px', fill: '#FFFF00'}); 
  this.physics.add.overlap(player, enemyGroup, (player, enemy) => {
    playerEnemyCollision(player, enemy, this);
  });
  laser = this.sound.add('laser');
  oof = this.sound.add('oof');
  destroy = this.sound.add('destroy');
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();
  if (cursors.right.isDown) {
    player.setVelocityX(playerSpeed);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-playerSpeed);
  } else {
    player.setVelocityX(0);
  }
  if (cursors.space.isDown && Phaser.Input.Keyboard.JustDown(cursors.space) && lives > 0) {
    laser.play();
fireLaser(laserGroup, player);
}
    // Check for out-of-bounds lasers
  checkLaserOutOfBounds(laserGroup);
  checkEnemyOutOfBounds(enemyGroup, this);


}
function laserCollision(enemy, laser, scene) {
  destroy.play();
  emitter.explode(40, enemy.x, enemy.y);
  laser.setActive(false);
  laser.setVisible(false);
  laser.disableBody(true, true);
  move(enemy, scene);
  score += 10;
  scoreText.setText('Score is ' + score);
}
function playerEnemyCollision(player, enemy, scene) {
  oof.play()
    // Call move function for each enemy in the group
    enemyGroup.children.iterate(function (child) {
      move(child, scene);
    });
    lives --;
    livesText.setText('You have ' + lives + ' lives left.');
    if(lives <= 0){
       player.setActive(false);
      player.setVisible(false);
      player.disableBody(true, true); // Disable player's physics body
      gameOverText = scene.add.text(scene.game.config.width / 2, scene.game.config.height / 2, 'Game Over', { fontSize: '32px', fill: '#ff0000' });
      gameOverText.setOrigin(0.5, 0.5); // Center the text
    }
  }

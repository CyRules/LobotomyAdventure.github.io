class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      key: 'enemy',
      frameQuantity: 20,
      active: false,
      visible: false
    });
  }
}
function move(enemy, scene) {
  // Randomize the enemy's starting position at the top of the screen
  enemy.x = Phaser.Math.Between(0, scene.game.config.width);
  enemy.y = 0;
  // Make the enemy active and visible
  enemy.setActive(true);
  enemy.setVisible(true);
  // Randomize the enemy's movement direction (left or right)
  let direction = Phaser.Math.Between(0, 1) ? -1 : 1;
  // Set the enemy's velocity for downward movement
  enemy.setVelocityY(150);
  enemy.setVelocityX(direction * 50); // Add horizontal movement
}
function checkEnemyOutOfBounds(enemyGroup, scene) {
  enemyGroup.children.iterate(function (child) {
    if (child.y > scene.game.config.height) {
      move(child, scene);
    }
  });
}
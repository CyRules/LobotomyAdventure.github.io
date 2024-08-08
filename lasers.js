class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      key: 'laser',
      frame: 0,
      repeat: 19,
      setXY: {
        x: -100,
        y: -100,
        stepX: 0,
        stepY: 0
      },
      active: false,
      visible: false
    });
  }
}
function fireLaser(laserGroup, player) {
  let laser = laserGroup.getFirstDead(false, player.x, player.y);
  if (laser) {
    laser.setActive(true);
    laser.setVisible(true);
    laser.setVelocityY(-600);
    laser.enableBody();
  }
}
function checkLaserOutOfBounds(laserGroup) {
  laserGroup.children.iterate(function (child) {
    if (child.y < 0) {
      child.setActive(false);
      child.setVisible(false);
      child.disableBody(true, true);
      child.setVelocity(0,0);
    }
  });
}

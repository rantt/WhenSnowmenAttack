var Snowman = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'snowman',5);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('walk', [6,5], 3);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.immovable = false;
  // this.body.collideWorldBounds = true;
  this.health = 3;
};

Snowman.prototype = Object.create(Phaser.Sprite.prototype);
Snowman.prototype.constructor = Snowman;

var Snowman = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'snowman');
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('walk', [1,0], 3);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.immovable = false;
  // this.body.collideWorldBounds = true;
  this.health = 3;

  this.emitter = this.game.add.emitter(0, 0, 200);
  this.emitter.makeParticles('snowflakes',[0,1,2,3,4]); 
  this.emitter.gravity = 1;
  this.emitter.minParticleSpeed.setTo(-200, -200);
  this.emitter.maxParticleSpeed.setTo(200, 200);


};

Snowman.prototype = Object.create(Phaser.Sprite.prototype);
Snowman.prototype.dead = function() {
  this.emitter.x = this.x;
  this.emitter.y = this.y;
  this.emitter.start(true, 1000, null, 200);
};
Snowman.prototype.hit = function() {
  this.emitter.x = this.x;
  this.emitter.y = this.y;
  this.emitter.start(true, 100, null, 10);
};

Snowman.prototype.constructor = Snowman;

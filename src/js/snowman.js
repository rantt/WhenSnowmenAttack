var Snowman = function(game, x, y, type) {
  this.game = game;
  this.type = type;


  if (this.type === 1) {
    Phaser.Sprite.call(this, this.game, x, y, 'snowman');
    this.animations.add('walk', [1,0], 3);
  }else if (this.type === 2) {
    Phaser.Sprite.call(this, this.game, x, y, 'snowman',2);
    this.animations.add('walk', [3,4,2], 3);
  }

  this.anchor.setTo(0.5, 0.5);
    

  this.game.physics.enable(this, Phaser.Physics.ARCADE);
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

  //fade effect on dmg
  // var t =  this.game.add.tween(this).to({alpha: 0.3},100).to({alpha: 1},100);

  //flash red on dmg
  var t =  this.game.add.tween(this).to({tint: 0xff0000},100).to({tint: 0xffffff},100);
  t.start();
};

Snowman.prototype.constructor = Snowman;

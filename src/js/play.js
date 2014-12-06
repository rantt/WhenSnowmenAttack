/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// var musicOn = true;

var wKey;
var aKey;
var sKey;
var dKey;
var spaceKey;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.ARCADE);

    this.stepInterval = 1000;
    this.nextStep = this.game.time.now + this.stepInterval;

    this.map = this.game.add.tilemap('woods');
    this.map.addTilesetImage('woods');
    this.layer1 = this.map.createLayer('layer1');
    this.layer1.resizeWorld();
    this.layer2 = this.map.createLayer('layer2');
    this.layer2.resizeWorld();
    

    this.player = this.game.add.sprite(96, 128, 'player');
    this.player.anchor.setTo(0.5,0.5);
    this.player.animations.add('walk',[0,1],3,true);
    this.player.animations.add('throw', [2,3],20);
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.animations.play('walk');
    this.player.throwing = false;


    //player snowballs
    this.snowballs = this.game.add.group();
    this.snowballs.enableBody = true;
    this.snowballs.physicsBodyType = Phaser.Physics.ARCADE;
    this.snowballs.createMultiple(30, 'snowball', 0, false);
    this.snowballs.setAll('anchor.x', 0.5);
    this.snowballs.setAll('anchor.y', 0.5);
    this.snowballs.setAll('outOfBoundsKill', true);
    this.snowballs.setAll('checkWorldBounds', true);


    this.snowman = this.game.add.sprite(700, (64*rand(0,7))+128, 'snowman',5);
    this.snowman.animations.add('walk', [6,5],3);
    this.snowman.anchor.setTo(0.5,0.5);
    this.game.physics.enable(this.snowman, Phaser.Physics.ARCADE);
    this.snowman.body.immovable = false;
    this.snowman.body.collideWorldBounds = true;
    this.snowman.health = 3;

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    this.cursors = this.game.input.keyboard.createCursorKeys();

  },

  snowballHitSnowman: function(snowman,snowball) {
    snowman.damage(1);
    snowball.kill();
    console.log('snowman hp',snowman.hp);

    // snowman.tint = 0xff0000;
    // snowball.tint = 0xffff00;

    console.log('Ouch!!',snowball);
  },
  playerActions: function() {
    if (wKey.isDown || this.cursors.up.isDown) {
      if ((this.player.posUpdate === false) && (this.player.y !== 128)) {
        this.player.y -= 64;
        this.player.posUpdate = true;
        console.log('player y',this.player.y);
      }
    } else if(sKey.isDown || this.cursors.down.isDown) {
      if ((this.player.posUpdate === false) && (this.player.y !== 576)) {
        this.player.y += 64;
        this.player.posUpdate = true;
        console.log('player y',this.player.y);
      }
    } else {
     this.player.posUpdate = false; 
    }

    //Throw Snowball
    if (spaceKey.isDown) {
      if (this.player.throwing !== true) {
        this.player.animations.play('throw');
        var snowball = this.snowballs.getFirstExists(false);
        snowball.reset(this.player.x, this.player.y);
        this.game.physics.arcade.moveToXY(snowball, this.player.x+600, this.player.y,700);
        snowball.scale.x = 2;
        snowball.scale.y = 2;
        this.player.throwing = true;
      }
    }else {
      this.player.throwing = false;
      this.player.animations.play('walk');
    }
  },  
  update: function() {
    //Collisions
    this.game.physics.arcade.overlap(this.snowballs, this.snowman, this.snowballHitSnowman, null, this);


    this.playerActions();

    //Snowman Movements
    
    //Move toward player every this.intervalTime
    if ((this.game.time.now - this.nextStep) > 0) {
      if (this.snowman.alive === true) {
       this.snowmanMoves(this.snowman); 
      }
      this.nextStep = this.game.time.now + this.stepInterval;
    }

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  snowmanMoves:  function(snowman) {
    if (this.moving) {
      return;
    }
    this.moving = true;
    console.log('snoman xpos',snowman.x);

    snowman.play('walk');
    var t = this.game.add.tween(snowman).to({x: snowman.x-64},100);
    t.start();
    t.onComplete.add(function() {
      this.moving = false;
    },this);
    
  },
  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  render: function() {
    // this.game.debug.spriteInfo(this.snowman, 64,64);
    // this.game.debug.spriteInfo(this.snowballs, 64,64);
  }


};

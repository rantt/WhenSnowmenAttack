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

// var snowmen = [];
var snowmenAlive = 0;
var snowmenTotal = 3;
var snowmenMax = 3;

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


    this.snowmen = this.game.add.group();

    var positions = [];
    for (var i = 0; i < 8;i++) {

      positions.push(i);
    }
    
    for (var i = 0; i < snowmenTotal; i++) {
     
      // Picks a positions from the positions array and removes
      // it so the next snowman can't takethat position
      var snowman = this.game.add.sprite(700, (64*positions.splice(Math.floor(Math.random() * positions.length),1))+128, 'snowman',5);
      snowman.animations.add('walk', [6,5],3);
      snowman.anchor.setTo(0.5,0.5);
      this.game.physics.enable(snowman, Phaser.Physics.ARCADE);
      snowman.body.immovable = false;
      snowman.body.collideWorldBounds = true;
      snowman.health = 3;

      //Add to the Snowman club
      this.snowmen.add(snowman);
    }

    this.wavePosition = 0;
    this.wave1 = [  [0, 0, 1],
                    [0, 1, 0],
                    [0, 0, 1],
                    [0, 0, 1],
                    [0, 0, 1],
                    [0, 0, 1],
                    [0, 0, 1],
                    [0, 0, 1]
                 ]
                 // console.log(this.wave1[0][2]);


    //this.game.add.emitter(x,y,maxNumberOfParticles)
    this.emitter = this.game.add.emitter(0, 0, 200);
    this.emitter.makeParticles('snowflakes'); 
    this.emitter.gravity = 0;
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(200, 200);
    this.emitter.minRotation = 0
    this.emitter.maxRotation = 40;

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

    // console.log('snowman hp',snowman.hp);

    if (snowman.alive === false) {
      // this.emitter.start(explode, lifespan, frequency, quantity, forceQuantity)
      this.emitter.x = snowball.x;
      this.emitter.y = snowball.y;
      this.emitter.start(true, 500, null, 200);
    }else {
      this.emitter.x = snowball.x;
      this.emitter.y = snowball.y;
      this.emitter.start(true, 100, null, 10);
    }

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

    this.playerActions();

    //Snowman Movements
    //Move toward player every this.intervalTime
    this.snowmen.forEach(function(s) {
      if ((this.game.time.now - this.nextStep) > 0) {
        if (s.alive === true) {
          //Move to player unless you're dead, in that case you can sit this one out :p
          this.snowmanMoves(s);
        }
      }
      //Did the Snowball hit the Snowman?...I hope so
      this.game.physics.arcade.overlap(this.snowballs, s, this.snowballHitSnowman, null, this);
    }, this); 

    if ((this.game.time.now - this.nextStep) > 0) {
      this.nextStep = this.game.time.now + this.stepInterval;
      
      // for(var i=0; i < this.wave1[0].length;i++) {

        console.log(this.wavePosition);
        var line = "";
        for(var j=0;j < 8;j++) {
          line += String(this.wave1[j][this.wavePosition]);
        }
        console.log(line);
      // }
      if (this.wavePosition < (this.wave1[0].length - 1)) {
        this.wavePosition += 1;
      }

    }


    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  snowmanMoves:  function(snowman) {
    // console.log('snowman xpos',snowman.x);

    snowman.play('walk');
    var t = this.game.add.tween(snowman).to({x: snowman.x-64},100);
    t.start();
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



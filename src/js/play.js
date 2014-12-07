/*global Game*/
/*global Snowman*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

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

    //Initialize Steps
    this.stepInterval = 1000;
    // this.stepInterval = 1500;
    this.nextStep = this.game.time.now + this.stepInterval;
    
    //Add SFX
    this.hitSnd = this.game.add.sound('hit');
    this.hitSnd.volume = 0.5;
    this.deadSnd = this.game.add.sound('dead');
    this.deadSnd.volume = 0.5;
    this.throwSnd = this.game.add.sound('throw');
    this.throwSnd.volume = 0.5;

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

    this.wavePosition = 0;
    this.wave1 = [  [1,0,0,1],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,1,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,1]
                 ];
                 // console.log(this.wave1[0][2]);
  

    //this.game.add.emitter(x,y,maxNumberOfParticles)
    this.emitter = this.game.add.emitter(0, 0, 200);
    this.emitter.makeParticles('snowflakes'); 
    this.emitter.gravity = 0;
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(200, 200);
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 40;

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    // aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    // dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
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
      this.deadSnd.play();
      this.emitter.x = snowball.x;
      this.emitter.y = snowball.y;
      this.emitter.start(true, 500, null, 200);
    }else {
      this.hitSnd.play();
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
        this.throwSnd.play();
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
      
      //Advance Wave on clock interval step
      this.loadNextWave();

    }

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  loadNextWave: function() {
    // Exit if we've reached the end of the wave
    if (this.wavePosition === (this.wave1[0].length)){
      return;
    }
    var line = '';
    for(var j=0;j < 8;j++) {
      line += String(this.wave1[j][this.wavePosition]);

      if (this.wave1[j][this.wavePosition] === 1) {
        console.log('made a snowman at position', j);
        // 736 last block
        // 800 Just Off Screen
        // this.snowmen.add(new Snowman(this.game, 736, (64*j)+128) ); 
        this.snowmen.add(new Snowman(this.game, 800, (64*j)+128) ); 
      }
        
    }
    console.log(line);

    //Update WavePosition
    if (this.wavePosition < (this.wave1[0].length)) {
      this.wavePosition += 1;
    }
  },
  snowmanMoves:  function(snowman) {
    if (snowman.x < 0) {
      snowman.kill();
      return;
    }

    console.log('snowman xpos',snowman.x);
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



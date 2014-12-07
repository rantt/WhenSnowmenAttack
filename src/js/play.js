/*global Game*/
/*global Snowman*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// var musicOn = true;

var wKey;
var sKey;
// var aKey;
// var dKey;
var spaceKey;
var snowmanSnowballs;


Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.ARCADE);
    this.game.stage.backgroundColor = '#000';

    //Initialize Steps
    // this.stepInterval = 1000;
    this.stepInterval = 1500;
    this.nextStep = this.game.time.now + this.stepInterval;

    this.topY = 128;
    this.bottomY = 384; 
    
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
    

    // this.player = this.game.add.sprite(96, 128, 'player');
    this.player = this.game.add.sprite(96, this.topY, 'player');
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

    //Snowman Snowballs
    snowmanSnowballs = this.game.add.group();
    snowmanSnowballs.enableBody = true;
    snowmanSnowballs.physicsBodyType = Phaser.Physics.ARCADE;
    snowmanSnowballs.createMultiple(100, 'snowball');
    snowmanSnowballs.setAll('anchor.x', 0.5);
    snowmanSnowballs.setAll('anchor.y', 0.5);
    snowmanSnowballs.setAll('outOfBoundsKill', true);
    snowmanSnowballs.setAll('checkWorldBounds', true);


    this.snowmen = this.game.add.group();

    this.wavePosition = 0;
    this.waveCount = 0;
    this.waveTimer = this.game.time.now + 3000;
    this.waveText = this.game.add.bitmapText(Game.w/2, Game.h/2,'minecraftia', '', 20);
    this.snowmanCount = 0;
    this.ready = false;


    this.waves = [];

    var wave1 = [  [1,0,0,1,0],
                   [0,0,0,0,0],
                   [0,0,0,0,0],
                   [0,1,0,0,0],
                   [0,0,0,0,0],
                   [0,0,0,0,0],
                   [0,0,0,0,0],
                   [0,0,0,1,0]
                 ];
    var wave2 = [  [0,0,0,0],
                   [0,0,0,0],
                   [0,1,0,1],
                   [1,0,1,0],
                   [0,1,0,1],
                   [1,0,1,0],
                   [0,0,0,0],
                   [0,0,0,0]
                 ];
    var wave3 = [  [1,0,0,0,1],
                   [0,0,0,1,0],
                   [0,0,1,0,0],
                   [0,1,0,0,0],
                   [0,1,0,0,0],
                   [0,0,1,0,0],
                   [0,0,0,1,0],
                   [1,0,0,0,1]
                 ];

    var wave4 = [  [1,0,0,2],
                   [1,0,0,0],
                   [1,0,0,0],
                   [2,0,2,0],
                   [0,0,0,0]
                   // [2,0,2,0],
                   // [0,0,0,0],
                   // [0,0,0,2]
                 ];


    // this.waves.push(wave1);
    // this.waves.push(wave2);
    // this.waves.push(wave3);
    this.waves.push(wave4);

    console.log(this.waves);
    
  
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

    snowball.kill();
    snowman.damage(1);

    if (snowman.alive === false) {
      this.snowmanCount -= 1;
      this.deadSnd.play();
      snowman.dead();
    }else {
      this.hitSnd.play();
      snowman.hit();
    }

    // snowman.tint = 0xff0000;
    // snowball.tint = 0xffff00;

    console.log('Ouch!!',snowball);
  },
  playerActions: function() {
    if (wKey.isDown || this.cursors.up.isDown) {
      if ((this.player.posUpdate === false) && (this.player.y !== this.topY)) {
        this.player.y -= 64;
        this.player.posUpdate = true;
        console.log('player y',this.player.y);
      }
    } else if(sKey.isDown || this.cursors.down.isDown) {
      if ((this.player.posUpdate === false) && (this.player.y !== this.bottomY)) {
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
        // snowball.scale.x = 1.5;
        // snowball.scale.y = 1.5;
        this.player.throwing = true;
      }
    }else {
      this.player.throwing = false;
      this.player.animations.play('walk');
    }
  },  
  update: function() {

    this.playerActions();

    //this.waveText.text = 'Incoming!';
    if ((this.waveTimer - this.game.time.now) > 0) {
      this.waveText.tint = 0xff0000;
      this.waveText.text = 'Incoming';
    }else {
      this.waveText.text = '';
    }


    if (this.waveTimer === 0) {
      this.waveTimer = this.game.time.now+3000;
    }else if (this.game.time.now > this.waveTimer) {
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
     
    }

    // console.log('waiting',this.ready,'count',this.snowmanCount);
    if ((this.ready === true) && (this.snowmanCount === 0)) {
        this.ready = false;
        this.wavePosition = 0;
        this.waveCount += 1;
        this.waveTimer = 0;
    } 

    // if ((this.snowmanCount === 0) ) {
    //   this.waveTimer = 0;
    // }

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  loadNextWave: function() {
    // Exit if we've reached the end of the wave
    var wave = this.waves[this.waveCount];
    if (this.wavePosition === (wave[0].length)){
      //If there's a wave after this one
      if (this.waves[this.waveCount+1] !== undefined) {
        this.ready = true;
      }else {
        return;
      }
    }
    var line = '';
    // for(var j=0;j < 8;j++) {
    for(var j=0;j < 5;j++) {
      line += String(wave[j][this.wavePosition]);

      if (wave[j][this.wavePosition] !== 0) {
        console.log('made a snowman at position', j);
        // 736 last block
        // 800 Just Off Screen
        // this.snowmen.add(new Snowman(this.game, 736, (64*j)+128) ); 
        this.snowmen.add(new Snowman(this.game, 800, (64*j)+this.topY, wave[j][this.wavePosition], snowmanSnowballs )); 
        this.snowmanCount += 1;
      }
        
    }
    console.log(line);

    //Update WavePosition
    if (this.wavePosition < (wave.length)) {
      this.wavePosition += 1;
    }
  },
  snowmanMoves:  function(snowman) {
    if (snowman.x < 0) {
      snowman.kill();
      return;
    }

    // console.log('snowman xpos',snowman.x);
    console.log('type',snowman.rank);
    snowman.play('walk');
    var t = this.game.add.tween(snowman).to({x: snowman.x-64},100);
    t.start();
    if (snowman.rank === 2) {
      t.onComplete.add(function() {
        snowman.throwSnowball(this.player);
        console.log('throw some shit');
      },this);
    }
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



/*global Game*/
/*global Snowman*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */


var wKey;
var sKey;
var spaceKey;
var snowmanSnowballs;


Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.ARCADE);

    //Load LocalStorage Variables
    this.levelUnlocked = JSON.parse(localStorage.getItem('levelUnlocked'));
    this.waveCount = JSON.parse(localStorage.getItem('waveCount'));

    //Initialize Steps
    // this.stepInterval = 1000;
    this.stepInterval = 1500;
    this.nextStep = this.game.time.now + this.stepInterval;
    this.gameOver = false;

    this.topY = 128;
    this.bottomY = 384; 
    
    //Add SFX
    this.hitSnd = this.game.add.sound('hit');
    this.hitSnd.volume = 0.5;
    this.deadSnd = this.game.add.sound('dead');
    this.deadSnd.volume = 0.5;
    this.throwSnd = this.game.add.sound('throw');
    this.throwSnd.volume = 0.5;
    this.playerHitSnd = this.game.add.sound('playerHit');
    this.playerHitSnd.volume = 0.5;
    this.playerDeadSnd = this.game.add.sound('playerDead');
    this.playerDeadSnd.volume = 0.5;

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
    this.player.health = 10;
    this.player.maxHealth = 10;

   
    // this.playerHealthText = this.game.add.bitmapText(10, 16,'minecraftia','Life:',20);
    // this.playerHealthBar = this.game.add.sprite(100, 16, this.drawRect(260,20,'#33ff00'));
    //
    this.levelText = this.game.add.bitmapText(Game.w - 120, 16, 'minecraftia', 'Level: '+String(this.waveCount + 1), 20); 

    //player snowballs
    this.snowballs = this.game.add.group();
    this.snowballs.enableBody = true;
    this.snowballs.physicsBodyType = Phaser.Physics.ARCADE;
    this.snowballs.createMultiple(30, 'snowball', 0, false);
    this.snowballs.setAll('anchor.x', 0.5);
    this.snowballs.setAll('anchor.y', 0.5);
    this.snowballs.setAll('outOfBoundsKill', true);
    this.snowballs.setAll('checkWorldBounds', true);
    // this.snowballs.setAll('tint',0x00FFFF);

    //Snowman Snowballs
    snowmanSnowballs = this.game.add.group();
    snowmanSnowballs.enableBody = true;
    snowmanSnowballs.physicsBodyType = Phaser.Physics.ARCADE;
    snowmanSnowballs.createMultiple(30, 'snowball');
    snowmanSnowballs.setAll('anchor.x', 0.5);
    snowmanSnowballs.setAll('anchor.y', 0.5);
    snowmanSnowballs.setAll('outOfBoundsKill', true);
    snowmanSnowballs.setAll('checkWorldBounds', true);
    // snowmanSnowballs.setAll('tint',0xF0FFF0);
    // snowmanSnowballs.setAll('tint',0x98FB98);


    this.snowmen = this.game.add.group();
    // this.snowmen.createMultiple(30, new Snowman(this.game,0,0,1,snowmanSnowballs));
    this.wavePosition = 0;
    // this.waveCount = 0;
    this.waveTimer = this.game.time.now + 3000;
    this.waveText = this.game.add.bitmapText(Game.w/2-140, Game.h/2,'minecraftia', '', 30);
    this.snowmanCount = 0;
    this.ready = false;


    this.waves = [];

    var wave1 = [  [0,0,0,0,0,0,1,0,0],
                   [2,0,0,0,0,0,0,0,0],
                   [1,0,0,0,1,0,0,0,0],
                   [0,0,1,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,1],
                 ];
    var wave2 = [  [0,0,1,0,0,0,0],
                   [0,0,1,0,1,0,0],
                   [0,0,0,0,0,0,1],
                   [1,0,0,0,1,0,0],
                   [1,0,0,0,0,0,1]
                 ];
    var wave3 = [  [1,0,0,0,0,0,1,0,0],
                   [1,0,0,0,1,0,1,0,0],
                   [1,0,1,0,1,0,0,0,1],
                   [0,0,1,0,0,0,0,0,1],
                   [0,0,1,0,0,0,1,0,1]
                 ];
    var wave4 = [  [0,0,1,0],
                   [0,1,1,0],
                   [1,0,1,0],
                   [0,1,1,0],
                   [0,0,1,0]
                 ];
    var wave5 = [  [0,0,0,0,0,0,0],
                   [2,0,0,0,2,0,0],
                   [0,0,2,0,0,0,0],
                   [0,0,0,0,0,0,2],
                   [0,0,0,0,0,0,0]
                 ];

    var wave6 = [  [0,0,0,0,0,0,0,1],
                   [0,0,0,0,1,0,2,0],
                   [2,0,1,0,2,0,1,0],
                   [0,0,0,0,1,0,2,0],
                   [0,0,0,0,0,0,0,1]
                 ];

    var wave7 = [  [0,0,0],
                   [0,0,0],
                   [0,3,0],
                   [0,0,0],
                   [0,0,0]
                 ];

    var wave8 = [  [2,0,0],
                   [0,0,0],
                   [0,3,0],
                   [0,0,0],
                   [2,0,0]
                 ];

    var wave9 = [  [0,0,0],
                   [0,0,0],
                   [0,4,0],
                   [0,0,0],
                   [0,0,0]
                 ];

    var wave10 = [  [0,0,0],
                    [0,3,0],
                    [0,0,0],
                    [0,4,0],
                    [0,0,0]
                 ];



    this.waves.push(wave1);
    this.waves.push(wave2);
    this.waves.push(wave3);
    this.waves.push(wave4);
    this.waves.push(wave5);
    this.waves.push(wave6);
    this.waves.push(wave7);
    this.waves.push(wave8);
    this.waves.push(wave9);
    this.waves.push(wave10);

    // console.log(this.waves);
    
  
    // // Music
    this.music = this.game.add.sound('music');
    this.music.volume = 0.4;
    this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    // aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    // dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    this.cursors = this.game.input.keyboard.createCursorKeys();

      // this.game.scale.maxWidth = window.innerHeight*(Game.w/Game.h);
      this.dpad = this.game.add.group();
      this.up = this.game.add.sprite(80, Game.h-160, 'dpad',3);
      this.dpad.add(this.up);

      this.down = this.game.add.sprite(80, Game.h-60, 'dpad',0);
      this.dpad.add(this.down);
      //  
      // this.toggleButton = this.game.add.sprite(Game.w-60, Game.h-40, 'dpad',3);
      // this.dpad.add(this.toggleButton);

      this.dpad.forEach(function(d) {
        d.fixedToCamera = true;
        d.inputEnabled = true;
        d.anchor.setTo(0.5,0.5);
      }, this);

    this.hearts = [];
    this.initHealthBar();

  },
  drawRect: function(width, height,color) {
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
  },
  snowballHitSnowman: function(snowman,snowball) {

    snowball.kill();
    // snowman.damage(1);
    snowman.health -= 1;

    // if (snowman.alive === false) {
    if ((snowman.health <= 0) && (snowman.dying === false)) {
      this.snowmanCount -= 1;
      this.deadSnd.play();
      snowman.dead();
    }else {
      this.hitSnd.play();
      snowman.hit();
    }

    // snowman.tint = 0xff0000;
    // snowball.tint = 0xffff00;

  },
  playerActions: function() {
    if (this.player.alive === false) {
      return;
    }
    if (wKey.isDown || this.cursors.up.isDown || this.up.input.pointerDown(this.game.input.activePointer.id)) {
      if ((this.player.posUpdate === false) && (this.player.y !== this.topY)) {
        this.player.y -= 64;
        this.player.posUpdate = true;
        // console.log('player y',this.player.y);
      }
    } else if(sKey.isDown || this.cursors.down.isDown || this.down.input.pointerDown(this.game.input.activePointer.id)) {
      if ((this.player.posUpdate === false) && (this.player.y !== this.bottomY)) {
        this.player.y += 64;
        this.player.posUpdate = true;
        // console.log('player y',this.player.y);
      }
    } else {
     this.player.posUpdate = false; 
    }

    //Throw Snowball
    if (spaceKey.isDown || this.game.input.activePointer.isDown) {
      if (this.player.throwing !== true) {
        this.throwSnd.play();
        this.player.animations.play('throw');
        var snowball = this.snowballs.getFirstExists(false);
        snowball.reset(this.player.x, this.player.y);
        this.game.physics.arcade.moveToXY(snowball, this.player.x+600, this.player.y,500);

        //Put some backspin on the snowball
        var t = this.game.add.tween(snowball).to({angle: -540},1500);
        t.start();
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

    if (this.player.alive === true) {
      this.playerActions();
      this.game.physics.arcade.overlap(snowmanSnowballs, this.player, this.snowballHitPlayer, null, this);

      //this.waveText.text = 'Incoming!';
      if ((this.waveTimer - this.game.time.now) > 0) {
        this.waveText.tint = 0xffff00;
        this.waveText.text = 'Incoming: Wave '+(this.waveCount + 1);
        this.levelText.text = 'Level: '+String(this.waveCount + 1); 
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
            // this.game.physics.arcade.overlap(s.snowballs, this.player, this.playerHit(2), null, this);
            if ((s.alive === true) && (s.dying === false)) {
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

      //If all the snowmen for this wave have made it to the screen
      //and they are all dead.  Prepare for the next wave
      if ((this.ready === true) && (this.snowmanCount === 0)) {
          this.ready = false;
          this.wavePosition = 0;
          this.waveCount += 1;
          this.waveTimer = 0;
      }
      if ((this.gameOver === true) && (this.snowmanCount === 0)) {
        this.waveText.tint = 0x00ff00;
        this.waveText.fontSize = 40;
        this.waveText.text = 'YOU WIN!';

        this.twitterButton = this.game.add.button(550, 550,'twitter', this.twitter, this);
        this.twitterButton.fixedToCamera = true;
      }
    }else {
      this.waveText.fontSize = 30;
      this.waveText.tint = 0xff0000;
      this.waveText.text = 'You Died.  Click to retry.';
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
        this.music.stop();
      }

    } 

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  twitter: function() {
    window.open('http://twitter.com/share?text=I+Survived+The+Snowpocalypse!+See+if+you+can!++at&via=rantt_&url=http://www.divideby5.com/games/WhenSnowmenAttack/', '_blank');
  },

  resetSprite: function(sprite) {
    if(this.resurrecting) {
      return;
    }
    this.resurrecting = true;
    var t = this.game.add.tween(sprite).to({alpha: 1},2000);
    t.start();
    t.onComplete.add(function() {
      this.resurrecting = false;
    },this);

  },
  loadNextWave: function() {
    // Exit if we've reached the end of the wave
    var wave = this.waves[this.waveCount];


    //Save Highest Level
    if (this.waveCount > this.levelUnlocked) {
      localStorage.setItem('levelUnlocked', this.waveCount);
    }

    if (this.wavePosition === (wave[0].length)){
      if (this.waves[this.waveCount+1] !== undefined) {
        this.ready = true;
        return;
      }else {
        // console.log('game over');
        this.gameOver = true;
        return;
      }
    }
    for(var j=0;j < 5;j++) {
      this.line += String(wave[j][this.wavePosition]);
      if (wave[j][this.wavePosition] !== 0) {
        // 736 last block
        // 800 Just Off Screen
        // this.snowmen.add(new Snowman(this.game, 736, (64*j)+128) ); 
        // console.log('iam a',wave[j][this.wavePosition],this.wavePosition);
        // this.snowmen.add(new Snowman(this.game, 800, (64*j)+this.topY, wave[j][this.wavePosition], snowmanSnowballs )); 
        //var snowball = this.snowballs.getFirstExists(false);
        //snowball.reset(this.player.x, this.player.y);
        // console.log('snowman'+this.snowmen.getFirstExists(false));
        if (this.snowmen.getFirstExists(false) === null) {
          this.snowmen.add(new Snowman(this.game, 800, (64*j)+this.topY, wave[j][this.wavePosition], snowmanSnowballs ));
        }else {
          var snowman = this.snowmen.getFirstExists(false);  
          // console.log('rank'+wave[j][this.wavePosition]);
          snowman.reset(800,(64*j)+this.topY, wave[j][this.wavePosition]);

          // console.log(snowman);
       } 

        // snowman.reset(800, (64*j)+this.topY);
        this.snowmanCount += 1;
      }
      // console.log(line);
      // console.log('size',wave.length);
        
    }

    //Update WavePosition
    if (this.wavePosition < (wave[0].length)) {
      this.wavePosition += 1;
    }
  },
  snowmanMoves:  function(snowman) {
    if (snowman.x < 0) {
      snowman.kill();
      return;
    }
    // if (snowman.dying === true) {
    //   return;
    // }

    // console.log('snowman xpos',snowman.x);
    // console.log('type',snowman.rank);
    snowman.play('walk');

    //Keep moving forward to great victory!!!
    var t = this.game.add.tween(snowman).to({x: snowman.x-64},100);
    t.start();
    t.onComplete.add(function() {
      if (snowman.x === this.player.x) {
        this.deadSnd.play();
        snowman.suicide();
        this.playerHit(2);
        this.snowmanCount -= 1;
      }else if((snowman.rank === 2) || (snowman.rank === 4)) {
        // if (this.player.alive === true) {
          snowman.throwSnowball(this.player);
        // }
      }
     },this);

  },
  playerHit: function(dmg) {
    var t;
    this.player.health -= dmg;
    if (this.player.health > 0) {
      this.playerHitSnd.play();
      this.updateHealthBar(this.player.health); 
      // this.playerHealthBar.scale.x = this.player.health/this.player.maxHealth;

      t =  this.game.add.tween(this.player).to({alpha: 0.3},100).to({alpha: 1},100);
      t.start();
    }else {
      this.playerDeadSnd.play();
      // this.playerHealthBar.scale.x = 0;
      this.updateHealthBar(0);
      this.player.animations.stop();
      this.player.frame = 4;
      this.player.alive = false;
      t = this.game.add.tween(this.player).to({alpha: 0}, 3000);
      t.start();
      t.onComplete.add(function() {
        this.player.kill();
        //Call End Of Game Function
      }, this);
    }
  },
  initHealthBar: function() {
    var xpos = 32;
    for (var i = 0;i < this.player.maxHealth;i++) {
      var heart = this.game.add.sprite(xpos,26,'heart');
      heart.anchor.setTo(0.5,0.5);
      heart.frame = 0;
      this.hearts.push(heart);
      console.log(heart);
      xpos += 36;
    }
  },
  updateHealthBar: function() {
    for (var i = 0;i < this.hearts.length;i++) {
      if (i < this.player.health) {
        this.hearts[i].frame = 0;
      }else {
        this.hearts[i].frame = 2;
      }
    }
  },
  snowballHitPlayer: function(player, snowball) {
    snowball.kill();
    this.playerHit(1);
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



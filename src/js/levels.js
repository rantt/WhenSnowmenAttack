/*global Game*/

Game.Levels = function(game) {
  this.game = game;
};

Game.Levels.prototype = {
  create: function() {
    this.levelUnlocked = JSON.parse(localStorage.getItem('levelUnlocked'));
    
    this.levels = [];
    var levelCount = 4;
    var xpos = 48;
    var ypos = 48;
    for (var i = 0; i < levelCount;i++) {

// game.add.button(game.world.centerX, game.world.centerY, 'button', actionOnClick, this, 1, 0, 2);
      var level = this.game.add.button(xpos, ypos, 'levelBadge', this.actionOnClick, this, 0);
      level.waveCount = i;
      level.anchor.setTo(0.5,0.5);

      xpos += 56
      console.log(this.levelUnlocked); 
      if (i <= this.levelUnlocked) {
        var levelNumber = this.game.add.bitmapText(level.x - 11, level.y - 13, 'minecraftia', String(i+1), 24);
        levelNumber.tint = 0x96fbff;
      }else {
        level.frame = 1;
        level.setFrames(1);
      }
       
    }
    

  },
  actionOnClick: function(btn) {
    // console.log(btn.waveCount);
    console.log(btn.frame);
    if (btn.frame === 0) {
      localStorage.setItem('waveCount', btn.waveCount);
      this.game.state.start('Play');
    }

  },
  update: function() {


  }
};

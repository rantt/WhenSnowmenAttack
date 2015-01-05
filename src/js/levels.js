/*global Game*/

Game.Levels = function(game) {
  this.game = game;
};

Game.Levels.prototype = {
  create: function() {
    
    this.levels = [];
    var levelCount = 4;
    var xpos = 48;
    var ypos = 48;
    for (var i = 0; i < levelCount;i++) {
      var level = this.game.add.sprite(xpos, ypos, 'levelBadge');
      level.anchor.setTo(0.5,0.5);

      level.frame = 0; //unlocked
      // level.frame = 1; //locked
      xpos += 56
      console.log(level.x,level.y); 

      var levelNumber = this.game.add.bitmapText(level.x - 11, level.y - 13, 'minecraftia', String(i+1), 24);
      // levelNumber.tint = 0x000000;
      levelNumber.tint = 0x96fbff;
       
    }
    

  },
  update: function() {

  }
};

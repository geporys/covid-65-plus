var config = {
  type: Phaser.CANVAS,
  width: 1800,
  height: 1200,
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var player;
var platforms;
var cursors;
var bd;
var dialog;
var game = new Phaser.Game(config);
var ment;

function preload() {
  this.load.image('sky', '/assets/interior.png');
  this.load.image('background2', '/assets/hall.png');
  this.load.image('background3 ', 'assets/ha.jpg');
  this.load.image('background4', '/assets/padik.png');
  this.load.image('ground', '/assets/floor_home.png');
  this.load.image('star', '/assets/star.png');
  this.load.image('coat', '/assets/coat.png');
  this.load.image('ment', '/assets/ment.png');
  this.load.spritesheet('dude', '/assets/babulya1.png', {
    frameWidth: 380,
    frameHeight: 831,
    spacing: 50,
    margin: 40,
  });
  this.load.spritesheet('babulyaСoat', '/assets/babulyaCoat.png', {
    frameWidth: 410,
    frameHeight: 832,
    spacing: 45,
    margin: 28,
  });
  this.load.scenePlugin({
    key: 'rexuiplugin',
    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
    sceneKey: 'rexUI',
  });
}

var stop = false;

var textureKey = 'dude';

function wearCoat(fooplayer, coat) {
  player.toggleData('babulyaСoat');

  fooplayer.setTexture('babulyaСoat', 2);
  player.setTexture('babulyaСoat', 2);
  player.destroy();
  player = this.physics.add.sprite(fooplayer.x, 600, 'babulyaСoat');
  camera.startFollow(player);
  this.physics.add.collider(player, platforms);

  // ment = platforms.create(2500, 550, 'ment');
  // ment = this.physics.add.image(2500, 550, 'ment');

  // this.physics.add.collider(player, ment, metWithMent, null, this);

  this.anims.get('turn').frames = this.anims
    .get('turn')
    .frames.map(({ textureKey, ...frame }) => ({ ...frame, textureKey: 'babulyaСoat' }));
  console.log(this.anims.get('turn'));

  textureKey = 'babulyaСoat';

  console.log(this.anims);

  coat.destroy();
  stop = true;

  dialog = this.rexUI.add
    .dialog({
      x: player.x + 550,
      y: 200,

      background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

      content: this.add.text(
        0,
        0,
        `Ой, надо бы на улицу  выйти.
        С этим ковидом так редко гулять стала.`,
        {
          fontSize: '24px',
        }
      ),

      space: {
        title: 25,
        content: 25,
        action: 15,

        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },

      align: {
        actions: 'right', // 'center'|'left'|'right'
      },

      expand: {
        content: false, // Content is a pure text object
      },
    })
    .layout()
    .popUp(1000);
  // .drawBounds(this.add.graphics(), 0xff0000)
}

dialogs = [
  { name: 'ment', text: 'Вам запрещено выходить.' },
  { name: 'player', text: 'Почему это?' },
  { name: 'ment', text: 'Указ о самоизоляции. Вернитесь домой!' },
];
var thisgame;

function metWithMent(player, ment) {}

function create() {
  camera = this.cameras.main;
  this.add.tileSprite(600, 450, 0, 0, 'sky');
  // this.add.tileSprite(2050, 450, 0, 0, 'background2');
  // this.add.tileSprite(-700, 450, 0, 0, 'sky');
  // this.add.tileSprite(3300, 450, 0, 0, 'background4');

  platforms = this.physics.add.staticGroup();

  platforms.create(420, 1400, 'ground').refreshBody();

  player = this.physics.add.sprite(-100, 600, 'dude');
  // ment = this.physics.add.image(2500, 550, 'ment');

  // this.physics.add.collider(ment, platforms);
  // this.physics.add.collider(ment, player);

  camera.startFollow(player);

  this.physics.add.collider(player, platforms);
  console.log(this.physics);
  // Start ment 3600
  ment = platforms.create(2500, 550, 'ment');
  this.physics.add.collider(player, platforms);

  this.physics.add.collider(player, ment, metWithMent, null, this);
  // End ment

  // Start Coat
  var coat = this.physics.add.image(1400, 300, 'coat');
  this.physics.add.collider(coat, platforms);

  this.physics.add.collider(player, coat, wearCoat, null, this);
  // End Coat

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers(textureKey, { start: 2, end: 3 }),
    frameRate: 5,
    repeat: -1,
  });

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1,
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: textureKey, frame: 2 }],
    frameRate: 6,
  });

  this.anims.create({
    key: 'babulyaСoatRight',
    frames: this.anims.generateFrameNumbers('babulyaСoat', { start: 2, end: 3 }),
    frameRate: 4,
    repeat: -1,
  });

  this.anims.create({
    key: 'babulyaСoatLeft',
    frames: this.anims.generateFrameNumbers('babulyaСoat', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1,
  });

  this.anims.create({
    key: 'babulyaСoatTurn',
    frames: [{ key: 'babulyaСoat', frame: 2 }],
    frameRate: 6,
  });

  cursors = this.input.keyboard.createCursorKeys();

  thisgame = this;
}

var need = true;
function showDialog(foo) {
  console.log(foo, thisgame);

  dialog = thisgame.rexUI.add
    .dialog({
      x: 2500,
      y: 50,

      background: thisgame.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

      content: thisgame.add.text(0, 0, `Вам запрещено выходить!`, {
        fontSize: '24px',
      }),

      space: {
        title: 25,
        content: 25,
        action: 15,

        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },

      align: {
        actions: 'right', // 'center'|'left'|'right'
      },

      expand: {
        content: false, // Content is a pure text object
      },
    })
    .layout()
    .popUp(1000);

  setTimeout(() => {
    dialog.destroy();
    dialog = thisgame.rexUI.add
      .dialog({
        x: 2200,
        y: 200,

        background: thisgame.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

        content: thisgame.add.text(0, 0, `Почему это?`, {
          fontSize: '24px',
        }),

        space: {
          title: 25,
          content: 25,
          action: 15,

          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },

        align: {
          actions: 'right', // 'center'|'left'|'right'
        },

        expand: {
          content: false, // Content is a pure text object
        },
      })
      .layout()
      .popUp(1000);
  }, 3000);

  setTimeout(() => {
    dialog.destroy();
    dialog = thisgame.rexUI.add
      .dialog({
        x: 2500,
        y: 50,

        background: thisgame.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

        content: thisgame.add.text(0, 0, `Указ о самоизоляции. Вернитесь домой!`, {
          fontSize: '24px',
        }),

        space: {
          title: 25,
          content: 25,
          action: 15,

          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },

        align: {
          actions: 'right', // 'center'|'left'|'right'
        },

        expand: {
          content: false, // Content is a pure text object
        },
      })
      .layout()
      .popUp(1000);
  }, 6000);

  setTimeout(() => {
    dialog.destroy();
  }, 9000);
}

function update() {
  if (cursors.space.isDown) {
    stop = false;
    dialog.destroy();
    // dialog = null;
    dialogs.shift();
  }
  if (cursors.left.isDown && !stop) {
    console.log(textureKey);
    player.setVelocityX(-200);
    player.anims.play(textureKey !== 'babulyaСoat' ? 'left' : 'babulyaСoatLeft', true);
  } else if (cursors.right.isDown && !stop) {
    if (player.x > 1800 && need) {
      showDialog(this);
      need = false;
    }
    player.setVelocityX(200);
    player.anims.play(textureKey !== 'babulyaСoat' ? 'right' : 'babulyaСoatRight', true);
  } else {
    player.setVelocityX(0);
    player.anims.play(textureKey !== 'babulyaСoat' ? 'turn' : 'babulyaСoatTurn', true);
  }
}

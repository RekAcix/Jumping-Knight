
var mainState = {
	preload: function() {
		game.load.image('playerss', 'assets/player.png');
		game.load.image('background', 'assets/background.png');
		game.load.image('pipe', 'assets/pipe.png');
		game.load.image('platform', 'assets/platform.png');
		game.load.image('1', 'assets/animation/1.png');
		game.load.image('2', 'aseets/animation/2.png');
		game.load.image('3', 'assets/animation/3.png');
		game.load.image('playerl', 'assets/animation/playerl.png');
		game.load.spritesheet('player', 'assets/playerspritesheet.png', 55, 88, 4);

		var player;
		var facing;
		var jumpTimer = 0;
		var cursors;
		var jumpButton;
		var bg;
		var platformheight = 200;
		var field;
		var scoreText;
		this.score = 0;
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE)
		game.world.setBounds(0, 0, 800, 10000);
		game.world.backgroundcolor = '#FFFFFF';
		this.background = game.add.tileSprite(0, 0, 800, 10000, 'background');

		game.time.desiredFps = 60;

		this.player = game.add.sprite(250, 9400, 'player');
		this.player.frame = 0;

		//Fizyka do ciala
		game.physics.arcade.enable(this.player);
		game.physics.arcade.gravity.y = 700;
		game.physics.enable(this.player, Phaser.Physics.ARCADE);

		this.player.body.bounce.y = 0.0;

		this.tileWidth = this.game.cache.getImage('platform').width;
		this.tileHeight = this.game.cache.getImage('platform').height;


		//platforms
		this.platform = this.game.add.group();
		this.platform.enableBody = true;
		game.physics.arcade.enable(this.platform);
		this.platform.createMultiple(250, 'platform');
		this.platform.immovable = true;
		this.platform.moves = false;

		this.addTile();

		//shitty thing, triggers platform
		this.timer = game.time.events.loop(500, this.createplatform, this);


		cursors = game.input.keyboard.createCursorKeys();
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//skok



		this.player.body.collideWorldBounds = true;

		this.platforms = game.add.group();
		this.platforms.enableBody = true;

		this.addFloor();
		this.createplatform();

		game.camera.follow(this.player);
		game.world.wrap(this.player,0,true,true,false);

		//animations

		this.player.animations.add('jump', [3, 1, 2], 10, false);
		this.player.animations.add('left', [0, 3], 10, false);
		this.player.animations.add('right', [0], 10, false);

		facing = 'right';

	},

	update: function() {

		game.physics.arcade.collide(this.player, this.platforms);
		game.world.wrap(this.player, 0, true, true, false);
		game.physics.arcade.collide(this.player, this.platform);

		let hitPlatform = game.physics.arcade.collide(this.player, this.platforms);
		let hitFloor = game.physics.arcade.collide(this.player, this.floor);

		//skakanie na gruncie
		if (jumpButton.isDown && this.player.body.touching.down) {
			this.jump();
			this.jumpTimer = game.time.now + 750;
		};

		// game.physics.arcade.collide(player, layer);

		this.player.body.velocity.x = 0
		if (cursors.left.isDown) {
			this.player.body.velocity.x = -400;

			if (this.facing != 'left') {
				this.player.frame = 3;
				facing = 'left';
			}
		}
		else if (cursors.right.isDown) {
			this.player.body.velocity.x = 400;

			if (facing != 'right') {
				this.player.frame = 0;
				facing = 'right';
			}
		}



		//makiki script
		game.camera.y = this.player.y-320

		let position = -320+this.player.y;
		game.world.setBounds(0, position, 800, 800);


	},


	jump: function() {
		this.player.body.velocity.y = -650;
		this.player.animations.play('jump');
	},


	restartGame: function() {
	game.state.start('main');
	},

	addOnePipe: function(x, y){
        var pipe = game.add.sprite(x, y, 'pipe');
        this.platforms.add(pipe);
				game.physics.arcade.enable(pipe);
				pipe.body.collideWorldBounds = true;
				pipe.body.immovable = true;
				pipe.body.moves = false;

    },
    addFloor: function(){
        for(var i = 0; i < game.world.width; i+=180)
            this.addOnePipe(i, game.world.height - 400);
    },

		createplatform: function() {

			if(typeof(y) == "undefined") {
				y = -this.tileHeight;
			};

			var tilesNeeded = Math.ceil(this.game.world.width / this.tileWidth);
			var hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;

			//Might edit this:
			y = y-100
			for (var i = 0; i < tilesNeeded; i++) {
				if (i != hole && i != hole + 1) {
					this.addTile(hole * this.tileWidth, y+9600);
				}
			}

		},

		addTile: function(x, y) {
			var tile = this.platform.getFirstDead();
			tile.body.moves = false;
			tile.reset(x, y);
			tile.body.velocity.y = 0;
			tile.body.immovable = true;
			tile.body.checkCollision.down = false;
			tile.body.checkCollision.left = false;
			tile.body.checkCollision.right = false;

			tile.checkWorldBounds = true;
			tile.outOfBoundsKill = true;

			this.score++;

		},

};


var game = new Phaser.Game(800, 800);

game.state.add('main', mainState);

game.state.start('main');

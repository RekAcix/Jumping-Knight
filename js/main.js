
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
		game.load.spritesheet('player', 'assets/playerspritesheet.png', 54, 88);

		var player;
		var facing = 'left';
		var jumpTimer = 0;
		var cursors;
		var jumpButton;
		var bg;
		var platformheight = 200;
		var field;
		var scoreText
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE)
		game.world.setBounds(0, 0, 800, 800);



		this.background = game.add.tileSprite(0, 0, 800, 800, 'background');


		game.time.desiredFps = 60;

		this.player = game.add.sprite(250, 250, 'player');

		//Fizyka do ciala
		game.physics.arcade.enable(this.player);
		game.physics.arcade.gravity.y = 250;
		game.physics.enable(this.player, Phaser.Physics.ARCADE);

		this.player.body.bounce.y = 0.2;

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
		this.timer = game.time.events.loop(1000, this.createplatform, this);


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
		this.player.animations.add('jump', [0, 1, 2], 10, false);
		this.player.animations.add('left', [0, 3], 10, false);
		this.player.animations.add('right', [0], 10, false);

	},

	update: function() {

		// game.physics.arcade.collide(player, layer);

		this.player.body.velocity.x = 0
		if (cursors.left.isDown) {
			this.player.body.velocity.x = -225;

			if (this.facing != 'left') {
				this.player.animations.play('left');
				facing = 'left';
			}
		}
		else if (cursors.right.isDown) {
			this.player.body.velocity.x = 225;

			if (facing != 'right') {
				this.player.animations.play('right');
				facing = 'right';
			}
		}
		else {
			if (facing = 'idle') {
				this.player.animations.stop();

				if (facing == 'left') {
					this.player.frame = 0;
				}
				else {
					this.player.frame = 5;
				}

				facing = 'idle';
			}
		}
		game.physics.arcade.collide(this.player, this.platforms);
		game.world.wrap(this.player, 0, true, true, false);
		game.physics.arcade.collide(this.player, this.platform);

		let hitPlatform = game.physics.arcade.collide(this.player, this.platforms);
		let hitFloor = game.physics.arcade.collide(this.player, this.floor);

		//makiki script
		game.camera.y = this.player.y-320


		let position = -320+this.player.y;
		game.world.setBounds(0, position, 800, 800);
		this.background.y = game.world.y;

		if (this.player.body.velocity.y < -10) {
			this.player.animations.play('jump');
		}







		//skakanie na gruncie

		if (jumpButton.isDown && this.player.body.touching.down) {
			this.jump();
			this.jumpTimer = game.time.now + 750;
		}
	},


	jump: function() {
	this.player.body.velocity.y = -350;
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
            this.addOnePipe(i, game.world.height);
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
					this.addTile(hole * this.tileWidth, y+800);
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

		},

};


var game = new Phaser.Game(800, 800);

game.state.add('main', mainState);

game.state.start('main');
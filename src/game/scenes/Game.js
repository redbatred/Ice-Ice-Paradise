import { EventBus } from '../EventBus';

class GameRenderer {
    constructor(scene) {
        this.scene = scene;
    }

    renderImages(imageSet, scale) {
        imageSet.forEach((img) => {
            this.scene.add.image(
                img.posX, // Use individual X position
                img.posY, // Use individual Y position
                'tileset'
            )
                .setCrop(img.x, img.y, img.width, img.height) // Crop the region
                .setScale(scale) // Scale for visibility
                .setOrigin(0, 0); // Align top-left corner
        });
    }

    renderFences(atlas, fenceWidth, fenceScale, fenceStartX, fenceYPosition) {
        for (let x = fenceStartX; x < this.scene.scale.width; x += fenceWidth * fenceScale) {
            const fence = this.scene.add.sprite(
                x, // Position each fence horizontally
                fenceYPosition, // Position above the river
                atlas,
                'fence-snow'
            );
            fence.setScale(fenceScale);
            fence.setOrigin(0.5, 0.5);
        }
    }

    renderBottomFences(atlas, fenceWidth, fenceScale, fenceStartX) {
        const fenceYPosition = this.scene.scale.height - 15; // Position at the bottom of the screen
        for (let x = fenceStartX; x < this.scene.scale.width; x += fenceWidth * fenceScale) {
            const fence = this.scene.add.sprite(
                x, // Position each fence horizontally
                fenceYPosition, // Position at the bottom
                atlas,
                'fence-snow'
            );
            fence.setScale(fenceScale);
            fence.setOrigin(0.5, 0.5);
        }
    }

    renderStaticSprites(atlas) {
        this.scene.add.sprite(910, 440, atlas, 'pine-snow')
            .setOrigin(0.5, 0.5)
            .setScale(1);

        this.scene.add.sprite(860, 460, atlas, 'pine')
            .setOrigin(0.5, 0.5)
            .setScale(1);

        this.scene.add.sprite(1200, 580, atlas, 'house')
            .setOrigin(0.5, 1)
            .setScale(2)
            .setDepth(0);
    }

    renderTrees(atlas, treeData) {
        treeData.forEach(tree => {
            const treeSprite = this.scene.add.sprite(tree.x, tree.y, atlas, tree.frame)
                .setOrigin(0.5, 1) // Bottom-center origin for trees
                .setScale(tree.scale);

            // Add interactive click event to 'branche-left'
            if (tree.frame === 'branche-left') {
				this.scene.branches.push(treeSprite);
                treeSprite.setInteractive().on('pointerdown', () => {
                    this.scene.flyOwlFrom(tree.x, tree.y);
					this.scene.rattleBranchesAndDropSnow();
					this.scene.playBranchClickSound();
                });
                treeSprite.setDepth(8); // Ensure branches are in the foreground
            }
        });
    }
}

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.snowflakes = []; // Array to hold snowflake sprites
		this.owls = []; // Array to hold active owl sprites
        this.branches = []; // Array to hold branch sprites
    }

    preload() {
        this.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json');
        this.load.image('tileset', 'assets/environment/tileset.png');

        // Load snowflake images
        this.load.image('snowflake_small', '/assets/snow/snowflake_small.png');
        this.load.image('snowflake_tiny', '/assets/snow/snowfalke_tiny.png');
        this.load.image('snowflake', '/assets/snow/snowflake.png');
        this.load.image('snowflake_lrg', '/assets/snow/snowflake_lrg.png');

		// Load background music
        this.load.audio('song1', '/assets/sounds/Song1.mp3');
        this.load.audio('song2', '/assets/sounds/Song2.mp3');
		this.load.audio('ambiance', '/assets/sounds/ambiance.mp3')

		    // Load branch click sound
        this.load.audio('whoosh', '/assets/sounds/whoosh.mp3');
    }

    create() {
        console.log('Available frames in atlas:', this.textures.get('atlas').getFrameNames());

        this.background = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'background'
        ).setDisplaySize(this.scale.width, this.scale.height);

        this.river = this.add.tileSprite(
            -200,
            this.scale.height,
            this.scale.width * 2,
            200,
            'river'
        )
            .setOrigin(0, 1)
            .setRotation(Phaser.Math.DegToRad(0));

        const images = [
            { x: 16, y: 16, width: 64, height: 48, posX: -40, posY: 430 },
            { x: 96, y: 16, width: 144, height: 48, posX: -120, posY: 430 },
            { x: 176, y: 0, width: 192, height: 48, posX: -360, posY: 460 },
            { x: 224, y: 0, width: 240, height: 48, posX: -250, posY: 460 },
            { x: 272, y: 16, width: 288, height: 48, posX: -270, posY: 415 }
        ];
        const scale = 2;

        const renderer = new GameRenderer(this);
        renderer.renderImages(images, scale);

        const positions = [
            [{ posX: 325, posY: 430 }, { posX: 160, posY: 420 }, { posX: 96, posY: 460 }, { posX: 35, posY: 462 }, { posX: 30, posY: 405 }],
            [{ posX: 650, posY: 428 }, { posX: 448, posY: 405 }, { posX: 450, posY: 460 }, { posX: 410, posY: 460 }, { posX: 317, posY: 390 }],
            [{ posX: 900, posY: 421 }, { posX: 620, posY: 430 }, { posX: 690, posY: 460 }, { posX: 650, posY: 460 }, { posX: 740, posY: 430 }]
        ];

        positions.forEach((set) => {
            images.forEach((img, idx) => {
                img.posX = set[idx].posX;
                img.posY = set[idx].posY;
            });
            renderer.renderImages(images, scale);
        });

        renderer.renderFences('atlas', 96, 1, 0, this.river.y - this.river.displayHeight / 2 - 115);
        renderer.renderBottomFences('atlas', 96, 1, 0);
        renderer.renderStaticSprites('atlas');

        // Add trees
        const trees = [
            { x: 200, y: 500, frame: 'pine-snow', scale: 0.7 },
            { x: 400, y: 480, frame: 'pine-snow', scale: 0.6 },
            { x: 420, y: 520, frame: 'pine-snow', scale: 0.75 },
            { x: 380, y: 500, frame: 'pine-snow', scale: 0.7 },
            { x: 580, y: 540, frame: 'pine-snow', scale: 1.1 },
            { x: 625, y: 530, frame: 'pine-snow', scale: 0.9 },
            { x: 550, y: 530, frame: 'pine-snow', scale: 0.9 },
            { x: 770, y: 520, frame: 'pine-snow', scale: 1.0 },
            { x: 825, y: 500, frame: 'pine-snow', scale: 0.8 },
            { x: 795, y: 530, frame: 'pine-snow', scale: 1.0 },
            { x: 1000, y: 520, frame: 'pine-snow', scale: 1.1 },
            { x: 980, y: 500, frame: 'pine-snow', scale: 0.8 },
            { x: 250, y: 500, frame: 'pine-snow', scale: 1.0 },
            { x: 270, y: 490, frame: 'pine-snow', scale: 0.8 },
            { x: 250, y: 490, frame: 'pine-snow', scale: 1.0 },
            { x: 170, y: 520, frame: 'pine-snow', scale: 1.2 },
            { x: 130, y: 550, frame: 'pine-snow', scale: 1.1 },
            { x: 90, y: 500, frame: 'pine-snow', scale: 1.0 },
            { x: 70, y: 490, frame: 'pine-snow', scale: 0.8 },
            { x: 110, y: 490, frame: 'pine-snow', scale: 1.0 },
            { x: 40, y: 520, frame: 'pine-snow', scale: 1.2 },
            { x: 20, y: 500, frame: 'pine-snow', scale: 1.1 },
            { x: 290, y: 490, frame: 'pine', scale: 0.9 },
            { x: 610, y: 500, frame: 'pine', scale: 0.7 },
            { x: 75, y: 530, frame: 'pine', scale: 1.0 },
            { x: 230, y: 520, frame: 'pine', scale: 1.0 },
            { x: 450, y: 520, frame: 'pine', scale: 0.9 },
            { x: 1070, y: 480, frame: 'tall-tree', scale: 0.6, depth: 0 },
            { x: 1090, y: 470, frame: 'tall-tree', scale: 0.5, depth: 0 },
            { x: 1050, y: 470, frame: 'tall-tree', scale: 0.4, depth: 0 },
            { x: 1040, y: 480, frame: 'tall-tree', scale: 0.4, depth: 0 },
            { x: 1250, y: 800, frame: 'branche-left', scale: 5, depth: 7 },
            { x: 1270, y: 740, frame: 'branche-left', scale: 5, depth: 7 },
            { x: 1290, y: 680, frame: 'branche-left', scale: 5, depth: 2 },
            { x: 1310, y: 620, frame: 'branche-left', scale: 5, depth: 2 },
            { x: 1330, y: 560, frame: 'branche-left', scale: 5, depth: 2 },
            { x: 1350, y: 500, frame: 'branche-left', scale: 5, depth: 2 },
            { x: 1370, y: 440, frame: 'branche-left', scale: 5, depth: 2 },
            { x: 1390, y: 380, frame: 'branche-left', scale: 5, depth: 2 },
            { x: 1410, y: 320, frame: 'branche-left', scale: 5, depth: 2 },
        ];
        renderer.renderTrees('atlas', trees);

        this.createSnowflakes(170); // Initialize snowflakes

		// Play random background music
        const musicKey = Phaser.Utils.Array.GetRandom(['song1', 'song2']);
        const music = this.sound.add(musicKey, { loop: true, volume: 0.5 });
        music.play();

		// Play ambiance sound
        const ambiance = this.sound.add('ambiance', { loop: true, volume: 0.5 });
        ambiance.play();

		

        // Owl animation setup
        this.owl = this.add.sprite(this.scale.width + 100, 200, 'atlas', 'owl-1')
            .setScale(1.5) // Start larger for perspective effect
            .setDepth(1); // Lower depth than branches
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'owl-',
                start: 1,
                end: 8
            }),
            frameRate: 8, // Slower animation speed
            repeat: -1
        });
        this.owl.play('fly');

        EventBus.emit('current-scene-ready', this);
    }

    createSnowflakes(count) {
        const snowflakeTextures = [
            'snowflake_small',
            'snowflake_tiny',
            'snowflake',
            'snowflake_lrg'
        ];

        for (let i = 0; i < count; i++) {
            const texture = Phaser.Utils.Array.GetRandom(snowflakeTextures);

            const snowflake = this.add.image(
                Phaser.Math.Between(0, this.scale.width), // Random X position
                Phaser.Math.Between(0, this.scale.height), // Random Y position
                texture
            );

            snowflake.setScale(Phaser.Math.FloatBetween(0.2, 0.5));
            snowflake.setDepth(7); // Ensure snowflakes are in the foreground

            snowflake.speed = Phaser.Math.Between(50, 150); // Speed of falling
            snowflake.resetY = -Phaser.Math.Between(10, 50); // Y position to reset to when off-screen

            this.snowflakes.push(snowflake);
        }
    }

	playBranchClickSound() {
    const whooshSound = this.sound.add('whoosh', { volume: 1 });
    whooshSound.play();
}

    flyOwlFrom(x, y) {
        this.owl.setPosition(x, y).setVisible(true);
        const duration = Phaser.Math.Between(4000, 7000); // Slower animation duration
        const endX = -100; // Move owl off-screen to the left
        const endY = Phaser.Math.Between(50, this.scale.height / 100); // Random end Y position

        this.tweens.add({
            targets: this.owl,
            x: endX,
            y: endY,
            scale: 0.5, // Shrink the owl for distance illusion
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.owl.setVisible(false).setScale(1.5); // Reset scale
			
            }
        });
    }

	rattleBranchesAndDropSnow() {
        this.branches.forEach(branch => {
            this.tweens.add({
                targets: branch,
                angle: { from: -4, to: 4 },
                duration: 100,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut'
            });

            // Drop snowflakes from branches
            for (let i = 0; i < 5; i++) {
                const snowflake = this.add.image(
                    branch.x + Phaser.Math.Between(-130, -100),
                    branch.y + 10,
                    'snowflake_tiny'
                ).setScale(Phaser.Math.FloatBetween(1.5, 3));

                this.tweens.add({
                    targets: snowflake,
                    y: branch.y + Phaser.Math.Between(20, 100),
                    alpha: 0,
                    duration: 1000,
                    ease: 'Sine.easeOut',
                    onComplete: () => snowflake.destroy()
                });
            }
        });
    }

    update(time, delta) {
        if (this.river) {
            this.river.tilePositionX += 2; // Adjust speed as needed
        }

        // Animate snowflakes
        this.snowflakes.forEach((snowflake) => {
            snowflake.y += (snowflake.speed * delta) / 1000;

            if (snowflake.y > this.scale.height) {
                snowflake.y = snowflake.resetY;
                snowflake.x = Phaser.Math.Between(0, this.scale.width);
            }
        });
    }
}

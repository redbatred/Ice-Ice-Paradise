import { EventBus } from '../EventBus';

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Load the atlas
        this.load.atlas(
            'atlas',
            'assets/atlas.png',   // Path to your atlas image
            'assets/atlas.json'   // Path to your atlas JSON
        );

        // Load the tileset
        this.load.image('tileset', 'assets/environment/tileset.png');
    }

    create() {
        // Debug: Log available frames to confirm `fence-snow` exists
        console.log('Available frames in atlas:', this.textures.get('atlas').getFrameNames());

        // Add background
        this.background = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'background'
        ).setDisplaySize(this.scale.width, this.scale.height);

        // Add a single river instance
        this.river = this.add.tileSprite(
            -200, // Start at the left corner
            this.scale.height, // Position at the bottom of the screen
            this.scale.width * 2, // Increase width to make it larger
            200, // Height of the river
            'river'
        )
            .setOrigin(0, 1) // Bottom-left corner as the origin
            .setRotation(Phaser.Math.DegToRad(0)); // No tilt (0 degrees)

// Define the crop areas and individual positions for the 5 images
const images = [
    { x: 16, y: 16, width: 64, height: 48, posX: -40, posY:   430 },  // Image 1
    { x: 96, y: 16, width: 144, height: 48, posX: -120, posY:   430 }, // Image 2
    { x: 176, y: 0, width: 192, height: 48, posX: -360, posY:   460 }, // Image 3
    { x: 224, y: 0, width: 240, height: 48, posX: -250, posY:   460 }, // Image 4
    { x: 272, y: 16, width: 288, height: 48, posX: -270, posY:   415 } // Image 5
];

// Define the scale
const scale = 2;

// Function to render images
function renderImages(imageSet) {
    imageSet.forEach((img) => {
        this.add.image(
            img.posX, // Use individual X position
            img.posY, // Use individual Y position
            'tileset'
        )
            .setCrop(img.x, img.y, img.width, img.height) // Crop the region
            .setScale(scale) // Scale for visibility
            .setOrigin(0, 0); // Align top-left corner
    });
}

// Render the initial set of images
renderImages.call(this, images);

// Modify the positions manually
images[0].posX = 325; images[0].posY = 430; // New position for Image 1
images[1].posX = 160; images[1].posY = 420; // New position for Image 2
images[2].posX = 96; images[2].posY = 460; // New position for Image 3
images[3].posX = 35; images[3].posY = 462; // New position for Image 4
images[4].posX = 30; images[4].posY = 405; // New position for Image 5

// Render the images again with new positions
renderImages.call(this, images);

images[0].posX = 650; images[0].posY = 428; // New position for Image 1
images[1].posX = 448; images[1].posY = 405; // New position for Image 2
images[2].posX = 450; images[2].posY = 460; // New position for Image 3
images[3].posX = 410; images[3].posY = 460; // New position for Image 4
images[4].posX = 317; images[4].posY = 390; // New position for Image 5

// Render the third set of images
renderImages.call(this, images);

images[0].posX = 900; images[0].posY = 421; // New position for Image 1
images[1].posX = 620; images[1].posY = 430; // New position for Image 2
images[2].posX = 690; images[2].posY = 460; // New position for Image 3
images[3].posX = 650; images[3].posY = 460; // New position for Image 4
images[4].posX = 740; images[4].posY = 430; // New position for Image 5

// Render the third set of images
renderImages.call(this, images);







        // Repeat the fence-snow sprite across the screen
        const fenceWidth = 96; // Width of the fence-snow sprite from JSON data
        const fenceScale = 1; // Scale factor for the fences
        const fenceStartX = 0; // Starting X position for the first fence
        const fenceYPosition = this.river.y - this.river.displayHeight / 2 - 115; // Y position for the fences

        for (let x = fenceStartX; x < this.scale.width; x += fenceWidth * fenceScale) {
            const fence = this.add.sprite(
                x,      // Position each fence horizontally
                fenceYPosition, // Position above the river
                'atlas',
                'fence-snow'
            );
            fence.setScale(fenceScale); // Apply scale to each fence
            fence.setOrigin(0.5, 0.5); // Set origin to center for proper alignment
        }

		// Adding the 'pine-snow' image from the atlas
this.add.sprite(
    910, // X position (adjust as needed)
    440, // Y position (adjust as needed)
    'atlas', // Name of the atlas
    'pine-snow' // Frame name in the atlas
)
    .setOrigin(0.5, 0.5) // Set origin to center for precise alignment
    .setScale(1); // Optional: Scale the sprite (adjust as needed)

	// Adding the house sprite with a lower depth
const house = this.add.sprite(
    1200, // X position for the house (adjust as needed)
    580, // Y position for the house (adjust as needed)
    'atlas', // Name of the atlas
    'house' // Frame name in the atlas
)
    .setOrigin(0.5, 1) // Set origin to bottom center
    .setScale(2) // Scale the house (adjust as needed)
    .setDepth(); // Set depth to 0 (lower index)

        // Emit event for React integration
        EventBus.emit('current-scene-ready', this);
    }

    update() {
        // Animate the river for horizontal movement
        this.river.tilePositionX += 2; // Adjust speed for the river flow
    }
}

import { Scene } from 'phaser';

export default class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load assets for the Game scene directly here
        this.load.image('background', 'assets/background.jpg');
        this.load.image('river', 'assets/water2.jpg');
        this.load.atlas(
    'atlas',                // Key for the atlas
    'assets/atlas/atlas.png',     // Path to the image file
    'assets/atlas/atlas.json'     // Path to the JSON file
);
this.load.image('tileset', 'assets/environment/tileset.png');
this.load.tilemapTiledJSON('map', 'assets/maps/map.json');

    }

    create() {
        // Directly start the Game scene after assets are loaded
        this.scene.start('Game');
    }
}

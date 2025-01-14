import Boot from './scenes/Boot';
import Game from './scenes/Game';
import Phaser from 'phaser';


// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.RESIZE, // Automatically resize to fit the parent container
        autoCenter: Phaser.Scale.CENTER_BOTH // Center the game in the parent container
    },
    scene: [
        Boot,
        Game,
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;

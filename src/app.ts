import "phaser";
import {Main} from "./Scenes/Main";
import {Preload} from "./Scenes/Preload";
import {Restart} from "./Scenes/Restart";

let game;
const config: GameConfig = {
    title: "Game",
    width: 750,
    height: 1334,
    type: Phaser.AUTO,
    parent: "game",
    scene: [Preload, Main, Restart],
    physics: {
        default: "arcade",
    },
    input: {
        mouse: true
    },
    render: {antialias: true},
    backgroundColor: "#1d2b53"
};

// game class
export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
    game = new Game(config);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
});

function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

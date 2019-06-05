import {Button} from "../GameObjects/Button";
import {Localizer} from "../Utils/Localizer";
import {GraphicUtils} from "../Utils/GraphicUtils";

class Restart extends Phaser.Scene {
    private background: Phaser.GameObjects.Image;
    private restartButton: Button;
    private quitButton: Button;

    constructor() {
        super(
            {
                key: "Restart",
                active: false
            }
        );
    }

    create() {
        let bgWidth: number = 300;
        let bgHeight: number = 300;
        let bg: Phaser.GameObjects.Graphics = new Phaser.GameObjects.Graphics(this);
        bg.fillRoundedRect(0, 0, bgWidth, bgHeight, 15);
        bg.fillStyle(0xfffffff, 1);
        bg.generateTexture("bg");

        this.background = new Phaser.GameObjects.Image(this, 0,0, "bg");
        this.background.setOrigin(0.5, 0.5);
        this.background.x = this.cameras.main.width - bgWidth / 2;
        this.background.y = this.cameras.main.height - bgHeight / 2;
        this.background.alpha = 0.5;
        this.add.existing(this.background);

        let style: any = {fontFamily: 'Luckiest Guy', fontSize: '50px',  fill: '#162521'};
        let fillColor: string = "#4F7CAC";
        let borderColor: string = "#C0E0DE";

        let width: number = 250;
        let height: number = 100;
        let radius: number = 15;

        this.restartButton = new Button(this, 0, 0, Localizer.getString("restartButton"), style, width, height, radius,
            fillColor, 10, borderColor, this.onRestart, this);
        this.restartButton.x = this.cameras.main.width * 0.5;
        this.restartButton.y = this.cameras.main.height * 0.45;
        this.add.existing(this.restartButton);

        this.quitButton = new Button(this, 0, 0, Localizer.getString("quitButton"), style, width, height, radius,
            fillColor, 10, borderColor, this.onQuit, this);
        this.quitButton.x = this.cameras.main.width * 0.5;
        this.quitButton.y = this.cameras.main.height * 0.55;
        this.add.existing(this.quitButton);
    }

    private onRestart(): void {
        this.scene.start("Main");
    }

    private onQuit(): void {
        this.game.destroy(true, true);
    }
}

export {Restart}
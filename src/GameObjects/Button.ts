import Scene = Phaser.Scene;
import {GraphicUtils} from "../Utils/GraphicUtils";

class Button extends Phaser.GameObjects.Container {
    private graphic: Phaser.GameObjects.Graphics;
    private text: Phaser.GameObjects.Text;
    private btnWidth: number;
    private btnHeight: number;
    private radius: number;
    private borderWidth: number;
    private fillColor: string;
    private borderColor: string;
    private fn: any;
    private context: any;
    private onHoverSound: Phaser.Sound.BaseSound;
    private onSelectSound: Phaser.Sound.BaseSound;

    constructor(scene: Scene, x: number, y: number, text: string, style: any, w: number, h: number, r: number, fillCol: string,
                borderWidth: number, borderColor: any, fn: any, context: any) {
        super(scene, x, y);

        this.btnWidth = w;
        this.btnHeight = h;
        this.radius = r;
        this.borderWidth = borderWidth;
        this.fillColor = fillCol;
        this.borderColor = borderColor;
        this.fn = fn;
        this.context = context;

        this.graphic = scene.add.graphics();
        this.graphic.fillRoundedRect(0, 0, this.btnWidth, this.btnHeight, this.radius);
        this.graphic.fillStyle(GraphicUtils.fromWebColor(this.fillColor), 1);
        this.graphic.fillRoundedRect(this.borderWidth / 2, this.borderWidth / 2, this.btnWidth - this.borderWidth,
            this.btnHeight - this.borderWidth, this.radius);
        this.graphic.fillStyle(GraphicUtils.fromWebColor(this.borderColor), 1);
        this.graphic.generateTexture(text);
        this.graphic.x = this.x - this.btnWidth / 2;
        this.graphic.y = this.y - this.btnHeight / 2;
        this.add(this.graphic);

        this.text = new Phaser.GameObjects.Text(scene, 0, 0, text, style);
        this.text.setOrigin(0.5, 0.5);
        this.text.x = this.x;
        this.text.y = this.y;
        this.add(this.text);

        this.setSize(this.btnWidth, this.btnHeight);
        this.setInteractive({useHandCursor: true}, Phaser.Geom.Rectangle.Contains);

        this.on("pointerover", this.onHoverOn)
            .on("pointerout", this.onHoverOut)
            .on("pointerdown", this.onButtonPress);

        this.onHoverSound = scene.sound.add("button_hover");
        this.onSelectSound = scene.sound.add("button_select");
    }

    /**
     * Changes the button colors to lighter ones
     * @method onHoverOn
     * @private
     */
    private onHoverOn(): void {
        let fill: number = GraphicUtils.fromWebColor(GraphicUtils.lightenHex(this.fillColor, 20));
        let border: number = GraphicUtils.fromWebColor(GraphicUtils.lightenHex(this.borderColor, 20));

        this.graphic.clear();
        this.graphic.fillRoundedRect(0, 0, this.btnWidth, this.btnHeight, this.radius);
        this.graphic.fillStyle(fill, 1);
        this.graphic.fillRoundedRect(this.borderWidth / 2, this.borderWidth / 2, this.btnWidth - this.borderWidth,
            this.btnHeight - this.borderWidth, this.radius);
        this.graphic.fillStyle(border, 1);

        this.onHoverSound.play();
    }

    /**
     * Returns button colors to original ones
     * @method onHoverOut
     * @private
     */
    private onHoverOut(): void {
        let fill: number = GraphicUtils.fromWebColor(GraphicUtils.darkenHex(this.fillColor, 0));
        let border: number = GraphicUtils.fromWebColor(GraphicUtils.darkenHex(this.borderColor, 0));

        this.graphic.clear();
        this.graphic.fillRoundedRect(0, 0, this.btnWidth, this.btnHeight, this.radius);
        this.graphic.fillStyle(fill, 1);
        this.graphic.fillRoundedRect(this.borderWidth / 2, this.borderWidth / 2, this.btnWidth - this.borderWidth,
            this.btnHeight - this.borderWidth, this.radius);
        this.graphic.fillStyle(border, 1);
    }

    /**
     * Calls the give function to the button class
     * @method onButtonPress
     * @private
     */
    private onButtonPress(): void {
        this.onSelectSound.play();

        this.fn.call(this.context);
    }
}

export {Button}
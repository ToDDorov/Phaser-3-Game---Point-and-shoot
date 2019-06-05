import Scene = Phaser.Scene;

class Bullet extends Phaser.GameObjects.Image {
    private speed: number;
    private born: number;
    private direction: number;
    private xSpeed: number;
    private ySpeed: number;
    private sound: Phaser.Sound.BaseSound;

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;

        this.sound = scene.sound.add("arrow_shoot");

        this.visible = false;
        this.active = false;

        this.scene.add.existing(this);
    }

    /**
     * Fire method setting the speed and rotation
     *
     * @param player - get the player images
     * @param pointer - capture active pointer coordinates
     */
    public fire(player: Phaser.GameObjects.Image, pointer: Phaser.Math.Vector2): void {
        this.setPosition(player.x, player.y);
        this.direction = Math.atan((pointer.x - this.x) / (pointer.y - this.y));

        if (pointer.y >= this.y) {
            this.xSpeed = this.speed * Math.sin(this.direction);
            this.ySpeed = this.speed * Math.cos(this.direction);
        } else {
            this.xSpeed = -this.speed * Math.sin(this.direction);
            this.ySpeed = -this.speed * Math.cos(this.direction);
        }

        this.rotation = player.rotation;
        this.born = 0;

        this.sound.play();
    }

    update(time: number, delta: number): void {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;

        if (this.born > 1800) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export {Bullet}
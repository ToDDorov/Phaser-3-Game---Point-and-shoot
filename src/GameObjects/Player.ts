import Scene = Phaser.Scene;
import {Bullet} from "./Bullet";

class Player extends Phaser.GameObjects.Sprite {
    private bullets: Phaser.Physics.Arcade.Group;

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.bullets = scene.physics.add.group();

        let scaleFactor: number = 0.6;
        for(let i: number = 0; i < 30; i++){
            let bullet: Bullet = new Bullet(scene, this.x, this.y, "arrow");
            bullet.setScale(scaleFactor, scaleFactor);
            bullet.setSize(bullet.width * scaleFactor, bullet.height * scaleFactor);
            this.bullets.add(bullet);
        }

        this.bullets.runChildUpdate = true;
    }

    /**
     * Gets a bullet from the bullets array
     * @method getBullet
     * @returns {Bullet}
     * @public
     */
    public getBullet(): Bullet {
        return this.bullets.get().setActive(true).setVisible(true);
    }

    destroy(fromScene?: boolean): void {
        super.destroy(fromScene);
    }
}

export {Player}
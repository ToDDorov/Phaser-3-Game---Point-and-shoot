import Scene = Phaser.Scene;
import Container = Phaser.GameObjects.Container;

class Enemy extends Phaser.GameObjects.Image {
    public health: number;
    private hearts: Container;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private ySpeed: number;
    private onHitSound: Phaser.Sound.BaseSound;
    private onDeathSound: Phaser.Sound.BaseSound;

    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.setOrigin(0.5, 0.5);

        this.health = 3;
        this.hearts = scene.add.container(this.x,this.y,);

        let xOffset: number = 50;
        let xPos: number = -50;

        for(let i: number = 0; i < this.health; i++){
            let heart: Phaser.GameObjects.Image = new Phaser.GameObjects.Image(scene, 0, 0, "heart");
            heart.setScale(0.6, 0.6);
            heart.setOrigin(0.5, 0.5);

            heart.x = xPos;
            this.hearts.add(heart);

            xPos += xOffset;
        }

        this.ySpeed = -0.4;

        this.onHitSound = scene.sound.add("on_hit");
        this.onDeathSound = scene.sound.add("on_death");
    }

    /**
     * getHealth method
     * @returns {number}
     */
    public getHealth(): number {
        return this.health;
    }

    /**
     * takeDamage method for reducing enemy health and emitting particles from hearts positions
     */
    public takeDamage(): void {
        let particleX: number = 100 - (50 * this.health);

        this.health--;

        let particles = this.scene.add.particles("heart");
        this.emitter = particles.createEmitter({
            x: this.hearts.x + particleX,
            y: this.hearts.y,
            scaleX: 0.2,
            scaleY: 0.2,
            speed: 500,
            lifespan: 200,
            maxParticles: 10,
            blendMode: 'ADD'
        });

        this.hearts.first.destroy(true);

        this.onHitSound.play();
    }

    /**
     * kill method tweening the enemy and destroying it after tween has completed
     */
    public kill(): void {
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            alpha: 0,
            ease: "Quintic.easeInOut",
            onStart: ()=>{
                this.active = false;

                if(this.onHitSound.isPlaying){
                    this.onHitSound.stop();
                }

                this.onDeathSound.play();
            },
            onComplete: ()=>{
                this.destroy(true);
            }
        });
    }

    update(time: number, delta: number): void {
        this.y -= this.ySpeed * delta;

        let yOffset: number = 110;
        this.hearts.x = this.x;
        this.hearts.y = this.y - yOffset;
    }

    destroy(fromScene?: boolean): void {
        if(this.hearts != null){
            this.hearts.destroy(true);
            this.hearts = null;
        }

        super.destroy(fromScene);
    }
}

export {Enemy}
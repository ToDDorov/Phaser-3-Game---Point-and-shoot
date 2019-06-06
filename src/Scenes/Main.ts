import {Player} from "../GameObjects/Player";
import {Bullet} from "../GameObjects/Bullet";
import {Enemy} from "../GameObjects/Enemy";
import {Localizer} from "../Utils/Localizer";

class Main extends Phaser.Scene {
    private MAX_SCORE: number = 10;
    private PLAYER_LIVES: number = 3;

    private monsterGroup: Phaser.Physics.Arcade.Group;
    private monsterPool: Phaser.GameObjects.Group;
    private player: Player;

    private score: number;
    private lives: number;

    private scoreText: Phaser.GameObjects.Text;
    private livesText: Phaser.GameObjects.Text;

    private loseLifeSound: Phaser.Sound.BaseSound;
    private victorySound: Phaser.Sound.BaseSound;
    private gameOverSound: Phaser.Sound.BaseSound;
    private backgroundMusic: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: "Main",
            active: false
        });
    }

    init(): void {
        this.score = 0;
        this.lives = this.PLAYER_LIVES;

        if (this.victorySound != null && this.victorySound.isPlaying) {
            this.victorySound.stop();
        }

        if (this.gameOverSound != null && this.gameOverSound.isPlaying) {
            this.victorySound.stop();
        }

        if (this.backgroundMusic != null && this.backgroundMusic.isPaused) {
            this.backgroundMusic.stop();
        }
    }

    create(): void {
        this.monsterGroup = this.physics.add.group({
            removeCallback: (monster: any) => {
                monster.scene.monsterPool.add(monster);
            }
        });
        this.monsterGroup.runChildUpdate = true;

        this.monsterPool = this.add.group({
            removeCallback: (monster: any) => {
                monster.scene.monsterGroup.add(monster);
            }
        });

        this.addMonster();

        this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height * 0.85, "arrow");
        this.player.setScale(0.6, 0.6);
        this.add.existing(this.player);

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            this.player.angle = (360 / (2 * Math.PI)) * Phaser.Math.Angle.Between(
                this.player.x, this.player.y,
                pointer.x, pointer.y) + 90;
        }, this);

        this.input.on("pointerdown", (pointer) => {
            let bullet: Bullet = this.player.getBullet();

            if (bullet) {
                bullet.fire(this.player, pointer.position);
                this.physics.add.collider(this.monsterGroup, bullet, (bulletHit: Bullet, monster: Enemy) => {
                    this.onEnemyHit(bulletHit, monster);
                })
            }
        }, this);

        this.scoreText = this.add.text(this.cameras.main.centerX - 200, this.cameras.main.height * 0.05,
            "", {fontFamily: 'Luckiest Guy', fontSize: '60px', fill: '#fff'});
        this.setScoreText();
        this.scoreText.setOrigin(0.5, 0.5);

        this.livesText = this.add.text(this.cameras.main.centerX + 200, this.cameras.main.height * 0.05,
            "", {fontFamily: 'Luckiest Guy', fontSize: '60px', fill: '#fff'});
        this.setLivesText();
        this.livesText.setOrigin(0.5, 0.5);

        this.loseLifeSound = this.sound.add("lose_life");
        this.victorySound = this.sound.add("victory");
        this.gameOverSound = this.sound.add("game_over");
        this.backgroundMusic = this.sound.add("bg_music");
        this.backgroundMusic.on('complete', ()=>{
            this.backgroundMusic.play();
        }, this);

        this.backgroundMusic.play();
    }

    /**
     * Handles when a bullet and enemy collide
     * @function onEnemyHit
     * @param bulletHit The bullet which has hit the monster
     * @param monster The monster which got hit
     * @private
     */
    private onEnemyHit(bulletHit: Bullet, monster: Enemy): void {
        if (bulletHit.active == true && monster.active == true) {
            if (monster.getHealth() != 0) {
                monster.takeDamage();

                if (monster.getHealth() <= 0) {
                    this.score++;
                    this.setScoreText();

                    monster.kill();

                    if (this.score != this.MAX_SCORE) {
                        this.addMonster();
                    }
                }

                bulletHit.setActive(false).setVisible(false);

                if (this.score == this.MAX_SCORE) {
                    this.victorySound.play();

                    this.transitionToRestart();
                }
            }
        }
    }

    /**
     * Responsible for creating new monsters and pooling them
     * @function addMonster
     * @private
     */
    private addMonster(): void {
        let monster: Enemy;
        let min = this.cameras.main.width * 0.1;
        let max = this.cameras.main.width * 0.9;

        let posX: number = Phaser.Math.Between(min, max);/*Math.floor(Math.random() * (max - min)) + min;*/

        if (this.monsterPool.getLength()) {
            monster = this.monsterPool.getFirst();
            monster.x = posX;
            monster.y = 0;
            monster.active = true;
            monster.visible = true;
            this.monsterPool.remove(monster);
        } else {
            monster = new Enemy(this, posX, this.cameras.main.height * 0.2, "monster");
            monster.setOrigin(0.5, 0.5);
            monster.setScale(0.6, 0.6);
            monster.setSize(monster.width * 0.6, monster.height * 0.6);
            this.monsterGroup.add(monster);
        }

        this.add.existing(monster);
    }

    update() {
        this.player.update();

        this.monsterGroup.children.iterate((monster: Enemy) => {
            if (monster.active && monster.y > this.cameras.main.height) {
                this.onMonsterOutOfBounds(monster);
            }
        }, this);
    }

    /**
     * Handles what happens when monster leaves the screen
     * @function onMonsterOutOfBounds
     * @param monster {Enemy} Monster which left the screen
     * @private
     */
    private onMonsterOutOfBounds(monster: Enemy): void {
        this.lives--;
        this.loseLifeSound.play();

        if ("vibrate" in window.navigator) {
            window.navigator.vibrate(100);
        }

        this.setLivesText();

        this.destroyMonster(monster);

        if (this.lives <= 0) {
            this.gameOverSound.play();

            this.transitionToRestart();
        } else {
            this.addMonster();
        }
    }

    /**
     * Changes scene to Restart
     * @function transitionToRestart
     * @private
     */
    private transitionToRestart(): void {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }

        this.scene.pause();
        this.scene.launch("Restart");
    }

    /**
     * Removes monster from monsterGroup and destroying it
     * @function destroyMonster
     * @param monster {Enemy} Monster to be destroyed
     * @private
     */
    private destroyMonster(monster: Enemy): void {
        this.monsterGroup.killAndHide(monster);
        this.monsterGroup.remove(monster);

        if (monster != null) {
            monster.destroy(true);
            monster = null;
        }
    }

    /**
     * Updates score text
     * @function setScoreText
     * @private
     */
    private setScoreText(): void {
        this.scoreText.setText(Localizer.getString("score", [this.score.toString()]));
    }

    /**
     * Updates lives text
     * @function setLivesText
     * @private
     */
    private setLivesText(): void {
        this.livesText.setText(Localizer.getString("lives", [this.lives.toString()]));
    }
}

export {Main}
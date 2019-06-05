import {Localizer} from "../Utils/Localizer";

class Preload extends Phaser.Scene {
    constructor() {
        super({
            key: "Preload",
            active: false
        });
    }

    preload() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '50px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '50px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '50px monospace',
                fill: '#ffffff'
            }
        });

        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value: number) => {
            percentText.setText((value * 100).toString() + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        }, this);

        this.load.on('fileprogress', (file: any) => {
            assetText.setText('Loading asset: ' + file.key);
        }, this);

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();

            Localizer.init(this.game);

            this.scene.start("Main");
        }, this);

        this.load.image("arrow", "src/assets/images/arrow.png");
        this.load.image("heart", "src/assets/images/heart.png");
        this.load.image("monster", "src/assets/images/monster.png");
        this.load.audio("arrow_shoot", "src/assets/audio/arrow_shoot.wav");
        this.load.audio("on_hit", "src/assets/audio/on_hit.wav");
        this.load.audio("on_death", "src/assets/audio/on_death.wav");
        this.load.audio("lose_life", "src/assets/audio/lose_life.wav");
        this.load.audio("button_hover", "src/assets/audio/button_hover.wav");
        this.load.audio("button_select", "src/assets/audio/button_select.wav");
        this.load.audio("victory", "src/assets/audio/victory.wav");
        this.load.audio("game_over", "src/assets/audio/game_over.wav");
        this.load.audio("bg_music", "src/assets/audio/bg_music.ogg");
        this.load.json("locale", "src/assets/en.json");
    }
}

export {Preload}
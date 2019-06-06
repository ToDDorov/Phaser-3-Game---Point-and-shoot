class Localizer {
    private static _instance: Localizer = null;

    private phaserGame: Phaser.Game;
    private localeData: any;

    constructor() {
        if (Localizer._instance) {
            throw new Error("Error: Instantiation failed: Use Localizer.getInstance() instead of new.");
        }
        Localizer._instance = this;
    }

    public static getInstance(): Localizer {
        if (Localizer._instance === null) {
            Localizer._instance = new Localizer();
        }

        return Localizer._instance;
    }

    public static init(g: Phaser.Game) {
        this.getInstance().phaserGame = g;
        this.getInstance().localeData = this.getInstance().phaserGame.cache.json.get("locale");
    }

    public static getString(name: string, param?: string[]) {
        let res: string = null;
        res = this.getInstance().localeData[name];

        if (res == null) {
            console.log("STRING DOESN'T EXIST: ( " + name + " ) FOR LANG - " + "put lang here");
            return "";
        }

        if (param != null) {
            for (let i: number = 0; i < param.length; i++) {
                res = res.replace("{" + i + "}", param[i]);
            }
        }

        return res;
    }

    public static destroy() {
        Localizer._instance = null;
    }
}

export {Localizer}
class GraphicUtils {
    // #FBE051 -> 0xFBE051
    /**
     * fromWebColor function converting hex to number color
     * @param col {string} web color
     * @returns {number} number color
     */
    static fromWebColor(col: string): number {
        let res: string = col.substring(1);

        return parseInt(res, 16);
    }

    /**
     * lightenHex function
     * @param color {string} color to be lighten
     * @param value {number} how much to lighten
     * @returns {string}
     */
    static lightenHex(color: string, value: number): string {
        let phaserCol: Phaser.Display.Color = Phaser.Display.Color.HexStringToColor(color).lighten(value);
        let stringColor: string = Phaser.Display.Color.RGBToString(phaserCol.red, phaserCol.green, phaserCol.blue, phaserCol.alpha);

        return stringColor;
    }

    /**
     * darkenHex function
     * @param color {string} color to be darken
     * @param value {number} how much to darken
     * @returns {string}
     */
    static darkenHex(color: string, value: number): string {
        let phaserCol: Phaser.Display.Color = Phaser.Display.Color.HexStringToColor(color).darken(value);
        let stringColor: string = Phaser.Display.Color.RGBToString(phaserCol.red, phaserCol.green, phaserCol.blue, phaserCol.alpha);

        return stringColor;
    }
}

export {GraphicUtils}
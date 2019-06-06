class GraphicUtils {
    // #FFFFFF -> 0xFFFFFF
    /**
     * Converts hex to number color
     * @method fromWebColor
     * @param col {string} web color
     * @returns {number} number color
     * @static
     * @public
     */
    public static fromWebColor(col: string): number {
        let res: string = col.substring(1);

        return parseInt(res, 16);
    }

    /**
     * Changes color to lighter one
     * @method lightenHex
     * @param color {string} color to be lighten
     * @param value {number} how much to lighten
     * @returns {string}
     * @static
     * @public
     */
    public static lightenHex(color: string, value: number): string {
        let phaserCol: Phaser.Display.Color = Phaser.Display.Color.HexStringToColor(color).lighten(value);
        let stringColor: string = Phaser.Display.Color.RGBToString(phaserCol.red, phaserCol.green, phaserCol.blue, phaserCol.alpha);

        return stringColor;
    }

    /**
     * Changes color to darker one
     * @method darkenHex
     * @param color {string} color to be darken
     * @param value {number} how much to darken
     * @returns {string}
     * @static
     * @public
     */
    public static darkenHex(color: string, value: number): string {
        let phaserCol: Phaser.Display.Color = Phaser.Display.Color.HexStringToColor(color).darken(value);
        let stringColor: string = Phaser.Display.Color.RGBToString(phaserCol.red, phaserCol.green, phaserCol.blue, phaserCol.alpha);

        return stringColor;
    }
}

export {GraphicUtils}
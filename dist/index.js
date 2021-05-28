"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCommandString = void 0;
const xxtea = __importStar(require("./xxtea"));
const crc8_1 = require("./crc8");
const convertTemp2rgb = require('color-temp');
class GenerateCommandString {
    constructor(deviceType, command, commandValue) {
        this.log = console.log;
        this.secret = '5674567400';
        this.RGBToHSB = (r, g, b) => {
            r /= 255;
            g /= 255;
            b /= 255;
            const v = Math.max(r, g, b), n = v - Math.min(r, g, b);
            const h = n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
            return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
        };
        this.rgbToHex = (r, g, b, w) => [r, g, b, w].map(x => {
            const hex = Math.round(x).toString(16).toUpperCase();
            return hex.length === 1 ? '0x0' + hex : '0x' + hex;
        });
        this.toHex = (d) => {
            return ("0" + (Number(d).toString(16))).slice(-2).toUpperCase();
        };
        this.deviceType = deviceType;
        this.command = command;
        this.commandValue = commandValue;
    }
    generateCommandBody() {
        const commandData = this.generateCommandArr(this.deviceType, this.command, this.commandValue);
        const encryptedData = xxtea.object.encrypt(commandData, this.secret);
        this.log(`Encrypted Data - `, encryptedData);
        const hexCmdString = this.toHexString(encryptedData);
        this.log('Encrypted hex command string - ', hexCmdString);
        return hexCmdString;
    }
    generateCommandArr(deviceType, command, commandValue) {
        let command_buf = new Uint8Array(11);
        switch (deviceType) {
            case 'VUL100':
                // command
                command_buf[4] = 0x70;
                command_buf[5] = 0x00;
                command_buf[6] = 0x00;
                command_buf[7] = 0x00;
                // data length
                command_buf[8] = 0x00;
                command_buf[9] = 0x01;
                // param
                command_buf[10] = commandValue == true ? 0x01 : 0x00;
                break;
            case 'VSC100':
                if (command == 'action.devices.commands.OnOff') {
                    // command
                    command_buf[4] = 0x70;
                    command_buf[5] = 0x00;
                    command_buf[6] = 0x20;
                    command_buf[7] = 0x03;
                    // data length
                    command_buf[8] = 0x00;
                    command_buf[9] = 0x01;
                    // param
                    command_buf[10] = commandValue == true ? 0x01 : 0x00;
                }
                else if (command == 'action.devices.commands.ColorAbsolute') {
                    command_buf = new Uint8Array(15);
                    const rgb = convertTemp2rgb.temp2rgb(commandValue);
                    this.log("Kelvin to RGB --->>> ", rgb);
                    const rgb2hsb = this.RGBToHSB(rgb[0], rgb[1], rgb[2]);
                    this.log("RGB to HSB --->>> ", rgb2hsb);
                    const wbgrValues = rgb.concat(rgb2hsb[rgb2hsb.length - 1]);
                    const hexValue = this.rgbToHex(wbgrValues[0], wbgrValues[1], wbgrValues[2], wbgrValues[3]);
                    this.log("RGBW Values --->>> ", wbgrValues);
                    this.log("RGBW to Hex values --->>> ", hexValue);
                    // command
                    command_buf[4] = 0x70;
                    command_buf[5] = 0x00;
                    command_buf[6] = 0x20;
                    command_buf[7] = 0x02;
                    // data length
                    command_buf[8] = 0x00;
                    command_buf[9] = 0x05;
                    // param 1
                    command_buf[10] = 0xFF;
                    // param 2
                    command_buf[11] = hexValue[3]; // w
                    command_buf[12] = hexValue[2]; // b
                    command_buf[13] = hexValue[1]; // g
                    command_buf[14] = hexValue[0]; // r
                }
                else if (command == 'action.devices.commands.ColorLoop') {
                    // command
                    command_buf[4] = 0x70;
                    command_buf[5] = 0x00;
                    command_buf[6] = 0x20;
                    command_buf[7] = 0x01;
                    // data length
                    command_buf[8] = 0x00;
                    command_buf[9] = 0x01;
                    // param
                    command_buf[10] = 0x01;
                }
                else if (command == 'action.devices.commands.BrightnessAbsolute') {
                    const numberToHex = this.toHex(commandValue);
                    // command
                    command_buf[4] = 0x70;
                    command_buf[5] = 0x00;
                    command_buf[6] = 0x20;
                    command_buf[7] = 0x0A;
                    // data length
                    command_buf[8] = 0x00;
                    command_buf[9] = 0x01;
                    // param
                    command_buf[10] = numberToHex;
                }
                break;
            case 'VLS':
                // command
                command_buf[4] = 0x70;
                command_buf[5] = 0x00;
                command_buf[6] = 0x10;
                command_buf[7] = 0x00;
                // data length
                command_buf[8] = 0x00;
                command_buf[9] = 0x01;
                // param
                command_buf[10] = commandValue == true ? 0x01 : 0x00;
                break;
            default:
                throw Error(`Unsupported device : ${deviceType}`);
        }
        // seq no
        command_buf[0] = 0x00;
        command_buf[1] = 0x00;
        // magicNo
        command_buf[2] = 0x56;
        command_buf[3] = 0x74;
        this.log('command_buf : ', command_buf);
        const cksum = this.generateChecksum(command_buf);
        // this.log('cksum - ', cksum)
        const cmd = new Uint8Array([...command_buf, cksum]);
        // this.log('unint array with cksum - ', cmd)
        return cmd;
    }
    generateChecksum(data) {
        const crc8 = new crc8_1.CRC8(crc8_1.CrcPoly.CRC8_DALLAS_MAXIM, 0xff);
        const cksum = crc8.checksum(data);
        return cksum;
    }
    toHexString(data) {
        let s = ''; // '0x';
        data.forEach(function (byte) {
            s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
        });
        return s;
    }
}
exports.GenerateCommandString = GenerateCommandString;
//# sourceMappingURL=index.js.map
const { Bot } = require("./Bot");
const $ = require("jquery");

const package = require('../package.json');

$(document).ready(() => {
    MPP.client.on('ch', () => {
        console.log(`%cNeptune v${package.version}: Successfully loaded`, `color: #ffffff; background: ${MPP.client.getOwnParticipant().color}; font-size: 10px; border-radius: 2px; padding: 4px; margin: 2px; font-family: Verdana; text-shadow: 1px 1px #222;`);
    });
    let bot = new Bot(globalThis.MPP.client);
});

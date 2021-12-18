const Bot = require("./Bot");

document.onload = () => {
    globalThis.Client = MPP.client;
    globalThis.sendChat = MPP.chat.send;
}
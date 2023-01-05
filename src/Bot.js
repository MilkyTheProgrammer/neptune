const EventEmitter = require("events");

const { Logger } = require('./Logger.js');
const MIDIPlayer = require("./Player");
const { Database, User } = require('./Database');
let randomErrors = require('./errorMessages.json');
let pack = require('../package.json');

function getRandomErrorMessage() {
    return randomErrors[Math.floor(Math.random() * randomErrors.length)];
}

class Buttons {
    constructor(pl) {
        this.player = pl;
    }

    add(buttonName, pos, type, cb) {
        if (type == "fileInput") {
            var html = `
            <div id="${buttonName}-file-input2" style="position:absolute; left: ${pos.x}px; top: ${pos.y}px" class="ugly-button translate">
                <label> ${buttonName}
                    <input id="${buttonName}-file-input" style="display: none;" type="file"></input>
                </label>
            </div>
            <pre id="${buttonName}-file-contents"></pre>
            `;
            console.log(html);
            $("#bottom .relative").append(html);
            
            document.getElementById(`${buttonName}-file-input`).onchange = () => {
                if (window.FileReader) {
                    var reader = new FileReader();
                    var f = document.getElementById(`${buttonName}-file-input`).files[0];

                    reader.onload = (e) => {
                        var data = '';
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.length; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        // load(data, f.name);
                        this.player.playMIDIFromData(data, document.getElementById(`${buttonName}-file-input`).files[0].name);
                    };

                    reader.readAsArrayBuffer(f);
                }
                console.log(document.getElementById(`${buttonName}-file-input`).files[0])
            }
        } else {
        $("#bottom .relative").append(`<div id="${buttonName}-btn" style="position:absolute; left: ${pos.x}px; top: ${pos.y}px" class="ugly-button translate"><label> ${buttonName} </label></div>`);
            document.getElementById(`${buttonName}-btn`).onclick = () => {
                cb();
            }
        }
    }
}

class Bot extends EventEmitter {
    client;
    commandHandler = require('./Commands.js').commandHandler;
    logger = new Logger("Neptune");
    player = new MIDIPlayer(this);

    constructor(cl) {
        super();
        
        this.client = cl;
        this.commandHandler = require('./Commands.js').commandHandler;
        this.bindEventListeners();
        this.prefix = '~';
        let savedPrefix =  Database.getPrefix();
        savedPrefix == null || typeof savedPrefix == 'undefined' ? undefined : this.prefix = savedPrefix;
        this.buttons = new Buttons(this.player);
        this.bindButtons();
    }

    bindEventListeners() {
        this.client.on('a', async msg => {
            msg.args = msg.a.split(' ');
            msg.cmd = msg.args[0].substring(this.prefix.length).trim();
            msg.argcat = msg.a.substring(msg.args[0].length).trim();
            msg.prefix = msg.args[0].substring(0, this.prefix.length);

            // let user = await Database.getUser(msg.p._id);
            // User.update(user, msg.p);
            // msg.user = await Database.getUser(msg.p._id);
            // if (msg.user == null) {
            //     msg.user = await Database.createUser(msg.p);
            // }
            
            this.emit('chat_receive', msg);
        });

        this.client.on("participant added", p => {
            let color = new Color(p.color);
            console.log(`%c${p._id} / ${p.name} joined ${this.client.channel._id}`, `color: #ffffff; background: ${p.color}; font-size: 10px; border-radius: 2px; padding: 4px; margin: 2px; font-family: Verdana; text-shadow: 1px 1px #222;`);
        });

        this.client.on("participant removed", p => {
            let color = new Color(p.color);
            console.log(`%c${p._id} / ${p.name} left ${this.client.channel._id}`, `color: #ffffff; background: ${p.color}; font-size: 10px; border-radius: 2px; padding: 4px; margin: 2px; font-family: Verdana; text-shadow: 1px 1px #222;`);
        });

        this.client.on('hi', msg => {
            this.logger.log("Received hi from server");
        });

        this.on('chat_receive', async msg => {
            if (!msg.a.startsWith(this.prefix)) return;
            for (let cmd of this.commandHandler.commands.values()) {
                let usedCommand = false;
                for (let acc of cmd.accessors) {
                    if (msg.cmd.toLowerCase()!== acc.toLowerCase()) continue;
                    usedCommand = true;
                }
                if (!usedCommand) continue;
                if (msg.args.length - 1 < cmd.minArgs) continue;
                try {
                    let out;
                    if (cmd.cb.constructor.name == 'AsyncFunction') {
                        out = await cmd.cb(msg, this);
                    } else {
                        out = cmd.cb(msg, this);
                    }
                    if (!out) return;
                    if (out == '') return;
                    this.sendChat(out);
                } catch (err) {
                    if (err) {
                        console.error(err);
                        // send random error message
                        this.sendChat(`An error has occurred. ${getRandomErrorMessage()}`);
                    }
                }
            }
        });
    }
    
    bindButtons() {
        this.buttons.add("Play", { x: 780, y: 4 }, "fileInput");
        this.buttons.add("Stop", { x: 780, y: 32 }, "script", () => {
            player.stopMIDI();
        });
    }

    sendChat(str) {
        this.client.sendArray([{
            m: 'a',
            message: `\u034f[Neptune] ${str}`
        }]);
    }

    getPart(id) {
        for (let p of Object.values(this.client.ppl)) {
            if (p._id.toLowerCase().includes(id.toLowerCase()) || p.name.toLowerCase().includes(id.toLowerCase())) return p;
        }
        return null;
    }
}

module.exports = {
    Bot
};

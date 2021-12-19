const EventEmitter = require("events");
//const cleverbot = require("cleverbot-free");

const { Logger } = require('./Logger.js');
const MIDIPlayer = require("./Player");

const player = new MIDIPlayer(MPP.chat);
class Command {
    constructor (id, acc, usage, desc, cb, minArgs, hidden) {
        this.id = id;
        this.accessors = acc;
        this.usage = usage;
        this.desc = desc;
        this.cb = cb;
        this.minArgs = minArgs;
        this.hidden = hidden;
    }
}

let randomErrors = require('./errorMessages.json');

let pack = require('../package.json');

function getRandomErrorMessage() {
    return randomErrors[Math.floor(Math.random() * randomErrors.length)];
}

class CommandHandler {
    constructor () {
        this.commands = new Map();
        this.logger = new Logger("Neptune Command Handler");
    }

    /**
     * @param {Command} cmd
     */
    addCommand(cmd) {
        this.commands.set(cmd.id, cmd);
    }
}

class Buttons {
    constructor() {
        this.player = player;
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
                    reader.onload = function(e) {
                        var data = '';
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.length; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        // load(data, f.name);
                        player.playMIDIFromData(data);
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

    constructor(cl) {
        super();
        this.client = cl;
        this.bindEventListeners();
        this.logger = new Logger("Neptune");
        this.prefix = '~';
        this.commandHandler = new CommandHandler();
        this.buttons = new Buttons();
        this.bindDefaultCommands();
        this.bindButtons();
    }

    bindEventListeners() {
        this.client.on('a', msg => {
            msg.args = msg.a.split(' ');
            msg.cmd = msg.args[0].substring(this.prefix.length).trim();
            msg.argcat = msg.a.substring(msg.args[0].length).trim();
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

        this.on('chat_receive', msg => {
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
                    let out = cmd.cb(msg);
                    if (out == '') return;
                    if (out) this.sendChat(out);
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

    bindDefaultCommands() {
        this.commandHandler.addCommand(new Command('help', ['help', 'h', 'cmds'], '%Phelp', 'Displays this help message', msg => {
            if (!msg.args[1]) {
                let out = `Commands:`;
                for (let cmd of this.commandHandler.commands.values()) {
                    if (cmd.hidden) continue;
                    out += ` ${this.prefix}${cmd.accessors[0]} |`;
                }
                out = out.substr(0, out.length - 1).trim();
                return out;
            }

            let cmd;

            for (let c of this.commandHandler.commands.values()) {
                for (let acc of c.accessors) {
                    if (acc.toLowerCase().includes(msg.argcat.toLowerCase())) {
                        cmd = c;
                    }
                }
            }
            if (!cmd) return `Command '${msg.argcat}' not found.`;
            return `Usage: ${cmd.usage.split('%P').join(this.prefix)} | ${cmd.desc}`;
        }, 0, false));

        this.commandHandler.addCommand(new Command('play', ['play'], '%Pplay [song]', `Plays a MIDI file or listed MIDI`, msg => {
            player.playMIDI(msg.argcat);
            // this.Player.octave = 0;
            // this.Player.echo = 0;
            // this.Player.echod = 0;
            // this.Player.transpose = 0;
        }, 0, false));

        this.commandHandler.addCommand(new Command('list', ['list'], '%Plist [song]', `Lists MIDI files that are playable`, msg => {
            player.listMIDIs();
        }, 0, false));

        this.commandHandler.addCommand(new Command('stop', ['stop'], '%Pstop', `Stops the current MIDI file`, msg => {
            player.stopMIDI();
        }, 0, false));

        this.commandHandler.addCommand(new Command('pause', ['pause'], '%Ppause', `Pauses the current MIDI file`, msg => {
            player.pauseMIDI();
        }, 0, false));

        this.commandHandler.addCommand(new Command('resume', ['resume'], '%Presume', `Resumes the current MIDI file`, msg => {
            player.resumeMIDI();
        }, 0, false));

        this.commandHandler.addCommand(new Command('ip', ['ip', 'getip'], '%Pip [user]', `Get someone's IP (totally not fake)`, msg => {
            if (!msg.args[1]) return this.sendChat('Please enter someone to grab an IP from.');
            let user = this.getPart(msg.args[1]);
            let ip = parseInt(user._id.substring(6, 18), 16).toString();
            ip = `${ip.substring(0, 3)}.${ip.substring(4, 7)}.${ip.substring(8, 11)}.${ip.substring(12, 15)}`;
            return `${user.name}'s IP: ${ip}`;
        }, 0, false));

        // this.commandHandler.addCommand(new Command('ai', ['ai'], '%Pai [text]', `Talk to CleverBot`, msg => {
        //     cleverbot(msg.argcat).then((response) => {
        //         return response;
        //     });
        // }, 1, false));

        this.commandHandler.addCommand(new Command('about', ['about'], '%Pabout', `About this bot`, msg => {
            return `This bot was made by ${pack.author}`;
        }, 0, false));

        this.commandHandler.addCommand(new Command('kiss', ['kiss'], '%Pkiss', `Kiss people`, msg => {
            if (!msg.args[1]) return 'Please mention someone to kiss.';
            let person = this.getPart(msg.args[1]);
            if (!person) return 'User not found.';
            if (person && msg.args[1]) {
                return msg.p.name + ' kisses ' + person.name + '.';
            }
        }, 0, false));
        
        this.commandHandler.addCommand(new Command('hug', ['hug'], '%Phug', `Hug people`, msg => {
            if (!msg.args[1]) return 'Please mention someone to hug.';
            let person = this.getPart(msg.args[1]);
            if (!person) return 'User not found.';
            if (person && msg.args[1]) {
                return msg.p.name + ' hugs ' + person.name + '.';
            }
        }, 0, false));

        this.commandHandler.addCommand(new Command('slap', ['slap'], '%Pslap', `Slap people`, msg => {
            if (!msg.args[1]) return 'Please mention someone to slap.';
            let person = this.getPart(msg.args[1]);
            if (!person) return 'User not found.';
            if (person && msg.args[1]) {
                return msg.p.name + ' slaps ' + person.name + '.';
            }
        }, 0, false));

        this.commandHandler.addCommand(new Command('fuck', ['fuck'], '%Pfuck', `Fuck people >;3`, msg => {
            if (!msg.args[1]) return 'Please mention someone to fuck >;3';
            let person = this.getPart(msg.args[1]);
            if (!person) return 'User not found.';
            if (person && msg.args[1]) {
                var eSex = [" they couldn't walk for a whole month..", " their legs went numb....", " the neighbors could hear the loud moaning from 200 miles away...", " they couldn't walk for a few weeks...", " they wanted more..", " they became addicted to it...", " " + msg.p.name + " wanted to marry" + " " + person.name + "!"];
                var sexLol = [" fucked the living shit out of ", " fucked ", " fucked the heck out of ", " fucked the cuteness out of ", " fucked the horny feelings out of "];
                let sexLmao = eSex[Math.floor(Math.random() * eSex.length)];
                var sex2Lmao = sexLol[Math.floor(Math.random() * sexLol.length)];
                return msg.p.name + sex2Lmao + person.name + sexLmao;
            }
        }, 0, false));

        this.commandHandler.addCommand(new Command('id', ['id'], '%Pid', `Get someone's _id`, msg => {
            if (!msg.args[1]) {
                return msg.p.name + ", your _id is: " + msg.p._id;
            }
            let person = this.getPart(msg.args[1]);
            if (!person) return 'User not found.';
            if (person && msg.args[1]) {
                return person.name + "'s _id is: " + person._id;
            }
        }, 0, false));
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
            message: `\u034f${str}`
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

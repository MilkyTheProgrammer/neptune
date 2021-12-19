const EventEmitter = require("events");
//const cleverbot = require("cleverbot-free");

const { Logger } = require('./Logger.js');
const MIDIPlayer = require("./Player");
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

class Bot extends EventEmitter {
    client;

    constructor(cl) {
        super();
        this.client = cl;
        this.bindEventListeners();
        this.logger = new Logger("Neptune");
        this.prefix = '~';
        this.Player = new MIDIPlayer(MPP.chat);
        this.commandHandler = new CommandHandler();
        this.bindDefaultCommands();
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

        this.commandHandler.addCommand(new Command('play', ['play'], '%Pplay [song]', `Plays a MIDI file`, msg => {
            this.Player.playMIDI(msg.argcat);
            // this.Player.octave = 0;
            // this.Player.echo = 0;
            // this.Player.echod = 0;
            // this.Player.transpose = 0;
        }, 0, false));

        this.commandHandler.addCommand(new Command('stop', ['stop'], '%Pstop', `Stops the current MIDI file`, msg => {
            this.Player.stopMIDI();
        }, 0, false));

        this.commandHandler.addCommand(new Command('pause', ['pause'], '%Ppause', `Pauses the current MIDI file`, msg => {
            this.Player.pauseMIDI();
        }, 0, false));

        this.commandHandler.addCommand(new Command('resume', ['resume'], '%Presume', `Resumes the current MIDI file`, msg => {
            this.Player.resumeMIDI();
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

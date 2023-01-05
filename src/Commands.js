const { CommandHandler, Command } = require('./CommandHandler');
const commandHandler = new CommandHandler();
const pack = require('../package.json');

commandHandler.addCommand(new Command('help', ['help', 'h', 'cmds'], '%Phelp', 'Displays this help message', msg => {
    if (!msg.args[1]) {
        let out = `Commands:`;
        for (let cmd of commandHandler.commands.values()) {
            if (cmd.hidden) continue;
            out += ` ${msg.prefix}${cmd.accessors[0]} |`;
        }
        out = out.substr(0, out.length - 1).trim();
        return out;
    }

    let cmd;

    for (let c of commandHandler.commands.values()) {
        for (let acc of c.accessors) {
            if (acc.toLowerCase().inbotudes(msg.argcat.toLowerCase())) {
                cmd = c;
            }
        }
    }

    if (!cmd) return `Command '${msg.argcat}' not found.`;
    
    return `Usage: ${cmd.usage.split('%P').join(this.prefix)} | ${cmd.desc}`;
}, 0, false));

commandHandler.addCommand(new Command('play', ['play'], '%Pplay [song]', `Plays a MIDI file or listed MIDI`, (msg, bot) => {
    bot.player.playMIDI(msg.argcat);
}, 0, false));

commandHandler.addCommand(new Command('list', ['list'], '%Plist [song]', `Lists MIDI files that are playable`, (msg, bot) => {
    bot.player.listMIDIs();
}, 0, false));

commandHandler.addCommand(new Command('stop', ['stop'], '%Pstop', `Stops the current MIDI file`, (msg, bot) => {
    bot.player.stopMIDI();
}, 0, false));

commandHandler.addCommand(new Command('pause', ['pause'], '%Ppause', `Pauses the current MIDI file`, (msg, bot) => {
    bot.player.pauseMIDI();
}, 0, false));

commandHandler.addCommand(new Command('resume', ['resume'], '%Presume', `Resumes the current MIDI file`, (msg, bot) => {
    bot.player.resumeMIDI();
}, 0, false));

commandHandler.addCommand(new Command('ip', ['ip', 'getip'], '%Pip [user]', `Get someone's IP (totally not fake)`, (msg, bot) => {
    if (!msg.args[1]) return 'Please enter someone to grab an IP from.';
    let user = bot.getPart(msg.args[1]);
    let ip = parseInt(user._id.substring(6, 18), 16).toString();
    ip = `${ip.substring(0, 3)}.${ip.substring(4, 7)}.${ip.substring(8, 11)}.${ip.substring(12, 15)}`;
    return `${user.name}'s IP: ${ip}`;
}, 0, false));

commandHandler.addCommand(new Command('about', ['about'], '%Pabout', `About this bot`, msg => {
    return `Neptune ${pack.version} | Made by ${pack.author}`;
}, 0, false));

commandHandler.addCommand(new Command('kiss', ['kiss'], '%Pkiss', `Kiss people`, (msg, bot) => {
    if (!msg.args[1]) return 'Please mention someone to kiss.';
    let person = bot.getPart(msg.args[1]);
    if (!person) return 'User not found.';
    if (person && msg.args[1]) {
        return msg.p.name + ' kisses ' + person.name + '.';
    }
}, 0, false));

commandHandler.addCommand(new Command('hug', ['hug'], '%Phug', `Hug people`, (msg, bot) => {
    if (!msg.args[1]) return 'Please mention someone to hug.';
    let person = bot.getPart(msg.args[1]);
    if (!person) return 'User not found.';
    if (person && msg.args[1]) {
        return msg.p.name + ' hugs ' + person.name + '.';
    }
}, 0, false));

commandHandler.addCommand(new Command('slap', ['slap'], '%Pslap', `Slap people`, (msg, bot) => {
    if (!msg.args[1]) return 'Please mention someone to slap.';
    let person = bot.getPart(msg.args[1]);
    if (!person) return 'User not found.';
    if (person && msg.args[1]) {
        return msg.p.name + ' slaps ' + person.name + '.';
    }
}, 0, false));

// commandHandler.addCommand(new Command('fuck', ['fuck'], '%Pfuck', `Fuck people >;3`, (msg, bot) => {
//     if (!msg.args[1]) return 'Please mention someone to fuck >;3';
//     let person = bot.getPart(msg.args[1]);
//     if (!person) return 'User not found.';
//     if (person && msg.args[1]) {
//         var eSex = [" they couldn't walk for a whole month..", " their legs went numb....", " the neighbors could hear the loud moaning from 200 miles away...", " they couldn't walk for a few weeks...", " they wanted more..", " they became addicted to it...", " " + msg.p.name + " wanted to marry" + " " + person.name + "!"];
//         var sexLol = [" fucked the living shit out of ", " fucked ", " fucked the heck out of ", " fucked the cuteness out of ", " fucked the horny feelings out of "];
//         let sexLmao = eSex[Math.floor(Math.random() * eSex.length)];
//         var sex2Lmao = sexLol[Math.floor(Math.random() * sexLol.length)];
//         return msg.p.name + sex2Lmao + person.name + sexLmao;
//     }
// }, 0, false));

commandHandler.addCommand(new Command('id', ['id'], '%Pid', `Get someone's _id`, (msg, bot) => {
    if (!msg.args[1]) {
        return msg.p.name + ", your _id is: " + msg.p._id;
    }
    let person = bot.getPart(msg.args[1]);
    if (!person) return 'User not found.';
    if (person && msg.args[1]) {
        return person.name + "'s _id is: " + person._id;
    }
}, 0, false));

commandHandler.addCommand(new Command('bonk', ['bonk'], '%Pbonk', `Bonk someone`, (msg, bot) => {
    if (!msg.args[1]) return 'Please mention someone to bonk.';
    let person = bot.getPart(msg.args[1]);
    if (!person) return 'User not found.';
    if (person && msg.args[1]) {
        return msg.p.name + ' bonks ' + person.name + '.';
    }
}, 0, false));

commandHandler.addCommand(new Command('userdatatest', ['userdatatest'], '%Puserdatatest', `User data testing`, async msg => {
    if (!msg.args[1]) {
        return msg.user.name;
    } else {
        let user = await Database.getUser(msg.args[1]);
        return user.name;
    }
}, 0, true));

module.exports = {
    commandHandler
}

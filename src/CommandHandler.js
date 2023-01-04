const { Logger } = require('./Logger');

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

module.exports = {
    CommandHandler,
    Command
}

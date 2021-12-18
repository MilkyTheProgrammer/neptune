class Commands {
    constructor() {
        this.commands = new Map();
    }

    addCommand(options = {name, description, catagory, isScript, func}) {
        if (typeof (options.name) !== "string") return;
        if (typeof (options.description) !== "string") return;
        this.commands.set(options.name, { name: options.name, description: options.description, catagory: options.catagory, isScript: options.isScript, func: options.func });
    }
}


let settings = {
    prefix: "~"
};


const commands = new Commands();

commands.addCommand({
    name: "help",
    description: "Shows all the fucking commands.",
    catagory: "Utils",
    isScript: false,
    func: (command, args, p) => {
        let helpObj = {};

        if (args[0].length) {
            let cmd = commands.commands.get(command);
            let description = cmd.description;
            MPP.chat.send(`Description for "${cmd.name}": ${description}.`);
        } else {
            commands.commands.forEach(command => {
                if (!command.name) return;
                if (!helpObj.hasOwnProperty(command.catagory)) helpObj[command.catagory] = [];
                helpObj[command.catagory] += command.name + ", ";
            });

            let props = Object.getOwnPropertyNames(helpObj);

            props.forEach(catagory => {
                let cmds = helpObj[catagory].substring(helpObj[catagory].length - 2, helpObj[catagory]);
                MPP.chat.send(`${catagory}: ${cmds}.`);
            });
        }
    }
})

function handleCommand(command, args, p) {
    try { 
        let cmd = commands.commands.get(command);
        let ev; 

        if (cmd.isScript) {
            ev = eval(cmd.func);
            return;
        }

        ev = cmd.func(command, args, p);

    } catch(e) {
        console.log(e);
        MPP.chat.send(`Command "${command}" not found.`);
        return;
    }
}

MPP.client.on("a", (msg) => {
    if (msg.a && msg.a.indexOf(settings.prefix) == 0) { 
        let message = msg.a;

        let spaceIndex = message.indexOf(" ");
        let index = spaceIndex > -1 ? spaceIndex : message.length;
        let command = message.substring(1, index).toLowerCase();
        let args = message.substring(index, message.length).trim().split(' ');

        let p = {
            name: msg.p.name,
            color: msg.p.color,
            _id: msg.p._id
        }

        handleCommand(command, args, p);
    }
});
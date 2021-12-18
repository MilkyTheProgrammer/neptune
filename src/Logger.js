class Logger {
    constructor(id) {
        this.id = id;
        this.logs = [];
    }
    
    log(message) {
        console.log(`%c${this.id}: ${message}`, 'color: #00ff00; background: #000; font-size: 10px; border-radius: 8px; padding: 5px;')
        this.logs.push(message);
    }
    
    getLogs() {
        return this.logs;
    }
}

module.exports = {
    Logger
}

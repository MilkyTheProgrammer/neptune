const idb = require('idb');
    
const { Logger } = require('./Logger');
const logger = new Logger('Database');

const asyncBypass = {}

idb.openDB('Neptune', 1, {
    upgrade(db) {
        let store = db.createObjectStore('users', {
            autoIncrement: true
        });

        // index users by _id
        store.createIndex('users', '_id', { unique: true });
    },
    blocked() {
        logger.log('blocked');
    },
    blocking() {
        logger.log('blocking');
    },
    terminated() {
        logger.log('terminated');
    }
}).then(db => {
    asyncBypass.getUser = async function(_id) {
        let user = await db.get('users', _id);
        return user;
    }

    asyncBypass.setUser = async function(user) {
        return await db.put('users', user, user._id);
    }
});

class User {
    constructor (p) {
        this._id = p._id;
        this.name = p.name;
        this.color = p.color;
        
        this.nameHistory = [];
        this.colorHistory = [];
        this.balance = 0;
        this.inventory = {};
    }
    
    static update(user, p) {
        user.name = p.name;
        user.color = p.color;
        Database.setUser(user);
    }
    
    get items () {
        let inv = [];
        for (let item in this.inventory) {
            inv.push(item);
        }
        return inv;
    }
}

class Database {
    static async getUser(id) {
        return await asyncBypass.getUser(id);
    }
    
    static async createUser(p) {
        const user = new User(p);
        await Database.setUser(user);
        return user;
    }
    
    static async setUser(user) {
        console.log('asyncBypass; ', asyncBypass);
        return await asyncBypass.setUser(user);
    }
}

module.exports = {
    Database,
    User
}

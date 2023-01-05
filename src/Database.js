const idb = require('idb');
    
const { Logger } = require('./Logger');
const logger = new Logger('Database');

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

const PREFIX_VAR = `neptune_prefix`;

class Database {
    static async load() {
        this.db = await idb.openDB('Neptune', 1, {
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
        })
    }

    static async getUser(id) {
        let user = await this.db.get('users', id);
        return user;
    }
    
    static async createUser(p) {
        const user = new User(p);
        await Database.setUser(user);
        return user;
    }
    
    static async setUser(user) {
        return await this.db.put('users', user, user._id);
    }

    static getPrefix() {
        return localStorage.getItem(PREFIX_VAR);
    }

    static setPrefix(pr) {
        return localStorage.setItem(PREFIX_VAR, pr);
    }
}

module.exports = {
    Database,
    User
}

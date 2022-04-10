class Permission {
    constructor () {

    }
}

class PermissionGroup {
    constructor () {
        this.permissions = new Map();
    }
}

module.exports = {
    PermissionGroup
}

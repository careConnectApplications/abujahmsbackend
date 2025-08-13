"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsForRole = exports.getRolesDefaultPermission = exports.getRolesById = void 0;
const roles_1 = require("../config/roles");
/**
 * fetch roles by Id
 * @returns {}
 */
const getRolesById = (id) => {
    return roles_1.roles.find(role => role.id === id);
};
exports.getRolesById = getRolesById;
/**
 * fetch role default permission
 * @returns {}
 */
const getRolesDefaultPermission = (roleId) => {
    var _a;
    return (_a = roles_1.roles.find(role => role.id == roleId)) === null || _a === void 0 ? void 0 : _a.defaultPermissions;
};
exports.getRolesDefaultPermission = getRolesDefaultPermission;
/**
 * get Role Permission
 * @return [{id: number, name: String, status: boolean}]
 */
const getPermissionsForRole = (roleId) => {
    const role = roles_1.roles.find(r => r.id === roleId);
    const result = roles_1.permissionsList.map(permission => ({
        id: permission.id,
        name: permission.name,
        status: role === null || role === void 0 ? void 0 : role.defaultPermissions.includes(permission.id)
    }));
    return result;
};
exports.getPermissionsForRole = getPermissionsForRole;

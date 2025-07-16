import { permissionsList, roles } from "../config/roles"

/**
 * fetch roles by Id
 * @returns {}
 */
export const getRolesById = (id: Number) => {
    return roles.find(role => role.id === id)
}

/**
 * fetch role default permission
 * @returns {}
 */
export const getRolesDefaultPermission = (roleId: Number) => {
    return roles.find(role => role.id == roleId)?.defaultPermissions;
}

/**
 * get Role Permission
 * @return [{id: number, name: String, status: boolean}]
 */
export const getPermissionsForRole = (roleId: Number) => {
    const role = roles.find(r => r.id === roleId);

    const result = permissionsList.map(permission => ({
        id: permission.id,
        name: permission.name,
        status: role?.defaultPermissions.includes(permission.id)
    }));

    return result;
}
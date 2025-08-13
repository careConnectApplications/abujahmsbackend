"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserDefaultPermission = exports.updateUserPermissions = exports.getUserPermissions = exports.getUserCombinedPermissions = exports.updateUserSpecialPermission = exports.getAllRoles = void 0;
exports.getallusers = getallusers;
exports.updatepassword = updatepassword;
exports.passwordreset = passwordreset;
exports.updatestatus = updatestatus;
exports.updateusers = updateusers;
exports.bulkuploadusers = bulkuploadusers;
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = require("../../dao/users");
const otherservices_1 = require("../../utils/otherservices");
const errors_1 = require("../../errors");
const roles_1 = require("../../config/roles");
const roles_2 = require("../../dao/roles");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
//get all users
function getallusers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, users_1.readall)({});
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//update a user password
function updatepassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            var { currentpassword, newpassword } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ currentpassword, newpassword });
            //read user 
            var user = yield (0, users_1.readone)({ _id: id });
            const { password } = user;
            const isMatch = yield bcryptjs_1.default.compare(currentpassword, password);
            if (!isMatch) {
                //return error
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            //change password
            var queryresult = yield (0, users_1.updateuser)(id, { password: newpassword });
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
function passwordreset(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const queryresult = yield (0, users_1.updateuser)(id, { password: config_1.default.defaultPassword });
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//deactivate a user
function updatestatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const response = yield (0, users_1.readone)({ _id: id });
            const status = (response === null || response === void 0 ? void 0 : response.status) == config_1.default.status[0] ? config_1.default.status[1] : config_1.default.status[0];
            const queryresult = yield (0, users_1.updateuser)(id, { status });
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//update a user
function updateusers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            //map role to role id
            const { role } = req.body;
            //get role id
            if (role) {
                var roleId = (config_1.default.roles).filter((e) => e.role == role)[0].roleId;
                req.body.roleId = roleId;
            }
            var queryresult = yield (0, users_1.updateuser)(id, req.body);
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//bulk upload users
function bulkuploadusers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.files.file;
            const filename = config_1.default.useruploadfilename;
            let allowedextension = ['.csv', '.xlsx'];
            let uploadpath = `${process.cwd()}/${config_1.default.useruploaddirectory}`;
            var columnmapping = {
                A: "title",
                B: "staffId",
                C: "firstName",
                D: "middleName",
                E: "lastName",
                F: "country",
                G: "state",
                H: "city",
                I: "address",
                J: "age",
                K: "dateOfBirth",
                L: "gender",
                M: "licence",
                N: "phoneNumber",
                O: "email",
                P: "role",
                Q: "degree",
                R: "profession",
                S: "employmentStatus",
                T: "nativeSpokenLanguage",
                U: "otherLanguage",
                V: "readWriteLanguage",
                W: "clinic",
                X: "zip",
                Y: "specializationDetails",
            };
            yield (0, otherservices_1.uploaddocument)(file, filename, allowedextension, uploadpath);
            //convert uploaded excel to json
            var convert_to_json = (0, otherservices_1.convertexceltojson)(`${uploadpath}/${filename}${path_1.default.extname(file.name)}`, config_1.default.usertemplate, columnmapping);
            //save to database
            var { userslist } = convert_to_json;
            if (userslist.length > 0) {
                for (var i = 0; i < userslist.length; i++) {
                    const { email, firstName, title, staffId, lastName, country, state, city, address, age, dateOfBirth, gender, licence, phoneNumber, role, degree, profession, employmentStatus, nativeSpokenLanguage, otherLanguage, readWriteLanguage, clinic, zip, specializationDetails } = userslist[i];
                    (0, otherservices_1.validateinputfaulsyvalue)({ email, firstName, title, staffId, lastName, country, state, city, address, age, dateOfBirth, gender, licence, phoneNumber, role, degree, profession, employmentStatus, nativeSpokenLanguage, otherLanguage, readWriteLanguage, clinic, zip, specializationDetails });
                    const foundUser = yield (0, users_1.readone)({ email });
                    if (foundUser) {
                        throw new Error(`${email} ${config_1.default.error.erroralreadyexit}`);
                    }
                    var roleId = (config_1.default.roles).filter((e) => e.role == role)[0].roleId;
                    userslist[i].roleId = roleId;
                    userslist[i].password = config_1.default.defaultPassword;
                    //other validations
                    yield (0, users_1.createuser)(userslist[i]);
                }
            }
            res.status(200).json({ status: true, queryresult: 'Bulk upload was successfull' });
        }
        catch (e) {
            //logger.error(e.message);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
exports.getAllRoles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        status: true,
        data: roles_1.roles
    });
}));
exports.updateUserSpecialPermission = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { permissions } = req.body;
    if (!id)
        return next(new errors_1.ApiError(400, "id is not provided!"));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, "invalid id"));
    const _id = new mongoose_1.default.Types.ObjectId(id);
    if (!permissions || !Array.isArray(permissions)) {
        return next(new errors_1.ApiError(400, "Permission must be array of id"));
    }
    const validPermissionsId = roles_1.permissionsList.map(p => p.id);
    const inValidPermissions = permissions.filter(id => !validPermissionsId.includes(id));
    if (inValidPermissions.length > 0)
        return next(new errors_1.ApiError(400, "invalid permission ids"));
    const user = yield (0, users_1.getUserById)(_id);
    if (!user)
        return next(new errors_1.ApiError(404, `no user found with id: ${id}`));
    const updateUser = yield (0, users_1.updateUserSpecialPermissionService)(_id, permissions);
    if (!updateUser)
        return next(new errors_1.ApiError(400, "error updating special permissions"));
    res.status(200).json({
        status: true,
        message: "special permissions updated successfully",
        body: updateUser
    });
}));
exports.getUserCombinedPermissions = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new errors_1.ApiError(400, "id is not provided!"));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, "invalid id"));
    const _id = new mongoose_1.default.Types.ObjectId(id);
    const user = yield (0, users_1.getUserById)(_id);
    if (!user)
        return next(new errors_1.ApiError(404, `no user found with id: ${id}`));
    /// get user role
    const role = (0, roles_2.getRolesById)(user.roleId);
    if (!role)
        return next(new errors_1.ApiError(404, `Role not found with user!`));
    /// get default permissions
    const roleDefaultPermissions = role.defaultPermissions || [];
    const userSpecialPermissions = user.specialPermissions || [];
    const allPermissions = [...new Set([...roleDefaultPermissions, ...userSpecialPermissions])];
    const userResponse = {
        user,
        role: {
            id: role.id,
            name: role.name
        },
        permissions: allPermissions
    };
    res.status(200).json({
        status: true,
        message: "user permissions fetched successfully",
        data: userResponse
    });
}));
exports.getUserPermissions = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new errors_1.ApiError(400, "id is not provided!"));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, "invalid id"));
    const _id = new mongoose_1.default.Types.ObjectId(id);
    const user = yield (0, users_1.getUserById)(_id);
    if (!user)
        return next(new errors_1.ApiError(404, `no user found with id: ${id}`));
    const { roleId } = user;
    /// get user role
    const role = (0, roles_2.getRolesById)(+roleId);
    if (!role)
        return next(new errors_1.ApiError(404, `invalid role Id!`));
    /// get permissons
    const permissions = roles_1.permissionsList.map(perm => {
        var _a;
        return ({
            id: perm.id,
            name: perm.name,
            status: (_a = user.specialPermissions) === null || _a === void 0 ? void 0 : _a.includes(perm.id)
        });
    });
    ;
    res.status(200).json({
        status: true,
        message: "user permissions fetched successfully",
        data: {
            permissions, user
        }
    });
}));
exports.updateUserPermissions = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { permissions } = req.body;
    if (!id)
        return next(new errors_1.ApiError(400, "id is not provided!"));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, "invalid id"));
    const _id = new mongoose_1.default.Types.ObjectId(id);
    if (!permissions || !Array.isArray(permissions))
        return next(new errors_1.ApiError(400, "permissions payload is required"));
    const user = yield (0, users_1.getUserById)(_id);
    if (!user)
        return next(new errors_1.ApiError(404, `no user found with id: ${id}`));
    const invalidPermissions = [];
    permissions.forEach(perm => {
        var _a;
        if (((_a = roles_1.permissionsList.find(p => p.id === perm.id)) === null || _a === void 0 ? void 0 : _a.name) !== perm.name) {
            invalidPermissions.push(`Permission name doesn't match ID: ${perm.id}`);
        }
    });
    if (invalidPermissions.length > 0)
        return next(new errors_1.ApiError(400, "invalid permissions data"));
    const enabledPermissionIds = permissions
        .filter(perm => perm.status === true)
        .map(perm => perm.id);
    const updatedUser = yield (0, users_1.updateUserSpecialPermissionService)(_id, enabledPermissionIds);
    if (!updatedUser)
        return next(new errors_1.ApiError(400, "error updating permissions"));
    const fullPermissions = roles_1.permissionsList.map(perm => ({
        id: perm.id,
        name: perm.name,
        status: enabledPermissionIds.includes(perm.id)
    }));
    res.status(200).json({
        status: true,
        message: "user permissions updated successfully",
        data: {
            user: updatedUser,
            permissions: fullPermissions
        }
    });
}));
exports.setUserDefaultPermission = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!id)
        return next(new errors_1.ApiError(400, "id is not provided!"));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, config_1.default.error.errorInvalidObjectId));
    const _id = new mongoose_1.default.Types.ObjectId(id);
    const user = yield (0, users_1.getUserById)(_id);
    if (!user)
        return next(new errors_1.ApiError(404, `no user found with id: ${id}`));
    const { roleId } = user;
    const permissions = ((_a = (0, roles_2.getRolesById)(+roleId)) === null || _a === void 0 ? void 0 : _a.defaultPermissions) || [];
    const queryresult = yield (0, users_1.updateuser)(_id, { specialPermissions: permissions });
    res.status(200).json({
        status: true,
        data: queryresult
    });
}));

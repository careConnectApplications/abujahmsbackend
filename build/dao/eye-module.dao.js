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
exports.queryEyeRecordsPaginated = void 0;
exports.getallEyeModules = getallEyeModules;
exports.createEyeService = createEyeService;
exports.findOneEyeModule = findOneEyeModule;
exports.updateEyeModule = updateEyeModule;
exports.updateappointmentbyquery = updateappointmentbyquery;
exports.getAllEyeRecordpaginated = getAllEyeRecordpaginated;
exports.findEyeModule = findEyeModule;
const config_1 = __importDefault(require("../config"));
const eye_module_model_1 = __importDefault(require("../models/eye-module/eye-module.model"));
const errors_1 = require("../errors");
function getallEyeModules(query, selectquery, populatequery, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const eyedetails = yield eye_module_model_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totaleyedetails = yield eye_module_model_1.default.find(query).countDocuments();
            return { eyedetails, totaleyedetails };
        }
        catch (err) {
            console.log(err);
            return next(new errors_1.ApiError(401, config_1.default.error.erroruserread));
        }
    });
}
;
function createEyeService(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = new eye_module_model_1.default(input);
        return yield doc.save();
    });
}
//find one
function findOneEyeModule(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield eye_module_model_1.default.findOne(query).select(selectquery);
    });
}
//update eye module by id
function updateEyeModule(id, reqbody, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const doc = yield eye_module_model_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                upsert: true, new: true
            });
            if (!doc) {
                //return json  false response
                return next(new errors_1.ApiError(401, config_1.default.error.errorinvalidcredentials));
            }
            return doc;
        }
        catch (err) {
            return next(new errors_1.ApiError(401, config_1.default.error.erroruserupdate));
        }
    });
}
//update eye module by query
function updateappointmentbyquery(query, reqbody, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const doc = yield eye_module_model_1.default.findOneAndUpdate(query, reqbody, {
                upsert: true,
                new: true
            });
            if (!doc) {
                //return json  false response
                return next(new errors_1.ApiError(400, config_1.default.error.errorinvalidcredentials));
            }
            return doc;
        }
        catch (err) {
            console.log(err);
            return next(new errors_1.ApiError(409, config_1.default.error.erroruserupdate));
        }
    });
}
function getAllEyeRecordpaginated(input, page, size) {
    return __awaiter(this, void 0, void 0, function* () {
        const skip = (page - 1) * size;
        const eyedetails = yield eye_module_model_1.default.aggregate(input).skip(skip).limit(size).sort({ createdAt: -1 });
        const totalEyeDocs = (yield eye_module_model_1.default.aggregate(input)).length;
        const totalPages = Math.ceil(eyedetails / size);
        return { totalEyeDocs, totalPages, eyedetails, size, page };
    });
}
/**
 * Query for eye records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryEyeRecordsPaginated = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = yield eye_module_model_1.default.paginate(filter, options);
    return docs;
});
exports.queryEyeRecordsPaginated = queryEyeRecordsPaginated;
function findEyeModule(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield eye_module_model_1.default.find(query).select(selectquery);
    });
}

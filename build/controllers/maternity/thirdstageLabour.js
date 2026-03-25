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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thirdstageLabour_1 = __importDefault(require("../../dao/thirdstageLabour"));
const otherservices_1 = require("../../utils/otherservices");
const createThirdStageLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, user } = req;
        const { _id } = user.user;
        // Validate required fields for third stage labour
        const { mother, newBorn } = body;
        (0, otherservices_1.validateinputfaulsyvalue)({ mother, newBorn });
        const thirdStageLabourData = Object.assign(Object.assign({}, body), { doctor: _id });
        const result = yield thirdstageLabour_1.default.createThirdStageLabour(thirdStageLabourData);
        res.status(result.status).json({
            status: true,
            msg: result.message,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
});
const getThirdStageLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { limit, skip, searchText } = req.query;
        const result = yield thirdstageLabour_1.default.readAllThirdStageLabour(Number(limit) || undefined, Number(skip) || undefined, searchText);
        res.status(result.status).json({
            queryresult: {
                data: result.data,
                totalCount: ((_a = result.data) === null || _a === void 0 ? void 0 : _a.length) || 0,
                status: true
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
});
const getThirdStageLabourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield thirdstageLabour_1.default.getThirdStageLabourById(id);
        res.status(result.status).json({
            status: true,
            queryresult: result.data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
});
const getThirdStageLabourByPatientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId } = req.params;
        const result = yield thirdstageLabour_1.default.getThirdStageLabourByPatientId(patientId);
        res.status(result.status).json({
            status: true,
            queryresult: result.data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
});
const updateThirdStageLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        const { firstName, lastName } = req.user.user;
        const updateData = Object.assign(Object.assign({}, body), { updatedBy: `${firstName} ${lastName}` });
        const result = yield thirdstageLabour_1.default.updateThirdStageLabour(id, updateData);
        res.status(result.status).json({
            status: true,
            msg: result.message,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
});
// Delete function commented out as per pattern
// const deleteThirdStageLabour = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const result = await thirdStageLabourDao.deleteThirdStageLabour(id);
//     res.status(result.status).json({
//       error: result.error,
//       message: result.message,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       error: true,
//       message: error.message || config.messages.general.serverError,
//     });
//   }
// };
const getThirdStageLabourPaginated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { page, limit, searchText } = _a, filters = __rest(_a, ["page", "limit", "searchText"]);
        const result = yield thirdstageLabour_1.default.getThirdStageLabourPaginated(Number(page) || 1, Number(limit) || 10, searchText, filters);
        res.status(result.status).json({
            queryresult: result.data,
            //totalCount: result.data?.totalCount || 0,
            status: true
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
});
exports.default = {
    createThirdStageLabour,
    getThirdStageLabour,
    getThirdStageLabourById,
    getThirdStageLabourByPatientId,
    updateThirdStageLabour,
    // deleteThirdStageLabour,
    getThirdStageLabourPaginated,
};

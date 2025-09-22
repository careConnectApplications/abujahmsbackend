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
const firststageLabour_1 = __importDefault(require("../../dao/firststageLabour"));
const otherservices_1 = require("../../utils/otherservices");
const createFirstStageLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, user } = req;
        const { dateExamined, phase } = body;
        (0, otherservices_1.validateinputfaulsyvalue)({ dateExamined, phase });
        //const userId = (req as any).userId;
        const { _id } = user.user;
        //console.log(userId);
        const firstStageLabourData = Object.assign(Object.assign({}, body), { doctor: _id });
        const result = yield firststageLabour_1.default.createFirstStageLabour(firstStageLabourData);
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
const getFirstStageLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, skip, searchText } = req.query;
        const result = yield firststageLabour_1.default.readAllFirstStageLabour(Number(limit) || undefined, Number(skip) || undefined, searchText);
        res.status(result.status).json({
            queryresult: {
                data: result.data,
                totalCount: result.totalCount,
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
const getFirstStageLabourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield firststageLabour_1.default.getFirstStageLabourById(id);
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
const getFirstStageLabourByPatientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId } = req.params;
        const result = yield firststageLabour_1.default.getFirstStageLabourByPatientId(patientId);
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
const updateFirstStageLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.updatedBy = `${firstName} ${lastName}`;
        const { body } = req;
        const updateData = Object.assign({}, body);
        const result = yield firststageLabour_1.default.updateFirstStageLabour(id, updateData);
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
/*
const deleteFirstStageLabour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await firstStageLabourDao.deleteFirstStageLabour(id);
    
    res.status(result.status).json({
      error: result.error,
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};
*/
const getFirstStageLabourPaginated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { page, limit, searchText } = _a, filters = __rest(_a, ["page", "limit", "searchText"]);
        const result = yield firststageLabour_1.default.getFirstStageLabourPaginated(Number(page) || 1, Number(limit) || 10, searchText, filters);
        res.status(result.status).json({
            status: true,
            queryresult: result.data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});
exports.default = {
    createFirstStageLabour,
    getFirstStageLabour,
    getFirstStageLabourById,
    getFirstStageLabourByPatientId,
    updateFirstStageLabour,
    getFirstStageLabourPaginated,
};

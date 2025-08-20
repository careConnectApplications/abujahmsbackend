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
exports.readAllInsuranceClaims = readAllInsuranceClaims;
exports.createInsuranceClaim = createInsuranceClaim;
exports.readOneInsuranceClaim = readOneInsuranceClaim;
exports.updateInsuranceClaimById = updateInsuranceClaimById;
exports.updateInsuranceClaimByQuery = updateInsuranceClaimByQuery;
const insuranceclaim_1 = __importDefault(require("../models/insuranceclaim"));
const config_1 = __importDefault(require("../config"));
// 🔍 Read all insurance claims
function readAllInsuranceClaims(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page = 1, limit = 150, query = {}, select = "", populate = [
            { path: "patient", select: "firstName middleName lastName phoneNumber email isHMOCover HMOName HMOId MRN" },
            { path: "lab", select: "testname testid raiseby createdAt" },
            { path: "radiology", select: "testname testid raiseby createdAt" },
            { path: "procedure", select: "procedure procedureid raiseby createdAt" },
            { path: "pharmacy", select: "prescription pharmacy orderid qty" },
            { path: "createdBy", select: "firstName lastName role" },
        ], } = options;
        try {
            const skip = (page - 1) * limit;
            const queryBuilder = insuranceclaim_1.default.find(query)
                .select(select)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            // apply populate with field selection
            populate.forEach((p) => {
                queryBuilder.populate(p);
            });
            const [claims, total] = yield Promise.all([
                queryBuilder.exec(), // latest first
                insuranceclaim_1.default.countDocuments(query),
            ]);
            return { claims, totalPages: Math.ceil(total / limit), total, limit, page };
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// ➕ Create a new insurance claim
/*
export async function createInsuranceClaim(input: any) {
  try {
    const newClaim = new InsuranceClaim(input);
    return await newClaim.save();
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.errorusercreate);
  }
}
  */
function createInsuranceClaim(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (Array.isArray(input)) {
                // 🔹 Insert many claims at once
                return yield insuranceclaim_1.default.insertMany(input);
            }
            else {
                // 🔹 Fallback for single claim
                const newClaim = new insuranceclaim_1.default(input);
                return yield newClaim.save();
            }
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
// 🔍 Read one insurance claim
function readOneInsuranceClaim(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, selectquery = {}) {
        try {
            return yield insuranceclaim_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// 🔄 Update claim by ID
function updateInsuranceClaimById(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield insuranceclaim_1.default.findOneAndUpdate({ _id: id }, reqbody, { new: true });
            if (!updated) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return updated;
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
// 🔄 Update claim by query
function updateInsuranceClaimByQuery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield insuranceclaim_1.default.findOneAndUpdate(query, reqbody, {
                new: true,
            });
            if (!updated) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return updated;
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}

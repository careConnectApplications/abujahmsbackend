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
exports.getAllHistopathologyDashboard = exports.CreateMultipleTestReport = exports.getAllHistopathologyPaginatedHandler = exports.getAllHistopathology = exports.getHistopathologyRecordById = exports.CreateHistopatholgyService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config"));
const histopathology_dao_1 = require("../../dao/histopathology.dao");
const histopathology_tests_dao_1 = require("../../dao/histopathology-tests.dao");
const patientmanagement_1 = require("../../dao/patientmanagement");
const payment_1 = require("../../dao/payment");
const price_1 = require("../../dao/price");
const errors_1 = require("../../errors");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const histopathology_1 = __importDefault(require("../../models/histopathology"));
const otherservices_1 = require("../../utils/otherservices");
const generateRefNumber = () => {
    const uniqueHistopathologyId = (0, uuid_1.v4)();
    return `histo-${new Date().getFullYear()}-${uniqueHistopathologyId}`;
};
const generateLabNumber = () => {
    const uniqueHistopathologyId = (0, uuid_1.v4)();
    return `Lab-${new Date().getFullYear()}-${uniqueHistopathologyId}`;
};
exports.CreateHistopatholgyService = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const validBiopsyType = ["Excision", "Incision", "Endoscopy", "Trucut"];
    var _a, _b;
    const { patientId, examTypes, /// this is the service types
    doctorId, lmp, biopsyType, wholeOrgan, previousBiopsy, diagnosis } = req.body;
    // if (!appointmentId) return next(new ApiError(400, "Appointment Id is not provided!"));
    //if (!mongoose.Types.ObjectId.isValid(appointmentId)) return next(new ApiError(404, "invalid id"));
    if (!patientId)
        return next(new errors_1.ApiError(400, "Patient Id is not provided!"));
    if (!examTypes || !Array.isArray(examTypes) || examTypes.length === 0) {
        return next(new errors_1.ApiError(400, config_1.default.error.errorMustBeAnArray));
    }
    if (doctorId && !mongoose_1.default.Types.ObjectId.isValid(doctorId))
        return next(new errors_1.ApiError(404, "Invalid doctor id"));
    const _doctorId = doctorId ? new mongoose_1.default.Types.ObjectId(doctorId) : null;
    if (biopsyType && !config_1.default.validBiopsyType.includes(biopsyType)) {
        return next(new errors_1.ApiError(400, `Invalid biopsy type. Valid types are: ${config_1.default.validBiopsyType.join(', ')}`));
    }
    //const _appointmentId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(appointmentId);
    const _patientId = new mongoose_1.default.Types.ObjectId(patientId);
    // let appointment = await readoneappointment({ _id: _appointmentId }, {}, '');
    // if (!appointment) {
    //     return next(new ApiError(404, `Appointment donot ${configuration.error.erroralreadyexit}`))
    // }
    // check if patient still has a pending record
    let pendingHistopathologyRecord = yield (0, histopathology_dao_1.queryHistopathologyRecord)({ patient: _patientId, status: config_1.default.status[2] }, null, null);
    if (pendingHistopathologyRecord)
        return next(new errors_1.ApiError(400, "this patient still has a pending histopathology record"));
    const { firstName, lastName, _id: userId } = (req.user).user;
    const raiseby = `${firstName} ${lastName}`;
    ///Step 2: Read the Appointment and populate the patient field.
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: patientId }, {}, 'insurance', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    }
    var hmopercentagecover = (_b = (_a = foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.insurance) === null || _a === void 0 ? void 0 : _a.hmopercentagecover) !== null && _b !== void 0 ? _b : 0;
    //const { servicetypedetails } = await readallservicetype({ category: configuration.category[6] }, { type: 1, category: 1, department: 1, _id: 0 });
    let totalAmount = 0;
    const testRequiredRecords = [];
    const createdPayments = [];
    const refNumber = generateRefNumber();
    for (let i = 0; i < examTypes.length; i++) {
        const service = examTypes[i];
        var testPrice = yield (0, price_1.readoneprice)({ servicetype: service });
        if (!testPrice) {
            return next(new Error(`${config_1.default.error.errornopriceset}  ${service}`));
        }
        const serviceAmount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(testPrice.amount));
        //const serviceAmount = testPrice.amount;
        totalAmount += serviceAmount;
        //const refNumber = generateRefNumber();
        const paymentData = {
            paymentreference: refNumber,
            paymentype: service,
            paymentcategory: config_1.default.category[6], // Histopathology category
            patient: _patientId,
            firstName: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.firstName,
            lastName: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.lastName,
            MRN: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.MRN,
            phoneNumber: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.phoneNumber,
            amount: Number(serviceAmount)
        };
        testRequiredRecords.push({
            name: service,
            PaymentRef: null,
            paymentStatus: config_1.default.status[5] // Scheduled
        });
        createdPayments.push(paymentData);
    }
    for (let i = 0; i < createdPayments.length; i++) {
        const paymentRecord = yield (0, payment_1.createpayment)(createdPayments[i]);
        testRequiredRecords[i].PaymentRef = paymentRecord._id;
    }
    const labNo = generateLabNumber();
    const newHistopathology = {
        patient: _patientId,
        staffInfo: userId,
        amount: totalAmount,
        status: config_1.default.status[5],
        paymentStatus: config_1.default.status[2],
        testRequired: testRequiredRecords,
        diagnosisForm: {
            lmp: lmp || '',
            biopsyType: biopsyType || null,
            wholeOrgan: wholeOrgan || '',
            previousBiopsy: previousBiopsy,
            diagnosis: diagnosis || '',
            labNo: labNo || '',
            requestingDoctor: _doctorId,
            phoneNumber: foundPatient.phoneNumber || null
        },
    };
    const savedHistopathology = yield (0, histopathology_dao_1.CreateHistopatholgyDao)(newHistopathology, next);
    res.status(201).json({
        status: true,
        message: "Histopathology  created successfully",
        data: savedHistopathology
    });
}));
exports.getHistopathologyRecordById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new errors_1.ApiError(400, `id ${config_1.default.error.errornotfound}`));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, config_1.default.error.errorInvalidObjectId));
    const doc = yield (0, histopathology_dao_1.queryHistopathologyRecord)({ _id: id }, {}, 'examForms');
    if (!doc) {
        return next(new errors_1.ApiError(404, `histopathology report ${config_1.default.error.errornotfound}`));
    }
    res.status(200).json({
        status: true,
        data: doc
    });
}));
exports.getAllHistopathology = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = yield (0, histopathology_dao_1.getAllHistopathologyRecords)({});
    if (!docs)
        return next(new errors_1.ApiError(404, `histopathology report ${config_1.default.error.errornotfound}`));
    res.status(200).json({
        status: true,
        length: docs.length,
        data: docs
    });
}));
exports.getAllHistopathologyPaginatedHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, [
        "sortBy",
        "limit",
        "page",
        "projectBy",
    ]);
    let { status } = req.query;
    let queryCriteria = {};
    if (status)
        queryCriteria.status = status;
    const result = yield (0, histopathology_dao_1.queryDocs)(queryCriteria, options);
    res.status(200).json({
        status: true,
        data: result,
    });
}));
exports.CreateMultipleTestReport = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { testResults } = req.body;
    if (!id)
        return next(new errors_1.ApiError(400, `${config_1.default.error.errorIdIsRequired}`));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, config_1.default.error.errorInvalidObjectId));
    const _id = new mongoose_1.default.Types.ObjectId(id);
    const histopathology = yield (0, histopathology_dao_1.getHistopathologyById)(_id);
    if (!histopathology)
        return next(new errors_1.ApiError(404, `histopathology record ${config_1.default.error.errornotfound}`));
    if (!Array.isArray(testResults) || testResults.length === 0) {
        return next(new errors_1.ApiError(400, config_1.default.error.errorMustBeAnArray));
    }
    const existingTest = yield (0, histopathology_tests_dao_1.queryHistopathologyTestFilter)({ histopathologyId: _id }, {}, '');
    let existingTestTypesMap = new Map();
    if (existingTest) {
        existingTestTypesMap = new Map(existingTest.map((exam) => [exam.testTypeId, exam]));
    }
    const results = {
        created: [],
        updated: [],
        errors: []
    };
    for (const test of testResults) {
        if (!test.testTypeId) {
            results.errors.push({
                test,
                error: "testTypeId is required"
            });
            continue;
        }
        const existingExam = existingTestTypesMap.get(test.testTypeId);
        try {
            if (existingExam) {
                // Update existing record
                const { histopathologyId: _ } = test, updateData = __rest(test, ["histopathologyId"]);
                const updatedTestRecord = yield (0, histopathology_tests_dao_1.updateHistopathologyById)(existingExam._id, updateData);
                results.updated.push(updatedTestRecord);
            }
            else {
                // Create new record
                const newTest = yield (0, histopathology_tests_dao_1.CreateHistopatholgyTestDao)(Object.assign(Object.assign({}, test), { histopathologyId: _id }), next);
                results.created.push(newTest);
            }
        }
        catch (err) {
            results.errors.push({ test, error: err.message });
        }
    }
    res.status(201).json({
        status: true,
        data: results
    });
}));
exports.getAllHistopathologyDashboard = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || '1') || 1;
    const limit = parseInt(req.query.limit || '100') || 100;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const baseMatch = {};
    if (status) {
        baseMatch["testRequired.paymentStatus"] = status;
    }
    const results = yield histopathology_1.default.aggregate([
        { $unwind: "$testRequired" },
        { $match: baseMatch },
        {
            $lookup: {
                from: "users",
                localField: "staffInfo",
                foreignField: "_id",
                as: "staff"
            }
        },
        { $unwind: { path: "$staff", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patientDetails"
            }
        },
        { $unwind: { path: "$patientDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "payments",
                localField: "testRequired.PaymentRef",
                foreignField: "_id",
                as: "testPayment"
            }
        },
        { $unwind: { path: "$testPayment", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 0,
                histopathologyId: "$_id",
                testName: "$testRequired.name",
                testPaymentStatus: "$testRequired.paymentStatus",
                testPaymentRef: "$testRequired.PaymentRef",
                amount: "$amount",
                status: "$status",
                createdAt: "$createdAt",
                diagnosisForm: "$diagnosisForm",
                staff: {
                    //name: { $concat: ["$staff.firstName", " ", "$staff.lastName"] },
                    firstName: "$staff.firstName",
                    lastName: "$staff.lastName",
                    email: "$staff.email",
                    staffId: "$staff.staffId",
                    role: "$staff.role"
                },
                patient: {
                    //name: { $concat: ["$patientDetails.firstName", " ", "$patientDetails.lastName"] },
                    firstName: "$patientDetails.firstName",
                    lastName: "$patientDetails.lastName",
                    age: "$patientDetails.age",
                    phone: "$patientDetails.phoneNumber",
                    gender: "$patientDetails.gender",
                    mrn: "$patientDetails.MRN"
                },
                paymentInfo: {
                    amount: "$testPayment.amount",
                    paymentReference: "$testPayment.paymentreference",
                    status: "$testPayment.status",
                    paymentCategory: "$testPayment.paymentcategory",
                    paymentType: "$testPayment.paymentype",
                    cashierName: "$testPayment.cashiername",
                    createdAt: "$testPayment.createdAt",
                }
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);
    const totalCount = results.length || 0;
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
        status: true,
        data: {
            results,
            page,
            limit,
            totalCount,
            totalPages
        },
    });
}));

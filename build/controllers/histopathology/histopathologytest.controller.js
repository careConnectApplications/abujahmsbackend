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
exports.getHistopathologyTestDetails = exports.getAllHistopathologyExamRecordPaginatedHandler = exports.getHistopathologyTestById = exports.CreateReportTest = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const histopathology_dao_1 = require("../../dao/histopathology.dao");
const errors_1 = require("../../errors");
const histopathology_dao_2 = require("../../dao/histopathology.dao");
const histopathology_tests_dao_1 = require("../../dao/histopathology-tests.dao");
const pick_1 = __importDefault(require("../../utils/pick"));
const payment_1 = require("../../dao/payment");
exports.CreateReportTest = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { testTypeId, histopathologyId } = req.body;
    if (!histopathologyId)
        return next(new errors_1.ApiError(400, `${config_1.default.error.errorIdIsRequired}`));
    if (!mongoose_1.default.Types.ObjectId.isValid(histopathologyId))
        return next(new errors_1.ApiError(404, config_1.default.error.errorInvalidObjectId));
    const _id = new mongoose_1.default.Types.ObjectId(histopathologyId);
    const histopathology = yield (0, histopathology_dao_1.getHistopathologyById)(_id);
    if (!histopathology)
        return next(new errors_1.ApiError(404, `histopathology record ${config_1.default.error.errornotfound}`));
    const hasMatchingTestType = (_a = histopathology.testRequired) === null || _a === void 0 ? void 0 : _a.find((test) => test.name === testTypeId);
    if (!hasMatchingTestType) {
        return next(new errors_1.ApiError(400, `Test type '${testTypeId}' is not in testRequired for this histopathology record`));
    }
    // then check if testRequired.PaymentRef.status is paid
    ///if its not paid throw error
    const payment = yield (0, payment_1.readonepayment)({ _id: hasMatchingTestType.PaymentRef });
    if (!payment) {
        return next(new errors_1.ApiError(404, `Payment record not found for test type '${testTypeId}'`));
    }
    ///console.log(payment, "payment info");
    if (payment.status !== config_1.default.status[3]) {
        return next(new errors_1.ApiError(400, `Payment for test type '${testTypeId}' is not completed.`));
    }
    const existingTest = yield (0, histopathology_tests_dao_1.queryOneHistopathologyTestFilter)({ histopathologyId: _id, testTypeId: req.body.testTypeId }, {}, '');
    if (existingTest) {
        return next(new errors_1.ApiError(400, `Test with testTypeId '${testTypeId}' already exists for this record.`));
    }
    const newReportTest = yield (0, histopathology_tests_dao_1.CreateHistopatholgyTestDao)(req.body, next);
    // update histopathology testRequired record status to processed
    yield (0, histopathology_dao_2.updateHistopathologyRecord)({ _id, "testRequired.name": testTypeId }, { $set: { "testRequired.$.paymentStatus": config_1.default.status[7] } });
    res.status(201).json({
        status: true,
        message: `Test type '${testTypeId}' created successfully`,
        data: newReportTest
    });
}));
exports.getHistopathologyTestById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new errors_1.ApiError(400, `id ${config_1.default.error.errornotfound}`));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, config_1.default.error.errorInvalidObjectId));
    const doc = yield (0, histopathology_tests_dao_1.queryOneHistopathologyTestFilter)({ _id: id }, {}, '');
    if (!doc) {
        return next(new errors_1.ApiError(404, `histopathology test ${config_1.default.error.errornotfound}`));
    }
    res.status(200).json({
        status: true,
        data: doc
    });
}));
exports.getAllHistopathologyExamRecordPaginatedHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield (0, histopathology_tests_dao_1.queryDocs)(queryCriteria, options);
    res.status(200).json({
        status: true,
        data: result,
    });
}));
exports.getHistopathologyTestDetails = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { servicename } = req.query;
    if (!id)
        return next(new errors_1.ApiError(400, `${config_1.default.error.errorIdIsRequired}`));
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return next(new errors_1.ApiError(404, config_1.default.error.errorInvalidObjectId));
    if (!servicename)
        return next(new errors_1.ApiError(401, "serviceName query is required"));
    const _id = new mongoose_1.default.Types.ObjectId(id);
    const histopathology = yield (0, histopathology_dao_1.getHistopathologyById)(_id);
    if (!histopathology)
        return next(new errors_1.ApiError(404, `histopathology record ${config_1.default.error.errornotfound}`));
    const existingTest = yield (0, histopathology_tests_dao_1.queryHistopathologyTestFilter)({ histopathologyId: _id, testTypeId: servicename }, {}, '');
    return res.status(200).json({
        status: true,
        data: existingTest
    });
}));

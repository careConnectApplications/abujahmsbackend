import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import configuration from "../../config";
import mongoose from "mongoose";
import { getHistopathologyById } from "../../dao/histopathology.dao";
import { ApiError } from "../../errors";
import { updateHistopathologyRecord } from "../../dao/histopathology.dao";
import { CreateHistopatholgyTestDao, queryOneHistopathologyTestFilter, queryDocs } from "../../dao/histopathology-tests.dao";
import { IOptions } from "../../paginate/paginate";
import pick from "../../utils/pick";
import { readonepayment } from "../../dao/payment";

export const CreateReportTest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { testTypeId, histopathologyId } = req.body;

    if (!histopathologyId) return next(new ApiError(400, `${configuration.error.errorIdIsRequired}`));
    if (!mongoose.Types.ObjectId.isValid(histopathologyId)) return next(new ApiError(404, configuration.error.errorInvalidObjectId));

    const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(histopathologyId);

    const histopathology = await getHistopathologyById(_id);

    if (!histopathology) return next(new ApiError(404, `histopathology record ${configuration.error.errornotfound}`));

    const hasMatchingTestType = histopathology.testRequired?.find(
        (test: any) => test.name === testTypeId
    );

    if (!hasMatchingTestType) {
        return next(new ApiError(400, `Test type '${testTypeId}' is not in testRequired for this histopathology record`));
    }

    // then check if testRequired.PaymentRef.status is paid
    ///if its not paid throw error
    const payment = await readonepayment({ _id: hasMatchingTestType.PaymentRef });

    if (!payment) {
        return next(new ApiError(404, `Payment record not found for test type '${testTypeId}'`));
    }

    ///console.log(payment, "payment info");

    if (payment.status !== configuration.status[3]) {
        return next(new ApiError(400, `Payment for test type '${testTypeId}' is not completed.`));
    }

    const existingTest: any = await queryOneHistopathologyTestFilter({ histopathologyId: _id, testTypeId: req.body.testTypeId }, {}, '');
    if (existingTest) {
        return next(new ApiError(400, `Test with testTypeId '${testTypeId}' already exists for this record.`));
    }

    const newReportTest = await CreateHistopatholgyTestDao(req.body, next);

    // update histopathology testRequired record status to processed
    await updateHistopathologyRecord({ _id, "testRequired.name": testTypeId },
        { $set: { "testRequired.$.paymentStatus": configuration.status[7] } },
    );

    res.status(201).json({
        status: true,
        message: `Test type '${testTypeId}' created successfully`,
        data: newReportTest
    });
})

export const getHistopathologyTestById = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) return next(new ApiError(400, `id ${configuration.error.errornotfound}`));
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ApiError(404, configuration.error.errorInvalidObjectId));

    const doc = await queryOneHistopathologyTestFilter({ _id: id }, {}, '');

    if (!doc) {
        return next(new ApiError(404, `histopathology test ${configuration.error.errornotfound}`))
    }

    res.status(200).json({
        status: true,
        data: doc
    })
});

export const getAllHistopathologyExamRecordPaginatedHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const options: IOptions = pick(req.query, [
        "sortBy",
        "limit",
        "page",
        "projectBy",
    ]);

    let { status } = req.query;

    let queryCriteria: any = {}

    if (status) queryCriteria.status = status;

    const result = await queryDocs(queryCriteria, options);

    res.status(200).json({
        status: true,
        data: result,
    });
});
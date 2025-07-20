import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import configuration from "../../config";
import { readoneappointment } from "../../dao/appointment";
import {
    CreateHistopatholgyDao,
    getHistopathologyById, getAllHistopathologyRecords,
    queryHistopathologyRecord,
    queryDocs
} from "../../dao/histopathology.dao";
import { queryHistopathologyTestFilter, updateHistopathologyById, CreateHistopatholgyTestDao } from "../../dao/histopathology-tests.dao";
import { readonepatient } from "../../dao/patientmanagement";
import { createpayment } from "../../dao/payment";
import { readoneprice } from "../../dao/price";
import { readallservicetype } from "../../dao/servicetype";
import { ApiError } from "../../errors";
import catchAsync from "../../utils/catchAsync";
import { IOptions } from "../../paginate/paginate";
import pick from "../../utils/pick";

const generateRefNumber = () => {
    const uniqueHistopathologyId = uuidv4();
    return `histo-${new Date().getFullYear()}-${uniqueHistopathologyId}`;
}

export const CreateHistopatholgyService = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    //const validBiopsyType = ["Excision", "Incision", "Endoscopy", "Trucut"];

    const {
        appointmentId,
        patientId,
        examTypes, /// this is the service types
        doctorId,
        clinicalDetails,
        lmp,
        parity,
        biopsyType,
        others,
        wholeOrgan,
        operationalOrEndoscopyFinding,
        radiologicalResults,
        otherLabResults,
        previousBiopsy,
        diagnosis,
        labNo,
        DateReceived,
        DateInspected,
        DateGrossed,
        DatePassed,
        NumberOfBlocks,
        Action,
        DateRequested,
        DateReported,
    } = req.body;


    if (!appointmentId) return next(new ApiError(400, "Appointment Id is not provided!"));
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) return next(new ApiError(404, "invalid id"));
    if (!patientId) return next(new ApiError(400, "Patient Id is not provided!"));
    if (!examTypes || !Array.isArray(examTypes) || examTypes.length === 0) {
        return next(new ApiError(400, configuration.error.errorMustBeAnArray));
    }
    if (doctorId && !mongoose.Types.ObjectId.isValid(doctorId)) return next(new ApiError(404, "Invalid doctor id"));
    const _doctorId = doctorId ? new mongoose.Types.ObjectId(doctorId) : null;

    if (biopsyType && !configuration.validBiopsyType.includes(biopsyType)) {
        return next(new ApiError(400, `Invalid biopsy type. Valid types are: ${configuration.validBiopsyType.join(', ')}`));
    }

    const _appointmentId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(appointmentId);
    const _patientId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(patientId);

    let appointment = await readoneappointment({ _id: _appointmentId }, {}, '');
    if (!appointment) {
        return next(new ApiError(404, `Appointment donot ${configuration.error.erroralreadyexit}`))
    }

    // check if patient still has a pending record
    let pendingHistopathologyRecord = await queryHistopathologyRecord({ patient: _patientId, status: configuration.status[2] }, null, null);
    if (pendingHistopathologyRecord) return next(new ApiError(400, "this patient still has a pending histopathology record"))

    const { firstName, lastName, _id: userId } = (req.user).user;
    const raiseby = `${firstName} ${lastName}`;

    ///Step 2: Read the Appointment and populate the patient field.
    const foundPatient: any = await readonepatient({ _id: patientId }, {}, '', '');
    const { isHMOCover } = foundPatient;

    if (!foundPatient) {
        return next(new ApiError(404, `Patient do not ${configuration.error.erroralreadyexit}`));
    }

    const { servicetypedetails } = await readallservicetype({ category: configuration.category[6] }, { type: 1, category: 1, department: 1, _id: 0 });

    let totalAmount = 0;
    const testRequiredRecords: any[] = [];
    const createdPayments = [];
    for (let i = 0; i < examTypes.length; i++) {
        const service = examTypes[i];

        var testPrice: any = await readoneprice({ servicetype: service });

        if (!testPrice) {
            return next(new Error(`${configuration.error.errornopriceset}  ${service}`));
        }

        const serviceAmount = testPrice.amount;
        totalAmount += serviceAmount;

        const refNumber = generateRefNumber();
        const paymentData = {
            paymentreference: refNumber,
            paymentype: service,
            paymentcategory: configuration.category[6], // Histopathology category
            patient: _patientId,
            amount: Number(serviceAmount)
        }

        testRequiredRecords.push({
            name: service,
            PaymentRef: null,
            paymentStatus: configuration.status[2] // Pending status
        });

        createdPayments.push(paymentData);
    }



    for (let i = 0; i < createdPayments.length; i++) {
        const paymentRecord = await createpayment(createdPayments[i]);

        testRequiredRecords[i].PaymentRef = paymentRecord._id;
    }

    const newHistopathology = {
        patient: _patientId,
        appointment: _appointmentId,
        appointmentid: appointmentId,
        staffInfo: userId,
        amount: totalAmount,
        status: configuration.status[2],
        testRequired: testRequiredRecords,
        diagnosisForm: {
            provisionalDiagnosis: diagnosis,
            clinicalDetails: clinicalDetails || '',
            lmp: lmp || '',
            parity: parity || '',
            biopsyType: biopsyType || null,
            others: others || '',
            wholeOrgan: wholeOrgan || '',
            operationalOrEndoscopyFinding: operationalOrEndoscopyFinding || '',
            radiologicalResults: radiologicalResults || '',
            otherLabResults: otherLabResults || '',
            previousBiopsy: previousBiopsy,
            diagnosis: diagnosis || '',
            labNo: labNo || '',
            requestingDoctor: _doctorId,
            phoneNumber: foundPatient.phoneNumber || null
        },
        LabUse: {
            DateReceived: DateReceived ? new Date(DateReceived) : new Date(),
            DateInspected: DateInspected ? new Date(DateInspected) : undefined,
            DateGrossed: DateGrossed ? new Date(DateGrossed) : undefined,
            DatePassed: DatePassed ? new Date(DatePassed) : undefined,
            NumberOfBlocks: NumberOfBlocks || undefined,
            Action: Action || '',
            DateRequested: DateRequested ? new Date(DateRequested) : undefined,
            DateReported: DateReported ? new Date(DateReported) : undefined,
        },
    };

    const savedHistopathology = await CreateHistopatholgyDao(newHistopathology, next);

    res.status(201).json({
        status: true,
        message: "Histopathology  created successfully",
        data: savedHistopathology
    });
});

export const getHistopathologyRecordById = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) return next(new ApiError(400, `id ${configuration.error.errornotfound}`));
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ApiError(404, configuration.error.errorInvalidObjectId));

    const doc = await queryHistopathologyRecord({_id: id}, {}, 'examForms');

    if (!doc) {
        return next(new ApiError(404, `histopathology report ${configuration.error.errornotfound}`))
    }

    res.status(200).json({
        status: true,
        data: doc
    })
});

export const getAllHistopathology = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const docs = await getAllHistopathologyRecords({});

    if (!docs) return next(new ApiError(404, `histopathology report ${configuration.error.errornotfound}`));

    res.status(200).json({
        status: true,
        length: docs.length,
        data: docs
    })
});

export const getAllHistopathologyPaginatedHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

export const CreateMultipleTestReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { testResults } = req.body;

    if (!id) return next(new ApiError(400, `${configuration.error.errorIdIsRequired}`));
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ApiError(404, configuration.error.errorInvalidObjectId));

    const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const histopathology = await getHistopathologyById(_id);

    if (!histopathology) return next(new ApiError(404, `histopathology record ${configuration.error.errornotfound}`));

    if (!Array.isArray(testResults) || testResults.length === 0) {
        return next(new ApiError(400, configuration.error.errorMustBeAnArray));
    }

    const existingTest: any = await queryHistopathologyTestFilter({ histopathologyId: _id }, {}, '');
    let existingTestTypesMap = new Map();

    if (existingTest) {
        existingTestTypesMap = new Map(
            existingTest.map((exam: any) => [exam.testTypeId, exam])
        );
    }


    const results = {
        created: [] as any[],
        updated: [] as any[],
        errors: [] as any[]
    };

    for (const test of testResults) {
        if (!test.testTypeId) {
            results.errors.push({
                test,
                error: "testTypeId is required"
            });
            continue;
        }

        const existingExam: any = existingTestTypesMap.get(test.testTypeId);

        try {
            if (existingExam) {
                // Update existing record
                const { histopathologyId: _, ...updateData } = test;
                const updatedTestRecord = await updateHistopathologyById(existingExam._id, updateData);
                results.updated.push(updatedTestRecord);
            } else {
                // Create new record
                const newTest = await CreateHistopatholgyTestDao({ ...test, histopathologyId: _id }, next);
                results.created.push(newTest);
            }
        } catch (err: any) {
            results.errors.push({ test, error: err.message });
        }
    }

    res.status(201).json({
        status: true,
        data: results
    })
});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportdeath = exports.reportimmunization = exports.reportradiology = exports.reportpharmacy = exports.reportprocedure = exports.reportlab = exports.reportbyfinancialreport = exports.reportbyadmissionreport = exports.reportbyappointmentreport = exports.buildFilters = exports.formatRow = exports.removeEmptyStrings = void 0;
exports.mergeCounts = mergeCounts;
// helper to merge counts by gender
const removeEmptyStrings = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => (0, exports.removeEmptyStrings)(item));
    }
    const cleanedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            // Skip empty strings
            if (value === '') {
                continue;
            }
            // Recursively clean nested objects
            cleanedObj[key] = (0, exports.removeEmptyStrings)(value);
        }
    }
    return cleanedObj;
};
exports.removeEmptyStrings = removeEmptyStrings;
function mergeCounts(arr1, arr2) {
    const map = new Map();
    [...arr1, ...arr2].forEach(({ _id, count }) => {
        map.set(_id, (map.get(_id) || 0) + count);
    });
    return Array.from(map, ([gender, count]) => ({ _id: gender, count }));
}
const formatRow = (rows) => {
    var _a, _b;
    const male = ((_a = rows.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "male"; })) === null || _a === void 0 ? void 0 : _a.count) || 0;
    const female = ((_b = rows.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "female"; })) === null || _b === void 0 ? void 0 : _b.count) || 0;
    return { male, female, total: male + female };
};
exports.formatRow = formatRow;
// individual strategies (pure functions)
const equalityFilter = (match, key, value) => {
    match[key] = value;
};
const regexFilter = (match, key, value) => {
    match[key] = { $regex: new RegExp(value, "i") };
};
const dateRangeFilter = (match, key, value, field) => {
    if (!match[field])
        match[field] = {};
    if (key === "startDate")
        match[field].$gte = new Date(value);
    if (key === "endDate")
        match[field].$lt = new Date(value);
};
const wardFilter = (match, key, value) => {
    match["referedward.wardname"] = value;
};
// Helper function for age range filtering
const ageRangeFilter = (match, min, max) => {
    if (min !== undefined || max !== undefined) {
        if (!match["patient.age"])
            match["patient.age"] = {};
        if (min !== undefined) {
            match["patient.age"].$gte = `${min} years`;
        }
        if (max !== undefined) {
            match["patient.age"].$lte = `${max} years`;
        }
    }
};
// ---------- Strategy Map ----------
const strategies = {
    // Admission filters
    wardname: (match, key, value) => (match["referedward.wardname"] = value),
    startDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
    endDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
    // Appointment filters
    appointmentStart: (match, key, value) => dateRangeFilter(match, key, value, "appointmentdate"),
    appointmentEnd: (match, key, value) => dateRangeFilter(match, key, value, "appointmentdate"),
    // Financial filters
    paymentcategory: (match, key, value) => (match[key] = value),
    financialStartDate: (match, key, value) => dateRangeFilter(match, key, value, "updatedAt"),
    financialEndDate: (match, key, value) => dateRangeFilter(match, key, value, "updatedAt"),
    // HMO filters
    HMOName: (match, key, value) => (match["patient.HMOName"] = value),
    hmoStartDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
    hmoEndDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
    // Secondary service filters
    patienttype: (match, key, value) => (match["patient.patienttype"] = value),
    secondaryServiceStartDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
    secondaryServiceEndDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
    // Pharmacy secondary service filters
    pharmacy: (match, key, value) => (match[key] = value),
    // Patient demographic filters
    firstName: (match, key, value) => regexFilter(match, "patient.firstName", value),
    lastName: (match, key, value) => regexFilter(match, "patient.lastName", value),
    gender: (match, key, value) => (match["patient.gender"] = value),
    // Age-specific filters
    ageInYears: (match, key, value) => {
        // Exact age match in years
        match["patient.age"] = `${value} years`;
    },
    ageInMonths: (match, key, value) => {
        // Exact age match in months
        match["patient.age"] = `${value} months`;
    },
    ageInDays: (match, key, value) => {
        // Exact age match in days
        match["patient.age"] = `${value} days`;
    },
    minAge: (match, key, value) => {
        // Minimum age filter (in years)
        if (!match["patient.age"])
            match["patient.age"] = {};
        match["patient.age"].$gte = `${value} years`;
    },
    maxAge: (match, key, value) => {
        // Maximum age filter (in years)
        if (!match["patient.age"])
            match["patient.age"] = {};
        match["patient.age"].$lte = `${value} years`;
    },
    ageRange: (match, key, value) => {
        // Age range filter accepting an object with min and/or max properties
        if (typeof value === "object" && value !== null) {
            ageRangeFilter(match, value.min, value.max);
        }
    },
};
const buildFilters = (filters = {}) => {
    const match = {};
    Object.entries(filters).forEach(([key, value]) => {
        //console.log("key", key, "value", value);
        if (!value)
            return;
        const strategy = strategies[key];
        //console.log("strategy", strategy);
        if (strategy) {
            strategy(match, key, value);
        }
        else if (typeof value === "string") {
            regexFilter(match, key, value);
        }
        else {
            equalityFilter(match, key, value);
        }
    });
    return match;
};
exports.buildFilters = buildFilters;
const reportbyappointmentreport = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true, // keeps documents even if no patient found
            },
        },
        { $match: matchConditions },
        {
            $project: {
                appointmentid: 1,
                appointmenttype: 1,
                unit: 1,
                clinic: 1,
                category: 1,
                policecase: 1,
                accidentType: 1,
                arrivalMode: 1,
                policaename: 1,
                dateOfAccident: 1,
                physicalassault: 1,
                sexualassault: 1,
                outcome: "$clinicalencounter.outcome",
                gender: "$patient.gender",
                age: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                MRN: "$patient.MRN",
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMONam",
                doctorsfirstName: 1,
                createdAt: 1
            }
        }
    ];
};
exports.reportbyappointmentreport = reportbyappointmentreport;
const reportbyadmissionreport = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    console.log("matchConditions", matchConditions);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true, // keeps documents even if no patient found
            },
        },
        {
            $lookup: {
                from: "wardmanagements",
                localField: "referedward",
                foreignField: "_id",
                as: "referedward",
            },
        },
        { $unwind: { path: "$referedward", preserveNullAndEmptyArrays: true } },
        { $match: matchConditions },
        {
            $project: {
                // Admission specific fields
                admissionid: 1,
                status: 1,
                referredIn: 1,
                referredFrom: 1,
                admittospecialization: 1,
                referddate: 1,
                dischargeReason: 1,
                bedfee: 1,
                // Ward information
                wardname: "$referedward.wardname",
                wardtype: "$referedward.wardtype",
                // Staff information
                doctorname: 1,
                staffname: 1,
                // Patient demographic information
                gender: "$patient.gender",
                age: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                MRN: "$patient.MRN",
                // Patient HMO information
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
};
exports.reportbyadmissionreport = reportbyadmissionreport;
const reportbyfinancialreport = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true, // keeps documents even if no patient found
            },
        },
        { $match: matchConditions },
        {
            $project: {
                // Payment specific fields
                paymentype: 1,
                paymentcategory: 1,
                paymentreference: 1,
                amount: 1,
                qty: 1,
                status: 1,
                numberoftimesprinted: 1,
                confirmationdate: 1,
                // Cashier information
                cashieremail: 1,
                cashiername: 1,
                cashierid: 1,
                // Patient information (from payment document)
                firstName: 1,
                lastName: 1,
                MRN: 1,
                HMOId: 1,
                phoneNumber: 1,
                // Patient demographics (from patient lookup)
                patientGender: "$patient.gender",
                patientAge: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                patientFirstName: "$patient.firstName",
                patientLastName: "$patient.lastName",
                patientMRN: "$patient.MRN",
                // Patient HMO information
                patientHMOId: "$patient.HMOId",
                patientHMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
};
exports.reportbyfinancialreport = reportbyfinancialreport;
const reportlab = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $match: matchConditions },
        {
            $project: {
                // Lab specific fields
                testname: 1,
                testid: 1,
                department: 1,
                labcategory: 1,
                appointmentid: 1,
                processeddate: 1,
                // Lab processing details
                priority: 1,
                sortby: 1,
                sortbydate: 1,
                remark: 1,
                note: 1,
                // Financial information
                amount: 1,
                hmopercentagecover: 1,
                actualcost: 1,
                // Status fields
                status: 1,
                chemicalpathologyhemathologyreviewtstatus: 1,
                // Staff information
                raiseby: 1,
                staffname: 1,
                // File attachment
                filename: 1,
                // Patient demographic information
                gender: "$patient.gender",
                age: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                MRN: "$patient.MRN",
                // Patient HMO information
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Contact information
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
};
exports.reportlab = reportlab;
const reportprocedure = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $match: matchConditions },
        {
            $addFields: {
                // Concatenate procedure array values into a single string
                procedure: {
                    $cond: {
                        if: { $isArray: "$procedure" },
                        then: {
                            $reduce: {
                                input: { $ifNull: ["$procedure", []] },
                                initialValue: "",
                                in: {
                                    $cond: {
                                        if: { $eq: ["$$value", ""] },
                                        then: "$$this",
                                        else: { $concat: ["$$value", ", ", "$$this"] }
                                    }
                                }
                            }
                        },
                        else: "$procedure"
                    }
                }
            }
        },
        {
            $project: {
                // Procedure specific fields
                procedureid: 1,
                procedure: 1,
                procedureoutcome: 1,
                indicationdiagnosisprocedure: 1,
                appointmentdate: 1,
                clinic: 1,
                // Financial information
                amount: 1,
                hmopercentagecover: 1,
                actualcost: 1,
                // Status
                status: 1,
                // Staff information
                raiseby: 1,
                processby: 1,
                // Patient demographic information
                gender: "$patient.gender",
                age: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                MRN: "$patient.MRN",
                // Patient HMO information
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Contact information
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
};
exports.reportprocedure = reportprocedure;
const reportpharmacy = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    console.log("matchConditions", matchConditions);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $match: matchConditions },
        {
            $project: {
                // Prescription specific fields
                prescription: 1,
                pharmacy: 1,
                prescriptionnote: 1,
                orderid: 1,
                appointmentid: 1,
                appointmentdate: 1,
                clinic: 1,
                // Dosage information
                dosageform: 1,
                strength: 1,
                dosage: 1,
                duration: 1,
                frequency: 1,
                route: 1,
                qty: 1,
                balance: 1,
                // Financial information
                amount: 1,
                hmopercentagecover: 1,
                actualcost: 1,
                // Status fields
                dispensestatus: 1,
                servedstatus: 1,
                // Staff information
                prescribersname: 1,
                pharmacistname: 1,
                // Remarks
                remark: 1,
                // Patient information (from prescription document)
                firstName: 1,
                lastName: 1,
                MRN: 1,
                HMOId: 1,
                HMOName: 1,
                HMOPlan: 1,
                isHMOCover: 1,
                // Patient demographics (from patient lookup)
                patientGender: "$patient.gender",
                patientAge: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                patientFirstName: "$patient.firstName",
                patientLastName: "$patient.lastName",
                patientMiddleName: "$patient.middleName",
                patientMRN: "$patient.MRN",
                // Patient HMO information from lookup
                patientHMOId: "$patient.HMOId",
                patientHMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Contact information
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
};
exports.reportpharmacy = reportpharmacy;
const reportradiology = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $match: matchConditions },
        {
            $project: {
                // Radiology specific fields
                testname: 1,
                testid: 1,
                department: 1,
                testresult: 1,
                typetestresult: 1,
                processeddate: 1,
                // Processing details
                note: 1,
                remark: 1,
                // Financial information
                amount: 1,
                hmopercentagecover: 1,
                actualcost: 1,
                // Status field
                status: 1,
                // Staff information
                raiseby: 1,
                processby: 1,
                // File attachment
                filename: 1,
                // Patient demographic information
                gender: "$patient.gender",
                age: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                MRN: "$patient.MRN",
                // Patient HMO information
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Contact information
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
};
exports.reportradiology = reportradiology;
const reportimmunization = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    return [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $match: matchConditions },
        {
            $addFields: {
                // Concatenate vaccination array values into a single string
                vaccination: {
                    $cond: {
                        if: { $isArray: "$vaccination" },
                        then: {
                            $reduce: {
                                input: { $ifNull: ["$vaccination", []] },
                                initialValue: "",
                                in: {
                                    $cond: {
                                        if: { $eq: ["$$value", ""] },
                                        then: "$$this",
                                        else: { $concat: ["$$value", ", ", "$$this"] }
                                    }
                                }
                            }
                        },
                        else: "$vaccination"
                    }
                }
            }
        },
        {
            $project: {
                // Immunization specific fields
                vaccination: 1,
                vaccinationlocation: 1,
                outreachMedications: 1,
                isFullyImmunized: 1,
                isZeroDoseChild: 1,
                // Vaccine details
                schedule: 1,
                vaccinecode: 1,
                vaccinename: 1,
                vaccinetype: 1,
                manufacturer: 1,
                batchno: 1,
                expirydate: 1,
                dose: 1,
                doseamount: 1,
                // Administration details
                administrationsite: 1,
                administrationroute: 1,
                consent: 1,
                immunizationstatus: 1,
                comment: 1,
                // Adverse effects
                anynotedadverseeffect: 1,
                adverseeffectseverity: 1,
                medicationgiventomanageadverseeffect: 1,
                adverseEffectVaccine: 1,
                onsetdateofreaction: 1,
                reactcode: 1,
                // Reporting information
                reporter: 1,
                reportingsource: 1,
                staffname: 1,
                // Patient demographic information
                gender: "$patient.gender",
                age: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                MRN: "$patient.MRN",
                // Patient HMO information
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Contact information
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];
};
exports.reportimmunization = reportimmunization;
const reportdeath = (filters) => {
    const matchConditions = (0, exports.buildFilters)(filters);
    // Enhanced death report combining appointments and admissions
    return [
        // First, query appointment deaths
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: Object.assign(Object.assign({}, matchConditions), { $or: [
                    { "clinicalencounter.outcome": "Death" },
                    { arrivalMode: "Death" }
                ] })
        },
        {
            $project: {
                // Source identifier
                deathSource: { $literal: "appointment" },
                // Appointment specific fields
                appointmentid: 1,
                deathDate: "$appointmentdate",
                appointmenttype: 1,
                appointmentcategory: 1,
                // Death indicators
                outcome: "$clinicalencounter.outcome",
                arrivalMode: 1,
                dischargeReason: { $literal: null },
                // Clinical information
                unit: 1,
                clinic: 1,
                category: 1,
                reason: 1,
                findings: 1,
                diagnosis: 1,
                // Ward information (null for appointments)
                wardname: { $literal: null },
                wardtype: { $literal: null },
                admissionid: { $literal: null },
                admissionDate: { $literal: null },
                // Police case information (if applicable)
                policecase: 1,
                accidentType: 1,
                dateOfAccident: 1,
                physicalassault: 1,
                sexualassault: 1,
                policaename: 1,
                // Clinical encounter details
                clinicalnote: "$clinicalencounter.clinicalnote",
                diagnosisnote: "$clinicalencounter.diagnosisnote",
                assessmentnote: "$clinicalencounter.assessmentnote",
                // Doctor information
                doctorsfirstName: 1,
                doctorslastName: 1,
                doctorname: { $literal: null },
                staffname: { $literal: null },
                // Patient demographic information
                gender: "$patient.gender",
                age: "$patient.age",
                patientCreatedAt: "$patient.createdAt",
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                middleName: "$patient.middleName",
                MRN: "$patient.MRN",
                // Patient HMO information
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMOName",
                patienttype: "$patient.patienttype",
                // Contact information
                phoneNumber: "$patient.phoneNumber",
                email: "$patient.email",
                // Next of kin information
                nextOfKinName: "$patient.nextOfKinName",
                nextOfKinRelationship: "$patient.nextOfKinRelationship",
                nextOfKinPhoneNumber: "$patient.nextOfKinPhoneNumber",
                nextOfKinAddress: "$patient.nextOfKinAddress",
                // Timestamps
                createdAt: 1,
                updatedAt: 1
            }
        },
        // Union with admission deaths
        {
            $unionWith: {
                coll: "admissions",
                pipeline: [
                    {
                        $lookup: {
                            from: "patientsmanagements",
                            localField: "patient",
                            foreignField: "_id",
                            as: "patient",
                        },
                    },
                    {
                        $unwind: {
                            path: "$patient",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "wardmanagements",
                            localField: "referedward",
                            foreignField: "_id",
                            as: "referedward",
                        },
                    },
                    {
                        $unwind: {
                            path: "$referedward",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: Object.assign(Object.assign({}, matchConditions), { $or: [
                                { dischargeReason: { $regex: /death/i } },
                                { dischargeReason: { $regex: /died/i } },
                                { dischargeReason: { $regex: /deceased/i } },
                                { dischargeReason: { $regex: /expired/i } },
                                { dischargeReason: "Death" }
                            ] })
                    },
                    {
                        $project: {
                            // Source identifier
                            deathSource: { $literal: "admission" },
                            // Death date from admission
                            deathDate: "$updatedAt", // Using updatedAt as discharge/death date
                            appointmentid: { $literal: null },
                            appointmenttype: { $literal: null },
                            appointmentcategory: { $literal: null },
                            // Death indicators
                            outcome: { $literal: "Death" },
                            arrivalMode: { $literal: null },
                            dischargeReason: 1,
                            // Clinical information
                            unit: { $literal: null },
                            clinic: { $literal: null },
                            category: { $literal: null },
                            reason: "$alldiagnosis",
                            findings: { $literal: null },
                            diagnosis: "$alldiagnosis",
                            // Ward information
                            wardname: "$referedward.wardname",
                            wardtype: "$referedward.wardtype",
                            admissionid: 1,
                            admissionDate: "$referddate",
                            // Police case information (null for admissions)
                            policecase: { $literal: null },
                            accidentType: { $literal: null },
                            dateOfAccident: { $literal: null },
                            physicalassault: { $literal: null },
                            sexualassault: { $literal: null },
                            policaename: { $literal: null },
                            // Clinical notes (null for admissions)
                            clinicalnote: { $literal: null },
                            diagnosisnote: { $literal: null },
                            assessmentnote: { $literal: null },
                            // Doctor/Staff information
                            doctorsfirstName: { $literal: null },
                            doctorslastName: { $literal: null },
                            doctorname: 1,
                            staffname: 1,
                            // Patient demographic information
                            gender: "$patient.gender",
                            age: "$patient.age",
                            patientCreatedAt: "$patient.createdAt",
                            firstName: "$patient.firstName",
                            lastName: "$patient.lastName",
                            middleName: "$patient.middleName",
                            MRN: "$patient.MRN",
                            // Patient HMO information
                            HMOId: "$patient.HMOId",
                            HMOName: "$patient.HMOName",
                            patienttype: "$patient.patienttype",
                            // Contact information
                            phoneNumber: "$patient.phoneNumber",
                            email: "$patient.email",
                            // Next of kin information
                            nextOfKinName: "$patient.nextOfKinName",
                            nextOfKinRelationship: "$patient.nextOfKinRelationship",
                            nextOfKinPhoneNumber: "$patient.nextOfKinPhoneNumber",
                            nextOfKinAddress: "$patient.nextOfKinAddress",
                            // Timestamps
                            createdAt: 1,
                            updatedAt: 1
                        }
                    }
                ]
            }
        },
        // Sort by death date
        {
            $sort: {
                deathDate: -1
            }
        }
    ];
};
exports.reportdeath = reportdeath;

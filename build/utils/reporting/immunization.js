"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.immunizationaggregatereports = void 0;
const immunizationaggregatereports = (startdate, enddate) => {
    const immunizationpipeline = [
        {
            $match: { createdAt: { $gt: startdate, $lt: enddate } }
        },
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patientInfo"
            }
        },
        { $unwind: "$patientInfo" },
        // Safely handle DOB
        {
            $addFields: {
                dob: {
                    $cond: {
                        if: {
                            $and: [
                                { $ne: ["$patientInfo.dateOfBirth", null] },
                                { $ne: ["$patientInfo.dateOfBirth", ""] }
                            ]
                        },
                        then: { $toDate: "$patientInfo.dateOfBirth" },
                        else: null
                    }
                }
            }
        },
        // Conditionally calculate ageInYears
        {
            $addFields: {
                ageInYears: {
                    $cond: {
                        if: { $ne: ["$dob", null] },
                        then: {
                            $dateDiff: {
                                startDate: "$dob",
                                endDate: "$$NOW",
                                unit: "year"
                            }
                        },
                        else: null
                    }
                }
            }
        },
        // Define ageGroup including unknowns
        {
            $addFields: {
                ageGroup: {
                    $switch: {
                        branches: [
                            { case: { $lt: ["$ageInYears", 1] }, then: "<1 year" },
                            { case: { $gte: ["$ageInYears", 1] }, then: ">=1 year" }
                        ],
                        default: "Unknown"
                    }
                }
            }
        },
        { $unwind: "$vaccination" },
        {
            $group: {
                _id: {
                    vaccine: "$vaccination",
                    location: "$vaccinationlocation",
                    ageGroup: "$ageGroup"
                },
                uniquePatients: { $addToSet: "$patient" }
            }
        },
        {
            $project: {
                _id: 0,
                vaccine: "$_id.vaccine",
                location: "$_id.location",
                ageGroup: "$_id.ageGroup",
                patientCount: { $size: "$uniquePatients" }
            }
        },
        {
            $sort: {
                vaccine: 1,
                location: 1,
                ageGroup: 1
            }
        }
    ];
    const AEFIcasesreported = [
        {
            $match: {
                adverseeffectseverity: { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: "$adverseeffectseverity", // Groups by severity type
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                severity: "$_id",
                count: 1,
                _id: 0
            }
        }
    ];
    return { immunizationpipeline, AEFIcasesreported };
};
exports.immunizationaggregatereports = immunizationaggregatereports;

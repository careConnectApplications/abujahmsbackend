"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diseaseCasesReports = void 0;
// Disease Cases Report Aggregation Pipeline
const diseaseCasesReports = (startdate, enddate) => {
    // Pipeline to aggregate disease cases by appointment type, gender, and age groups
    const diseaseCasesPipeline = [
        // Lookup patient information
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient"
            }
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: false
            }
        },
        // Filter by date range and ensure diagnosis exists
        {
            $match: {
                appointmentdate: { $gte: startdate, $lt: enddate },
                "clinicalencounter.diagnosisicd10": { $exists: true, $nin: [null, ""] }
            }
        },
        // Add fields for age group categorization and appointment type
        {
            $addFields: {
                // Parse age from string format (e.g., "25 years", "6 months", "10 days")
                ageValue: {
                    $cond: {
                        if: { $regexMatch: { input: "$patient.age", regex: /years?$/ } },
                        then: {
                            $toInt: {
                                $arrayElemAt: [
                                    { $split: ["$patient.age", " "] },
                                    0
                                ]
                            }
                        },
                        else: {
                            $cond: {
                                if: { $regexMatch: { input: "$patient.age", regex: /months?$/ } },
                                then: {
                                    $divide: [
                                        {
                                            $toInt: {
                                                $arrayElemAt: [
                                                    { $split: ["$patient.age", " "] },
                                                    0
                                                ]
                                            }
                                        },
                                        12
                                    ]
                                },
                                else: {
                                    $cond: {
                                        if: { $regexMatch: { input: "$patient.age", regex: /days?$/ } },
                                        then: {
                                            $divide: [
                                                {
                                                    $toInt: {
                                                        $arrayElemAt: [
                                                            { $split: ["$patient.age", " "] },
                                                            0
                                                        ]
                                                    }
                                                },
                                                365
                                            ]
                                        },
                                        else: 0
                                    }
                                }
                            }
                        }
                    }
                },
                // Determine if it's a mortality case
                isMortality: {
                    $cond: {
                        if: { $eq: ["$clinicalencounter.outcome", "Death"] },
                        then: 1,
                        else: 0
                    }
                }
            }
        },
        // Add age group categorization
        {
            $addFields: {
                ageGroup: {
                    $switch: {
                        branches: [
                            { case: { $lt: ["$ageValue", 5] }, then: "<5" },
                            { case: { $lt: ["$ageValue", 15] }, then: "<15" },
                            { case: { $and: [
                                        { $gte: ["$ageValue", 15] },
                                        { $lte: ["$ageValue", 19] }
                                    ] }, then: "15-19" },
                            { case: { $gte: ["$ageValue", 20] }, then: "20+" }
                        ],
                        default: "20+"
                    }
                },
                // Categorize appointment type as new or follow-up
                appointmentCategory: {
                    $cond: {
                        if: {
                            $regexMatch: { input: { $toLower: "$appointmenttype" }, regex: /follow/ }
                        },
                        then: "followup",
                        else: "new"
                    }
                }
            }
        },
        // Group by diagnosis, appointment type, gender, and age group
        {
            $group: {
                _id: {
                    diagnosis: "$clinicalencounter.diagnosisicd10",
                    appointmentCategory: "$appointmentCategory",
                    gender: { $toLower: "$patient.gender" },
                    ageGroup: "$ageGroup"
                },
                count: { $sum: 1 },
                mortality: { $sum: "$isMortality" }
            }
        },
        // Reshape the data
        {
            $project: {
                _id: 0,
                diagnosis: "$_id.diagnosis",
                appointmentCategory: "$_id.appointmentCategory",
                gender: "$_id.gender",
                ageGroup: "$_id.ageGroup",
                count: 1,
                mortality: 1
            }
        },
        // Sort by diagnosis name
        {
            $sort: {
                diagnosis: 1
            }
        }
    ];
    return {
        diseaseCasesPipeline
    };
};
exports.diseaseCasesReports = diseaseCasesReports;

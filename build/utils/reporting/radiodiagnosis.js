"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radiodiagnosisreports = void 0;
const radiodiagnosisreports = (startdate, enddate) => {
    // Simplified Radio Diagnosis pipeline - grouped by testname and gender
    const radioDiagnosisPipeline = [
        {
            $match: {
                createdAt: { $gte: startdate, $lt: enddate }
            }
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
        {
            $project: {
                testname: 1,
                gender: "$patientInfo.gender"
            }
        },
        {
            $group: {
                _id: {
                    testname: "$testname",
                    gender: "$gender"
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                testname: "$_id.testname",
                gender: "$_id.gender",
                count: 1
            }
        },
        {
            $sort: {
                testname: 1,
                gender: 1
            }
        }
    ];
    return { radioDiagnosisPipeline };
};
exports.radiodiagnosisreports = radiodiagnosisreports;

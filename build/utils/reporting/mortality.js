"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mortalityreports = void 0;
const mortalityreports = (startdate, enddate) => {
    // Helper function to create age group pipeline
    const createAgeGroupPipeline = (ageConditions) => {
        return [
            {
                $match: {
                    createdAt: { $gte: startdate, $lte: enddate },
                    deletedAt: { $exists: false }
                }
            },
            {
                $addFields: {
                    // Parse age to determine age group
                    ageInDays: {
                        $cond: {
                            if: { $regexMatch: { input: "$age", regex: /days?$/i } },
                            then: {
                                $toInt: {
                                    $arrayElemAt: [
                                        { $split: ["$age", " "] },
                                        0
                                    ]
                                }
                            },
                            else: null
                        }
                    },
                    ageInMonths: {
                        $cond: {
                            if: { $regexMatch: { input: "$age", regex: /months?$/i } },
                            then: {
                                $toInt: {
                                    $arrayElemAt: [
                                        { $split: ["$age", " "] },
                                        0
                                    ]
                                }
                            },
                            else: null
                        }
                    },
                    ageInYears: {
                        $cond: {
                            if: { $regexMatch: { input: "$age", regex: /years?$/i } },
                            then: {
                                $toInt: {
                                    $arrayElemAt: [
                                        { $split: ["$age", " "] },
                                        0
                                    ]
                                }
                            },
                            else: null
                        }
                    }
                }
            },
            {
                $match: ageConditions
            },
            {
                $group: {
                    _id: "$sex",
                    count: { $sum: 1 }
                }
            }
        ];
    };
    // 0-28 days (Neonatal)
    const mortality0to28DaysPipeline = createAgeGroupPipeline({
        $or: [
            { ageInDays: { $gte: 0, $lte: 28 } }
        ]
    });
    // 29 days - 11 months
    const mortality29Daysto11MonthsPipeline = createAgeGroupPipeline({
        $or: [
            { ageInDays: { $gte: 29 } },
            { ageInMonths: { $gte: 1, $lte: 11 } }
        ]
    });
    // 12-59 months (1-4 years)
    const mortality12to59MonthsPipeline = createAgeGroupPipeline({
        $or: [
            { ageInMonths: { $gte: 12, $lte: 59 } },
            {
                $and: [
                    { ageInYears: { $gte: 1, $lte: 4 } },
                    { ageInMonths: { $eq: null } }
                ]
            }
        ]
    });
    // 5-9 years
    const mortality5to9YearsPipeline = createAgeGroupPipeline({
        ageInYears: { $gte: 5, $lte: 9 }
    });
    // 10-19 years
    const mortality10to19YearsPipeline = createAgeGroupPipeline({
        ageInYears: { $gte: 10, $lte: 19 }
    });
    // 20+ years
    const mortality20PlusYearsPipeline = createAgeGroupPipeline({
        ageInYears: { $gte: 20 }
    });
    // Maternal Mortality Pipelines - Only affects females of childbearing age
    const createMaternalAgeGroupPipeline = (ageConditions) => {
        return [
            {
                $match: {
                    createdAt: { $gte: startdate, $lte: enddate },
                    maternalMortality: true,
                    deletedAt: { $exists: false }
                }
            },
            {
                $addFields: {
                    // Parse age to determine age group
                    ageInYears: {
                        $cond: {
                            if: { $regexMatch: { input: "$age", regex: /years?$/i } },
                            then: {
                                $toInt: {
                                    $arrayElemAt: [
                                        { $split: ["$age", " "] },
                                        0
                                    ]
                                }
                            },
                            else: null
                        }
                    }
                }
            },
            {
                $match: ageConditions
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ];
    };
    // Maternal Mortality: <20 years (Adolescent mothers - high risk)
    const maternalMortalityUnder20Pipeline = createMaternalAgeGroupPipeline({
        ageInYears: { $lt: 20 }
    });
    // Maternal Mortality: 20-34 years (Prime reproductive age)
    const maternalMortality20to34Pipeline = createMaternalAgeGroupPipeline({
        ageInYears: { $gte: 20, $lte: 34 }
    });
    // Maternal Mortality: 35+ years (Advanced maternal age - higher risk)
    const maternalMortality35PlusPipeline = createMaternalAgeGroupPipeline({
        ageInYears: { $gte: 35 }
    });
    // Neonatal Death Causes Pipelines
    const createNeonatalDeathCausePipeline = (cause) => {
        return [
            {
                $match: {
                    createdAt: { $gte: startdate, $lte: enddate },
                    neonatalDeath: cause,
                    deletedAt: { $exists: false }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ];
    };
    const neonatalDeathPrematurityPipeline = createNeonatalDeathCausePipeline("Prematurity");
    const neonatalDeathTetanusPipeline = createNeonatalDeathCausePipeline("Neonatal Tetanus");
    const neonatalDeathMalformationPipeline = createNeonatalDeathCausePipeline("⁠Continental Malformation");
    const neonatalDeathOtherPipeline = createNeonatalDeathCausePipeline("⁠Others");
    // Under-5 Death Causes Pipelines
    const createUnderFiveDeathCausePipeline = (cause) => {
        return [
            {
                $match: {
                    createdAt: { $gte: startdate, $lte: enddate },
                    Deathunderfive: cause,
                    deletedAt: { $exists: false }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ];
    };
    const underFiveDeathMalariaPipeline = createUnderFiveDeathCausePipeline("Malaria");
    const underFiveDeathPneumoniaPipeline = createUnderFiveDeathCausePipeline("⁠Pneumonia");
    const underFiveDeathMalnutritionPipeline = createUnderFiveDeathCausePipeline("Malnutrition");
    const underFiveDeathOtherPipeline = createUnderFiveDeathCausePipeline("Others");
    return {
        mortality0to28DaysPipeline,
        mortality29Daysto11MonthsPipeline,
        mortality12to59MonthsPipeline,
        mortality5to9YearsPipeline,
        mortality10to19YearsPipeline,
        mortality20PlusYearsPipeline,
        maternalMortalityUnder20Pipeline,
        maternalMortality20to34Pipeline,
        maternalMortality35PlusPipeline,
        neonatalDeathPrematurityPipeline,
        neonatalDeathTetanusPipeline,
        neonatalDeathMalformationPipeline,
        neonatalDeathOtherPipeline,
        underFiveDeathMalariaPipeline,
        underFiveDeathPneumoniaPipeline,
        underFiveDeathMalnutritionPipeline,
        underFiveDeathOtherPipeline
    };
};
exports.mortalityreports = mortalityreports;

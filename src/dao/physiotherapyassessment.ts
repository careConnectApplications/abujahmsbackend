import PhysiotherapyAssessment from "../models/physiotherapyassessment";
import configuration from "../config";

// 🔍 Read all physiotherapy assessments
export async function readAllPhysiotherapyAssessments(
  query = {},
  selectquery = {},
  populatequery = "",
  populatesecondquery = "",
  skip = 0,
  limit = 150
) {
  try {
    const assessments = await PhysiotherapyAssessment.find(query)
      .select(selectquery)
      .populate(populatequery)
      .populate(populatesecondquery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PhysiotherapyAssessment.countDocuments(query);

    return { assessments, total };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve physiotherapy assessment data");
  }
}

// ➕ Create a physiotherapy assessment
export async function createPhysiotherapyAssessment(input:any) {
  try {
    const newAssessment = new PhysiotherapyAssessment(input);
    return await newAssessment.save();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create physiotherapy assessment");
  }
}

// 🔍 Read one physiotherapy assessment
export async function readOnePhysiotherapyAssessment(query:any, selectquery = {}) {
  try {
    return await PhysiotherapyAssessment.findOne(query).select(selectquery);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve physiotherapy assessment data");
  }
}

// 🔄 Update assessment by ID
export async function updatePhysiotherapyAssessmentById(id:any, reqbody:any) {
  try {
    const updated = await PhysiotherapyAssessment.findOneAndUpdate(
      { _id: id },
      reqbody,
      { new: true }
    );

    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }

    return updated;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update physiotherapy assessment");
  }
}

// 🔄 Update assessment by query
export async function updatePhysiotherapyAssessmentByQuery(query:any, reqbody:any) {
  try {
    const updated = await PhysiotherapyAssessment.findOneAndUpdate(
      query,
      reqbody,
      { new: true }
    );

    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }

    return updated;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update physiotherapy assessment");
  }
}

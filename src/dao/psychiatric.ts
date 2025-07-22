import PsychiatricEvaluation from "../models/psychiatric";
import configuration from "../config";

// 🔍 Read all psychiatric evaluations
export async function readAllPsychiatricEvaluations(query: any, selectquery: any, populatequery: any, populatesecondquery: any, skip:number=0, limit:number=150) {
  try {
    const evaluations = await PsychiatricEvaluation.find(query)
      .select(selectquery)
      .populate(populatequery)
      .populate(populatesecondquery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      ;

    const total = await PsychiatricEvaluation.countDocuments(query);

    return { evaluations, total };
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// ➕ Create psychiatric evaluation
export async function createPsychiatricEvaluation(input: any) {
  try {
    const newEvaluation = new PsychiatricEvaluation(input);
    return await newEvaluation.save();
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.errorusercreate);
  }
}

// 🔍 Read one psychiatric evaluation
export async function readOnePsychiatricEvaluation(query: any, selectquery: any) {
  try {
    return await PsychiatricEvaluation.findOne(query).select(selectquery);
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// 🔄 Update evaluation by ID
export async function updatePsychiatricEvaluationById(id: any, reqbody: any) {
  try {
    const updated = await PsychiatricEvaluation.findOneAndUpdate({ _id: id }, reqbody, { new: true });

    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }

    return updated;
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserupdate);
  }
}

// 🔄 Update evaluation by query
export async function updatePsychiatricEvaluationByQuery(query: any, reqbody: any) {
  try {
    const updated = await PsychiatricEvaluation.findOneAndUpdate(query, reqbody, { new: true });

    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }

    return updated;
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserupdate);
  }
}

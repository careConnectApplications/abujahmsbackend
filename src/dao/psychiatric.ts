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
<<<<<<< HEAD
    throw new Error("Failed to retrieve psychiatric data");
=======
    throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// ➕ Create psychiatric evaluation
export async function createPsychiatricEvaluation(input: any) {
  try {
    const newEvaluation = new PsychiatricEvaluation(input);
    return await newEvaluation.save();
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    throw new Error("Failed to create psychiatric");
=======
    throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// 🔍 Read one psychiatric evaluation
export async function readOnePsychiatricEvaluation(query: any, selectquery: any) {
  try {
    return await PsychiatricEvaluation.findOne(query).select(selectquery);
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    throw new Error("Failed to retrieve psychiatric data");
=======
    throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
    throw new Error("Failed to update psychiatric");
=======
    throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
    throw new Error("Failed to update psychiatric");
=======
    throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

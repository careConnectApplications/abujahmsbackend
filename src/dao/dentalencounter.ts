import DentalEncounter from "../models/dentalencounter";
import configuration from "../config";

// 🔍 Read all dental encounters
export async function readAllDentalEncounters(
  query: any,
  selectquery: any,
  populatequery: any,
  populatesecondquery: any,
  skip: number = 0,
  limit: number = 150
) {
  try {
    const encounters = await DentalEncounter.find(query)
      .select(selectquery)
      .populate(populatequery)
      .populate(populatesecondquery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DentalEncounter.countDocuments(query);

    return { encounters, total };
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// ➕ Create a dental encounter
export async function createDentalEncounter(input: any) {
  try {
    const newEncounter = new DentalEncounter(input);
    return await newEncounter.save();
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.errorusercreate);
  }
}

// 🔍 Read one dental encounter
export async function readOneDentalEncounter(query: any, selectquery: any) {
  try {
    return await DentalEncounter.findOne(query).select(selectquery);
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserread);
  }
}

// 🔄 Update dental encounter by ID
export async function updateDentalEncounterById(id: any, reqbody: any) {
  try {
    const updated = await DentalEncounter.findOneAndUpdate(
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
    throw new Error(configuration.error.erroruserupdate);
  }
}

// 🔄 Update dental encounter by query
export async function updateDentalEncounterByQuery(query: any, reqbody: any) {
  try {
    const updated = await DentalEncounter.findOneAndUpdate(query, reqbody, {
      new: true,
    });

    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }

    return updated;
  } catch (err) {
    console.error(err);
    throw new Error(configuration.error.erroruserupdate);
  }
}

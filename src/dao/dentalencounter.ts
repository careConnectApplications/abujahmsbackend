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
<<<<<<< HEAD
    throw new Error("Failed to retrieve dental encounter data");
=======
    throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// ➕ Create a dental encounter
export async function createDentalEncounter(input: any) {
  try {
    const newEncounter = new DentalEncounter(input);
    return await newEncounter.save();
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    throw new Error("Failed to create dental encounter");
=======
    throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// 🔍 Read one dental encounter
export async function readOneDentalEncounter(query: any, selectquery: any) {
  try {
    return await DentalEncounter.findOne(query).select(selectquery);
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    throw new Error("Failed to retrieve dental encounter data");
=======
    throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
    throw new Error("Failed to update dental encounter");
=======
    throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
    throw new Error("Failed to update dental encounter");
=======
    throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

import Bed from "../models/beds";
import configuration from "../config";

// Create a bed
export async function createbed(input: any) {
  try {
    const bed = new Bed(input);
    return await bed.save();
  } catch (err) {
    console.log(err);
<<<<<<< HEAD
    throw new Error("Failed to create bed");
=======
    throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// Read all beds
export async function readallbeds(query: any, selectquery: any, populate:any) {
  try {
    const bedDetails = await Bed.find(query).select(selectquery).populate(populate).sort({ createdAt: -1 });
    const totalBeds = await Bed.countDocuments(query);
    return { bedDetails, totalBeds };
  } catch (err) {
    console.log(err);
<<<<<<< HEAD
    throw new Error("Failed to retrieve bed data");
=======
    throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// Read one bed
export async function readonebed(query: any, selectquery: any) {
  try {
    return await Bed.findOne(query).select(selectquery);
  } catch (err) {
    console.log(err);
<<<<<<< HEAD
    throw new Error("Failed to retrieve bed data");
=======
    throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// Update bed by ID
export async function updatebed(id: any, reqbody: any) {
  try {
    const bed = await Bed.findOneAndUpdate({ _id: id }, reqbody, {
      new: true
    });
    if (!bed) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return bed;
  } catch (err) {
    console.log(err);
<<<<<<< HEAD
    throw new Error("Failed to update bed");
=======
    throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

// Update bed by query
export async function updatebedbyquery(query: any, reqbody: any) {
  try {
    const bed = await Bed.findOneAndUpdate(query, reqbody, {
      new: true
    });
    if (!bed) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return bed;
  } catch (err) {
    console.log(err);
<<<<<<< HEAD
    throw new Error("Failed to update bed");
=======
    throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }
}

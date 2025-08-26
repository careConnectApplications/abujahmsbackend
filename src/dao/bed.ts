import Bed from "../models/beds";
import configuration from "../config";

// Create a bed
export async function createbed(input: any) {
  try {
    const bed = new Bed(input);
    return await bed.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create bed");
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
    throw new Error("Failed to retrieve bed data");
  }
}

// Read one bed
export async function readonebed(query: any, selectquery: any) {
  try {
    return await Bed.findOne(query).select(selectquery);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve bed data");
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
    throw new Error("Failed to update bed");
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
    throw new Error("Failed to update bed");
  }
}

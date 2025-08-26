import InsuranceClaim from "../models/insuranceclaim";
import configuration from "../config";
interface PaginationOptions {
  page?: number;
  limit?: number;
  query?: any;
  select?: string;
  populate?: {
    path: string;
    select?: string;
  }[];
}

// 🔍 Read all insurance claims
export async function readAllInsuranceClaims(
 options: PaginationOptions
) {
    const {
    page = 1,
    limit = 150,
    query = {},
    select = "",
    populate = [
      { path: "patient", select: "firstName middleName lastName phoneNumber email isHMOCover HMOName HMOId MRN" },
      { path: "lab", select: "testname testid raiseby createdAt" },
      { path: "radiology", select: "testname testid raiseby createdAt" },
      { path: "procedure", select: "procedure procedureid raiseby createdAt" },
      { path: "pharmacy", select: "prescription pharmacy orderid qty" },
      { path: "createdBy", select: "firstName lastName role" },
    ],
  } = options;
  try {
    const skip = (page - 1) * limit;

     const queryBuilder = InsuranceClaim.find(query)
      .select(select)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // apply populate with field selection
    populate.forEach((p) => {
      queryBuilder.populate(p);
    });

    const [claims, total] = await Promise.all([
      queryBuilder.exec(), // latest first
      InsuranceClaim.countDocuments(query),
    ]);
     return { claims, totalPages:Math.ceil(total / limit),total, limit, page};

    
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve insurance claim data");
  }
}

// ➕ Create a new insurance claim
/*
export async function createInsuranceClaim(input: any) {
  try {
    const newClaim = new InsuranceClaim(input);
    return await newClaim.save();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create insurance claim");
  }
}
  */
export async function createInsuranceClaim(input: any) {
  try {
    if (Array.isArray(input)) {
      // 🔹 Insert many claims at once
      return await InsuranceClaim.insertMany(input);
    } else {
      // 🔹 Fallback for single claim
      const newClaim = new InsuranceClaim(input);
      return await newClaim.save();
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create insurance claim");
  }
}


// 🔍 Read one insurance claim
export async function readOneInsuranceClaim(query: any, selectquery = {}) {
  try {
    return await InsuranceClaim.findOne(query).select(selectquery);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve insurance claim data");
  }
}

// 🔄 Update claim by ID
export async function updateInsuranceClaimById(id: any, reqbody: any) {
  try {
    const updated = await InsuranceClaim.findOneAndUpdate(
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
    throw new Error("Failed to update insurance claim");
  }
}

// 🔄 Update claim by query
export async function updateInsuranceClaimByQuery(query: any, reqbody: any) {
  try {
    const updated = await InsuranceClaim.findOneAndUpdate(query, reqbody, {
      new: true,
    });
    if (!updated) {
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return updated;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update insurance claim");
  }
}

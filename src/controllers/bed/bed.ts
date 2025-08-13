import { NextFunction, Request, Response } from "express";
import configuration from "../../config";
import { createaudit } from "../../dao/audit";
import { generateRandomNumber, validateinputfaulsyvalue } from "../../utils/otherservices";
import {
  readallbeds,
  createbed,
  readonebed,
  updatebed
} from "../../dao/bed";
import  {readonewardmanagement,updatewardmanagement}  from "../../dao/wardmanagement";
import mongoose from 'mongoose';
import catchAsync from "../../utils/catchAsync";
const { ObjectId } = mongoose.Types;

// Create a new bed
export const createbeds = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { wardid,bednumber} = req.body;
    const { firstName, lastName } = req.user.user;
    const actor = `${firstName} ${lastName}`;
    const id = new ObjectId(wardid);
    validateinputfaulsyvalue({ wardid });
    const foundWard =  await readonewardmanagement({_id:id},'');
    if(!foundWard){
      throw new Error(`Ward doesnt ${configuration.error.erroralreadyexit}`);
    
    }
      

    // Check for existing bed with same number in the same ward
    const existing = await readonebed({ bednumber, ward:id }, '');
    if (existing) {
      throw new Error(`Bed ${configuration.error.erroralreadyexit}`);
    }

    const queryresult = await createbed({
      bednumber,
      ward:id,
      status: configuration.bedstatus[0],
      assignedPatient: null,
      assignedDate: null
    });
     await updatewardmanagement(id,{$inc:{vacantbed:1}});
    await createaudit({ action: "Created Bed", actor, affectedentity: bednumber });
    res.status(200).json({ queryresult, status: true });

});
//get all not deleted and vacant be by ward
// Get all vacant and not-deleted beds in a specific ward
export const getAvailableBedsByWard = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { wardid } = req.params;
    if (!wardid) {
      throw new Error("Ward ID is required");
    }

    const query = {
      ward: wardid,
      status: configuration.bedstatus[0],
      isDeleted:false
    };

    const queryresult = await readallbeds(query, "","ward");

    res.status(200).json({ queryresult, status: true });
 
});
//delete a bed
export const softDeleteBed = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const { isDeleted } = req.body; // true or false

    if (!id || typeof isDeleted !== "boolean") {
      throw new Error("Both Bed ID and valid isDeleted (true or false) are required.");
    }

    // Fetch current bed data
    const bed = await readonebed({ _id: id }, "");

    if (!bed) {
      throw new Error("Bed not found.");
    }

    // Block operation if bed is occupied
    if (bed.status === configuration.bedstatus[1]) {
      throw new Error("Cannot delete or restore an occupied bed.");
    }

    // Adjust vacantbed count based on deletion or restoration
    const adjustment = isDeleted ? -1 : 1;
    if(isDeleted !== bed.isDeleted) await updatewardmanagement(bed.ward, { $inc: { vacantbed: adjustment,totalbed: adjustment } });

    // Apply soft delete / restore
    const queryresult = await updatebed(id, { isDeleted });

    res.status(200).json({ queryresult, status: true });
   
 
});

// Read all beds
export const getallbeds = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

    const queryresult = await readallbeds({}, '','ward');
    res.status(200).json({ queryresult, status: true });
  
});

// Update a bed
export const updatebeds = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { bednumber} = req.body;
    const { firstName, lastName } = req.user.user;
    const actor = `${firstName} ${lastName}`;
    validateinputfaulsyvalue({ bednumber});
    const existing = await readonebed({ bednumber}, '');
    if (existing) {
      throw new Error(`Bed ${configuration.error.erroralreadyexit}`);
    }
    const queryresult = await updatebed(id, {
      bednumber
    });

    await createaudit({ action: "Updated Bed", actor, affectedentity: bednumber });

    res.status(200).json({ queryresult, status: true });
  
});

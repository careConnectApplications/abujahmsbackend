import Anaethesia from "../models/anaethesia";
import configuration from "../config";


  //read all patient history
  export async function readallanaethesias(query:any,selectquery:any) {
    try {
      const anaethesiadetails = await Anaethesia.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalanaethesiadetails = await Anaethesia.find(query).countDocuments();
      return { anaethesiadetails, totalanaethesiadetails };
    } catch (err) {
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve anaesthesia data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    }
  };
  export async function createanaethesia(input:any){
    try{
      console.log('///////////',input);
       const anaethesia = new Anaethesia(input);
        return await anaethesia.save();
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to create anaesthesia");
=======
      throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  //find one
  export async function readoneanaethesia(query:any,selectquery:any,populatequery:any,populatequerysecond:any){
    try{
    return await Anaethesia.findOne(query).select(selectquery).populate(populatequery).populate(populatequerysecond).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve anaesthesia data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  
 
  
  //update  appointment by id
  export async function updateanaethesia(id:any, reqbody:any){
    try{
    const anaethesia = await Anaethesia.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!anaethesia) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return anaethesia;
    }catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to update anaesthesia");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  //update  appointment by query
  export async function updateanaethesiaquery(query:any, reqbody:any){
    try{
    const anaethesia = await Anaethesia.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!anaethesia) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return anaethesia;
    }catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to update anaesthesia");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  
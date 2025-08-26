import Postanaetheticrecoverychart from "../models/postanaetheticrecoverychart";
import configuration from "../config";


  //read all patient history
  export async function readallpostanaetheticrecoverychart(query:any,selectquery:any) {
    try {
      const postanaetheticrecoverycharts = await Postanaetheticrecoverychart.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalpostanaetheticrecoverycharts = await Postanaetheticrecoverychart.find(query).countDocuments();
      return { postanaetheticrecoverycharts, totalpostanaetheticrecoverycharts };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve post-anaesthetic recovery chart data");
    }
  };                                                                                                        
  export async function createpostanaetheticrecoverychart(input:any){
    try{
      console.log('///////////',input);
       const postanaetheticrecoverychart = new Postanaetheticrecoverychart(input);
        return await postanaetheticrecoverychart.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create post-anaesthetic recovery chart");

    }
  }
  //find one
  export async function readonepostanaetheticrecoverychart(query:any,selectquery:any,populatequery:any,populatequerysecond:any){
    try{
    return await Postanaetheticrecoverychart.findOne(query).select(selectquery).populate(populatequery).populate(populatequerysecond).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve post-anaesthetic recovery chart data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatepostanaetheticrecoverychart(id:any, reqbody:any){
    try{
    const postanaetheticrecoverychart = await Postanaetheticrecoverychart.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!postanaetheticrecoverychart) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return postanaetheticrecoverychart;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update post-anaesthetic recovery chart");

    }

  }
  //update  appointment by query
  export async function updatepostanaetheticrecoverychartquery(query:any, reqbody:any){
    try{
    const postanaetheticrecoverychart = await Postanaetheticrecoverychart.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!postanaetheticrecoverychart) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return postanaetheticrecoverychart;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update post-anaesthetic recovery chart");

    }

  }
  
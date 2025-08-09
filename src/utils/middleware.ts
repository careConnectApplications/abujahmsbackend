import  {Request, Response, NextFunction} from 'express';
import configuration from '../config';
import * as jwt from 'jsonwebtoken';
//Protect routes
export const protect = async(req:any,res:Response,next:NextFunction)=>{
    try{
    let token;
    //check if token is contain in the header
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token= req.headers.authorization.split(" ")[1];
    }
    //check the presence of token
    if(!token){
        throw new Error(configuration.error.protectroutes);
    }


  
        const decoded = jwt.verify(token, process.env.KEYGEN!);
      
        req.user= decoded;
       
        next();
    }
    catch(e:any){
        //console.error(e.message);
        res.status(500).json({ msg: e.message, status: false }) ;
  
    }
  }

  

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const status = false;

  res.status(statusCode).json({
    status,
    msg: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

export default globalErrorHandler;

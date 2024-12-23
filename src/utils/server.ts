import express,{Application} from 'express';
import cors from 'cors';
import fileUpload from "express-fileupload";
import auth from "../routes/auth";
import users from "../routes/usermanagement";
import patientsmanagement from '../routes/patientmanagement';
import billingandpayment from '../routes/billingandpayment';
import appointment from '../routes/appointment';
import settings from '../routes/setting';
import downloads from "../routes/downloads";
import {protect} from "../utils/middleware";

function createServer(){
    const app:Application=express();
    //cross origin sharing
    app.use(cors({
      origin: "*",
      }));
    app.use(express.static(__dirname + '/downloads'));
    app.use(express.static(__dirname + '/uploads'));
    //middleware to process json
    app.use(express.json({limit: '50mb'}));
    /*
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir:path.join(__dirname, 'tmp'),
        createParentPath: true,
    }));
    */
    app.use(fileUpload());
  app.use('/api/v1/downloads', downloads);
  app.use('/api/v1/uploads', express.static('uploads'));
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/users',users);
  app.use('/api/v1/billing',protect,billingandpayment);
  app.use('/api/v1/patientsmanagement',protect,patientsmanagement);
  app.use('/api/v1/appointment',appointment);
  app.use('/api/v1/settings',settings);
  
    return app;

}
export default createServer;

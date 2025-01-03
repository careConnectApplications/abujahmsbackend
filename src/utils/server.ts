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
import lab from '../routes/lab';
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
  app.use('/api/v1/appointment',protect, appointment);
  app.use('/api/v1/lab',protect, lab);
  app.use('/api/v1/settings',settings);
  // Handle POST requests to /webhook
  /*
app.post('/api/v1/webhook', (req, res) => {
  // Log the incoming Event Grid event data
  console.log('Event received:', JSON.stringify(req.body, null, 2));

  // You can handle the event logic here
  // Example: if you're dealing with Azure Storage events, check for a specific event type
  const event = req.body[0];  // Event Grid sends an array of events
  if (event.eventType === 'Microsoft.Storage.BlobCreated') {
      console.log('A blob was created in your storage account.');
      // Handle blob creation event
  }

  // Send a 200 OK response back to acknowledge receipt of the event
  res.status(200).send('Event received');
});
*/
  
    return app;

}
export default createServer;

import cors from 'cors';
import express, { Application } from 'express';
import fileUpload from "express-fileupload";
import httpStatus from "http-status";
import { readicdeleven } from '../controllers/icdten/icdten';
import { ApiError, errorConverter, errorHandler } from '../errors';
import { morgan } from '../logger';
import admission from '../routes/admission';
import anc from '../routes/anc';
import appointment from '../routes/appointment';
import auth from "../routes/auth";
import billingandpayment from '../routes/billingandpayment';
import dashboard from '../routes/dashboard';
import deliverynote from '../routes/deliverynote';
import downloads from "../routes/downloads";
import familyplanning from '../routes/familyplanning';
import histopathologyRoute from "../routes/histopathology.route";
import immunization from '../routes/immunization';
import lab from '../routes/lab';
import nursingcare from '../routes/nursingcare';
import nutrition from '../routes/nutrition';
import pathogragh from '../routes/pathograph';
import patientsmanagement from '../routes/patientmanagement';
import pharmacy from '../routes/pharmacy';
import procedure from '../routes/procedure';
import psychiatricRoute from "../routes/psychiatric";
import radiology from '../routes/radiology';
import referrer from '../routes/referrer';
import reports from '../routes/reportsandanalytics';
import settings from '../routes/setting';
import theatreadmission from '../routes/theatreadmission';
import users from "../routes/usermanagement";
import { protect } from "../utils/middleware";


function createServer() {
  const app: Application = express();

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }
  //cross origin sharing
  app.use(cors({
    origin: "*",
  }));
  app.use(express.static(__dirname + '/downloads'));
  app.use(express.static(__dirname + '/uploads'));
  //middleware to process json
  app.use(express.json({ limit: '50mb' }));
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
  app.use('/api/v1/users', protect, users);
  app.use('/api/v1/billing', protect, billingandpayment);
  app.use('/api/v1/patientsmanagement', protect, patientsmanagement);
  app.use('/api/v1/appointment', protect, appointment);
  app.use('/api/v1/lab', protect, lab);
  app.use('/api/v1/settings', protect, settings);
  app.use('/api/v1/pharmacy', protect, pharmacy);
  app.use('/api/v1/admission', protect, admission);
  app.use('/api/v1/nursingcare', protect, nursingcare);
  app.use('/api/v1/immunization', protect, immunization);
  app.use('/api/v1/nutrition', protect, nutrition);
  app.use('/api/v1/pathogragh', protect, pathogragh)
  app.use('/api/v1/radiology', protect, radiology);
  app.use('/api/v1/familyplanning', protect, familyplanning);
  app.use('/api/v1/referrer', protect, referrer);
  app.use('/api/v1/deliverynote', protect, deliverynote);
  app.use('/api/v1/procedure', protect, procedure);
  app.use('/api/v1/dashboard', protect, dashboard);
  app.use('/api/v1/anc', protect, anc);
  app.use('/api/v1/theatreadmission', protect, theatreadmission);
  //app.use('/api/v1/reports',protect,  reports);
  app.use('/api/v1/reports', reports);
  app.use('/api/v1/readicdten', readicdeleven);
  app.use("/api/v1/histopathology", protect, histopathologyRoute)
  app.use("/api/v1/psychiatric", protect, psychiatricRoute)
 
  

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
  // Send back a 404 error for any unknown API request
  app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Request Endpoint Not found"));
  });

  // Convert errors to ApiError, if needed
  app.use(errorConverter);

  // Handle errors
  app.use(errorHandler);
  return app;

}
export default createServer;

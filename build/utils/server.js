"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http_status_1 = __importDefault(require("http-status"));
const icdten_1 = require("../controllers/icdten/icdten");
const errors_1 = require("../errors");
const logger_1 = require("../logger");
const admission_1 = __importDefault(require("../routes/admission"));
const anc_1 = __importDefault(require("../routes/anc"));
const appointment_1 = __importDefault(require("../routes/appointment"));
const auth_1 = __importDefault(require("../routes/auth"));
const billingandpayment_1 = __importDefault(require("../routes/billingandpayment"));
const dashboard_1 = __importDefault(require("../routes/dashboard"));
const deliverynote_1 = __importDefault(require("../routes/deliverynote"));
const downloads_1 = __importDefault(require("../routes/downloads"));
const familyplanning_1 = __importDefault(require("../routes/familyplanning"));
const histopathology_route_1 = __importDefault(require("../routes/histopathology.route"));
const immunization_1 = __importDefault(require("../routes/immunization"));
const lab_1 = __importDefault(require("../routes/lab"));
const nursingcare_1 = __importDefault(require("../routes/nursingcare"));
const nutrition_1 = __importDefault(require("../routes/nutrition"));
const pathograph_1 = __importDefault(require("../routes/pathograph"));
const patientmanagement_1 = __importDefault(require("../routes/patientmanagement"));
const pharmacy_1 = __importDefault(require("../routes/pharmacy"));
const procedure_1 = __importDefault(require("../routes/procedure"));
const psychiatric_1 = __importDefault(require("../routes/psychiatric"));
const dental_1 = __importDefault(require("../routes/dental"));
const radiology_1 = __importDefault(require("../routes/radiology"));
const referrer_1 = __importDefault(require("../routes/referrer"));
const reportsandanalytics_1 = __importDefault(require("../routes/reportsandanalytics"));
const setting_1 = __importDefault(require("../routes/setting"));
const theatreadmission_1 = __importDefault(require("../routes/theatreadmission"));
const usermanagement_1 = __importDefault(require("../routes/usermanagement"));
const middleware_1 = require("../utils/middleware");
const histopathology_tests_route_1 = __importDefault(require("../routes/histopathology-tests.route"));
const phisiotherapy_1 = __importDefault(require("../routes/phisiotherapy"));
const eye_module_route_1 = __importDefault(require("../routes/eye-module.route"));
const doctor_ward_round_route_1 = __importDefault(require("../routes/doctor-ward-round.route"));
const insuranceauthorizationandclaims_1 = __importDefault(require("../routes/insuranceauthorizationandclaims"));
function createServer() {
    const app = (0, express_1.default)();
    if (process.env.NODE_ENV !== "test") {
        app.use(logger_1.morgan.successHandler);
        app.use(logger_1.morgan.errorHandler);
    }
    //cross origin sharing
    app.use((0, cors_1.default)({
        origin: "*",
    }));
    app.use(express_1.default.static(__dirname + '/downloads'));
    app.use(express_1.default.static(path.join(__dirname, 'uploads')));
    //middleware to process json
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    /*
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir:path.join(__dirname, 'tmp'),
        createParentPath: true,
    }));
    */
    /****
     * Cron Jobs
     */
    //import("../jobs/checkExpiredSubscriptionDate.job");
    app.use((0, express_fileupload_1.default)());
    app.use('/api/v1/downloads', downloads_1.default);
    app.use('/api/v1/uploads', express_1.default.static('uploads'));
    app.use('/api/v1/auth', auth_1.default);
    app.use('/api/v1/users', middleware_1.protect, usermanagement_1.default);
    app.use('/api/v1/billing', middleware_1.protect, billingandpayment_1.default);
    app.use('/api/v1/patientsmanagement', middleware_1.protect, patientmanagement_1.default);
    app.use('/api/v1/appointment', middleware_1.protect, appointment_1.default);
    app.use('/api/v1/lab', middleware_1.protect, lab_1.default);
    app.use('/api/v1/settings', middleware_1.protect, setting_1.default);
    app.use('/api/v1/pharmacy', middleware_1.protect, pharmacy_1.default);
    app.use('/api/v1/admission', middleware_1.protect, admission_1.default);
    app.use('/api/v1/nursingcare', middleware_1.protect, nursingcare_1.default);
    app.use('/api/v1/immunization', middleware_1.protect, immunization_1.default);
    app.use('/api/v1/nutrition', middleware_1.protect, nutrition_1.default);
    app.use('/api/v1/pathogragh', middleware_1.protect, pathograph_1.default);
    app.use('/api/v1/radiology', middleware_1.protect, radiology_1.default);
    app.use('/api/v1/familyplanning', middleware_1.protect, familyplanning_1.default);
    app.use('/api/v1/referrer', middleware_1.protect, referrer_1.default);
    app.use('/api/v1/deliverynote', middleware_1.protect, deliverynote_1.default);
    app.use('/api/v1/procedure', middleware_1.protect, procedure_1.default);
    app.use('/api/v1/dashboard', middleware_1.protect, dashboard_1.default);
    app.use('/api/v1/anc', middleware_1.protect, anc_1.default);
    app.use('/api/v1/theatreadmission', middleware_1.protect, theatreadmission_1.default);
    //app.use('/api/v1/reports',protect,  reports);
    app.use('/api/v1/reports', reportsandanalytics_1.default);
    app.use('/api/v1/readicdten', icdten_1.readicdeleven);
    app.use("/api/v1/histopathology", middleware_1.protect, histopathology_route_1.default);
    app.use("/api/v1/psychiatric", middleware_1.protect, psychiatric_1.default);
    app.use("/api/v1/physiotherapy", middleware_1.protect, phisiotherapy_1.default);
    app.use("/api/v1/dental", middleware_1.protect, dental_1.default);
    app.use("/api/v1/histopathology-test", middleware_1.protect, histopathology_tests_route_1.default);
    app.use("/api/v1/eye-module", middleware_1.protect, eye_module_route_1.default);
    app.use("/api/v1/doctor-ward-round", middleware_1.protect, doctor_ward_round_route_1.default);
    app.use("/api/v1/insuranceauthorizationandclaims", middleware_1.protect, insuranceauthorizationandclaims_1.default);
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
        next(new errors_1.ApiError(http_status_1.default.NOT_FOUND, "Request Endpoint Not found"));
    });
    // Convert errors to ApiError, if needed
    app.use(errors_1.errorConverter);
    // Handle errors
    app.use(errors_1.errorHandler);
    return app;
}
exports.default = createServer;

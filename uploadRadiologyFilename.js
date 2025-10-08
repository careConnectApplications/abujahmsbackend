const path = require("path");
const excelToJson = require("convert-excel-to-json");
const { MongoClient } = require('mongodb');
const XLSX = require("xlsx");

// MongoDB connection details
const uri = 'mongodb://onecare:Policy4Onecare@102.37.18.28:27017/ngh?authSource=admin';
const dbName = 'hms';
const nyanyaDbName = 'ngh';
const karshiName = 'rshgh';
const kujeName = "kgh";
const karuName = "krgh";
const kwaliName = 'kwlgh';

function isBase64(str) {
    try {
        return Buffer.from(str, "base64").toString("base64") === str.split(",").pop();
    } catch {
        return false;
    }
}


async function UploadRadiologyBase64() {
    const client = new MongoClient(uri);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        const db = client.db(dbName);

        const admissionCollection = db.collection(name);
    } catch (err) {
        // console.error(`Error processing admission:`, err.message);
        // errorCount++;
        console.error('Fatal error:', err);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

async function getDataFromExcel() {
    const filePath = path.join(__dirname, "patients_reversed.xlsx");

    const result = excelToJson({
        sourceFile: filePath,
        header: { rows: 0 }, // no headers in your sample
        //range: 'A17606:F100000',
        columnToKey: {
            A: "patientId",
            B: "firstName",
            C: "lastName",
            D: "mrn",
            E: "oldMrn",
            F: "code2",
        },
    });

    return result.Reversed;
}

async function getDataFromNyanyaExcel() {
    const filePath = path.join(__dirname, "PatientData(Kwali).xlsx");

    const result = excelToJson({
        sourceFile: filePath,
        header: { rows: 0 }, // no headers in your sample
        //range: 'A17606:F100000',
        columnToKey: {
            A: "patientId",
            B: "firstName",
            C: "lastName",
            D: "mrn",
            E: "oldMrn",
            F: "userId",
        },
    });

    return result.PatientData;
}

async function UpdatePatientDb() {
    const patientData = await getDataFromExcel();
    console.log(patientData);

    // 🔑 Step 1: Create a fast lookup map from Excel data
    const excelMap = new Map();
    for (const row of patientData) {
        excelMap.set(row.mrn, row);
    }

    const client = new MongoClient(uri);
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        const db = client.db(dbName);
        const patientsCollection = db.collection("patientsmanagements");

        // 🔑 Step 2: Fetch only the 81 records that need updating
        const dbPatients = await patientsCollection
            .find({ firstName: { $eq: null } }) // your filter for 81 records
            .toArray();

        console.log(`Found ${dbPatients.length} patients to update`);



        // 🔑 Step 3: Build bulk operations only for the 81
        const ops = [];
        for (const dbPatient of dbPatients) {
            const mrn = dbPatient.mrn || dbPatient.MRN;
            console.log(mrn);

            const excelRow = excelMap.get(mrn);
            if (excelRow) {
                ops.push({
                    updateOne: {
                        filter: { MRN: mrn },
                        update: {
                            $set: {
                                patientId: excelRow.patientId,
                                firstName: excelRow.firstName,
                                lastName: excelRow.lastName,
                                oldMrn: excelRow.oldMrn,
                                nameUpdatedAt: new Date(),
                                nameStatus: 'success',
                            },
                        },
                    },
                });
            }
        }

        // 🔑 Step 4: Execute bulkWrite once
        if (ops.length > 0) {
            const res = await patientsCollection.bulkWrite(ops);
            console.log(`✅ Bulk update done. Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
        } else {
            console.log("⚠️ No matching MRNs found in Excel for these 81 patients");
        }
    } catch (err) {
        console.error("Fatal error:", err);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }

}

async function UpdatePatientRecord() {
    //PatientData
    const patientData = await getDataFromExcel();

    const client = new MongoClient(uri);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        const db = client.db(dbName);

        const patientsCollection = db.collection('patientsmanagements');

        console.log(`Found ${patientData.length} items`);

        let successCount = 0;
        let notFoundCount = 0;
        let errorCount = 0;
        // Process appointments in batches for better performance
        const batchSize = 100;
        const totalBatches = Math.ceil(patientData.length / batchSize);

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const startIndex = batchIndex * batchSize;
            const endIndex = Math.min(startIndex + batchSize, patientData.length);
            const batch = patientData.slice(startIndex, endIndex);

            console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (${startIndex + 1}-${endIndex})`);

            const bulkOps = [];

            for (const patData of batch) {
                const patMrn = patData.mrn;

                if (!patMrn) {
                    console.log(` ${patData.patientId} has no MRN, skipping...`);
                    continue;
                }

                const patient = await patientsCollection.findOne({
                    MRN: patMrn.toString()
                });

                console.log(patMrn);

                if (patient) {
                    bulkOps.push({
                        updateOne: {
                            filter: { MRN: patMrn },
                            update: {
                                $set: {
                                    firstName: patData.firstName,
                                    lastName: patData.lastName,
                                    patientId: patData.patientId,
                                    oldMrn: patData.oldMrn,
                                    nameUpdatedAt: new Date(),
                                    nameStatus: 'success',
                                }
                            }
                        }
                    });
                    successCount++;
                }
            }

            if (bulkOps.length > 0) {
                await patientsCollection.bulkWrite(bulkOps);
                //console.log(bulkOps, "bulk ops")
            }

            // Progress update
            console.log(`Batch ${batchIndex + 1} completed. Success: ${successCount}, Not Found: ${notFoundCount}, Errors: ${errorCount}`);
        }
    } catch (err) {
        // console.error(`Error processing admission:`, err.message);
        // errorCount++;
        console.error('Fatal error:', err);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

async function UpdateNyanyaPatientRecord() {
    //PatientData
    const patientData = await getDataFromNyanyaExcel();

    const client = new MongoClient(uri);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        const db = client.db(kwaliName);

        const patientsCollection = db.collection('patientsmanagements');

        console.log(`Found ${patientData.length} items`);

        let successCount = 0;
        let notFoundCount = 0;
        let errorCount = 0;
        // Process appointments in batches for better performance
        const batchSize = 100;
        const totalBatches = Math.ceil(patientData.length / batchSize);

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const startIndex = batchIndex * batchSize;
            const endIndex = Math.min(startIndex + batchSize, patientData.length);
            const batch = patientData.slice(startIndex, endIndex);

            console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (${startIndex + 1}-${endIndex})`);

            const bulkOps = [];

            for (const patData of batch) {
                const patMrn = patData.mrn;

                if (!patMrn) {
                    console.log(` ${patData.patientId} has no MRN, skipping...`);
                    continue;
                }

                const patient = await patientsCollection.findOne({
                    MRN: patMrn.toString()
                });

                console.log(patMrn);

                if (patient) {
                    bulkOps.push({
                        updateOne: {
                            filter: { MRN: patMrn },
                            update: {
                                $set: {
                                    firstName: patData.firstName,
                                    lastName: patData.lastName,
                                    patientId: patData.patientId,
                                    oldMrn: patData.oldMrn,
                                    nameUpdatedAt: new Date(),
                                    nameStatus: 'success',
                                }
                            }
                        }
                    });
                    successCount++;
                }
            }

            if (bulkOps.length > 0) {
                await patientsCollection.bulkWrite(bulkOps);
                //console.log(bulkOps, "bulk ops")
            }

            // Progress update
            console.log(`Batch ${batchIndex + 1} completed. Success: ${successCount}, Not Found: ${notFoundCount}, Errors: ${errorCount}`);
        }
    } catch (err) {
        // console.error(`Error processing admission:`, err.message);
        // errorCount++;
        console.error('Fatal error:', err);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

async function reversePatientData() {
    const filePath = path.join(__dirname, "PatientData.xlsx");

    // Read workbook
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON array (each row as array of cells)
    let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // If first row is a header, keep it separate
    let header = data[0];
    let rows = data.slice(1).reverse();

    // Put back together
    let reversed = [header, ...rows];

    // Write new Excel file
    const newSheet = XLSX.utils.aoa_to_sheet(reversed);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Reversed");
    XLSX.writeFile(newWorkbook, path.join(__dirname, "patients_reversed.xlsx"));

    console.log("✅ Done! Saved as patients_reversed.xlsx");

}

async function main() {
    console.log('UPLOAD RADIOLOGY BASE64 IMAGE TO FOLDER');
    console.log('========================================');

    const args = process.argv.slice(2);
    const operation = args[0] || 'upload';

    switch (operation) {
        case 'upload':
            await UploadRadiologyBase64();
            break;
        case 'update_patient':
            await UpdatePatientRecord();
            break;
        case 'update':
            await UpdatePatientDb();
            break;
        case 'update_nyanya_patient':
            await UpdateNyanyaPatientRecord();
            break;
        case 'reverse':
            await reversePatientData();
        default:
            console.log('Usage: node script.js [map|reverse|both]');
            console.log('  upload: Add radiology base64string to file folder');
    }
}

main().catch(console.error);
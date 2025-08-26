const fs = require('fs');
const path = require('path');

// Map of DAO files to their entity names
const daoEntityMap = {
  'admissions.ts': 'admission',
  'anaethesia.ts': 'anaesthesia',
  'anc.ts': 'ANC',
  'anc2.ts': 'ANC',
  'anc3.ts': 'ANC',
  'ancfollowup.ts': 'ANC follow-up',
  'ancfollowup3.ts': 'ANC follow-up',
  'appointment.ts': 'appointment',
  'audit.ts': 'audit',
  'bed.ts': 'bed',
  'bloodmonitoring.ts': 'blood monitoring',
  'clinics.ts': 'clinic',
  'conscenttooperation.ts': 'consent to operation',
  'dailywardreport.ts': 'daily ward report',
  'deliverynote.ts': 'delivery note',
  'dentalencounter.ts': 'dental encounter',
  'doctor-ward-round.dao.ts': 'doctor ward round',
  'druggiven.ts': 'drug administration',
  'eye-module.dao.ts': 'eye module',
  'familyplanning.ts': 'family planning',
  'fluidbalance.ts': 'fluid balance',
  'foodgiven.ts': 'food administration',
  'histology.ts': 'histology',
  'histopathology-tests.dao.ts': 'histopathology test',
  'histopathology.dao.ts': 'histopathology',
  'hmocategorycover.ts': 'HMO category cover',
  'hmomanagement.ts': 'HMO',
  'immunization.ts': 'immunization',
  'insulin.ts': 'insulin',
  'insuranceclaim.ts': 'insurance claim',
  'inventory.ts': 'inventory',
  'lab.ts': 'lab test',
  'medicationcharts.ts': 'medication chart',
  'nursingcareplan.ts': 'nursing care plan',
  'nutrition.ts': 'nutrition',
  'operationnotes.ts': 'operation notes',
  'outreachmedication.ts': 'outreach medication',
  'pathograph.ts': 'pathograph',
  'patientmanagement.ts': 'patient',
  'patientmanagementachieve.ts': 'patient archive',
  'payment.ts': 'payment',
  'physiotherapyassessment.ts': 'physiotherapy assessment',
  'postanaetheticrecoverychart.ts': 'post-anaesthetic recovery chart',
  'preanathetics.ts': 'pre-anaesthetic',
  'preoperativeprevisit.ts': 'pre-operative visit',
  'prescription.ts': 'prescription',
  'price.ts': 'price',
  'pricingmodel.ts': 'pricing model',
  'procedure.ts': 'procedure',
  'progressreport.ts': 'progress report',
  'psychiatric.ts': 'psychiatric',
  'radiology.ts': 'radiology test',
  'referrer.ts': 'referrer',
  'reports.ts': 'report',
  'roles.ts': 'role',
  'servicetype.ts': 'service type',
  'testcomponent.ts': 'test component',
  'theatre.ts': 'theatre',
  'theatreadmission.ts': 'theatre admission',
  'tubefeedingchart.ts': 'tube feeding chart',
  'users.ts': 'user', // This one should stay as is
  'vitalcharts.ts': 'vital chart',
  'vitalsignscore.ts': 'vital sign score',
  'wardmanagement.ts': 'ward'
};

function processDAOFile(filePath, entityName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip users.ts as it already has correct error messages
    if (path.basename(filePath) === 'users.ts') {
      console.log(`Skipping ${path.basename(filePath)} - already has correct user-specific errors`);
      return;
    }
    
    let changes = 0;
    const originalContent = content;
    
    // Create entity-specific error messages
    const errorReadMessage = `Failed to retrieve ${entityName} data`;
    const errorCreateMessage = `Failed to create ${entityName}`;
    const errorUpdateMessage = `Failed to update ${entityName}`;
    
    // Replace erroruserread with entity-specific read error
    const readPattern = /configuration\.error\.erroruserread/g;
    const readReplacement = `"${errorReadMessage}"`;
    const readMatches = content.match(readPattern);
    if (readMatches) {
      content = content.replace(readPattern, readReplacement);
      changes += readMatches.length;
    }
    
    // Replace errorusercreate with entity-specific create error
    const createPattern = /configuration\.error\.errorusercreate/g;
    const createReplacement = `"${errorCreateMessage}"`;
    const createMatches = content.match(createPattern);
    if (createMatches) {
      content = content.replace(createPattern, createReplacement);
      changes += createMatches.length;
    }
    
    // Replace erroruserupdate with entity-specific update error
    const updatePattern = /configuration\.error\.erroruserupdate/g;
    const updateReplacement = `"${errorUpdateMessage}"`;
    const updateMatches = content.match(updatePattern);
    if (updateMatches) {
      content = content.replace(updatePattern, updateReplacement);
      changes += updateMatches.length;
    }
    
    // Only write if changes were made
    if (changes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${path.basename(filePath)}: Fixed ${changes} error messages for "${entityName}"`);
    } else {
      console.log(`⏭️  ${path.basename(filePath)}: No user-specific errors found`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all DAO files
const daoDir = path.join(__dirname, 'src', 'dao');

console.log('🔧 Starting DAO error message fix...\n');

for (const [fileName, entityName] of Object.entries(daoEntityMap)) {
  const filePath = path.join(daoDir, fileName);
  if (fs.existsSync(filePath)) {
    processDAOFile(filePath, entityName);
  } else {
    console.log(`⚠️  ${fileName}: File not found`);
  }
}

console.log('\n✨ DAO error message fix complete!');
console.log('\nSummary:');
console.log('- All DAO files (except users.ts) have been updated with entity-specific error messages');
console.log('- Error messages now accurately reflect the entity being operated on');
console.log('- users.ts was skipped as it already has correct user-specific errors');

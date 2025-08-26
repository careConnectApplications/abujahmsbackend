const fs = require('fs');
const path = require('path');

// Define all the replacements to be made
const replacements = [
  // Fix "donot" to "does not"
  { pattern: /donot/g, replacement: 'does not' },
  { pattern: /Donot/g, replacement: 'Does not' },
  
  // Fix "doesnt" to "does not" 
  { pattern: /doesnt/g, replacement: 'does not' },
  { pattern: /Doesnt/g, replacement: 'Does not' },
  
  // Fix incorrect usage of erroralreadyexit for "does not exist" scenarios
  { pattern: /`([^`]+) donot \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`$1 does not exist`' },
  { pattern: /`([^`]+) doesnt \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`$1 does not exist`' },
  { pattern: /`([^`]+) does not \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`$1 does not exist`' },
  { pattern: /throw new Error\(`([^`]+) donot \$\{configuration\.error\.erroralreadyexit\}`\)/g, replacement: 'throw new Error(`$1 does not exist`)' },
  { pattern: /throw new Error\(`([^`]+) doesnt \$\{configuration\.error\.erroralreadyexit\}`\)/g, replacement: 'throw new Error(`$1 does not exist`)' },
  { pattern: /throw new Error\(`([^`]+) does not \$\{configuration\.error\.erroralreadyexit\}`\)/g, replacement: 'throw new Error(`$1 does not exist`)' },
  
  // Fix other specific problematic patterns
  { pattern: /`Admission donot \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Admission does not exist`' },
  { pattern: /`Patient donot \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Patient does not exist`' },
  { pattern: /`Theatre doesnt \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Theatre does not exist`' },
  { pattern: /`Specialization doesnt \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Specialization does not exist`' },
  { pattern: /`HMO doesnt \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`HMO does not exist`' },
  { pattern: /`ANC donot \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`ANC does not exist`' },
  { pattern: /`Appointment donot \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Appointment does not exist`' },
  
  // Fix combined error messages with incorrect usage
  { pattern: /`([^`]+) donot \$\{configuration\.error\.erroralreadyexit\} or has not made payment for registration`/g, replacement: '`$1 does not exist or has not made payment for registration`' },
  { pattern: /`Patient Admission to Theatre \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Patient admission to theatre already exists`' },
  
  // Fix standalone patterns for clarity
  { pattern: /`([^`]+) \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`$1 already exists`' },
  
  // Fix inconsistent "donot" in other places
  { pattern: /`([^`]+) donot \$\{configuration\.error\.errornotexist\}`/g, replacement: '`$1 does not exist`' },
  { pattern: /`This service donot exist in your service tray`/g, replacement: '`This service does not exist in your service tray`' },
  { pattern: /`([^`]+) donot exist`/g, replacement: '`$1 does not exist`' },
  
  // Fix error messages without proper grammar
  { pattern: /`Occupied bed \$\{configuration\.error\.errorgreaterthan\} Total bed`/g, replacement: '`Occupied beds cannot be greater than total beds`' },
  { pattern: /`Theatre Admission donot \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Theatre admission does not exist`' },
  { pattern: /`Theatre to be transfered donot  \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Theatre to be transferred does not exist`' },
  { pattern: /`Preoperative previsit Form \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Preoperative previsit form already exists`' },
  { pattern: /`Postanaetheticrecoverychart Form \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Post-anaesthetic recovery chart form already exists`' },
  { pattern: /`Preanathetics Form donot  \$\{configuration\.error\.erroralreadyexit\}`/g, replacement: '`Pre-anaesthetics form does not exist`' },
  
  // Fix other grammatical issues
  { pattern: /throw new Error\(`\$\{([^}]+)\} \$\{configuration\.error\.erroravailability\} or qty not defined in inventory`\)/g, replacement: 'throw new Error(`${$1} ${configuration.error.erroravailability} or quantity not defined in inventory`)' },
  
  // Fix capitalization and formatting issues
  { pattern: /`querytype \$\{configuration\.error\.errorisrequired\}`/g, replacement: '`Query type ${configuration.error.errorisrequired}`' },
];

// Function to process a single file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ pattern, replacement }) => {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

// Function to recursively process all TypeScript files in a directory
function processDirectory(dirPath) {
  let totalFixed = 0;
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'build') {
      totalFixed += processDirectory(fullPath);
    } else if (stat.isFile() && file.endsWith('.ts')) {
      if (processFile(fullPath)) {
        totalFixed++;
      }
    }
  });
  
  return totalFixed;
}

// Main execution
console.log('🔧 Starting to fix error messages in TypeScript files...\n');

const srcPath = path.join(__dirname, 'src');
const totalFixed = processDirectory(srcPath);

console.log(`\n✨ Completed! Fixed error messages in ${totalFixed} files.`);

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

// New contact information
const NEW_CONTACTS = {
  phone1: '0768860665',
  phone2: '0782914717',
  phone1Intl: '+254768860665',
  phone2Intl: '+254782914717',
  email1: 'info@emersoneims.com',
  email2: 'emersoneimservices@gmail.com'
};

// Old patterns to replace (various formats)
const OLD_PATTERNS = [
  // Old phone numbers (if any exist)
  { pattern: /\+254[\s-]?768[\s-]?860[\s-]?655/g, replacement: NEW_CONTACTS.phone1Intl },
  { pattern: /\+254[\s-]?782[\s-]?914[\s-]?717/g, replacement: NEW_CONTACTS.phone2Intl },
  { pattern: /0768[\s-]?860[\s-]?665/g, replacement: NEW_CONTACTS.phone1 },
  { pattern: /0782[\s-]?914[\s-]?717/g, replacement: NEW_CONTACTS.phone2 },

  // Ensure emails are consistent
  { pattern: /info@emersoneims\.com/g, replacement: NEW_CONTACTS.email1 },
  { pattern: /emersoneimservices@gmail\.com/g, replacement: NEW_CONTACTS.email2 },
];

// File patterns to search
const filePatterns = [
  'app/**/*.{tsx,ts,jsx,js}',
  'components/**/*.{tsx,ts,jsx,js}',
  'lib/**/*.{tsx,ts,jsx,js}',
  '*.{tsx,ts,jsx,js}',
  'public/**/*.txt',
  'public/**/.well-known/**/*'
];

let filesUpdated = 0;
let totalReplacements = 0;

console.log('🔍 Scanning for contact information...\n');

for (const pattern of filePatterns) {
  const files = globSync(pattern, {
    ignore: ['node_modules/**', '.next/**', 'dist/**', '.git/**'],
    nodir: true
  });

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      let newContent = content;
      let fileChanged = false;
      let fileReplacements = 0;

      // Apply all pattern replacements
      for (const { pattern, replacement } of OLD_PATTERNS) {
        const before = newContent;
        newContent = newContent.replace(pattern, replacement);
        if (newContent !== before) {
          fileChanged = true;
          const matches = (before.match(pattern) || []).length;
          fileReplacements += matches;
        }
      }

      if (fileChanged) {
        writeFileSync(file, newContent, 'utf8');
        filesUpdated++;
        totalReplacements += fileReplacements;
        console.log(`✅ Updated: ${file} (${fileReplacements} replacements)`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
}

console.log(`\n✨ Complete!`);
console.log(`📊 Files updated: ${filesUpdated}`);
console.log(`🔄 Total replacements: ${totalReplacements}`);
console.log(`\n📞 New contact info:`);
console.log(`   Phone 1: ${NEW_CONTACTS.phone1}`);
console.log(`   Phone 2: ${NEW_CONTACTS.phone2}`);
console.log(`   Email 1: ${NEW_CONTACTS.email1}`);
console.log(`   Email 2: ${NEW_CONTACTS.email2}`);

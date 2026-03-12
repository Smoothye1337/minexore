const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const inputPath  = path.join(__dirname, 'script.js');
const outputPath = path.join(__dirname, 'script.min.js');

const source = fs.readFileSync(inputPath, 'utf8');

const result = JavaScriptObfuscator.obfuscate(source, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
});

fs.writeFileSync(outputPath, result.getObfuscatedCode(), 'utf8');

const origSize = Buffer.byteLength(source, 'utf8');
const newSize  = Buffer.byteLength(result.getObfuscatedCode(), 'utf8');
console.log(`✅ Obfuszkálás kész!`);
console.log(`   Eredeti méret : ${(origSize / 1024).toFixed(1)} KB`);
console.log(`   Obfuszkált    : ${(newSize  / 1024).toFixed(1)} KB`);
console.log(`   Kimenet       : script.min.js`);

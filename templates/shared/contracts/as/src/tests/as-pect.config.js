// load default config from near-sdk-as
module.exports = require('near-sdk-as/imports')

// override "include", which defines the test-files' path
module.exports.include = ["./src/tests/**/*.spec.ts"];
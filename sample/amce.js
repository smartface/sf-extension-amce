const AMCE = require('sf-extension-amce');
const options = {
    'backendId': 'YOUR BACKEND ID', // Required
    'baseUrl': 'YOUR BASE URL', // Required
    'androidApplicationKey': 'YOUR ANDROID APP KEY', // Required only for analytics & events
    'iOSApplicationKey': 'YOUR IOS APP KEY', // Required only for analytics & events
    'anonymousKey': 'YOUR BASIC AUTHENTICATION ANONYMOUS KEY' // Required only to perform operations without logging in first
};
const amce = new AMCE(options);
module.exports = exports = amce;

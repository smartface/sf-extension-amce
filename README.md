# AMCE Extension from Smartface
[![Twitter: @Smartface_io](https://img.shields.io/badge/contact-@Smartface_io-blue.svg?style=flat)](https://twitter.com/smartface_io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/smartface/sf-extension-amce/blob/master/LICENSE)
![npm version](https://img.shields.io/npm/v/sf-extension-amce.svg?style=flat)

An extension to Oracle AMCE Connection with Smartface Native Framework.

## Installation
AMCE Extension can be installed via npm easily from our public npm repository. The installation is pretty easy via Smartface Cloud IDE.

- Open terminal
- `(cd ~/workspace/scripts && npm i -S sf-extension-amce)`
- Finally require the extension as: `require("sf-extension-amce")`

## How to use
1) Init your AMCE config
```javascript
const AMCE = require('sf-extension-amce');
var options = {
	'backendId': 'YOUR BACKEND ID', // Required
	'baseUrl': 'YOUR BASE URL', // Required
	'androidApplicationKey': 'YOUR ANDROID APP KEY', // Required only for analytics & events
	'iOSApplicationKey': 'YOUR IOS APP KEY', // Required only for analytics & events
	'anonymousKey': 'YOUR BASIC AUTHENTICATION ANONYMOUS KEY' // Required only to perform operations without logging in first
};
var amce = new AMCE(options);
```

2) Login to AMCE (Example)
```javascript
amce.login({
		'username': 'YOUR USER NAME',
		'password': 'YOUR PASSWORD'
	})
	.then(e => {
		alert("login succeeded");
	})
	.catch(e => {
		alert("login failed");
	});
```
3) Send Basic Analytic Event (Example)
```javascript
var options = {
	'deviceID': '112233', // Required
	'sessionID': '112233', // Required
	'eventName': 'sendBasicEvent'
};
amce.sendBasicEvent(options)
    .then(e => {
		alert("sendBasicEvent succeeded");
    })
    .catch(e => {
		alert("sendBasicEvent failed");
    });

```

## API Documentation
Full api documentation is in [api.md](./api.md)

## Need Help?
Please [submit an issue](https://github.com/msmete/sf-extension-amce/issues) on GitHub and provide information about your problem.

## Support & Documentation & Useful Links
- [Guides](https://developer.smartface.io)
- [API Docs](http://ref.smartface.io)
- [Smartface Cloud Dashboard](https://cloud.smartface.io)

## Code of Conduct
We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License
This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE) file. Within the scope of this license, all modifications to the source code, regardless of the fact that it is used commercially or not, shall be committed as a contribution back to this repository.

const AMCE = require("sf-extension-amce");
var options = {
    "backendId": "YOUR BACKEND ID", // Required
    "baseUrl": "YOUR BASE URL", // Required
    "androidApplicationKey": "YOUR ANDROID APP KEY", // Required only for analytics & events
    "iOSApplicationKey": "YOUR IOS APP KEY", // Required only for analytics & events
    "anonymousKey": "YOUR BASIC AUTHENTICATION ANONYMOUS KEY", // Required only to perform operations without logging in first
    "oAuthTokenEndpoint": "YOUR OAUTH TOKEN ENDPOINT", // Required only if OAuth to be used
    "clientId": "YOUR CLIENT ID", // Required only if OAuth to be used
    "clientSecret": "YOUR CLIENT SECRET" // Required only if OAuth to be used
};
var amce = new AMCE(options);

amce.login({
        "username": "YOUR USERNAME",
        "password": "YOUR PASSWORD"
    })
    .then(e => {
        alert("login succeeded");
    })
    .catch(e => {
        alert("login failed");
    });

amce.registerDeviceToken({
        "packageName": "io.smartface.amcetest",
        "version": "1.0.0",
    })
    .then(e => {
        alert("registerDeviceToken succeeded");
    })
    .catch(e => {
        alert("registerDeviceToken failed");
    });

amce.deregisterDeviceToken({
        "packageName": "io.smartface.amcetest",
        "version": "1.0.0",
    })
    .then(e => {
        alert("deregisterDeviceToken succeeded");
    })
    .catch(e => {
        alert("deregisterDeviceToken failed");
    });

amce.createRequestOptions()
    .then(e => {
        alert("createRequestOptions succeeded" + JSON.stringify(e));
    })
    .catch(e => {
        alert("createRequestOptions failed");
    });

amce.getItem({
        "collectionId": "collectionId",
        "itemId": "imageId"
    })
    .then(e => {
        alert("getItem succeeded" + JSON.stringify(e));
    })
    .catch(e => {
        alert("getItem failed");
    });

amce.sendAnalytic({
        "deviceId": "112233",
        "sessionId": "112233",
        "body": [{
            "name": "testEvent",
            "type": "custom",
            "timestamp": new Date().toISOString()
        }]
    })
    .then(e => {
        alert("sendAnalytic succeeded");
    })
    .catch(e => {
        alert("sendAnalytic failed");
    });

amce.sendBasicEvent("sampleEvent")
    .then(e => {
        alert("sendBasicEvent succeeded");
    })
    .catch(e => {
        alert("sendBasicEvent failed");
    });

amce.getCollectionList()
    .then(e => {
        let collectionId = e[0].id;
        return amce.getItemListInCollection(collectionId);
    })
    .then(e => {
        // e is an array
        alert("getItems succeeded");
    })
    .catch(e => {
        alert("getItems failed");
    });

amce.storeItem({
        "collectionId": "collectionId",
        "itemName": "itemName",
        "base64EncodeData": "base64EncodeData",
        "contentType": "image/png"
    })
    .then(e => {
        alert("storeItem succeeded");
    })
    .catch(e => {
        alert("storeItem failed");
    });

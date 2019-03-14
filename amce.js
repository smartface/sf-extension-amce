const Notications = require("sf-core/notifications");
const System = require('sf-core/device/system');
const Base64_Helper = require("./base64");
const Base64 = new Base64_Helper();
const privates = new WeakMap();
const Data = require('sf-core/data');
const ServiceCall = require("sf-extension-utils/lib/service-call");
const {
    init,
    OfflineRequestServiceCall,
    OfflineResponseServiceCall
} = require("sf-extension-utils/lib/service-call-offline");
const guid = require("sf-extension-utils/lib/guid");
const AMCE_VERSION = "1.0";
const amceDeviceId = Data.getStringVariable("amce-deviceId") || (function() {
    var id = guid();
    Data.setStringVariable("amce-deviceId", id);
    return id;
})();
const jwtDecode = require('jwt-decode');

require("sf-extension-utils/lib/base/timers"); // Corrects setTimeout & setInterval

/**
 * Creates new instace of AMCE
 * @class
 * @param {object} options
 * @param {string} options.baseUrl - AMCE Base URL
 * @param {string} options.backendId - AMCE Backend Id
 * @param {string} options.anonymousKey - AMCE Basic Anonymous Key
 * @param {string} options.oAuthTokenEndpoint - AMCE OAuth Token Endpoint (optional, needed if OAuth to be used)
 * @param {string} options.clientId - AMCE Client Id (optional, needed if OAuth to be used)
 * @param {string} options.clientSecret - AMCE Client Secret (optional, needed if OAuth to be used)
 * @param {string} options.androidApplicationKey - AMCE Android Client Key
 * @param {string} options.iOSApplicationKey - AMCE iOS Client Key
 * @param {boolean} [options.logEnabled=false] - AMCE http requests are being logged or not
 * @param {boolean} [options.offline=false] - Support offline data sync
 */
class AMCE {
    constructor(options) {
        var serviceCallOptions = {
            baseUrl: options.baseUrl,
            logEnabled: options.logEnabled || false,
            headers: {
                'Oracle-Mobile-API-Version': AMCE_VERSION,
                'Oracle-Mobile-Backend-ID': options.backendId,
            }
        };
        options.offline && init();
        var onlineServiceCall = !options.offline && new ServiceCall(serviceCallOptions);
        var offlineRequestServiceCall = options.offline && new OfflineRequestServiceCall(serviceCallOptions);
        var offlineResponseServiceCall = options.offline && new OfflineResponseServiceCall(serviceCallOptions);
        privates.set(this, {
            backendId: options.backendId,
            deviceToken: null,
            baseUrl: options.baseUrl,
            anonymousKey: options.anonymousKey || "",
            authorization: options.anonymousKey ? `Basic ${options.anonymousKey}` : "",
            androidApplicationKey: options.androidApplicationKey,
            iOSApplicationKey: options.iOSApplicationKey,
            oAuthTokenEndpoint: options.oAuthTokenEndpoint,
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            autoFlushEventsTimerId: null,
            eventStore: [],
            logEnabled: options.logEnabled || false,
            offline: options.offline || false,
            onlineServiceCall,
            offlineRequestServiceCall,
            offlineResponseServiceCall
        });
    }

    /**
     * Sets API authorization header value. Compared to login, this does not check
     * @method
     * @param {object} options - authorization options
     * @param {string} options.username - AMCE Username
     * @param {string} options.password - AMCE Password
     */
    setAuthorization(options) {
        privates[this].authorization = 'Basic ' + Base64.encode(options.username + ':' + options.password);
    }

    /**
     * login to AMCE
     * @see {@link https://docs.oracle.com/en/cloud/paas/mobile-autonomous-cloud/develop/authentication-omce.html#GUID-5A87EE93-E46F-4172-B622-0CF8FFC011AC Oracle Docs}
     * @method
     * @param {object} options - login options
     * @param {string} options.username - AMCE Username (optional, needed if basic authentication to be used)
     * @param {string} options.password - AMCE Password (optional, needed if basic authentication to be used)
     * @param {boolean} options.useOAuth [options.useOAuth=false]
     * @return {Promise<object>}
     * @example // Result:
     * {
     *   "id": "295e450a-63f0-41fa-be43-cd2dbcb21598",
     *   "username": "joe",
     *   "email": "joe@example.com",
     *   "firstName": "Joe",
     *   "lastName": "Doe",
     *   "links": [
     *     { "rel": "canonical", "href": "/mobile/platform/users/joe" },
     *     { "rel": "self", "href": "/mobile/platform/users/joe" }
     *   ]
     * }
     */
    login(options) {
        const p = privates.get(this);
        const { username, password, useOAuth } = options;
        const token = 'Basic ' + Base64.encode(username + ':' + password);
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        if (useOAuth)
            return this.loginWithOAuth();

        return new Promise((resolve, reject) => {
            serviceCall.request(`/mobile/platform/users/${username}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': token
                    }
                })
                .then(response => {
                    p.authorization = token;
                    response.id === null ? reject(response) : resolve(response);
                })
                .catch(reject);
        });
    }

    /**
     * Logs out authenticated user, using Anonymous Key if provided
     * @method
     */
    logout() {
        const p = privates.get(this);
        p.authorization = p.anonymousKey ? "Basic " + p.anonymousKey : "";
    }

    /**
     * Register device push notification token to AMCE
     * @method
     * @param {object} options - push notification options
     * @param {string} options.packageName - Application package name
     * @param {string} options.version - Application version
     * @return {Promise<object>}
     * @example // Result:
     * {
     *   "id": "8a8a1eff-83c3-41b4-bea8-33357962d9a7",
     *   "user": "joe",
     *   "notificationToken": "03767dea-29ac-4440-b4f6-75a755845ade",
     *   "notificationProvider": "APNS",
     *   "mobileClient": {
     *     "id": "com.oracle.myapplication",
     *     "version": "1.0",
     *     "platform": "IOS"
     *   },
     *   "modifiedOn": "2015-05-05'T'12:09:33.281'Z"
     * }
     */
    registerDeviceToken(options) {
        const p = privates.get(this);
        const { packageName, version } = options;
        const isIOS = System.OS === 'iOS';
        const amce = this;
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return new Promise((resolve, reject) => {
            Notications.registerForPushNotifications(e => {
                p.deviceToken = e.token;
                amce.notificationToken = e.token;

                this.loginWithOAuth()
                    .then(() => {
                        return serviceCall.request(`/mobile/platform/devices/register`, {
                            method: "POST",
                            body: {
                                notificationToken: p.deviceToken,
                                notificationProvider: isIOS ? 'APNS' : 'GCM',
                                mobileClient: {
                                    id: packageName,
                                    version: version,
                                    platform: isIOS ? 'IOS' : 'ANDROID'
                                }
                            },
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                                'Authorization': p.authorization
                            }
                        });
                    })
                    .then(response => {
                        response.id === null ? reject(response) : resolve(response);
                    })
                    .catch(reject);
            }, reject);
        });
    }

    /**
     * Deregister device push notification token from AMCE
     * @method
     * @param {object} options - push notification options
     * @param {string} options.packageName - Application package name
     * @return {Promise<object>}
     */
    deregisterDeviceToken(options) {
        const p = privates.get(this);
        const { packageName } = options;
        const isIOS = System.OS === 'iOS';
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        Notications.unregisterForPushNotifications();

        this.loginWithOAuth()
            .then(() => {
                return serviceCall.request(`/mobile/platform/devices/deregister`, {
                    method: "POST",
                    body: {
                        notificationToken: p.deviceToken,
                        notificationProvider: isIOS ? 'APNS' : 'GCM',
                        mobileClient: {
                            id: packageName,
                            platform: isIOS ? 'IOS' : 'ANDROID'
                        }
                    },
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': p.authorization
                    }
                });
            });
    }

    /**
     * Send Analytic Event to AMCE
     * @see {@link https://docs.oracle.com/en/cloud/paas/mobile-cloud/mcsra/op-mobile-platform-analytics-events-post.html Oracle Docs}
     * @method
     * @param {object} options - Analytic options
     * @param {string} [options.deviceId] - can override what is set by the amce lib
     * @param {string} [options.sessionId] - can override what is set by the amce lib
     * @param {object} options.body - Event json array
     * @return {Promise<AnalyticResult>}
     */
    sendAnalytic(options) {
        const p = privates.get(this);
        const { deviceId = amceDeviceId, sessionId = guid(), body } = options;
        const isIOS = System.OS === 'iOS';
        const applicationKey = isIOS ? p.iOSApplicationKey : p.androidApplicationKey;
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return new Promise((resolve, reject) => {
            this.loginWithOAuth()
                .then(() => {
                    return serviceCall.request(`/mobile/platform/analytics/events`, {
                        method: "POST",
                        body,
                        headers: {
                            'Authorization': p.authorization,
                            'Content-Type': 'application/json; charset=utf-8',
                            'Oracle-Mobile-Application-Key': applicationKey,
                            'Oracle-Mobile-Analytics-Session-ID': sessionId,
                            'Oracle-Mobile-Device-ID': deviceId,
                        }
                    });
                })
                .then(response => {
                    response.message === null ? reject(response) : resolve(response);
                })
                .catch(reject);
        });
    }

    /**
     * Send Analytic Event to AMCE
     * @method
     * @param {string} eventName - Event name
     * @return {Promise<AnalyticResult>}
     */
    sendBasicEvent(eventName) {
        const body = [{
            "name": eventName,
            "type": "custom",
            "timestamp": new Date().toISOString()
        }];
        return this.sendAnalytic({ body });
    }

    /**
     * @typedef {object} AnalyticResult
     * @property {string} message - collection id
     * @example
     * {"message": "1 events accepted for processing."}
     */

    /**
     * Stores basic events to be sent later, similar to sendBasicEvent
     * @method
     * @param {string} eventName
     */
    storeBasicEvent(eventName) {
        const p = privates.get(this);
        p.eventStore.push({
            "name": eventName,
            "type": "custom",
            "timestamp": new Date().toISOString()
        });
    }

    /**
     * Sends stored events
     * @method
     */
    flushEvents() {
        const p = privates.get(this);

        return new Promise((resolve, reject) => {
            if (p.eventStore.length > 0) {
                let eventCache = p.eventStore.slice();
                p.eventStore.length = 0;

                this.sendAnalytic({ body: eventCache })
                    .then(resolve)
                    .catch(e => {
                        Array.prototype.unshift.apply(p.eventStore, eventCache);
                        reject(e);
                    });
            }
            else {
                resolve();
            }
        });
    }

    /**
     * Starts calling flushEvents periodically
     * @method
     * @param {number} [period = 15000] in miliselcods
     */
    startAutoFlushEvents(period = 15000) {
        privates[this].autoFlushEventsTimerId = setInterval(() => {
            this.flushEvents();
        }, period);
    }

    /**
     * Stops calling flushEvents periodically
     * @method
     */
    stopAutoFlushEvents() {
        const p = privates.get(this);
        if (!p.autoFlushEventsTimerId)
            return;
        clearInterval(p.autoFlushEventsTimerId);
        p.autoFlushEventsTimerId = null;
    }

    /**
     * @prop {boolean} gets calling flushEvents periodically is active or not
     */
    get autoFlushEventsStarted() {
        return !!privates[this].autoFlushEventsTimerId;
    }

    /**
     * Get list of collections from AMCE
     * @method
     * @return {Promise<Collection[]>}
     */
    getCollectionList() {
        const p = privates.get(this);
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return new Promise((resolve, reject) => {
            this.loginWithOAuth()
                .then(() => {
                    return serviceCall.request(`/mobile/platform/storage/collections`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': p.authorization
                        }
                    });
                })
                .then(response => {
                    if (response.items == null) {
                        reject(response);
                    }
                    else {
                        var resultArr = [];
                        for (var i = 0; i < response.items.length; i++) {
                            var arrayObject = {};
                            arrayObject.id = response.items[i].id;
                            arrayObject.description = response.items[i].description;
                            resultArr.push(arrayObject);
                        }
                        resolve(resultArr);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * @typedef {object} Collection
     * @property {string} id - collection id
     * @property {string} description - collection description
     */

    /**
     * Get item list in collection from AMCE
     * @method
     * @param {string|object} options - AMCE collection id
     * @param {string} options.collectionId - AMCE collection id
     * @return {Promise<CollectionItem[]>}
     */
    getItemListInCollection(options) {
        const p = privates.get(this);
        const collectionId = options ? options.collectionId : options;
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return new Promise((resolve, reject) => {
            this.loginWithOAuth()
                .then(() => {
                    return serviceCall.request(`/mobile/platform/storage/collections/${collectionId}/objects`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Authorization': p.authorization
                        }
                    });
                })
                .then(response => {
                    response.items === null ? reject(response) : resolve(response.items);
                })
                .catch(reject);
        });
    }

    /**
     * @typedef {object} CollectionItem
     * @param {string} id - item id
     * @param {string} name - item name
     * @param {string} contentType - item contentType
     * @param {string} createdBy - item createdBy
     * @param {string} createdOn - item createdOn
     * @param {string} modifiedBy - item modifiedBy
     * @param {string} modifiedOn - item modifiedOn
     */

    /**
     * Get item data from AMCE
     * @method
     * @param {object} options - Analytic options
     * @param {string} options.collectionId - AMCE collection Id
     * @param {string} options.itemId - AMCE item Id
     * @return {Promise<object>}
     */
    getItem(options) {
        const p = privates.get(this);
        const { collectionId, itemId } = options;
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return this.loginWithOAuth()
            .then(() => {
                return serviceCall.request(`/mobile/platform/storage/collections/${collectionId}/objects/${itemId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': p.authorization
                    }
                });
            });
    }

    /**
     * Store item to AMCE
     * @method
     * @param {object} options - Analytic options
     * @param {string} options.collectionId - AMCE collection Id
     * @param {string} options.itemName - item full name
     * @param {string} options.base64EncodeData - item base64 encode data
     * @param {string} options.contentType - item content type
     * @return {Promise<object>}
     * @example // Result:
     * {
     *   "id": "947119e5-b45c-498b-a643-dca279b24f07",
     *   "name": "947119e5-b45c-498b-a643-dca279b24f07",
     *   "user": "8c8f1a5a-e56b-494b-9a99-f03d562c1ee7",
     *   "contentLength": 59,
     *   "contentType": "text/plain",
     *   "eTag": "\"1\"",
     *   "createdBy": "mobileuser",
     *   "createdOn": "2015-06-24T02:59:08Z",
     *   "modifiedBy": "mobileuser",
     *   "modifiedOn": "2015-06-24T02:59:08Z",
     *   "links": [
     *     {
     *       "rel": "canonical",
     *       "href": "/mobile/platform/storage/collections/technicianNotes/objects/947119e5-b45c-498b-a643-dca279b24f07?user=8c8f1a5a-e56b-494b-9a99-f03d562c1ee7"
     *     },
     *     {
     *       "rel": "self",
     *       "href": "/mobile/platform/storage/collections/technicianNotes/objects/947119e5-b45c-498b-a643-dca279b24f07"
     *     }
     *   ]
     * }
     */
    storeItem(options) {
        const p = privates.get(this);
        const { collectionId, itemName, base64EncodeData, contentType } = options;
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return this.loginWithOAuth()
            .then(() => {
                return serviceCall.request(`/mobile/platform/storage/collections/${collectionId}/objects`, {
                    method: "POST",
                    body: base64EncodeData,
                    headers: {
                        'Authorization': p.authorization,
                        'Oracle-Mobile-Name': itemName,
                        'Content-Type': contentType
                    }
                });
            });
    }

    /**
     * Delete item data from AMCE
     * @method
     * @param {object} options - Analytic options
     * @param {string} options.collectionId - AMCE collection Id
     * @param {string} options.itemId - AMCE item Id
     * @return {Promise<object>}
     */
    deleteItem(options) {
        const p = privates.get(this);
        const { collectionId, itemId } = options;
        const random = Math.floor(Math.random() * 100000); // Added due to the SUPDEV-470 workaround
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return this.loginWithOAuth()
            .then(() => {
                return serviceCall.request(`/mobile/platform/storage/collections/${collectionId}/objects/${itemId}?v=${random}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': p.authorization
                    }
                });
            });
    }

    /**
     * Create api request options for AMCE Custom API
     * @method
     * @param {object} options - Request options
     * @param {string} options.apiName - AMCE Api Name
     * @param {string} options.endpointPath - AMCE Endpoint path
     * @param {string} [options.version = "1.0"] - API version, by default 1.0
     * @return {Promise<RequestOptions>}
     */
    createRequestOptions(options = {}) {
        const p = privates.get(this);
        const { version = "1.0", apiName, endpointPath } = options;
        const url = `${p.baseUrl}/mobile/custom/${apiName}/${endpointPath}`;
        return new Promise((resolve, reject) => {
            this.loginWithOAuth()
                .then(() => resolve({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': p.authorization,
                        'Oracle-Mobile-API-Version': version,
                        'oracle-mobile-backend-id': p.backendId
                    }
                }))
                .catch(reject);
        });
    }

    /**
     * @typedef {object} RequestOptions
     * @property {string} url
     * @property {object} headers
     */

    /**
     * Get application policies from AMCE
     * @method
     * @return {Promise<object>}
     */
    getAppPolicies() {
        const p = privates.get(this);
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        return this.loginWithOAuth()
            .then(() => {
                return serviceCall.request(`/mobile/platform/appconfig/client`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': p.authorization
                    }
                });
            });
    }

    /**
     * Get Device Location List by Name
     * @method
     * @param {object} options
     * @param {string} options.name
     * @return {Promise<object>}
     */
    getDeviceLocationsByName(options) {
        const optionsLocal = {
            key: 'name',
            value: options.name || options,
            pathStr: 'devices',
            isQuery: true
        };
        return this.getLocationList(optionsLocal);
    }

    /**
     * Get Device Location List by Id
     * @method
     * @param {object} options
     * @param {string} options.id
     * @return {Promise<object>}
     */
    getDeviceLocationsById(options) {
        const optionsLocal = {
            key: 'name',
            value: options.id || options,
            pathStr: 'devices',
            isQuery: false
        };
        return this.getLocationList(optionsLocal);
    }

    /**
     * Get Places List by Name
     * @method
     * @param {object} options
     * @param {string} options.name
     * @return {Promise<object>}
     */
    getPlaceByName(options) {
        const optionsLocal = {
            key: 'name',
            value: options.name || options,
            pathStr: 'places',
            isQuery: true
        };
        return this.getLocationList(optionsLocal);
    }

    /**
     * Get Places List by Id,
     * @method
     * @param {object} options
     * @param {string} options.id
     * @return {Promise<object>}
     */
    getPlaceById(options) {
        const optionsLocal = {
            key: 'name',
            value: options.id || options,
            pathStr: 'places',
            isQuery: false
        };
        return this.getLocationList(optionsLocal);
    }

    /**
     * Get Asset List by Name
     * @method
     * @param {object} options
     * @param {string} options.name
     * @return {Promise<object>}
     */
    getAssetByName(options) {
        const optionsLocal = {
            key: 'name',
            value: options.name || options,
            pathStr: 'assets',
            isQuery: true
        };
        return this.getLocationList(optionsLocal);
    }

    /**
     * Get Asset List by Id
     * @method
     * @param {object} options
     * @param {string} options.id
     * @return {Promise<object>}
     *
     */
    getAssetById(options) {
        const optionsLocal = {
            key: 'name',
            value: options.id || options,
            pathStr: 'assets',
            isQuery: false
        };
        return this.getLocationList(optionsLocal);
    }

    /**
     * Get Location List Base Function
     * @method
     * @param {object} options
     * @param {string} options.key
     * @param {string} options.value
     * @param {string} options.pathStr
     * @param {string} options.isQuery
     * @return {Promise<object>}
     */
    getLocationList(options) {
        const p = privates.get(this);
        const { key, value, pathStr, isQuery } = options;
        var url = `/mobile/platform/location/${pathStr}`;
        const serviceCall = p.offline ? p.offlineResponseServiceCall : p.onlineServiceCall;

        url += isQuery ?
            '?' + key + '=' + value :
            '/' + value;

        return this.loginWithOAuth()
            .then(() => {
                return serviceCall.request(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': p.authorization,
                        key: value
                    }
                });
            });
    }

    loginWithOAuth() {
        const p = privates.get(this);
        const serviceCallOptions = {
            baseUrl: p.oAuthTokenEndpoint,
            logEnabled: p.logEnabled,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': `Basic ${Base64.encode(p.clientId + ':' + p.clientSecret)}`,
            }
        };

        // Need to create a new ServiceCall instance because base url is different
        const serviceCall = p.offline ?
            new OfflineResponseServiceCall(serviceCallOptions) :
            new ServiceCall(serviceCallOptions);

        return new Promise((resolve, reject) => {
            if (p.token) {
                let dateNow = Math.round((new Date()).getTime() / 1000) + 120; //add 2 minutes of buffer
                if (p.token.exp > dateNow)
                    return resolve();
            }
            if (!p.oAuthTokenEndpoint && p.authorization)
                return resolve();

            serviceCall.request("", {
                    method: "POST",
                    body: `grant_type=client_credentials&scope=${p.baseUrl}urn:opc:resource:consumer::all`,
                })
                .then(response => {
                    let tokenRetrieved = !!response.access_token;
                    if (tokenRetrieved) {
                        p.authorization = `Bearer ${response.access_token}`;
                        p.token = jwtDecode(response.access_token);
                        resolve(response);
                    }
                    else
                        reject(response);
                })
                .catch(reject);
        });
    }
}

module.exports = AMCE;

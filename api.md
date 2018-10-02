## Classes

<dl>
<dt><a href="#AMCE">AMCE</a></dt>
<dd><p>Creates new instace of AMCE</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AnalyticResult">AnalyticResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Collection">Collection</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#CollectionItem">CollectionItem</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="AMCE"></a>

## AMCE
Creates new instace of AMCE

**Kind**: global class  

* [AMCE](#AMCE)
    * [new AMCE(options)](#new_AMCE_new)
    * [.autoFlushEventsStarted](#AMCE+autoFlushEventsStarted)
    * [.setAuthorization(options)](#AMCE+setAuthorization)
    * [.login(options)](#AMCE+login) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.logout()](#AMCE+logout)
    * [.registerDeviceToken(options)](#AMCE+registerDeviceToken) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.deregisterDeviceToken(options)](#AMCE+deregisterDeviceToken) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.sendAnalytic(options)](#AMCE+sendAnalytic) ⇒ [<code>Promise.&lt;AnalyticResult&gt;</code>](#AnalyticResult)
    * [.sendBasicEvent(eventName)](#AMCE+sendBasicEvent) ⇒ [<code>Promise.&lt;AnalyticResult&gt;</code>](#AnalyticResult)
    * [.storeBasicEvent(eventName)](#AMCE+storeBasicEvent)
    * [.flushEvents()](#AMCE+flushEvents)
    * [.startAutoFlushEvents([period])](#AMCE+startAutoFlushEvents)
    * [.stopAutoFlushEvents()](#AMCE+stopAutoFlushEvents)
    * [.getCollectionList()](#AMCE+getCollectionList) ⇒ <code>Promise.&lt;Array.&lt;Collection&gt;&gt;</code>
    * [.getItemListInCollection(options)](#AMCE+getItemListInCollection) ⇒ <code>Promise.&lt;Array.&lt;CollectionItem&gt;&gt;</code>
    * [.getItem(options)](#AMCE+getItem) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.storeItem(options)](#AMCE+storeItem) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.deleteItem(options)](#AMCE+deleteItem) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.createRequestOptions(options)](#AMCE+createRequestOptions) ⇒ <code>object</code>
    * [.getAppPolicies()](#AMCE+getAppPolicies) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getDeviceLocationsByName(options)](#AMCE+getDeviceLocationsByName) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getDeviceLocationsById(options)](#AMCE+getDeviceLocationsById) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getPlaceByName(options)](#AMCE+getPlaceByName) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getPlaceById(options)](#AMCE+getPlaceById) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAssetByName(options)](#AMCE+getAssetByName) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAssetById(options)](#AMCE+getAssetById) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getLocationList(options)](#AMCE+getLocationList) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_AMCE_new"></a>

### new AMCE(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | init object |
| options.baseUrl | <code>string</code> | AMCE Base URL |
| options.backendId | <code>string</code> | AMCE BackendId |
| options.androidApplicationKey | <code>string</code> | AMCE Android Client Key |
| options.iOSApplicationKey | <code>string</code> | AMCE iOS Client Key |
| options.anonymousKey | <code>string</code> | AMCE Basic Anonymous Key |

<a name="AMCE+autoFlushEventsStarted"></a>

### amcE.autoFlushEventsStarted
**Kind**: instance property of [<code>AMCE</code>](#AMCE)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| gets | <code>boolean</code> | calling flushEvents periodically is active or not |

<a name="AMCE+setAuthorization"></a>

### amcE.setAuthorization(options)
Sets API authorization header value. Compared to login, this does not check

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | authorization options |
| options.username | <code>string</code> | AMCE Username |
| options.password | <code>string</code> | AMCE Password |

<a name="AMCE+login"></a>

### amcE.login(options) ⇒ <code>Promise.&lt;object&gt;</code>
login to AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | login options |
| options.username | <code>string</code> | AMCE Username |
| options.password | <code>string</code> | AMCE Password |

**Example**  
```js
// Result:
{
  "id": "295e450a-63f0-41fa-be43-cd2dbcb21598",
  "username": "joe",
  "email": "joe@example.com",
  "firstName": "Joe",
  "lastName": "Doe",
  "links": [
    { "rel": "canonical", "href": "/mobile/platform/users/joe" },
    { "rel": "self", "href": "/mobile/platform/users/joe" }
  ]
}
```
<a name="AMCE+logout"></a>

### amcE.logout()
Logs out authenticated user, using Anonymous Key if provided

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  
<a name="AMCE+registerDeviceToken"></a>

### amcE.registerDeviceToken(options) ⇒ <code>Promise.&lt;object&gt;</code>
Register device push notification token to AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | push notification options |
| options.packageName | <code>string</code> | Application package name |
| options.version | <code>string</code> | Application version |

**Example**  
```js
// Result:
{
  "id": "8a8a1eff-83c3-41b4-bea8-33357962d9a7",
  "user": "joe",
  "notificationToken": "03767dea-29ac-4440-b4f6-75a755845ade",
  "notificationProvider": "APNS",
  "mobileClient": {
    "id": "com.oracle.myapplication",
    "version": "1.0",
    "platform": "IOS"
  },
  "modifiedOn": "2015-05-05'T'12:09:33.281'Z"
}
```
<a name="AMCE+deregisterDeviceToken"></a>

### amcE.deregisterDeviceToken(options) ⇒ <code>Promise.&lt;object&gt;</code>
Deregister device push notification token from AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | push notification options |
| options.packageName | <code>string</code> | Application package name |

<a name="AMCE+sendAnalytic"></a>

### amcE.sendAnalytic(options) ⇒ [<code>Promise.&lt;AnalyticResult&gt;</code>](#AnalyticResult)
Send Analytic Event to AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  
**See**: [Oracle Docs](https://docs.oracle.com/en/cloud/paas/mobile-cloud/mcsra/op-mobile-platform-analytics-events-post.html)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Analytic options |
| [options.deviceId] | <code>string</code> | can override what is set by the amce lib |
| [options.sessionId] | <code>string</code> | can override what is set by the amce lib |
| options.body | <code>object</code> | Event json array |

<a name="AMCE+sendBasicEvent"></a>

### amcE.sendBasicEvent(eventName) ⇒ [<code>Promise.&lt;AnalyticResult&gt;</code>](#AnalyticResult)
Send Analytic Event to AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | Event name |

<a name="AMCE+storeBasicEvent"></a>

### amcE.storeBasicEvent(eventName)
Stores basic events to be sent later, similar to sendBasicEvent

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 

<a name="AMCE+flushEvents"></a>

### amcE.flushEvents()
Sends stored events

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  
<a name="AMCE+startAutoFlushEvents"></a>

### amcE.startAutoFlushEvents([period])
Starts calling flushEvents periodically

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [period] | <code>number</code> | <code>15000</code> | in miliselcods |

<a name="AMCE+stopAutoFlushEvents"></a>

### amcE.stopAutoFlushEvents()
Stops calling flushEvents periodically

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  
<a name="AMCE+getCollectionList"></a>

### amcE.getCollectionList() ⇒ <code>Promise.&lt;Array.&lt;Collection&gt;&gt;</code>
Get list of collections from AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  
<a name="AMCE+getItemListInCollection"></a>

### amcE.getItemListInCollection(options) ⇒ <code>Promise.&lt;Array.&lt;CollectionItem&gt;&gt;</code>
Get item list in collection from AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>string</code> \| <code>object</code> | AMCE collection id |
| options.collectionId | <code>string</code> | AMCE collection id |

<a name="AMCE+getItem"></a>

### amcE.getItem(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get item data from AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Analytic options |
| options.collectionId | <code>string</code> | AMCE collection Id |
| options.itemId | <code>string</code> | AMCE item Id |

<a name="AMCE+storeItem"></a>

### amcE.storeItem(options) ⇒ <code>Promise.&lt;object&gt;</code>
Store item to AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Analytic options |
| options.collectionId | <code>string</code> | AMCE collection Id |
| options.itemName | <code>string</code> | item full name |
| options.base64EncodeData | <code>string</code> | item base64 encode data |
| options.contentType | <code>string</code> | item content type |

**Example**  
```js
// Result:
{
  "id": "947119e5-b45c-498b-a643-dca279b24f07",
  "name": "947119e5-b45c-498b-a643-dca279b24f07",
  "user": "8c8f1a5a-e56b-494b-9a99-f03d562c1ee7",
  "contentLength": 59,
  "contentType": "text/plain",
  "eTag": "\"1\"",
  "createdBy": "mobileuser",
  "createdOn": "2015-06-24T02:59:08Z",
  "modifiedBy": "mobileuser",
  "modifiedOn": "2015-06-24T02:59:08Z",
  "links": [
    {
      "rel": "canonical",
      "href": "/mobile/platform/storage/collections/technicianNotes/objects/947119e5-b45c-498b-a643-dca279b24f07?user=8c8f1a5a-e56b-494b-9a99-f03d562c1ee7"
    },
    {
      "rel": "self",
      "href": "/mobile/platform/storage/collections/technicianNotes/objects/947119e5-b45c-498b-a643-dca279b24f07"
    }
  ]
}
```
<a name="AMCE+deleteItem"></a>

### amcE.deleteItem(options) ⇒ <code>Promise.&lt;object&gt;</code>
Delete item data from AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Analytic options |
| options.collectionId | <code>string</code> | AMCE collection Id |
| options.itemId | <code>string</code> | AMCE item Id |

<a name="AMCE+createRequestOptions"></a>

### amcE.createRequestOptions(options) ⇒ <code>object</code>
Create api request options for AMCE Custom API

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  
**Returns**: <code>object</code> - httpRequestOption to be used in Smartface request  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | Request options |
| options.apiName | <code>string</code> |  | AMCE Api Name |
| options.endpointPath | <code>string</code> |  | AMCE Endpoint path |
| [options.version] | <code>string</code> | <code>&quot;\&quot;1.0\&quot;&quot;</code> | API version, by default 1.0 |

<a name="AMCE+getAppPolicies"></a>

### amcE.getAppPolicies() ⇒ <code>Promise.&lt;object&gt;</code>
Get application policies from AMCE

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  
<a name="AMCE+getDeviceLocationsByName"></a>

### amcE.getDeviceLocationsByName(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get Device Location List by Name

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.name | <code>string</code> | 

<a name="AMCE+getDeviceLocationsById"></a>

### amcE.getDeviceLocationsById(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get Device Location List by Id

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.id | <code>string</code> | 

<a name="AMCE+getPlaceByName"></a>

### amcE.getPlaceByName(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get Places List by Name

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.name | <code>string</code> | 

<a name="AMCE+getPlaceById"></a>

### amcE.getPlaceById(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get Places List by Id,

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.id | <code>string</code> | 

<a name="AMCE+getAssetByName"></a>

### amcE.getAssetByName(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get Asset List by Name

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.name | <code>string</code> | 

<a name="AMCE+getAssetById"></a>

### amcE.getAssetById(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get Asset List by Id

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.id | <code>string</code> | 

<a name="AMCE+getLocationList"></a>

### amcE.getLocationList(options) ⇒ <code>Promise.&lt;object&gt;</code>
Get Location List Base Function

**Kind**: instance method of [<code>AMCE</code>](#AMCE)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.key | <code>string</code> | 
| options.value | <code>string</code> | 
| options.pathStr | <code>string</code> | 
| options.isQuery | <code>string</code> | 

<a name="AnalyticResult"></a>

## AnalyticResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | collection id |

**Example**  
```js
{"message": "1 events accepted for processing."}
```
<a name="Collection"></a>

## Collection : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | collection id |
| description | <code>string</code> | collection description |

<a name="CollectionItem"></a>

## CollectionItem : <code>object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | item id |
| name | <code>string</code> | item name |
| contentType | <code>string</code> | item contentType |
| createdBy | <code>string</code> | item createdBy |
| createdOn | <code>string</code> | item createdOn |
| modifiedBy | <code>string</code> | item modifiedBy |
| modifiedOn | <code>string</code> | item modifiedOn |


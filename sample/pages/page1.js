const extend = require("js-base/core/extend");
const Button = require('sf-core/ui/button');
const Page = require("sf-core/ui/page");
const Router = require("sf-core/ui/router");
const Color = require('sf-core/ui/color');
const FlexLayout = require('sf-core/ui/flexlayout');
const ActivityIndicator = require('sf-core/ui/activityindicator');
const System = require('sf-core/device/system');
const ServiceCall = require("sf-extension-utils/lib/service-call");

var amce = require('../amce');
var loadingView;

const Page1 = extend(Page)(
    function(_super) {
        var self = this;
        _super(self);

        loadingView = loadingViewCreator(99999);

        var btnLogin = new Button({
            text: 'Login',
            flexGrow: 1,
            onPress: amceLogin
        });
        var btnRegister = new Button({
            text: 'Register Device For Push Notification',
            flexGrow: 1,
            onPress: amceRegister
        });
        var btnDeregister = new Button({
            text: 'Deregister Device For Push Notification',
            flexGrow: 1,
            onPress: amceDeregister
        });
        var btnSendBasicEvent = new Button({
            text: 'Send Analytic - Basic Event',
            flexGrow: 1,
            onPress: amceSendBasicAnalytic
        });
        var btnSendAnalytic = new Button({
            text: 'Send Analytic',
            flexGrow: 1,
            onPress: amceSendAnalytic
        });
        var btnApiCaller = new Button({
            text: 'Api Caller (GET)',
            flexGrow: 1,
            onPress: amceCreateRequest
        });
        var btnDemoApp = new Button({
            text: 'Demo App',
            backgroundColor: Color.GREEN,
            flexGrow: 1,
            onPress: demoApp
        });

        // AMCE INIT
        this.layout.addChild(btnLogin);
        this.layout.addChild(btnRegister);
        this.layout.addChild(btnDeregister);
        this.layout.addChild(btnSendBasicEvent);
        this.layout.addChild(btnSendAnalytic);
        this.layout.addChild(btnApiCaller);
        this.layout.addChild(btnDemoApp);
        this.layout.addChild(loadingView);
    });

// Gets/sets press event callback for btn
function amceLogin() {
    loadingView.visible = true;
    amce.login({
            'username': 'YOUR USER NAME',
            'password': 'YOUR PASSWORD'
        })
        .then(e => {
            loadingView.visible = false;
            alert("login succeeded");
        })
        .catch(e => {
            loadingView.visible = false;
            alert("login failed");
        });
}

function amceSendBasicAnalytic() {
    loadingView.visible = true;
    amce.sendBasicEvent({
            'deviceId': '112233',
            'sessionId': '112233',
            'eventName': 'sendBasicEvent'
        })
        .then(e => {
            loadingView.visible = false;
            alert("sendBasicEvent succeeded");
        })
        .catch(e => {
            loadingView.visible = false;
            alert("sendBasicEvent failed");
        });
}

function amceSendAnalytic() {
    loadingView.visible = true;
    amce.sendBasicEvent({
            'deviceId': '112233',
            'sessionId': '112233',
            'body': [{
                "name": "testEvent",
                "type": "custom",
                "timestamp": new Date().toISOString()
            }]
        })
        .then(e => {
            loadingView.visible = false;
            alert("sendAnalytic succeeded");
        })
        .catch(e => {
            loadingView.visible = false;
            alert("sendAnalytic failed");
        });
}

function amceRegister() {
    loadingView.visible = true;
    amce.registerDeviceToken({
            'packageName': 'io.smartface.amcetest',
            'version': '1.0.0',
        })
        .then(e => {
            loadingView.visible = false;
            alert("registerDeviceToken succeeded");
        })
        .catch(e => {
            loadingView.visible = false;
            alert("registerDeviceToken failed");
        });
}

function amceDeregister() {
    loadingView.visible = true;
    amce.deregisterDeviceToken({
            'packageName': 'io.smartface.amcetest',
            'version': '1.0.0',
        })
        .then(e => {
            loadingView.visible = false;
            alert("deregisterDeviceToken succeeded");
        })
        .catch(e => {
            loadingView.visible = false;
            alert("deregisterDeviceToken failed");
        });
}

function amceCreateRequest() {
    loadingView.visible = true;
    var requestOptions = amce.createRequestOptions({
        'apiName': 'weather',
        'endpointName': 'getCity',
    });
    var sc = new ServiceCall({
        baseUrl: requestOptions.url,
        logEnabled: false
    });
    sc.request(`q=sanfrancisco&appid=caf032ca9a5364cb41ca768e3553d9b3`, {
            method: "GET",
            body: {},
            headers: requestOptions.headers
        })
        .then(e => {
            loadingView.visible = false;
            alert("createRequestOptions succeeded");
        })
        .catch(e => {
            loadingView.visible = false;
            alert("createRequestOptions failed");
        });
}


function demoApp() {
    Router.go('page2');
}

var loadingViewCreator = function(id) {
    var loadingLayout = new FlexLayout({
        id: id,
        backgroundColor: Color.BLACK,
        alpha: 0.5,
        visible: false,
        touchEnabled: true
    });
    loadingLayout.positionType = FlexLayout.PositionType.ABSOLUTE;
    loadingLayout.top = 0;
    loadingLayout.left = 0;
    loadingLayout.right = 0;
    loadingLayout.bottom = 0;
    var myActivityIndicator = new ActivityIndicator({
        color: Color.WHITE,
        backgroundColor: Color.TRANSPARENT,
        touchEnabled: true
    });
    if (System.OS != "Android") {
        myActivityIndicator.flexGrow = 1;
    }
    loadingLayout.addChild(myActivityIndicator);
    loadingLayout.justifyContent = FlexLayout.JustifyContent.CENTER;
    return loadingLayout;
};

module.exports = Page1;

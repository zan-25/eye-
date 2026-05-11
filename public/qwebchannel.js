/****************************************************************************
** QWebChannel Client (Stable)
****************************************************************************/
"use strict";

var QWebChannelMessageTypes = {
    signal: 1,
    propertyUpdate: 2,
    init: 3,
    idle: 4,
    debug: 5,
    reply: 6,
    error: 7,
    invokeMethod: 8,
    connectToSignal: 9,
    disconnectFromSignal: 10,
    setProperty: 11,
    response: 12
};

var QWebChannel = function(transport, initCallback)
{
    if (typeof transport !== "object" || typeof transport.send !== "function") {
        console.error("The QWebChannel transport object is invalid!");
        return;
    }

    var channel = this;
    this.transport = transport;

    this.send = function(data)
    {
        if (typeof data !== "string") {
            data = JSON.stringify(data);
        }
        channel.transport.send(data);
    };

    this.transport.onmessage = function(message)
    {
        var data = message.data;
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        switch (data.type) {
            case QWebChannelMessageTypes.signal:
                channel.handleSignal(data);
                break;
            case QWebChannelMessageTypes.response:
                channel.handleResponse(data);
                break;
            case QWebChannelMessageTypes.propertyUpdate:
                channel.handlePropertyUpdate(data);
                break;
            case QWebChannelMessageTypes.error:
                console.error("An error occurred in the WebChannel: " + data.error);
                break;
        }
    };

    this.execCallbacks = {};
    this.execId = 0;
    this.exec = function(data, callback)
    {
        if (!callback) {
            channel.send(data);
            return;
        }
        var id = channel.execId++;
        channel.execCallbacks[id] = callback;
        data.id = id;
        channel.send(data);
    };

    this.objects = {};

    this.handleSignal = function(data)
    {
        var object = channel.objects[data.object];
        if (object) {
            object.signalEmitted(data.signal, data.args);
        }
    };

    this.handleResponse = function(data)
    {
        var callback = channel.execCallbacks[data.id];
        if (callback) {
            delete channel.execCallbacks[data.id];
            callback(data.res);
        }
    };

    this.handlePropertyUpdate = function(data)
    {
        for (var i in data.signals) {
            var signal = data.signals[i];
            var object = channel.objects[signal[0]];
            if (object) {
                object.propertyUpdate(signal[1], signal[2]);
            }
        }
    };

    this.debug = function(message)
    {
        channel.send({type: QWebChannelMessageTypes.debug, data: message});
    };

    this.exec({type: QWebChannelMessageTypes.init}, function(data) {
        for (var objectName in data) {
            var objectInfo = data[objectName];
            var object = new QObject(objectName, objectInfo, channel);
        }
        if (initCallback) initCallback(channel);
    });
};

function QObject(name, data, webChannel)
{
    this.__id__ = name;
    webChannel.objects[name] = this;

    var self = this;

    this.propertyUpdate = function(propertyName, propertyValue)
    {
        self[propertyName] = propertyValue;
        var signalName = propertyName + "Changed";
        if (self[signalName]) {
            self[signalName].emit(propertyValue);
        }
    };

    this.signalEmitted = function(signalName, args)
    {
        if (self[signalName]) {
            self[signalName].emit.apply(self[signalName], args);
        }
    };

    for (var i = 0; i < data.methods.length; ++i) {
        var methodName = data.methods[i][0];
        this[methodName] = (function(methodName) {
            return function() {
                var args = [];
                var callback;
                for (var j = 0; j < arguments.length; ++j) {
                    if (typeof arguments[j] === "function") {
                        callback = arguments[j];
                    } else {
                        args.push(arguments[j]);
                    }
                }
                webChannel.exec({
                    type: QWebChannelMessageTypes.invokeMethod,
                    object: self.__id__,
                    method: methodName,
                    args: args
                }, callback);
            };
        })(methodName);
    }
}

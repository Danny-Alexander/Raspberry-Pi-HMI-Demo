const os = require('os');
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const globalFile = './globals.json';

var http = require('http');
var express = require('express');
var RED = require('node-red');
var path = require('path');
var fs = require('fs');
var redGlobals = {};


// Get or Create Globals
try {
    var contents = fs.readFileSync(globalFile, 'utf8');
    redGlobals = JSON.parse(contents);
} catch (e) {
    var date = new Date();
    console.info(date.getDay() + " " + monthNames[date.getMonth()] + " " + date.getHours()+":"+date.getMinutes() +":"+date.getSeconds() + " - [info] Creating new globals file");
    redGlobals = {
		// Initialise global variables here.
    };
    fs.writeFile(globalFile,JSON.stringify(redGlobals));
}

// Add platform to globals
redGlobals.platform = os.platform();
redGlobals.globalFile = globalFile;
redGlobals.fs = require('fs');
redGlobals.pixelWidth = require('string-pixel-width');
redGlobals.dateFormat = require('dateformat');
redGlobals.pad = function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

redGlobals.qrEncoder = require('qr-encoder');
redGlobals.calcBatchId = function(tenantId, deviceNumber, startTimeDate, plcBatchNumber){
	return redGlobals.pad(tenantId, 4) + redGlobals.pad(deviceNumber, 7) + redGlobals.pad(startTimeDate, 23) + redGlobals.pad(plcBatchNumber, 5);
};

// Create an Express app
var app = express();

// Get current root folder
global.appRoot = path.resolve(__dirname);

// Add a simple route for static content served from 'public'
//app.use('/public', express.static('www'));
app.use(express.static('public'));

// Create a serer
var server = http.createServer(app);

// Create a settings object - see default settings.js file for other options
var settings = {
    flowFilePretty: true,
    httpAdminRoot:"/red",
    httpNodeRoot: "/",
    userDir:".nodered/",
    flowFile: appRoot + '/flows.json',
    functionGlobalContext: redGlobals//,
};

RED.init(server, settings);
// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);
// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);
server.listen(8000);
// Start the runtime
RED.start();

module.exports = app;

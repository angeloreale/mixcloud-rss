/*!
* MixCloud RSS Converter
*
* @package    MixCloudRSS
* @subpackage app
* @copyright  Copyright (c) 2012 Andrew Weeks http://meloncholy.com
* @license    MIT licence. See http://meloncholy.com/licence for details.
* @version    0.1.1
*/

var bodyParser = require('body-parser');
var methodOverride = require('method-override')

"use strict";

var config = require("konphyg")(__dirname + "/config/");
// There must be a better way to do this.
global.appPath = __dirname;
global.mcSettings = { app: config("app") };
if (global.mcSettings.app.url.substr(-1) != "/") global.mcSettings.app.url += "/";

var express = require('express');
var app = express();

var routes = {};
routes.site = require("./routes/site");
routes.feed = require("./routes/feed");


app.set("env", global.mcSettings.mode);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(bodyParser.json());
app.use(methodOverride());
// Put static before router to check for real files first, a la .htaccess
app.use(express.static(__dirname + "/public"));


if (process.env.NODE_ENV === "development") {
	app.use(express.logger());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}


if (process.env.NODE_ENV === "development") {
	app.use(express.errorHandler());
}


// Routes
// Make sure you have a favicon or this will request user favicon.ico from MixCloud
app.get("/:user/test", routes.feed.test);
app.get("/:user", routes.feed.index);
app.get("/", routes.site.index);

app.listen(config("app").localPort);
console.log("We're up on port %d in %s mode.", config("app").localPort, app.get('env'));

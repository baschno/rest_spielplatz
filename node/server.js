var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var index = require("./routes/index");
var user_info = require("./routes/user");
var health_info = require("./routes/health");


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working
router.get('/', function(req, res) {
    console.log('Here I am...');
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', index);
app.use('/user', user_info);
app.use('/health', health_info);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var port = 3000;

var color               = 255;
var brightness          = 100;
var pattern             = "static";
var mode_brightness     = 55;
var mode_start_time     = "hh:mm";
var mode_end_time       = "hh:mm";

var router = express();

var inputs = [{ pin: '11', gpio: '17', value: 1 },
              { pin: '12', gpio: '18', value: 0 }];
 
  router.use(express['static'](__dirname ));
  router.use(bodyParser.json());

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",				// Not ready yet
  user: "yourusername",				// Not ready yet
  password: "yourpassword",			// Not ready yet
  database: "mydb"					// Not ready yet
});

var RED_PIN = 17;
var GREEN_PIN = 27;
var BLUE_PIN = 22;

//include pigpio to interact with the GPIO
var Gpio = require('pigpio').Gpio,
//use GPIO pin 4 as output for RED
ledRed = new Gpio(RED_PIN, {mode: Gpio.OUTPUT}), 
//use GPIO pin 17 as output for GREEN
ledGreen = new Gpio(GREEN_PIN, {mode: Gpio.OUTPUT}), 
//use GPIO pin 27 as output for BLUE
ledBlue = new Gpio(BLUE_PIN, {mode: Gpio.OUTPUT})

/*
*Get request to get the status of the LED strip.
*
*/
router.get('/status', function (req, res) {
      res.writeHead(200, { "Content-Type": "application/json" });
      var json = JSON.stringify({
          "color" : color,
          "brightness": brightness,
          "pattern": pattern,
          "mode_brightness": mode_brightness,
          "mode_start_time": mode_start_time,
          "mode_end_time" : mode_end_time
      });
      res.end(json);
}); 

router.post('/color', function(req, res) {
    var color = req.body.color;
    console.log(color);
    res.status(204).send();
	SetColor(color);
});

router.post('/brightness', function (req, res) {
    var brightness = req.body.brightness;
    console.log(brightness);
    res.status(204).send();
	SetBrightness(brightness);
});

router.post('/brightness/mode', function (req, res) {
    var mode_brightness = req.body.mode_brightness;
    console.log(mode_brightness);
    res.status(204).send();
	SetModeBrightness(mode_brightness);
});

router.post('/mode/time', function (req, res) {
    var mode_start_time = req.body.mode_start_time;
    var mode_end_time = req.body.mode_end_time;
    console.log(mode_start_time);
    console.log(mode_end_time);
    res.status(204).send();
	SetModeTime(mode_start_time, mode_end_time);
});

// Express route for any other unrecognised incoming requests
router.get('*', function (req, res) {
    console.log("The resource you are trying to send a GET request to does not exist or does not accept the request method.");
    res.status(404).send('The resource you are trying to send a GET request to does not exist or does not accept the request method.');
});

router.post('*', function (req, res) {
    console.log("The resource you are trying to send a POST request to does not exist or does not accept the request method.");
    res.status(404).send('The resource you are trying to send a POST request to does not exist or does not accept the request method.');
});

router.put('*', function (req, res) {
    console.log("The resource you are trying to send a PUT request to does not exist or does not accept the request method.");
    res.status(404).send('The resource you are trying to send a PUT request to does not exist or does not accept the request method.');
});

router.patch('*', function (req, res) {
    console.log("The resource you are trying to send a PATCH request to does not exist or does not accept the request method.");
    res.status(404).send('The resource you are trying to send a PATCH request to does not exist or does not accept the request method.');
});

router.delete('*', function (req, res) {
    console.log("The resource you are trying to send a DELETE request to does not exist or does not accept the request method.");
    res.status(404).send('The resource you are trying to send a DELETE request to does not exist or does not accept the request method.');
});

router.copy('*', function (req, res) {
    console.log("The resource you are trying to send a COPY request to does not exist or does not accept the request method.");
    res.status(404).send('The resource you are trying to send a COPY request to does not exist or does not accept the request method.');
});

// Express route to handle errors
router.use(function(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send('Oops, Something went wrong!');
    } else {
        next(err);
    }
});

function SetCurrentColor() {
	//Get the HEX value
	var colorValue = hexToRgb();

	//for common cathode RGB LED 0 is fully off, and 255 is fully on
	var redRGB = colorValue.r;
	var greenRGB = colorValue.g;
    var blueRGB = colorValue.b;

	//set RED LED to specified value
	ledRed.pwmWrite(redRGB);
	//set GREEN LED to specified value
	ledGreen.pwmWrite(greenRGB);
	//set BLUE LED to specified value
	ledBlue.pwmWrite(blueRGB);
};

// Function for converting hex color values to RGB values
function hexToRgb() {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function SetColor(hex){
	var sql = 'UPDATE values SET color = ' + hex;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED HEX: ' + hex);
	});
	this.color = hex;
	SetCurrentColor();
}

function SetBrightness(brightness){
	var sql = 'UPDATE values SET brightness = ' + brightness;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED brightness: ' + brightness);
	});
	this.brightness = brightness;
}

function SetPattern(pattern){
	var sql = 'UPDATE values SET pattern = ' + pattern;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED pattern: ' + pattern);
	});
	this.pattern = pattern;
}

function SetModeTime(mode_start_time, mode_end_time){
	var sql = 'UPDATE values SET startTime = ' + mode_start_time + ', endTime = ' + mode_end_time;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED mode_start_time: ' + mode_start_time);
		console.log('UPDATED mode_end_time: ' + mode_end_time);
	});
	this.mode_start_time = mode_start_time;
	this.mode_end_time = mode_end_time;
}

function SetModeBrightness(mode_brightness){
	var sql = 'UPDATE values SET brightness = ' + mode_brightness;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('Updated mode_brightness: ' + mode_brightness);
	});
	this.mode_brightness = mode_brightness;
}

function CheckAlternativeMode(){
	var date = new Date();
	var current_hour = date.getHours();
	var current_minute = date.getMinutes();
	var current_minutes = ((current_hour * 60) + current_minute);
	var mode_start_minutes = ((parseInt(mode_start_time.substring(0,2)) * 60) + parseInt(mode_start_time.substring(3,5)));
	var mode_end_minutes = ((parseInt(mode_end_time.substring(0,2)) * 60) + parseInt(mode_end_time.substring(3,5)));
	if(current_minutes >= mode_start_minutes){
		// Set the mode_brightness to the pins
	}else if(current_minutes >= mode_end_minutes){
		// Set the brightness to the pins
	}
}

// Connects to the database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//Finally, start the server application, listening on the given port:
router.listen(port);
console.log('Server running at port' + port);
console.log('Server version 0.0.02');

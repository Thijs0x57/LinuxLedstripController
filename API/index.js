var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var port = 3000;

var color               = 255;
var brightness          = 255;
var pattern             = "static";
var mode_brightness     = 255;
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
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function SetColor(hex){
	var sql = 'UPDATE currentState SET color = ' + hex;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED HEX: ' + hex);
		this.color = hex;
	});
}

function SetBrightness(brightness){
	var sql = 'UPDATE currentState SET brightness = ' + brightness;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED brightness: ' + brightness);
		this.brightness = brightness;
	});
}

function SetPattern(pattern){
	var sql = 'UPDATE currentState SET pattern = ' + pattern;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED pattern: ' + pattern);
		this.pattern = pattern;
	});
}

function SetModeTime(mode_start_time, mode_end_time){
	var sql = 'UPDATE alternativeMode SET startTime = ' + mode_start_time + ', endTime = ' + mode_end_time;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('UPDATED mode_start_time: ' + mode_start_time);
		console.log('UPDATED mode_end_time: ' + mode_end_time);
		this.mode_start_time = mode_start_time;
		this.mode_end_time = mode_end_time;
	});
}

function SetModeBrightness(mode_brightness){
	var sql = 'UPDATE alternativeMode SET brightness = ' + mode_brightness;
	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log('Updated mode_brightness: ' + mode_brightness);
		this.mode_brightness = mode_brightness;
	});
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

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


/*
*Get request to get the status of the LED strip.
*
*/
router.get('/status', function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    console.log("GET status");
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

router.get('/patterns', function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    console.log("GET patterns");
    var json = JSON.stringify({
        "patterns": [
            { "name": "static", "display_name": "Static" },
            { "name": "static_wave", "display_name": "Static rainbow" },
            { "name": "moving_wave", "display_name": "Moving rainbow" }
        ]
    });
    res.end(json);
});

router.post('/color', function(req, res) {
    var color = req.body.color;
    console.log(color);
    res.status(204).send();
});

router.post('/brightness', function (req, res) {
    var brightness = req.body.brightness;
    console.log(brightness);
    res.status(204).send();
});

router.post('/brightness/mode', function (req, res) {
    var mode_brightness = req.body.mode_brightness;
    console.log(mode_brightness);
    res.status(204).send();
});

router.post('/mode/time', function (req, res) {
    var mode_start_time = req.body.mode_start_time;
    var mode_end_time = req.body.mode_end_time;
    console.log(mode_start_time);
    console.log(mode_end_time);
    res.status(204).send();
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

//Finally, start the server application, listening on the given port:
router.listen(port);
console.log('Server running at port' + port);
console.log('Server version 0.0.02');

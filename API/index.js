var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var port = 3000;

var color               = 255;
var brightness          = 255;
var pattern             = "static";
var mode_brightness     = 255;
var mode_start_time     = "YYYY-MM-DDThh:mm:ss";
var mode_end_time       = "YYYY-MM-DDThh:mm:ss";

var router = express();

var inputs = [{ pin: '11', gpio: '17', value: 1 },
              { pin: '12', gpio: '18', value: 0 }];
 
  router.use(express['static'](__dirname ));
  router.use(bodyParser.json());


/*
*Get request to get the status of the LED strip.
*
*/
router.get('/status', function(req, res) {
    res.body.color = color;
    res.body.brightness = brightness;
    res.body.pattern = pattern;
    res.body.mode_brightness = mode_brightness;
    res.body.mode_start_time = mode_start_time;
    res.body.mode_end_time = mode_end_time;
}); 

router.post('/name', function(req, res) {
    var name = req.body.name;
    console.log(name);
    res.status(200).send(name);
});

// Express route for any other unrecognised incoming requests
router.get('*', function(req, res) {
    res.status(404).send('Unrecognised API call');
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

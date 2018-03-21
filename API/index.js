var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var port = 3000;

var router = express();

var inputs = [{ pin: '11', gpio: '17', value: 1 },
              { pin: '12', gpio: '18', value: 0 }];
 
  router.use(express['static'](__dirname ));
  router.use(bodyParser.json());


// Express route for incoming requests for a customer name
router.get('/inputs/:id', function(req, res) {
  res.status(200).send(inputs[req.params.id]);
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

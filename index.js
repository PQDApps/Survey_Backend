var express = require('express');
var app = require('express')();
var router = express.Router();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
//var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/game.html');
});

////////////////////////////
// Mongo Database Testing //
////////////////////////////
//var mongoURL = "mongodb://user:user@ds025792.mlab.com:25792/survey_info";
var mongoURL = "mongodb://localhost:27017/local";
MongoClient.connect(mongoURL, function(err, db) {
    console.log(err);
    if(!err) {
        console.log("Connected to Mongo Local");
    }
});

// API Example: localhost:5000/api
router.get('/', function(req, res) {
    res.json({ message: 'Yup Yup! welcome to our api!' });   
});

// Stuff
router.get('/login', function(req, res){
  res.status(200).send({message : "HELLO"})
})

//Sign up API, userName and password
router.post('/signupnow', function(req,res){
  var user = req.body.userName;
  var pass = req.body.password;
  MongoClient.connect(mongoURL, function(err, db) {
    if (!err) {
      var users = db.collection("users");
      users.findOne({"email" : user}, function(err, usersItem){
        if (err) {
          console.log("Mongo error: " + err);
        }
        if (!usersItem) {
          console.log("User not found, creating new user");
          users.insert({email: user, password: pass}, function createUser (err, result){
            if (err) {
              res.status(500).send({Success: false, error: err});           
            }        
            console.log(result);
            res.status(200).send({Status: 'Success'});                 
          });
        } else {
          res.status(409).send({Message: "User already exists"});
          console.log("USER EXISTS");
        }
      })
     }
  })
  
router.post('/saveinfo', function(req,res){
  var user = req.body.user;
  var eligibility = req.body.eligibility;
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var suffix = req.body.suffix;
  var birthday = req.body.birthday;
  var identification = req.body.identification;
  var street = req.body.street;
  var city = req.body.city;
  var state = req.body.state;
  var zipcode = req.body.zipcode;
  var party = req.body.party;
  MongoClient.connect(mongoURL, function(err, db) {
    if (err) {
      res.status(500).send({Success: false, error: err});
    }
    if (!err) {
      var users = db.collection("users");
      users.findAndModify(
            {email: user}, //query
            [['_id', 'asc']], //sort order 
            {$set: {              
              eligibility : eligibility,
              firstName :firstName,
              middleName:middleName,
              lastName : lastName,
              suffix : suffix,
              birthday : birthday,
              identification : identification,
              street : street,
              city : city,
              state : state,
              zipcode : zipcode,
              party : party,
            }}, // replacement
            {}, // options
            function userUpdated (err, result){
              if (err) {
                res.status(500).send({Success: false, error: err});           
              }        
              console.log(result);
              res.status(200).send({Status: 'Success'});                 
          });
        } else {
          res.status(404).send({Message: "User not found"});
          console.log("USER EXISTS");
        }
      })
   })
})

// Register our api urls with /api
app.use('/api', router);

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});
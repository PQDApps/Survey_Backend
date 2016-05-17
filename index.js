var express = require('express');
var app = require('express')();
var router = express.Router();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
//var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/game.html');
});

////////////////////////////
// Mongo Database Testing //
////////////////////////////
var mongoURL = "mongodb://localhost:27017/local";
MongoClient.connect(mongoURL, function(err, db) {
    if(!err) {
        console.log("Connected to Mongo Local");
    }
});

function saveNewUser(user, pass) {  
  MongoClient.connect(mongoURL, function(err, db) {
  if (!err) {
    var users = db.collection("users")
    users.insert({email: user, password: pass}, function(err, result){
        if (err) {
          return err; 
        }        
        console.log(result);
        return this.result;          
      });
    } 
  })   
}

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
  console.log(req);
  //res.json({message: req.body});
  var user = req.body.userName;
  var pass = req.body.password;
  var userExists = false;
  //var resultOfInsert = saveNewUser(user, pass);
  MongoClient.connect(mongoURL, function(err, db) {
  if (!err) {
    var users = db.collection("users");
    var cursor = db.collection('users').findOne({ "email" : user});
    cursor.each(function(err, doc){
      assert.equal(err, null);
      if (doc != null) {
        userExists = true;               
      }  
    });
    users.insert({email: user, password: pass}, function createUser (err, result){
        if (err) {
          res.json({Success: false, error: err})           
        }        
        console.log(result);
        res.json({Status: 'Success'});
        //res.sendStatus(200);                  
      });
    }
  })
  //res.json({Status: true});
  //res.sendStatus(200); 
})

// Register our api urls with /api
app.use('/api', router);

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});
var express = require('express'); //loads express module
var app = express(); //to build an app
var load = require('express-load'); //helps with the mvc structure
var server = require('http').createServer(app); //create a server using express app

/*
 * database configs (mongoose lib for mongoDB)
 */
var Mongoose = require('Mongoose');
var db = Mongoose.connection;
db.on('error', function(){
	console.log('MongoDB: Vaso? que v...'); //if something goes wrong with database
});
db.on('error', console.error); //shows databases errors
db.once('open', function() { //database conection is OK!
  console.log('MongoDB: Não vou cair nessa de novo, Oráculo!');
});
// defines what database to connect
Mongoose.connect('mongodb://localhost/test');

/*
 * Sets main configs for express library
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.cookieParser('educase'));
app.use(express.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(__dirname, 'public'));
app.use(function(req, res, next) {
res.status(404);
res.render('404');
});

/*
 * loads the mvc structure
 */
load('models')
.then('controllers')
.then('routes')
.into(app);

/*
 * starts the application server
 */
server.listen(3000, function(){
  console.log("NodeJS: Bem vindo, Neo. Não se preocupe com o vaso.");
});
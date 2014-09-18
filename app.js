var express = require('express'); // loads express module
var app = express();
var load = require('express-load');
var server = require('http').createServer(app); // create a server using express app
var Mongoose = require('Mongoose');

var db = Mongoose.connection;

var erroMongo = function(){
	console.log('MongoDB: Vaso? que va...');
}

db.on('error', erroMongo);
db.on('error', console.error);
db.once('open', function() {
  console.log('MongoDB: Não vou cair nessa de novo, Oráculo!');
});

Mongoose.connect('mongodb://localhost/test');




/**
 * Sets main configs for express
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

/**
 * Rota principal
 */
//app.get("/", function(req, res){
//  res.render('index');
//});

load('models')
.then('controllers')
.then('routes')
.into(app);
server.listen(3000, function(){
  console.log("NodeJS: Bem vindo, Neo. Não se preocupe com o vaso.");
});
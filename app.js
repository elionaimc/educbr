var express = require('express'); // carrega módulo express
var app = express(); // para montar uma app
var load = require('express-load'); // facilita a estrutura mvc
var server = require('http').createServer(app); // cria um servidor de aplicação express

/*
 * configurações do banco de dados (biblioteca mongoose para mongoDB)
 */
var Mongoose = require('Mongoose');
var db = Mongoose.connection;
db.on('error', function(){
	console.log('MongoDB: Vaso? que v...'); // se alguma coisa der errado
});
db.on('error', console.error); // mostra os erros da base de dados
db.once('open', function() { // conexão com mongoDB está OK!
  console.log('MongoDB: Não vou cair nessa de novo, Oráculo!');
});
// define em qual base de dados conectar
Mongoose.connect('mongodb://localhost/test');

/*
 * Define as principais configurações para a biblioteca express
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
 * carrega a estrutura mvc
 */
load('models')
.then('controllers')
.then('routes')
.into(app);

/*
 * inicia o servidor de aplicação
 */
server.listen(3000, function(){
  console.log("NodeJS: Bem vindo, Neo. Não se preocupe com o vaso.");
});
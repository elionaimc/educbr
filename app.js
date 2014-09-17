var express = require('express'); // loads express module
var app = express();
var server = require('http').createServer(app); // create a server using express app

/**
 * Sets main configs for express
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname, 'public'));

/**
 * Rota principal
 */
app.get("/", function(req, res){
  res.render('index');
});

server.listen(3000, function(){
  console.log("Yeah! Science...");
});
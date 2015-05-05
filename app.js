

var express = require('express'); 
var routes = require('./routes'); 
var path = require('path');

var mongoose = require('mongoose'); 
var passport = require('passport'); 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

require('./models/user');
require('./authPassport')(passport);

mongoose.connect('mongodb://localhost:27017/passport-example', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

var app = express();

app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('add a sign here'));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'xyz-qwrty' }));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(express.Router());


if ('development' == app.get('env')) {
  app.use(errorHandler());
}


app.get('/', routes.index);

/* Passport Routes */
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }
));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', failureRedirect: '/login' }
));

//============  end passport routes
app.get('/api/test', function(req, res) {
	console.log('api/test session: ', req.session, 'request user: ', req.user);
	res.send('api/test get received');
})

app.listen(app.get('port'), function(){
  console.log('Aplicación Express escuchando en el puerto ' + app.get('port'));
});

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('db/content'),
    app = express();

var form = require('express-form'),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler');

app.set('port', process.env.PORT || 9250);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.post('/',
  form(
    form.field('name').trim().required(),
    form.field('surname').trim().required(),
    form.field('email').trim().toLower().required().isEmail()
  ),
  routes.saveUser
);

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

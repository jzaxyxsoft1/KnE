/**
 * Module dependencies.
 */
var DB = require('DB').DB;
var Svc = require('Svc');
var cookie = require('Svc').HttpHelper.Cookie;
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('keyboard cat'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
var fs = require('fs');
var files = fs.readdirSync('./controller');
var _s = '', controllers = {};
app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/sysadmin', routes.sysadmin);
app.get('/mm', routes.mm);
app.post('/postsa', routes.postsa);
app.post('/index/postl', routes.postl);
app.get('/main', routes.main);
function checkUser(req, res, next) {
    req.currentUser = cookie.get(req, cookie.defaultUserCookieName);
    res.charset = 'utf-8';
    if (req.currentUser) {next();}
    else {
        res.redirect('/');
        res.end();
    }
};
app.post('/file/pos', require('./controller/file.js').pos);
app.post('/file/ckpost', require('./controller/file.js').ckpost);
files.forEach(function (f) {
    _s = f.replace(/\.js/, '');
    controllers[_s] = require('./controller/' + f);
    if (_s != 'file') {
        for (var ex  in controllers[_s]) {
            if (ex.indexOf('post') > -1) {
                app.post('/' + _s + '/' + ex, checkUser, controllers[_s][ex]);
            }
            else {
                app.get('/' + _s + '/' + ex, checkUser, controllers[_s][ex]);
            }
        }
    }
});
Svc.init(function (e) {
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
});


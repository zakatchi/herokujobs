var mysql = require('mysql2/promise');
var dotenv = require('dotenv');
dotenv.config();

//database
var myDatabase = require('./controllers/sqlDatabase');
var sequelizeInstance = myDatabase.sequelizeInstance;

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var SQLiteStore = require('connect-sqlite3')(session);

var GoogleStrategy = require('passport-google-oidc');
var db = require('./db');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var express = require('express');
var app = express();
var path = require('path');

app.locals.pluralize = require('pluralize');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// var sequelizeSessionStore = new SessionStore({
//     db: myDatabase.sequelizeInstance,
// });


var Bids = require('./models/bid');
var Jobs = require('./models/jobs');

app.set('views', path.resolve(__dirname, 'views/pages'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use("/joblist/job", express.static(path.join(__dirname, "public")));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
  }));



// app.get('/', (req,res) => {
//     res.render('index', req.user);
// });

// app.use(passport.authenticate('session'));
// app.use('/', indexRouter);
// app.use('/', authRouter);



app.use(passport.authenticate('session'));
app.get('/', function(req, res, next) {
  if (!req.user) { return res.render('adminAlert'); }
  next();
}, function(req, res, next) {
  res.locals.filter = null;
  res.render('index', { user: req.user });
});

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    issuer,
    profile.id
  ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) {
      db.run('INSERT INTO users (name) VALUES (?)', [
        profile.displayName
      ], function(err) {
        if (err) { return cb(err); }

        var id = this.lastID;
        db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
          id,
          issuer,
          profile.id
        ], function(err) {
          if (err) { return cb(err); }
          var user = {
            id: id,
            name: profile.displayName
          };
          return cb(null, user);
        });
      });
    } else {
      db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false); }
        return cb(null, row);
      });
    }
  });
}));


passport.serializeUser(function(user, cb) {
process.nextTick(function() {
  cb(null, { id: user.id, username: user.username, name: user.name });
});
});

passport.deserializeUser(function(user, cb) {
process.nextTick(function() {
  return cb(null, user);
});
});

app.get('/login/federated/google', passport.authenticate('google'));

app.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});




// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
//   });
  
  // error handler
  // app.use(function(err, req, res, next) {
  //   // set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  //   // render the error page
  //   res.status(err.status || 500);
  //   res.render('error');
  // });


var jobbing = require('./routes/jobbing');
app.use("/jobList", jobbing);


// app.get('/jobList', (req,res) => {
//     res.render('jobList');
// });


app.listen(3000);

module.exports = app;
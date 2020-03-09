const express = require('express')
const passport = require('passport')
const util = require('util')
const EveOnlineSsoStrategy = require('passport-eveonline-sso').Strategy
const admin = require("firebase-admin")

var serviceAccount = require("./eve-mail-sender-firebase-adminsdk-8gf0j-2081d7dec4.json")


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eve-mail-sender.firebaseio.com"
});

//firebase store
var db = admin.database()
var ref = db.ref("key")

passport.serializeUser(function(user, done) {
  done(null, user)
});

passport.deserializeUser(function(obj, done) {
  done(null, obj)
});

passport.use(new EveOnlineSsoStrategy({
    clientID: 'f6686d90484e414fb2ba5060781c94cd',
    clientSecret: 'GyA81sTLv6TCwPg30ll6W98cXUr5XVPueS6yyhFZ',
    callbackURL: 'http://54.169.114.12:7000/auth/eveonline/callback',
    scope: 'esi-mail.send_mail.v1'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's EVE Online Character profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the EVE Online Character with a user record in your database,
      // and return that user instead.

      // You could save the tokens to a database and/or call EVE Swaggger Interface (ESI) resources.
      // If you desire to use ESI, be sure to configure your application at https://developers.eveonline.com/applications)
      // and specify your scopes with EVEONLINE_SSO_SCOPES

      // The refreshToken will only be set if you are using scopes

      let postsRef = ref.child('eveonline')
      let newPostRef = postsRef.push()
      newPostRef.set({
      	accessToken : accessToken,
      	refreshToken : refreshToken,
      	CharacterID : profile.CharacterID,
      	CharacterName : profile.CharacterName,
      })


      console.log('=== New Login ===')
      console.log('accessToken:', accessToken)
      console.log('refreshToken:', refreshToken)
      //console.log('profile:', profile)
      console.log(profile.CharacterID)
      console.log(profile.CharacterName)
      console.log(profile.ExpiresOn)

      return done(null, profile)
    })
  }
))

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }

  res.redirect('/login')
}

// Configure Express

// Create a new Express application.
var app = express()
app.set('port', process.env.PORT || 7000)


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

app.get('/profile', ensureAuthenticated, function(req, res) {
  res.render('profile', { user: req.user });
});

app.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

// GET /auth/eveonline
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in EVE Online authentication will involve
//   redirecting the user to EVE Online.  After authorization, EVE Online
//   will redirect the user back to this application at /auth/eveonline/callback
//   This path can be almost anything.
app.get('/auth/eveonline',
  passport.authenticate('eveonline-sso'),
  function(req, res){
    // The request will be redirected to EVE Online for authentication, so this
    // function will not be called.
  });

// GET /auth/eveonline/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//   This path is the same as specified in the application on the
//   EVE Online Developers site. This is also the same as your callbackURL.
app.get('/auth/eveonline/callback', 
  passport.authenticate('eveonline-sso', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
  console.log('');
  //console.log('Be sure to setup the OAuth2 client in EVE Online SSO with the following:')
  //console.log('');
  //console.log('Client ID:', EVEONLINE_SSO_CLIENT_ID);
  //console.log('Client Secret:', EVEONLINE_SSO_CLIENT_SECRET);
  //console.log('CallbackURL:', EVEONLINE_SSO_CALLBACK_URL);
  //console.log('Scopes:', EVEONLINE_SSO_SCOPES)
});
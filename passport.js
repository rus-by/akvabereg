var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var User = require('./models/user');
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function(username, password,done){
  User.findOne({ username : username},function(err,user){
    if (err) {
      return done(err)
    } else {
        console.log(err, user)
        if(user){
            return user.password == password ? done(null, user, {message: 'ook'}) : done(null, false, {message: 'incorrect password'})
        }
        else{
            return done(null, false, {message: 'incorrect user name'})
        }
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null,user);
  });
});
module.exports = passport;
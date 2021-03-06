// source https://stackoverflow.com/questions/23481817/node-js-passport-autentification-with-sqlite
// source https://youtu.be/mAOxWf36YLo
const SHA256 = require("crypto-js/sha256");
const req = require("express/lib/request");
const LocalStrategy = require('passport-local').Strategy;
module.exports=function(passport,db){
    passport.use(new LocalStrategy(function(username, password, done) {
        db.get('select username, id from user where username=? and password=?',username, SHA256(password), function(err, row) {
            if(err) console.log(err)
            if (!row) {
              return done(null, false, {message:"invalid user input "});
            }
            //console.log('flash ' + JSON.stringify(req));
            return done(null, row);
          });
      }));

      passport.serializeUser(function(user, done) {
        return done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
          //console.log('user id is ',id)
          //Here you can return any fields you want to display in the temaplate. 
          //for example I added wallet_address so I can display it in the user page.
        db.get('SELECT id, username,privatekey_wif FROM user WHERE id = ?', id, function(err, user) {
          if(err) console.log('this is '+err)
          if (!user) return done(null,{message:'invalid user name '} );
          return done(null, user);
        });
      });
}